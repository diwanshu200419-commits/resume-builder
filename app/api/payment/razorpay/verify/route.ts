import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
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

    if (!razorpay_payment_id) {
      return NextResponse.json({ error: "Missing razorpay_payment_id" }, { status: 400 });
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    // SECURITY: If Razorpay is not configured, this endpoint must be disabled.
    // Do NOT allow plan upgrades without verified payment signature.
    if (!razorpaySecret) {
      console.warn("[Razorpay Verify] RAZORPAY_KEY_SECRET not configured — endpoint disabled.");
      return NextResponse.json(
        { error: "Razorpay payment verification is not currently active. Please use UPI payment." },
        { status: 503 }
      );
    }

    if (razorpaySecret && razorpay_order_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", razorpaySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }
    } else if (!razorpay_order_id || !razorpay_signature) {
      // Missing required Razorpay fields — reject
      return NextResponse.json(
        { error: "Missing required Razorpay payment fields" },
        { status: 400 }
      );
    }

    // Upgrade profile & allot all plan features instantly
    await upgradeUserPlan(profile.id, plan, "manual_upi", razorpay_payment_id);

    // Dispatch In-App Notification to candidate
    await createNotification({
      userId: profile.id,
      type: "payment_approved",
      title: `Payment Success — ${plan.toUpperCase()} Unlocked! 🎉`,
      body: `Your payment (ID: ${razorpay_payment_id}) has been processed successfully. All features of the ${plan.toUpperCase()} plan are now active on your account!`,
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
