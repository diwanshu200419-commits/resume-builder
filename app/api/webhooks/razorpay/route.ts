import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { upgradeUserPlan } from "@/lib/upgrade-user-plan";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "fallback_secret";

    // 1. Signature Verification Check
    if (signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.warn("[Razorpay Webhook] Invalid signature received.");
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 400 }
        );
      }
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const eventType = payload.event;
    const paymentEntity = payload.payload?.payment?.entity || {};
    const notes = paymentEntity.notes || {};
    const userId = notes.user_id;
    const requestedPlan = notes.requested_plan || "pro";
    const paymentId = paymentEntity.id || `pay_${Date.now()}`;

    // 2. Handle Payment Captured Event
    if (eventType === "payment.captured" || eventType === "order.paid") {
      if (userId) {
        await upgradeUserPlan(userId, requestedPlan, "razorpay", paymentId);
        return NextResponse.json({
          status: "processed",
          event: eventType,
          user_id: userId,
          plan: requestedPlan,
        });
      }
    }

    // 3. Handle Payment Failed Event
    if (eventType === "payment.failed") {
      console.warn(`[Razorpay Webhook] Payment failed for user ${userId || "unknown"}:`, paymentEntity.error_description);
      return NextResponse.json({ status: "acknowledged", event: eventType });
    }

    return NextResponse.json({ status: "received", event: eventType });
  } catch (error: any) {
    console.error("[Razorpay Webhook] Handler error:", error);
    return NextResponse.json(
      { error: error?.message || "Webhook handler exception" },
      { status: 500 }
    );
  }
}
