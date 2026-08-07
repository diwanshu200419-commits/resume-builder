import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { logAdminAudit } from "@/lib/admin/logger";
import { createNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { error: authError, admin } = await requireAdmin();
    if (authError) {
      return authError;
    }

    const body = await request.json().catch(() => ({}));
    const { userId, requestId, plan = "pro", status = "approve", reason = "" } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing required userId parameter" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // Fetch target candidate profile
    const { data: targetProfile } = await supabase
      .from("profiles")
      .select("id, email, plan, subscription_status")
      .eq("id", userId)
      .single();

    const targetEmail = targetProfile?.email || "unknown@candidate.com";
    const previousPlan = targetProfile?.plan || "free";

    // Validate payment request status atomically if requestId is provided
    if (requestId) {
      const { data: paymentReq } = await supabase
        .from("payment_requests")
        .select("id, status")
        .eq("id", requestId)
        .single();

      if (paymentReq && paymentReq.status !== "pending") {
        return NextResponse.json(
          { error: `Payment request is already ${paymentReq.status}. Duplicate processing prevented.` },
          { status: 409 }
        );
      }
    }

    if (status === "approve") {
      let expiresAt: string | null = null;
      if (plan === "pro" || plan === "premium") {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        expiresAt = date.toISOString();
      }

      // Step 1: Update target profile plan & subscription status
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          plan: plan,
          subscription_status: "active",
          current_period_start: new Date().toISOString(),
          expires_at: expiresAt,
          analyses_limit: plan === "pro" ? 100 : 1000,
        })
        .eq("id", userId);

      if (profileError) {
        console.warn("[Admin Verify] Profile plan update warning:", profileError.message);
      }

      // Step 2: Mark payment_requests as approved
      if (requestId) {
        await supabase
          .from("payment_requests")
          .update({
            status: "approved",
            reviewed_at: new Date().toISOString(),
            reviewed_by: admin.userId,
          })
          .eq("id", requestId);
      } else {
        await supabase
          .from("payment_requests")
          .update({
            status: "approved",
            reviewed_at: new Date().toISOString(),
            reviewed_by: admin.userId,
          })
          .eq("user_id", userId)
          .eq("status", "pending");
      }

      // Step 3: Dispatch In-App Notification & Audit Log Entry
      await createNotification({
        userId,
        type: "payment_approved",
        title: `Payment Verified — ${plan.toUpperCase()} Unlocked! 🎉`,
        body: `Your payment has been verified by our admin team. All features of the ${plan.toUpperCase()} tier are now active on your account.`,
        link: "/settings",
      });

      await logAdminAudit({
        adminUserId: admin.userId,
        adminEmail: admin.email,
        action: "PAYMENT_APPROVED",
        targetUserId: userId,
        targetEmail: targetEmail,
        previousState: { plan: previousPlan, subscription_status: targetProfile?.subscription_status },
        newState: { plan, subscription_status: "active", expires_at: expiresAt },
        reason: reason || "Manual payment approval",
        metadata: { requestId, plan },
      });

      return NextResponse.json({
        success: true,
        status: "approved",
        plan,
        expires_at: expiresAt,
        message: `Payment verified. Account upgraded to ${plan.toUpperCase()} successfully.`,
      });
    } else {
      // Rejection logic
      if (requestId) {
        await supabase
          .from("payment_requests")
          .update({
            status: "rejected",
            rejection_reason: reason || "Invalid UTR reference number or verification failed.",
            reviewed_at: new Date().toISOString(),
            reviewed_by: admin.userId,
          })
          .eq("id", requestId);
      } else {
        await supabase
          .from("payment_requests")
          .update({
            status: "rejected",
            rejection_reason: reason || "Verification failed.",
            reviewed_at: new Date().toISOString(),
            reviewed_by: admin.userId,
          })
          .eq("user_id", userId)
          .eq("status", "pending");
      }

      // Dispatch In-App Notification for rejection
      await createNotification({
        userId,
        type: "payment_rejected",
        title: "Payment Verification Notice",
        body: `Your payment submission could not be verified. Reason: ${reason || "Invalid UTR reference number"}. Please re-check your UTR and resubmit.`,
        link: "/checkout/pro",
      });

      // Audit Log Entry for rejection
      await logAdminAudit({
        adminUserId: admin.userId,
        adminEmail: admin.email,
        action: "PAYMENT_REJECTED",
        targetUserId: userId,
        targetEmail: targetEmail,
        previousState: { status: "pending" },
        newState: { status: "rejected", rejection_reason: reason },
        reason: reason || "Invalid UTR number",
        metadata: { requestId },
      });

      return NextResponse.json({
        success: true,
        status: "rejected",
        message: "Payment request rejected.",
      });
    }
  } catch (error: any) {
    console.error("[Admin Verify POST Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process payment verification" },
      { status: 500 }
    );
  }
}
