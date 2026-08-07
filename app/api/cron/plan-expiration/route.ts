import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

/**
 * Scheduled Cron Job: Plan Expiration Warning
 * Triggers once per day via Vercel Cron or Supabase Cron.
 * Finds candidates whose recurring plan expires within 3 days and dispatches a notification.
 */
export async function GET(request: NextRequest) {
  try {
    // Optional Vercel Cron Header Verification
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
    }

    const supabase = await createServiceClient();

    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    const { data: expiringProfiles, error } = await supabase
      .from("profiles")
      .select("id, email, plan, expires_at")
      .neq("plan", "free")
      .neq("plan", "career_pack")
      .gte("expires_at", now.toISOString())
      .lte("expires_at", threeDaysFromNow.toISOString());

    if (error) {
      console.error("[Cron Plan Expiration Error]:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let notifiedCount = 0;
    for (const p of expiringProfiles || []) {
      const daysLeft = Math.ceil((new Date(p.expires_at!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      await createNotification({
        userId: p.id,
        type: "plan_expiring",
        title: `Your ${p.plan.toUpperCase()} Plan Expires in ${daysLeft} Day${daysLeft > 1 ? "s" : ""} ⏳`,
        body: `Renew your subscription to maintain uninterrupted access to AI cover letters, interview prep, and unlimited ATS scans.`,
        link: "/pricing",
      });
      notifiedCount++;
    }

    return NextResponse.json({
      success: true,
      notifiedCandidates: notifiedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[Cron Exception]:", err);
    return NextResponse.json({ error: "Cron execution failed" }, { status: 500 });
  }
}
