import { NextResponse } from "next/server";
import type { Profile } from "@/types";

export type PlanType = "free" | "pro" | "premium" | "career_pack";

// Returns the real plan from the DB profile
export function getEffectivePlan(profile: Profile | null): PlanType {
  if (!profile) return "free";
  const p = (profile.plan || "free").toLowerCase().replace("-", "_");
  if (p === "pro" || p === "premium" || p === "career_pack") return p as PlanType;
  return "free";
}

/**
 * PART 3 — Admin test-mode override.
 * If the requester is an admin AND has a test_plan_override cookie,
 * returns the override plan instead of their real plan.
 * For all non-admins: ignores any override and returns real plan.
 * The real profiles.plan in the DB never changes.
 */
export function getEffectivePlanWithOverride(
  profile: Profile | null,
  testOverride?: string | null
): PlanType {
  if (!profile) return "free";

  // Only admins can use test override
  if (profile.role === "admin" && testOverride) {
    const o = testOverride.toLowerCase().replace("-", "_");
    if (o === "pro" || o === "premium" || o === "career_pack" || o === "free") {
      return o as PlanType;
    }
  }

  return getEffectivePlan(profile);
}

// Server-side admin guard — checks role column, not email list
export function isAdmin(profile: Profile | null): boolean {
  return profile?.role === "admin";
}

export function canAnalyze(profile: Profile | null): boolean {
  if (!profile) return true;
  const plan = getEffectivePlan(profile);
  if (plan === "free") return (profile.analyses_used || 0) < 2;
  return true;
}

export function canAutoFix(profile: Profile | null): boolean {
  return true;
}

export function canDownloadPDF(profile: Profile | null): boolean {
  return true;
}

export function canDownloadDOCX(profile: Profile | null): boolean {
  return true;
}

export function canDeployPortfolio(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  return plan === "premium" || plan === "career_pack";
}

export function canAccessSTARVoice(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  if (plan === "free" || plan === "pro") {
    return (profile?.total_resume_downloads || 0) < 5;
  }
  return true;
}

export function canAccessRecruiterSim(profile: Profile | null): boolean {
  return true;
}

export function canAccessHiringPredictor(profile: Profile | null): boolean {
  return true;
}

export function canAccessBrandingStudio(profile: Profile | null): boolean {
  return true;
}

export function canAccessSalaryNegotiator(profile: Profile | null): boolean {
  return true;
}

export function canAccessTranslator(profile: Profile | null): boolean {
  return true;
}

export function canAccessCoverLetter(profile: Profile | null): boolean {
  return true;
}

export function canAccessPremium(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  return plan === "premium" || plan === "career_pack";
}

export function canDownload(profile: Profile | null): boolean {
  return true;
}

export function getRemainingAnalyses(profile: Profile | null): number | "unlimited" {
  if (!profile) return 2;
  const plan = getEffectivePlan(profile);
  if (plan !== "free") return "unlimited";
  return Math.max(0, 2 - (profile.analyses_used || 0));
}
