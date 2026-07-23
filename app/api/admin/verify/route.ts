import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Verify admin permissions
const ADMIN_EMAILS = [
  "admin@vaylo.ai",
  "jattshiv32@gmail.com",
  "paid_tester_123@example.com"
];

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile || !profile.email || !ADMIN_EMAILS.includes(profile.email)) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 403 });
    }

    const { userId, plan, status } = await request.json();

    if (!userId || !plan) {
      return NextResponse.json({ error: "Invalid payload parameters" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        plan: status === "approve" ? plan : "free",
        subscription_status: status === "approve" ? "active" : "canceled",
        current_period_start: new Date().toISOString(),
        analyses_limit: plan === "pro" ? 100 : 1000,
      })
      .eq("id", userId);

    if (profileError) throw profileError;

    // Optional: Update payments table if it exists
    try {
      await supabase
        .from("payments")
        .update({ status: status === "approve" ? "completed" : "failed" })
        .eq("user_id", userId)
        .eq("status", "pending");
    } catch {
      // Gracefully continue if table missing/unmigrated
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin verification error:", error);
    return NextResponse.json({ error: "Failed to perform admin update" }, { status: 500 });
  }
}
