import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
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
    const utr = String(formData.get("utr") || "").trim().replace(/\s+/g, "");
    const rawPlan = String(formData.get("plan") || "pro").toLowerCase();
    const plan = rawPlan === "career-pack" || rawPlan === "career_pack" ? "career_pack" : rawPlan;
    const customerName = String(formData.get("customerName") || profile.full_name || "Candidate").trim();
    const customerEmail = String(formData.get("customerEmail") || profile.email || "candidate@vaylo.ai").trim();
    const customerPhone = String(formData.get("customerPhone") || "").trim();

    if (!utr || utr.length < 4) {
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

    // 1. Check for Duplicate UTR
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id, status")
      .eq("utr", utr)
      .single();

    if (existingPayment) {
      return NextResponse.json(
        { error: "This UPI UTR reference number has already been submitted or processed." },
        { status: 400 }
      );
    }

    // 2. Store Payment Submission with 'pending' status for Manual Review
    const { error: dbError } = await supabase.from("payments").insert({
      user_id: profile.id,
      utr,
      upi_ref: utr,
      plan,
      amount: amountClaimed,
      currency: "INR",
      status: "pending",
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      screenshot_url: screenshotPath,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("[payment/upi/submit] DB insert error:", dbError.message);
    }

    // 3. Dispatch In-App Notification
    await createNotification({
      userId: profile.id,
      type: "payment_pending",
      title: "Payment Submitted — Verification Pending",
      body: `Your payment of ₹${amountClaimed} (Ref: ${utr}) for ${plan.toUpperCase()} has been received and is being verified. Your plan will activate upon approval.`,
      link: "/dashboard",
    });

    return NextResponse.json({
      success: true,
      status: "pending",
      requested_plan: plan,
      utr_number: utr,
      message: "Payment submitted. Your payment is being verified. Please wait while our team confirms your transaction.",
    });
  } catch (error) {
    console.error("UPI submit error:", error);
    return NextResponse.json({ error: "Something went wrong, try again" }, { status: 500 });
  }
}
