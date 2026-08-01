import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { isAdmin } from "@/lib/plans";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const profile = await getProfile();

    // Role-based admin check
    if (!isAdmin(profile)) {
      return NextResponse.json({ error: "Unauthorized: admin role required" }, { status: 403 });
    }

    const supabase = await createServiceClient();

    // Fetch all users
    const { data: users } = await supabase
      .from("profiles")
      .select("id, email, full_name, plan, role, subscription_status, total_resume_downloads, analyses_used, total_ats_checks, expires_at, last_seen_at, created_at")
      .order("created_at", { ascending: false });

    // Fetch all payment requests
    const { data: paymentRequests } = await supabase
      .from("payment_requests")
      .select("*")
      .order("created_at", { ascending: false });

    // Revenue: sum approved payments this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const { data: approvedThisMonth } = await supabase
      .from("payment_requests")
      .select("amount_claimed, requested_plan")
      .eq("status", "approved")
      .gte("reviewed_at", monthStart);

    const revenueByPlan: Record<string, number> = { pro: 0, premium: 0, career_pack: 0, career: 0 };
    let totalRevenueThisMonth = 0;
    for (const r of approvedThisMonth || []) {
      totalRevenueThisMonth += Number(r.amount_claimed || 0);
      const key = (r.requested_plan || "").toLowerCase();
      if (revenueByPlan[key] !== undefined) revenueByPlan[key] += Number(r.amount_claimed || 0);
    }

    // Activity windows
    const now_ts = Date.now();
    const day1 = new Date(now_ts - 86400000).toISOString();
    const day7 = new Date(now_ts - 7 * 86400000).toISOString();
    const day30 = new Date(now_ts - 30 * 86400000).toISOString();

    const usersArr = users || [];
    const activeToday = usersArr.filter(u => u.last_seen_at && u.last_seen_at >= day1).length;
    const active7d = usersArr.filter(u => u.last_seen_at && u.last_seen_at >= day7).length;
    const active30d = usersArr.filter(u => u.last_seen_at && u.last_seen_at >= day30).length;

    return NextResponse.json({
      users: usersArr,
      paymentRequests: paymentRequests || [],
      revenue: {
        thisMonth: totalRevenueThisMonth,
        byPlan: revenueByPlan,
      },
      activity: { activeToday, active7d, active30d },
    });
  } catch (error: any) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 });
  }
}
