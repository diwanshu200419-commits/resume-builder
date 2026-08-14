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

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "rzp_test_VayloAI2026Key";
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || "";

    let orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    if (razorpaySecret && razorpayKey && !razorpayKey.startsWith("rzp_test_VayloAI")) {
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
        }
      } catch (err) {
        console.warn("[Razorpay Order API] Fallback to client order generation:", err);
      }
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
