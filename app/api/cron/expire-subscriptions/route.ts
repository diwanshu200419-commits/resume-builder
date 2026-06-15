import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  // Verify Cron Secret to prevent unauthorized calls
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceClient();

  try {
    const now = new Date().toISOString();

    // 1. Find expired subscriptions
    const { data: expiredSubs, error: fetchError } = await supabase
      .from("subscriptions")
      .select("user_id")
      .lt("end_date", now)
      .neq("plan", "free")
      .eq("status", "active");

    if (fetchError) throw fetchError;

    if (!expiredSubs || expiredSubs.length === 0) {
      return NextResponse.json({ message: "No expired subscriptions found" });
    }

    const expiredUserIds = expiredSubs.map((sub) => sub.user_id);

    // 2. Downgrade subscriptions to free
    const { error: subUpdateError } = await supabase
      .from("subscriptions")
      .update({
        plan: "free",
        status: "expired",
        updated_at: now,
      })
      .in("user_id", expiredUserIds);

    if (subUpdateError) throw subUpdateError;

    // 3. Downgrade profiles to free
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        plan: "free",
        analyses_limit: 2, // Reset to free limit
      })
      .in("id", expiredUserIds);

    if (profileUpdateError) throw profileUpdateError;

    return NextResponse.json({
      message: `Successfully downgraded ${expiredUserIds.length} users to free plan`,
      users: expiredUserIds,
    });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
