import { NextResponse } from "next/server";
import type { Profile } from "@/types";

export type PlanType = "free" | "pro" | "premium" | "career_pack";

export interface PlanConfig {
  id: PlanType;
  name: string;
  priceInr: number;
  billingType: "free" | "recurring" | "lifetime";
  periodLabel: string;
  tagline: string;
  features: string[];
  limits: Record<string, number>;
}

export const PLAN_CONFIG: Record<PlanType, PlanConfig> = {
  free: {
    id: "free",
    name: "Free Tier",
    priceInr: 0,
    billingType: "free",
    periodLabel: "forever",
    tagline: "Perfect to try Vaylo AI",
    features: [
      "2 ATS Resume Scans",
      "Basic Resume Builder",
      "Watermark on PDF export",
    ],
    limits: {
      ats_scan: 2,
      bullet_rewrite: 0,
      linkedin_optimizer: 0,
      cover_letter: 0,
      resume_roast: 0,
      networking: 0,
      translation: 0,
      interview_eval: 0,
      hiring_readiness: 0,
      recruiter_simulation: 0,
      career_roadmap: 0,
      salary_analysis: 0,
      portfolio_generation: 0,
      career_coach: 0,
    },
  },
  pro: {
    id: "pro",
    name: "Pro Plan",
    priceInr: 99,
    billingType: "recurring",
    periodLabel: "/month",
    tagline: "Essential optimization tools",
    features: [
      "Unlimited PDF downloads",
      "Auto-Fix Bullet Rewriter",
      "LinkedIn Profile Optimizer",
      "Cover Letter Generator",
      "No Watermark",
      "Higher AI Allowance",
    ],
    limits: {
      ats_scan: 30,
      bullet_rewrite: 50,
      linkedin_optimizer: 15,
      cover_letter: 15,
      resume_roast: 10,
      networking: 15,
      translation: 10,
      interview_eval: 0,
      hiring_readiness: 0,
      recruiter_simulation: 0,
      career_roadmap: 5,
      salary_analysis: 0,
      portfolio_generation: 0,
      career_coach: 20,
    },
  },
  premium: {
    id: "premium",
    name: "Premium Plan",
    priceInr: 299,
    billingType: "recurring",
    periodLabel: "/month",
    tagline: "Complete career copilot",
    features: [
      "Everything in Pro",
      "STAR Voice Interview Practice",
      "Portfolio Website Generator",
      "Recruiter Attention Simulator",
      "Hiring Odds Predictor",
      "AI Career Mentor",
    ],
    limits: {
      ats_scan: 50,
      bullet_rewrite: 100,
      linkedin_optimizer: 25,
      cover_letter: 25,
      resume_roast: 20,
      networking: 30,
      translation: 15,
      interview_eval: 20,
      hiring_readiness: 20,
      recruiter_simulation: 20,
      career_roadmap: 10,
      salary_analysis: 20,
      portfolio_generation: 10,
      career_coach: 50,
    },
  },
  career_pack: {
    id: "career_pack",
    name: "Career Pack",
    priceInr: 499,
    billingType: "lifetime",
    periodLabel: "one-time",
    tagline: "Lifetime AI Career Toolkit",
    features: [
      "Everything in Premium",
      "Lifetime access to Career Pack features",
      "Recruiter-Friendly Premium Templates",
      "Advanced Career Analysis",
      "Lifetime Career Roadmap Access",
      "Portfolio & Personal Branding Tools",
      "Higher AI Fair-Use Limits",
      "Priority Support",
    ],
    limits: {
      ats_scan: 50,
      bullet_rewrite: 100,
      linkedin_optimizer: 25,
      cover_letter: 25,
      resume_roast: 20,
      networking: 30,
      translation: 15,
      interview_eval: 20,
      hiring_readiness: 20,
      recruiter_simulation: 20,
      career_roadmap: 10,
      salary_analysis: 20,
      portfolio_generation: 10,
      career_coach: 50,
    },
  },
};

// Returns the real plan from the DB profile, respecting subscription expiry
export function getEffectivePlan(profile: Profile | null): PlanType {
  if (!profile) return "free";

  // Check subscription expiry (Pro & Premium expire after 30 days unless renewed)
  // Career Pack has no expiry (expires_at is null) and remains lifetime active
  if (profile.expires_at) {
    const expiresDate = new Date(profile.expires_at);
    if (expiresDate.getTime() < Date.now()) {
      return "free"; // Subscription expired — revoke paid entitlement
    }
  }

  if (profile.subscription_status === "cancelled" && !profile.expires_at) {
    return "free";
  }

  const p = (profile.plan || "free").toLowerCase().replace("-", "_");
  if (p === "career") return "career_pack";
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

// ATS Scan Limit
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
