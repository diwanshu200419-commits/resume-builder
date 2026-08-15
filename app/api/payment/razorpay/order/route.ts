import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { getPlanAmount } from "@/lib/upi";
import type { Plan } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();
    if (!plan || (plan !== "pro" && plan !== "premium" && plan !== "career" && plan !== "career-pack" && plan !== "career_pack")) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const amount = getPlanAmount(plan as Exclude<Plan, "free">);
    const amountInPaise = Math.round(amount * 100);

    // NOTE: Razorpay is not currently active (pending KYC verification).
    // Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in env when Razorpay KYC is complete.
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || "";

    // SECURITY: Return 503 if Razorpay is not configured.
    // Do NOT return a fake order — the UPI flow is the live payment method.
    if (!razorpayKey || !razorpaySecret) {
      return NextResponse.json(
        { error: "Razorpay payment is not currently active. Please use UPI payment." },
        { status: 503 }
      );
    }

    let orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      const authHeader = "Basic " + Buffer.from(`${razorpayKey}:${razorpaySecret}`).toString("base64");
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `rcpt_${profile.id.slice(0, 8)}_${Date.now().toString(36)}`,
          notes: {
            userId: profile.id,
            plan,
          },
        }),
      });

      if (res.ok) {
        const rzpOrder = await res.json();
        orderId = rzpOrder.id;
      } else {
        return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 502 });
      }
    } catch (err) {
      console.error("[Razorpay Order API] Error:", err);
      return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      orderId,
      key: razorpayKey,
      amount,
      amountInPaise,
      currency: "INR",
      plan,
    });
  } catch (error: any) {
    console.error("[Razorpay Order Error]:", error);
    return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 });
  }
}
