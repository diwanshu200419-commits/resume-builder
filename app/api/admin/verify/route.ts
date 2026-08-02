import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { logAdminAction } from "@/lib/admin-audit";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const profile = await getProfile();
  if (!profile) return null;
  if (profile.role === "admin") return profile;
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const adminProfile = await requireAdmin();
    if (!adminProfile) {
      return NextResponse.json(
        { error: "Unauthorized: admin role required" },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { userId, requestId, plan = "pro", status = "approve", reason = "" } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // Fetch target user email for audit log
    const { data: targetProfile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single();

    const targetEmail = targetProfile?.email || "unknown@user.com";

    if (status === "approve") {
      let expiresAt: string | null = null;
      if (plan === "pro" || plan === "premium") {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        expiresAt = date.toISOString();
      }

      // Step 1: Update profiles.plan
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
        console.warn("[admin/verify] Profile update warning:", profileError.message);
      }

      // Step 2: Update payment_requests.status
      try {
        const updateQuery = supabase
          .from("payment_requests")
          .update({
            status: "approved",
            reviewed_at: new Date().toISOString(),
            reviewed_by: adminProfile.id,
          });

        if (requestId) {
          await updateQuery.eq("id", requestId);
        } else {
          await updateQuery.eq("user_id", userId).eq("status", "pending");
        }
      } catch (err) {
        console.warn("[admin/verify] payment_requests update exception:", err);
      }

      // Step 3: Write to admin_audit_log
      await logAdminAction({
        adminUserId: adminProfile.id,
        adminEmail: adminProfile.email || "admin@system.com",
        action: "approve_payment",
        targetUserId: userId,
        targetEmail: targetEmail,
        details: { plan, requestId, expiresAt },
      });

      return NextResponse.json({
        success: true,
        status: "approved",
        plan,
        expires_at: expiresAt,
        message: `Plan upgraded to ${plan.toUpperCase()} successfully. ${
          expiresAt ? "Valid for 30 days." : "Lifetime access active."
        }`,
      });
    } else {
      // Reject
      try {
        const updateQuery = supabase
          .from("payment_requests")
          .update({
            status: "rejected",
            rejection_reason: reason || "Invalid UTR reference number or payment verification failed.",
            reviewed_at: new Date().toISOString(),
            reviewed_by: adminProfile.id,
          });

        if (requestId) {
          await updateQuery.eq("id", requestId);
        } else {
          await updateQuery.eq("user_id", userId).eq("status", "pending");
        }
      } catch (err) {
        console.warn("[admin/verify] payment_requests reject exception:", err);
      }

      // Write to admin_audit_log
      await logAdminAction({
        adminUserId: adminProfile.id,
        adminEmail: adminProfile.email || "admin@system.com",
        action: "reject_payment",
        targetUserId: userId,
        targetEmail: targetEmail,
        details: { reason: reason || "Verification failed", requestId },
      });

      return NextResponse.json({
        success: true,
        status: "rejected",
        message: "Payment request rejected.",
      });
    }
  } catch (error: any) {
    console.error("Admin verify error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to perform admin update" },
      { status: 500 }
    );
  }
}
