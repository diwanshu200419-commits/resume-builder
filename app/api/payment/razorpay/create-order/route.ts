import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";

const PLAN_PRICES_PAISE: Record<string, number> = {
  pro: 9900, // ₹99
  premium: 29900, // ₹299
  career: 49900, // ₹499
  "career-pack": 49900, // ₹499
  career_pack: 49900, // ₹499
};

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const plan = String(body.plan || "pro").toLowerCase();
    const amount = PLAN_PRICES_PAISE[plan] || 9900;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If live/test Razorpay keys are configured, create real Razorpay Order
    if (keyId && keySecret) {
      const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
      const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: {
            user_id: profile.id,
            requested_plan: plan,
            customer_email: profile.email,
          },
        }),
      });

      if (razorpayRes.ok) {
        const orderData = await razorpayRes.json();
        return NextResponse.json({
          order_id: orderData.id,
          amount: orderData.amount,
          currency: orderData.currency,
          key_id: keyId,
          notes: orderData.notes,
        });
      }
    }

    // Test / Demo Fallback Mode
    const mockOrderId = `order_${Math.random().toString(36).substring(2, 12)}`;
    return NextResponse.json({
      order_id: mockOrderId,
      amount: amount,
      currency: "INR",
      key_id: keyId || "rzp_test_demo_key",
      notes: {
        user_id: profile.id,
        requested_plan: plan,
        customer_email: profile.email,
      },
    });
  } catch (error: any) {
    console.error("Razorpay create-order error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
