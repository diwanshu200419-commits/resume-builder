import type { Profile } from "@/types";

export function canAnalyze(profile: Profile): boolean {
  if (profile.plan === "free") return profile.analyses_used < 2;
  return true;
}

export function canDownloadDOCX(profile: Profile): boolean {
  return profile.plan !== "free";
}

export function canDownloadPDF(profile: Profile): boolean {
  return profile.plan !== "free";
}

export function canAccessCoverLetter(profile: Profile): boolean {
  return profile.plan !== "free";
}

export function canAccessInterviewPrep(profile: Profile): boolean {
  return profile.plan !== "free";
}

export function canAccessLinkedIn(profile: Profile): boolean {
  return profile.plan !== "free";
}

export function canAccessPremium(profile: Profile): boolean {
  return profile.plan === "premium";
}

export function canDownload(profile: Profile): boolean {
  return profile.plan !== "free";
}

export function getRemainingAnalyses(profile: Profile): number | "unlimited" {
  if (profile.plan !== "free") return "unlimited";
  return Math.max(0, 2 - profile.analyses_used);
}
