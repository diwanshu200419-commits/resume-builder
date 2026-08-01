import { createServiceClient } from "@/lib/supabase/server";

export async function upgradeUserPlan(
  userId: string,
  plan: string,
  source: "manual_upi" | "admin_override",
  transactionId?: string
) {
  let expiresAt: string | null = null;
  if (plan === "pro" || plan === "premium") {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    expiresAt = date.toISOString();
  }

  const supabase = await createServiceClient();

  // 1. Update User Profile Plan
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

  if (profileError) console.warn("Supabase profile plan update warning:", profileError.message);

  // 2. Audit Record in payment_requests
  try {
    await supabase
      .from("payment_requests")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("status", "pending");
  } catch {}

  // 3. Fallback Mock DB Store Update
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    await fetch(`${baseUrl}/api/mock-db`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "approve_payment_request",
        payload: { userId, plan, expiresAt },
      }),
    });
  } catch {}

  return { success: true, plan, expiresAt, source };
}
