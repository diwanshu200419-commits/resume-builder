import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { upgradeUserPlan } from "@/lib/upgrade-user-plan";
import { createNotification } from "@/lib/notifications";

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
    const rawPlan = String(formData.get("plan") || "pro").toLowerCase();
    const plan = rawPlan === "career-pack" || rawPlan === "career_pack" ? "career_pack" : rawPlan;
    const customerName = String(formData.get("customerName") || profile.full_name || "Candidate");
    const customerEmail = String(formData.get("customerEmail") || profile.email || "candidate@vaylo.ai");
    const customerPhone = String(formData.get("customerPhone") || "");

    if (!utr || !/^\d{6,12}$/.test(utr)) {
      return NextResponse.json(
        { error: "Please enter a valid 12-digit numeric UPI UTR reference number" },
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

    // 1. Store payment request record
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
        status: "approved", // Auto-approved for instant feature allotment
        created_at: new Date().toISOString(),
      });

      if (dbError && dbError.code === "23505") {
        return NextResponse.json(
          { error: "This UTR number has already been submitted for your account." },
          { status: 400 }
        );
      }
    } catch (err) {
      console.warn("[payment/upi/submit] payment_requests insert exception:", err);
    }

    // 2. INSTANT PLAN UPGRADE ALLOTMENT
    await upgradeUserPlan(profile.id, plan, "manual_upi", utr);

    // 3. Dispatch In-App Notification to candidate
    await createNotification({
      userId: profile.id,
      type: "payment_approved",
      title: `Plan Upgraded — ${plan.toUpperCase()} Unlocked! 🎉`,
      body: `Your payment (UTR: ${utr}) has been processed. All features of the ${plan.toUpperCase()} plan are now active on your account!`,
      link: "/dashboard",
    });

    return NextResponse.json({
      success: true,
      status: "approved",
      requested_plan: plan,
      utr_number: utr,
      message: `Success! Your account has been upgraded to ${plan.toUpperCase()}. All features are now unlocked! 🎉`,
    });
  } catch (error) {
    console.error("UPI submit error:", error);
    return NextResponse.json({ error: "Something went wrong, try again" }, { status: 500 });
  }
}
