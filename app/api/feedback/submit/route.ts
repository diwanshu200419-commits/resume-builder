import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  checkAnonymousFeedbackRateLimit,
  addFallbackFeedback,
  UserFeedbackRecord,
} from "@/lib/feedback";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      category = "general",
      message,
      name,
      email,
      website_hp,
      noReplyNeeded,
    } = body;

    // 1. Honeypot check: Bots auto-fill hidden input fields
    if (website_hp && String(website_hp).trim().length > 0) {
      console.warn("[Feedback Submit] Honeypot triggered by automated bot submission.");
      return NextResponse.json(
        { error: "Spam submission detected." },
        { status: 400 }
      );
    }

    // 2. Validate message content
    const cleanMessage = String(message || "").trim();
    if (!cleanMessage || cleanMessage.length < 5) {
      return NextResponse.json(
        { error: "Please provide a message with at least 5 characters." },
        { status: 400 }
      );
    }
    if (cleanMessage.length > 3000) {
      return NextResponse.json(
        { error: "Message exceeds maximum allowed length of 3,000 characters." },
        { status: 400 }
      );
    }

    const validCategories = ["bug", "billing", "feature", "complaint", "general"];
    const cleanCategory = validCategories.includes(category) ? category : "general";

    // 3. Resolve user identity: Authenticated session vs Anonymous visitor
    let userId: string | null = null;
    let userEmail = "";
    let userName: string | null = null;

    try {
      const supabaseUser = await createClient();
      const {
        data: { user },
      } = await supabaseUser.auth.getUser();

      if (user) {
        userId = user.id;
        userEmail = user.email || "";
        userName = user.user_metadata?.full_name || null;
      }
    } catch {}

    // Anonymous Path handling
    if (!userId) {
      // Fingerprint combines IP + anonymous device cookie (if present)
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
      const anonCookie = request.cookies.get("v_aid")?.value || "";
      const identifier = `${ip}:${anonCookie}`;

      const rateCheck = checkAnonymousFeedbackRateLimit(identifier);
      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            error: `Too many submissions from this connection. Please wait ${rateCheck.resetSeconds} seconds before sending more feedback.`,
          },
          { status: 429 }
        );
      }

      userName = name ? String(name).trim().slice(0, 100) : "Anonymous Visitor";

      const isExplicitlyAnonymous = Boolean(noReplyNeeded);

      if (isExplicitlyAnonymous) {
        // Explicitly anonymous user: Do NOT store fake email like anonymous@vayloai.online.
        // Store empty string / null so admin UI explicitly knows this user requested anonymity.
        userEmail = email ? String(email).trim().toLowerCase() : "";
      } else {
        const candidateEmail = String(email || "").trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!candidateEmail || !emailRegex.test(candidateEmail)) {
          return NextResponse.json(
            {
              error: "Please enter a valid email address so we can reply to you, or check 'No reply needed'.",
            },
            { status: 400 }
          );
        }
        userEmail = candidateEmail;
      }
    }

    const isAnonymousSubmission = !userId && !userEmail;

    // 4. Persistence via Service-Role Client (supports both Auth & Anonymous inserts)
    let savedRecord: UserFeedbackRecord | null = null;

    try {
      const serviceClient = await createServiceClient();
      const { data: inserted, error: insertError } = await serviceClient
        .from("user_feedback")
        .insert({
          user_id: userId,
          user_email: userEmail || "anonymous",
          category: cleanCategory,
          message: userName && !userId ? `[From: ${userName}] ${cleanMessage}` : cleanMessage,
          status: "open",
        })
        .select()
        .single();

      if (!insertError && inserted) {
        savedRecord = {
          ...inserted,
          is_anonymous: isAnonymousSubmission,
          name: userName,
        } as UserFeedbackRecord;
      } else if (insertError) {
        console.warn("[Feedback Submit] DB insert error, using fallback:", insertError.message);
      }
    } catch (dbErr) {
      console.warn("[Feedback Submit] DB exception, using fallback:", dbErr);
    }

    // Resilient in-memory fallback for zero-downtime
    if (!savedRecord) {
      savedRecord = {
        id: `fb-${Date.now()}`,
        user_id: userId,
        user_email: userEmail,
        name: userName,
        is_anonymous: isAnonymousSubmission,
        category: cleanCategory,
        message: cleanMessage,
        status: "open",
        created_at: new Date().toISOString(),
      };
      addFallbackFeedback(savedRecord);
    }

    // 5. Trigger Realtime Notification for Admin Console
    try {
      const { createNotification } = await import("@/lib/notifications");
      // Admin user IDs
      const ADMIN_IDS = [
        "cca59e48-cfba-44ca-9033-3d57bce2220c", // jattshiv32@gmail.com
        "811b0310-f9bc-4cf2-83af-a61c901f3e25", // diwanshu200419@gmail.com
      ];
      for (const adminId of ADMIN_IDS) {
        await createNotification({
          userId: adminId,
          type: "general",
          title: `New Feedback: ${cleanCategory.toUpperCase()}`,
          body: isAnonymousSubmission
            ? `Anonymous visitor submitted: "${cleanMessage.slice(0, 80)}..."`
            : `${userEmail || userName} submitted: "${cleanMessage.slice(0, 80)}..."`,
          link: "/admin",
        });
      }
    } catch (notifErr) {
      console.warn("[Feedback Submit] Admin notification warning:", notifErr);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your feedback has been sent to our founders and support team.",
      feedback: savedRecord,
    });
  } catch (error: any) {
    console.error("[Feedback Submit Exception]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
