import { createServiceClient } from "@/lib/supabase/server";

export interface InterviewQuestion {
  id: string;
  role_category: string;
  sub_role: string;
  company_tag: string;
  question_type: string;
  difficulty: "easy" | "medium" | "hard";
  question_text: string;
  ideal_answer_structure: {
    situation?: string;
    action?: string;
    result?: string;
  };
  tags?: string[];
}

export const FALLBACK_QUESTIONS: InterviewQuestion[] = [
  {
    id: "fq-1",
    role_category: "software_engineering",
    sub_role: "frontend",
    company_tag: "google_style",
    question_type: "technical",
    difficulty: "medium",
    question_text: "Describe how you would optimize the rendering performance and initial load time of a complex React application with dynamic dashboards.",
    ideal_answer_structure: {
      situation: "Heavy bundle size causing high Largest Contentful Paint (LCP).",
      action: "Implemented code splitting via React.lazy, virtualized lists, memoization, and dynamic asset compression.",
      result: "Reduced LCP by 45% and improved Lighthouse score to 94.",
    },
    tags: ["react", "performance"],
  },
  {
    id: "fq-2",
    role_category: "software_engineering",
    sub_role: "backend",
    company_tag: "amazon_style",
    question_type: "behavioral",
    difficulty: "medium",
    question_text: "Tell me about a time when a production service under your ownership experienced an unexpected traffic surge. How did you handle it?",
    ideal_answer_structure: {
      situation: "Traffic spike exhausted database connections during sales event.",
      action: "Added Redis caching, rate limiting, and pod auto-scaling.",
      result: "Maintained 99.99% availability with zero downtime.",
    },
    tags: ["scalability", "amazon_principles"],
  },
  {
    id: "fq-3",
    role_category: "product_management",
    sub_role: "general",
    company_tag: "google_style",
    question_type: "case_study",
    difficulty: "hard",
    question_text: "How would you measure the success of Google Photos, and what feature would you prioritize next to drive 30-day user retention?",
    ideal_answer_structure: {
      situation: "Need to balance storage monetization with daily active engagement.",
      action: "Defined weekly memory shares metric, analyzed churn funnel, prioritized AI semantic search.",
      result: "Drove 18% lift in retention.",
    },
    tags: ["pm", "strategy"],
  },
];

/**
 * Selects a session question set for candidate, excluding recently served question IDs to guarantee variety.
 */
export async function getSessionQuestions(params: {
  roleCategory?: string;
  subRole?: string;
  limit?: number;
  excludeIds?: string[];
}): Promise<InterviewQuestion[]> {
  const limit = params.limit || 3;
  const roleCategory = params.roleCategory || "software_engineering";
  const excludeSet = new Set(params.excludeIds || []);

  try {
    const supabase = await createServiceClient();
    let query = supabase
      .from("interview_questions")
      .select("*")
      .eq("role_category", roleCategory);

    if (params.subRole && params.subRole !== "all") {
      query = query.eq("sub_role", params.subRole);
    }

    const { data: dbQuestions, error } = await query.limit(50);

    if (!error && dbQuestions && dbQuestions.length > 0) {
      const filtered = dbQuestions.filter((q) => !excludeSet.has(q.id));
      const pool = filtered.length >= limit ? filtered : dbQuestions;
      
      // Shuffle pool deterministically
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit) as InterviewQuestion[];
    }
  } catch (err) {
    console.warn("[getInterviewQuestions] Supabase fallback to static bank:", err);
  }

  // Fallback to in-memory curated FAANG bank
  const filteredFallback = FALLBACK_QUESTIONS.filter((q) => !excludeSet.has(q.id));
  const pool = filteredFallback.length > 0 ? filteredFallback : FALLBACK_QUESTIONS;
  return pool.slice(0, limit);
}
