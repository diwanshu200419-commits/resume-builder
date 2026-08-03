import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { logAdminAudit } from "@/lib/admin/logger";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { error: authError, admin } = await requireAdmin();
    if (authError) {
      return authError;
    }

    const { userId, newPlan, actionType = "change_plan", reason = "Manual admin override for support" } = await request.json();

    if (!userId || !newPlan) {
      return NextResponse.json({ error: "userId and newPlan parameters are required" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // Fetch target user profile
    const { data: targetUser } = await supabase
      .from("profiles")
      .select("email, plan, subscription_status, expires_at, total_ats_checks")
      .eq("id", userId)
      .single();

    if (!targetUser) {
      return NextResponse.json({ error: "Target user account not found" }, { status: 404 });
    }

    const oldPlan = targetUser.plan;
    let expiresAt: string | null = null;
    let newStatus = "active";

    if (actionType === "expire") {
      expiresAt = new Date().toISOString();
      newStatus = "canceled";
    } else if (actionType === "extend") {
      const currentEnd = targetUser.expires_at ? new Date(targetUser.expires_at) : new Date();
      currentEnd.setDate(currentEnd.getDate() + 30);
      expiresAt = currentEnd.toISOString();
    } else {
      if (newPlan === "pro" || newPlan === "premium") {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        expiresAt = d.toISOString();
      } else if (newPlan === "free") {
        newStatus = "canceled";
      }
    }

    // 1. Update profiles table
    const updateData: Record<string, any> = {
      plan: newPlan,
      subscription_status: newStatus,
      current_period_start: new Date().toISOString(),
      expires_at: expiresAt,
      analyses_limit: newPlan === "free" ? 2 : newPlan === "pro" ? 100 : 1000,
    };

    if (actionType === "reset_usage") {
      updateData.analyses_used = 0;
      updateData.total_ats_checks = 0;
    }

    const { error: profileErr } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId);

    if (profileErr) {
      return NextResponse.json({ error: profileErr.message }, { status: 500 });
    }

    // 2. Server-Side Audit Log Entry
    const auditActionMap: Record<string, "PLAN_CHANGED" | "PLAN_EXTENDED" | "PLAN_EXPIRED" | "SCAN_USAGE_RESET"> = {
      change_plan: "PLAN_CHANGED",
      extend: "PLAN_EXTENDED",
      expire: "PLAN_EXPIRED",
      reset_usage: "SCAN_USAGE_RESET",
    };

    await logAdminAudit({
      adminUserId: admin.userId,
      adminEmail: admin.email,
      action: auditActionMap[actionType] || "PLAN_CHANGED",
      targetUserId: userId,
      targetEmail: targetUser.email || "unknown@user.com",
      previousState: { plan: oldPlan, status: targetUser.subscription_status, expires_at: targetUser.expires_at },
      newState: { plan: newPlan, status: newStatus, expires_at: expiresAt },
      reason,
      metadata: { actionType, newPlan },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully executed ${actionType} on user plan (${oldPlan} → ${newPlan}).`,
    });
  } catch (error: any) {
    console.error("[Manual Plan Override POST Error]:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
