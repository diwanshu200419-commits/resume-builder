import { NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { getRemainingAnalyses } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await getProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Update last_seen_at on every profile fetch (tracks active users for admin dashboard)
  try {
    const supabase = await createClient();
    await supabase
      .from("profiles")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", profile.id);
  } catch {}

  // Also fetch user's payment requests for /settings billing history
  let paymentRequests: any[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("payment_requests")
      .select("id, requested_plan, amount_claimed, utr_number, status, created_at")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });
    if (data) paymentRequests = data;
  } catch {}

  return NextResponse.json({
    profile,
    remaining: getRemainingAnalyses(profile),
    paymentRequests,
  });
}
