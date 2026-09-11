import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { getPlanAmount } from "@/lib/upi";
import type { Plan } from "@/types";
import Razorpay from "razorpay";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, couponCode } = await request.json();
    const validPlans = ["pro", "premium", "career", "career-pack", "career_pack"];
    if (!plan || !validPlans.includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "";

    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json(
        { error: "Razorpay is not configured. Please contact support." },
        { status: 503 }
      );
    }

    let amount = getPlanAmount(plan as Exclude<Plan, "free">);
    let validatedCouponCode: string | null = null;

    if (couponCode) {
      const { validateCouponForUser, calculateCouponDiscount } = await import("@/lib/coupons");
      const validation = await validateCouponForUser(String(couponCode), profile.id, plan);
      if (validation.valid) {
        const { finalPrice } = calculateCouponDiscount(amount, validation.coupon);
        amount = finalPrice;
        validatedCouponCode = validation.coupon.code;
      }
    }

    const amountInPaise = Math.round(amount * 100);

    if (amountInPaise < 100) {
      return NextResponse.json({ error: "Amount must be at least ₹1 (100 paise)" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${profile.id.slice(0, 8)}_${Date.now().toString(36)}`,
      notes: {
        userId: profile.id,
        userEmail: profile.email || "",
        plan,
        couponCode: validatedCouponCode || "",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      key: razorpayKeyId,
      amount,
      amountInPaise,
      currency: "INR",
      plan,
    });
  } catch (error: any) {
    console.error("[Razorpay Order Error]:", error);
    const message = error?.error?.description || error?.message || "Failed to create Razorpay order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
