import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { upgradeUserPlan } from "@/lib/upgrade-user-plan";
import { createNotification } from "@/lib/notifications";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, plan = "pro" } = body;

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required fields: razorpay_payment_id, razorpay_order_id, razorpay_signature" },
        { status: 400 }
      );
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpaySecret) {
      console.warn("[Razorpay Verify] RAZORPAY_KEY_SECRET not configured — endpoint disabled.");
      return NextResponse.json(
        { error: "Razorpay payment verification is not currently active." },
        { status: 503 }
      );
    }

    // HMAC-SHA256 signature verification
    const generatedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("[Razorpay Verify] Signature mismatch — payment rejected.");
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Persist payment records
    const supabase = await createServiceClient();

    await supabase.from("payments").upsert({
      user_id: profile.id,
      utr: razorpay_payment_id,
      upi_ref: razorpay_order_id,
      plan,
      amount: body.amount || 0,
      currency: "INR",
      status: "completed",
      reviewed_at: new Date().toISOString(),
    });

    await supabase.from("payment_requests").upsert({
      user_id: profile.id,
      user_email: profile.email || "",
      customer_name: profile.full_name || "Customer",
      requested_plan: plan,
      amount_claimed: body.amount || 0,
      utr_number: razorpay_payment_id,
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: "RAZORPAY_AUTO_CHECKOUT",
    });

    // Grant plan access
    await upgradeUserPlan(profile.id, plan, "razorpay", razorpay_payment_id);

    // In-app notification
    await createNotification({
      userId: profile.id,
      type: "payment_approved",
      title: `Payment Confirmed — ${plan.toUpperCase()} Unlocked! 🎉`,
      body: `Your Razorpay payment (ID: ${razorpay_payment_id}) was verified. All ${plan.toUpperCase()} features are now active!`,
      link: "/dashboard",
    });

    return NextResponse.json({
      success: true,
      status: "approved",
      plan,
      paymentId: razorpay_payment_id,
      message: `Success! Account upgraded to ${plan.toUpperCase()}. All features unlocked! 🎉`,
    });
  } catch (error: any) {
    console.error("[Razorpay Verify Error]:", error);
    return NextResponse.json({ error: "Failed to verify Razorpay payment" }, { status: 500 });
  }
}
