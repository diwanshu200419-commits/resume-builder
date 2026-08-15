import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { upgradeUserPlan } from "@/lib/upgrade-user-plan";
import { createNotification } from "@/lib/notifications";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // SECURITY: Webhook processing requires a configured secret.
    // Without it, forged webhooks could trigger plan upgrades.
    if (!webhookSecret) {
      console.warn("[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET not configured — all webhook events rejected.");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }

    // 1. Signature Verification (always enforced when secret is set)
    if (!signature) {
      return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("[Razorpay Webhook] Invalid HMAC signature.");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payload = event.payload;

    const supabase = await createServiceClient();

    // 2. Event Dispatching
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = payload.payment?.entity || payload.order?.entity;
      const paymentId = paymentEntity.id;
      const notes = paymentEntity.notes || {};
      const userId = notes.userId;
      const rawPlan = (notes.plan || "pro").toLowerCase().replace("-", "_");
      const plan = rawPlan === "career" ? "career_pack" : rawPlan;
      const amount = paymentEntity.amount ? paymentEntity.amount / 100 : 99;
      const currency = paymentEntity.currency || "INR";

      if (!userId) {
        console.warn("[Razorpay Webhook] Missing userId in notes");
        return NextResponse.json({ received: true });
      }

      // Price Integrity Check
      const EXPECTED_PRICES: Record<string, number> = {
        pro: 99,
        premium: 299,
        career_pack: 499,
      };

      const expectedPrice = EXPECTED_PRICES[plan] || 99;
      const isCouponApplied = Boolean(notes.coupon);

      if (!isCouponApplied && amount < expectedPrice) {
        console.error(`[Razorpay Webhook Mismatch] Paid ₹${amount} for plan ${plan} (expected ₹${expectedPrice}). Entitlement rejected.`);
        return NextResponse.json({ error: "Amount mismatch for plan" }, { status: 400 });
      }

      // Idempotency Check: Check if paymentId already processed
      const { data: existingPayment } = await supabase
        .from("payments")
        .select("id, status")
        .eq("utr", paymentId)
        .single();

      if (existingPayment && existingPayment.status === "completed") {
        console.log(`[Razorpay Webhook] Payment ${paymentId} already processed (Idempotent execution).`);
        return NextResponse.json({ received: true, status: "already_processed" });
      }

      // Record / Update Payment Record in DB
      await supabase.from("payments").upsert({
        user_id: userId,
        utr: paymentId,
        upi_ref: paymentEntity.order_id || paymentId,
        plan,
        amount,
        currency,
        status: "completed",
        reviewed_at: new Date().toISOString(),
      });

      // Grant Server-Side Database Entitlement
      await upgradeUserPlan(userId, plan, "manual_upi", paymentId);

      // Send In-App Notification
      await createNotification({
        userId,
        type: "payment_approved",
        title: `Payment Confirmed — ${plan.toUpperCase()} Active! 🎉`,
        body: `Your payment of ${currency} ${amount} (Ref: ${paymentId}) was verified. All features are now unlocked!`,
        link: "/dashboard",
      });
    } else if (eventType === "payment.failed") {
      const paymentEntity = payload.payment?.entity;
      const paymentId = paymentEntity?.id;
      const userId = paymentEntity?.notes?.userId;

      if (userId && paymentId) {
        await supabase.from("payments").upsert({
          user_id: userId,
          utr: paymentId,
          status: "failed",
          reviewed_at: new Date().toISOString(),
        });
      }
    } else if (eventType === "subscription.cancelled" || eventType === "subscription.halted") {
      const subEntity = payload.subscription?.entity;
      const userId = subEntity?.notes?.userId;

      if (userId) {
        await supabase
          .from("profiles")
          .update({ subscription_status: "cancelled" })
          .eq("id", userId);
      }
    } else if (eventType === "refund.processed" || eventType === "refund.created") {
      const refundEntity = payload.refund?.entity;
      const paymentId = refundEntity?.payment_id;

      if (paymentId) {
        await supabase
          .from("payments")
          .update({ status: "refunded" })
          .eq("utr", paymentId);
      }
    }

    return NextResponse.json({ received: true, event: eventType });
  } catch (error: any) {
    console.error("[Razorpay Webhook Error]:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
