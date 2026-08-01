import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { Profile } from "@/types";

export async function getUser() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return user;
  } catch (err) {
    console.error("[auth] getUser failed:", err);
  }

  return null;
}

export async function getProfile(): Promise<Profile | null> {
  const user = await getUser();
  if (!user) return null;

  try {
    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      // Log the actual error instead of silently swallowing it
      console.error("[auth] getProfile DB error:", error.message, "| code:", error.code);
    }

    if (profile) return profile as Profile;
  } catch (err) {
    console.error("[auth] getProfile exception:", err);
  }

  // Fallback: return a FREE-tier profile, not "pro".
  // This ensures that if the DB is unreachable or the profiles table
  // doesn't exist, users get the most restrictive tier — not a free pass.
  // The fallback plan MUST be "free" so tier-gated features are blocked.
  return {
    id: user.id,
    email: user.email || null,
    full_name: user.user_metadata?.full_name || null,
    avatar_url: user.user_metadata?.avatar_url || null,
    plan: "free",
    role: null,
    analyses_used: 0,
    analyses_limit: 2,
    current_period_start: null,
    current_period_end: null,
    subscription_status: null,
    total_ats_checks: 0,
    total_resume_downloads: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Profile;
}
