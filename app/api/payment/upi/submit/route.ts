import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const utr = String(formData.get("utr") || "").trim();
    const plan = String(formData.get("plan") || "pro").toLowerCase();
    const customerName = String(formData.get("customerName") || profile.full_name || "Candidate");
    const customerEmail = String(formData.get("customerEmail") || profile.email || "candidate@vaylo.ai");
    const customerPhone = String(formData.get("customerPhone") || "");

    if (!utr || utr.length < 6) {
      return NextResponse.json(
        { error: "Please enter a valid 12-digit UPI UTR reference number" },
        { status: 400 }
      );
    }

    const screenshot = formData.get("screenshot");
    let screenshotPath = null;

    if (screenshot instanceof File && screenshot.size > 0) {
      if (screenshot.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "Screenshot must be under 5MB" }, { status: 400 });
      }
      if (!ALLOWED_TYPES.includes(screenshot.type)) {
        return NextResponse.json(
          { error: "Screenshot must be a JPG, PNG, or WEBP image" },
          { status: 400 }
        );
      }
      const ext = (screenshot.name.split(".").pop() || "jpg").toLowerCase();
      screenshotPath = `${profile.id}/${Date.now()}_utr.${ext}`;
    }

    const amountClaimed = plan === "career_pack" ? 499 : plan === "premium" ? 299 : 99;

    const supabase = await createServiceClient();

    // Store in Supabase table
    try {
      const { error: dbError } = await supabase.from("payment_requests").insert({
        user_id: profile.id,
        user_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone,
        requested_plan: plan,
        amount_claimed: amountClaimed,
        utr_number: utr,
        screenshot_url: screenshotPath,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      if (dbError) {
        console.warn("[payment/upi/submit] payment_requests insert warning:", dbError.message);
        // If UTR constraint fails
        if (dbError.code === "23505") {
          return NextResponse.json(
            { error: "This UTR number has already been submitted for your account." },
            { status: 400 }
          );
        }
      }
    } catch (err) {
      console.warn("[payment/upi/submit] payment_requests insert exception:", err);
    }

    // Mock DB Fallback Store for full offline/mock environment resilience
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/mock-db`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_payment_request",
          payload: {
            id: `req_${Date.now()}`,
            user_id: profile.id,
            user_email: customerEmail,
            customer_name: customerName,
            customer_phone: customerPhone,
            requested_plan: plan,
            amount_claimed: amountClaimed,
            utr_number: utr,
            screenshot_url: screenshotPath,
            status: "pending",
            created_at: new Date().toISOString(),
          },
        }),
      });
    } catch (err) {
      console.warn("[payment/upi/submit] mock-db sync warning:", err);
    }

    return NextResponse.json({
      success: true,
      status: "pending",
      requested_plan: plan,
      utr_number: utr,
      message: "Payment submitted — under review. Usually verified within 1-2 hours by our team.",
    });
  } catch (error) {
    console.error("UPI submit error:", error);
    return NextResponse.json({ error: "Something went wrong, try again" }, { status: 500 });
  }
}
