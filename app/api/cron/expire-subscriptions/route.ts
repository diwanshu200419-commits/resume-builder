import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
    }

    const supabase = await createServiceClient();
    const now = new Date().toISOString();

    const { data: expiredProfiles, error } = await supabase
      .from("profiles")
      .select("id, email, plan")
      .lt("expires_at", now)
      .neq("plan", "free")
      .neq("plan", "career_pack");

    let count = 0;
    if (expiredProfiles && expiredProfiles.length > 0) {
      for (const user of expiredProfiles) {
        await supabase
          .from("profiles")
          .update({
            plan: "free",
            subscription_status: "expired",
            expires_at: null,
          })
          .eq("id", user.id);
        count++;
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now,
      expiredCount: count,
      message: `Reverted ${count} expired subscription plans to Free tier.`,
    });
  } catch (error: any) {
    console.error("Cron subscription expiration error:", error);
    return NextResponse.json({ error: error?.message || "Cron job failed" }, { status: 500 });
  }
}
