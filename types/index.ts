export type Plan = "free" | "pro" | "premium";
export type PaymentStatus = "pending" | "completed" | "expired" | "rejected";
export type SubscriptionStatus = "active" | "expired" | "cancelled" | "pending";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  analyses_used: number;
  analyses_limit: number;
  current_period_start: string | null;
  current_period_end: string | null;
  subscription_status: SubscriptionStatus | null;
  total_ats_checks: number;
  total_resume_downloads: number;
  created_at: string;
  updated_at: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  original_resume_text: string;
  job_description: string;
  job_title: string | null;
  original_ats_score: number | null;
  optimized_ats_score: number | null;
  missing_keywords: string[] | null;
  weak_sections: string[] | null;
  optimized_resume_text: string | null;
  before_summary: string | null;
  after_summary: string | null;
  before_skills: string | null;
  after_skills: string | null;
  before_experience: string | null;
  after_experience: string | null;
  cover_letter: string | null;
  interview_questions: InterviewQuestions | null;
  linkedin_suggestions: LinkedInSuggestions | null;
  keyword_match_score?: number | null;
  skills_match_score?: number | null;
  readability_score?: number | null;
  format_score?: number | null;
  optimized_keyword_match?: number | null;
  optimized_skills_match?: number | null;
  optimized_readability?: number | null;
  optimized_format?: number | null;
  added_keywords?: string[] | null;
  status: "pending" | "analyzing" | "done" | "error";
  created_at: string;
}

export interface ATSAnalysisResult {
  ats_score: number;
  keyword_match_score: number;
  skills_match_score: number;
  readability_score: number;
  format_score: number;
  missing_keywords: string[];
  missing_skills: string[];
  weak_sections: string[];
  match_percentage: number;
  summary_analysis: string;
}

export interface OptimizationResult {
  optimized_full_text: string;
  professional_summary: { before: string; after: string };
  skills_section: { before: string; after: string };
  experience_section: { before: string; after: string };
  optimized_ats_score: number;
  changes_made: string[];
}

export interface InterviewQuestion {
  question: string;
  suggested_answer: string;
  tip: string;
}

export interface InterviewQuestions {
  hr_questions: InterviewQuestion[];
  technical_questions: InterviewQuestion[];
  behavioral_questions: InterviewQuestion[];
}

export interface LinkedInSuggestions {
  headline_options: string[];
  about_section: string;
  skills_to_add: string[];
  profile_tips: string[];
}

export interface Payment {
  id: string;
  user_id: string;
  upi_ref: string | null;
  utr: string | null;
  plan: Plan;
  amount: number;
  currency: string;
  status: PaymentStatus;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  screenshot_url?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export function canAnalyze(profile: Profile): boolean {
  if (profile.plan === "free") return profile.analyses_used < profile.analyses_limit;
  return true;
}

export function canDownload(profile: Profile): boolean {
  return profile.plan === "pro" || profile.plan === "premium";
}

export function canAccessCoverLetter(profile: Profile): boolean {
  return profile.plan === "pro" || profile.plan === "premium";
}

export function canAccessPremium(profile: Profile): boolean {
  return profile.plan === "premium";
}

export const PLAN_LIMITS = {
  free: { analyses: 2, price: 0 },
  pro: { analyses: Infinity, price: 199 },
  premium: { analyses: Infinity, price: 399 },
} as const;
