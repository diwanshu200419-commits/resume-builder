import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { isAdmin } from "@/lib/plans";
import { createServiceClient } from "@/lib/supabase/server";
import { logAdminAction } from "@/lib/admin-audit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const adminProfile = await getProfile();

    if (!adminProfile || !isAdmin(adminProfile)) {
      return NextResponse.json({ error: "Unauthorized: admin role required" }, { status: 403 });
    }

    const { userId, newPlan, reason = "Manual admin override for support" } = await request.json();

    if (!userId || !newPlan) {
      return NextResponse.json({ error: "userId and newPlan are required" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // Fetch target user email
    const { data: targetUser } = await supabase
      .from("profiles")
      .select("email, plan")
      .eq("id", userId)
      .single();

    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    const oldPlan = targetUser.plan;

    // Calculate expiration
    let expiresAt: string | null = null;
    if (newPlan === "pro" || newPlan === "premium") {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      expiresAt = d.toISOString();
    }

    // 1. Update profiles table
    const { error: profileErr } = await supabase
      .from("profiles")
      .update({
        plan: newPlan,
        subscription_status: newPlan === "free" ? "canceled" : "active",
        current_period_start: new Date().toISOString(),
        expires_at: expiresAt,
        analyses_limit: newPlan === "free" ? 2 : newPlan === "pro" ? 100 : 1000,
      })
      .eq("id", userId);

    if (profileErr) {
      return NextResponse.json({ error: profileErr.message }, { status: 500 });
    }

    // 2. Upsert subscriptions table
    await supabase.from("subscriptions").upsert({
      user_id: userId,
      plan: newPlan,
      status: newPlan === "free" ? "canceled" : "active",
      current_period_start: new Date().toISOString(),
      current_period_end: expiresAt,
      created_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    // 3. Write to admin_audit_log
    await logAdminAction({
      adminUserId: adminProfile.id,
      adminEmail: adminProfile.email || "admin@system.com",
      action: "manual_plan_override",
      targetUserId: userId,
      targetEmail: targetUser.email || "unknown@user.com",
      details: {
        oldPlan,
        newPlan,
        reason,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully changed user plan from ${oldPlan} to ${newPlan}.`,
    });
  } catch (error: any) {
    console.error("Manual plan override error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
