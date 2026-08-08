import { createClient, createServiceClient } from "@/lib/supabase/server";
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
  let user;
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
  } catch (err) {
    console.error("[auth] getProfile getUser failed:", err);
    return null;
  }

  if (!user) return null;

  let profile: Profile | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .limit(1);

    if (error) {
      console.error("[auth] getProfile DB error:", error.message, "| code:", error.code);
      return null;
    }

    if (data && data.length > 0) {
      const row = data[0];
      const oauthAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
      profile = {
        ...row,
        email: row.email || user.email || null,
        avatar_url: row.avatar_url || oauthAvatar,
      } as Profile;
    }
  } catch (err) {
    console.error("[auth] getProfile DB exception:", err);
    return null;
  }

  if (profile) return profile;

  // Edge case: handle_new_user trigger failed to create a profiles row.
  // Try to insert one via service role if available, otherwise return
  // a minimal in-memory Profile derived from auth metadata only.
  const now = new Date().toISOString();
  const minimalProfile: Profile = {
    id: user.id,
    email: user.email || null,
    full_name: user.user_metadata?.full_name || null,
    avatar_url: user.user_metadata?.avatar_url || null,
    plan: "free",
    role: "user",
    analyses_used: 0,
    analyses_limit: 2,
    current_period_start: null,
    current_period_end: null,
    subscription_status: null,
    total_ats_checks: 0,
    total_resume_downloads: 0,
    created_at: now,
    updated_at: now,
    phone: null,
    location: null,
    headline: null,
    current_role: null,
    target_role: null,
    experience_level: null,
    industry: null,
    skills: null,
    preferred_location: null,
    onboarding_completed: null,
  };

  try {
    const serviceClient = await createServiceClient();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (serviceRoleKey) {
      const { error: insertError } = await serviceClient
        .from("profiles")
        .insert(minimalProfile);

      if (insertError) {
        console.error("[auth] getProfile service-role insert failed:", insertError.message);
      }
    }
  } catch (err) {
    console.error("[auth] getProfile service-role exception:", err);
  }

  return minimalProfile;
}

export function canAccessSTARVoice(plan?: string | null): boolean {
  return plan === "premium" || plan === "career_pack";
}
