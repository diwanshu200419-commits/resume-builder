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
 * Admin test-mode override.
 */
export function getEffectivePlanWithOverride(
  profile: Profile | null,
  testOverride?: string | null
): PlanType {
  if (!profile) return "free";

  if (profile.role === "admin" && testOverride) {
    const o = testOverride.toLowerCase().replace("-", "_");
    if (o === "pro" || o === "premium" || o === "career_pack" || o === "free") {
      return o as PlanType;
    }
  }

  return getEffectivePlan(profile);
}

// Server-side admin guard
export function isAdmin(profile: Profile | null): boolean {
  return profile?.role === "admin";
}

// ATS Scan Limit: Free = 2 scans, Pro/Premium/Career Pack = Unlimited
export function canAnalyze(profile: Profile | null): boolean {
  if (!profile) return true;
  const plan = getEffectivePlan(profile);
  if (plan === "free") return (profile.analyses_used || 0) < 2;
  return true;
}

// Auto-Fix Bullet Rewriter: Pro+
export function canAutoFix(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  return plan === "pro" || plan === "premium" || plan === "career_pack";
}

// PDF Export: Free (with watermark) / Pro+ (no watermark)
export function canDownloadPDF(profile: Profile | null): boolean {
  return true;
}

// DOCX Export: Pro+
export function canDownloadDOCX(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  return plan === "pro" || plan === "premium" || plan === "career_pack";
}

// Portfolio Live Subdomain Deploy: Premium+
export function canDeployPortfolio(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  return plan === "premium" || plan === "career_pack";
}

// Portfolio Custom Domain (CNAME): Career Pack
export function canUseCustomDomain(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  return plan === "career_pack";
}

// STAR Voice Interview Practice: Premium+
export function canAccessSTARVoice(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  return plan === "premium" || plan === "career_pack";
}

// Recruiter Eye-Screen Simulation: Premium+
export function canAccessRecruiterSim(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  return plan === "premium" || plan === "career_pack";
}

// Hiring Odds Predictor: Premium+
export function canAccessHiringPredictor(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  return plan === "premium" || plan === "career_pack";
}

// Branding Studio & LinkedIn: Pro+
export function canAccessBrandingStudio(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  return plan === "pro" || plan === "premium" || plan === "career_pack";
}

// Salary Negotiator: Premium+
export function canAccessSalaryNegotiator(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  return plan === "premium" || plan === "career_pack";
}

// Multi-Language Translator: Pro+
export function canAccessTranslator(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  return plan === "pro" || plan === "premium" || plan === "career_pack";
}

// AI Cover Letter Generator: Pro+
export function canAccessCoverLetter(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  return plan === "pro" || plan === "premium" || plan === "career_pack";
}

// Premium All-Access
export function canAccessPremium(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  return plan === "premium" || plan === "career_pack";
}

export function canDownload(profile: Profile | null): boolean {
  const plan = getEffectivePlan(profile);
  return plan === "pro" || plan === "premium" || plan === "career_pack";
}

export function getRemainingAnalyses(profile: Profile | null): number | "unlimited" {
  if (!profile) return 2;
  const plan = getEffectivePlan(profile);
  if (plan !== "free") return "unlimited";
  return Math.max(0, 2 - (profile.analyses_used || 0));
}
