import { createClient } from "@supabase/supabase-js";
import { generateVayloInterviewQuestions } from "@/lib/gemini";
import { validateAndParseQuestionSet } from "./validateQuestionSet";

export interface QuestionRequest {
  targetRole: string;
  seniority?: "entry-level" | "mid-level" | "senior" | "leadership" | string;
  companyStyle?: string | null;
  previouslyAsked?: string[];
}

export function normalizeRole(role: string): string {
  return role
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,;]+$/, "");
}

// Fallback question set if Gemini calls fail twice
export const GENERIC_FALLBACK_QUESTION_SET = {
  role: "General Industry Standard",
  seniority: "mid-level",
  company_style: null,
  questions: [
    {
      id: "fb_q1",
      type: "behavioral",
      question: "Describe a project where you had to adapt quickly to unexpected changes in requirements or scope.",
      why_this_matters: "Evaluates adaptability and problem-solving under ambiguity.",
      rubric: {
        structure_weight: 0.35,
        specificity_weight: 0.35,
        relevance_weight: 0.15,
        communication_weight: 0.15,
        model_answer_keywords: ["adaptability", "scope change", "re-prioritization", "stakeholder communication"]
      }
    },
    {
      id: "fb_q2",
      type: "behavioral",
      question: "Tell me about a situation where you encountered a technical or interpersonal disagreement with a team member.",
      why_this_matters: "Tests conflict resolution maturity and team collaboration.",
      rubric: {
        structure_weight: 0.3,
        specificity_weight: 0.3,
        relevance_weight: 0.2,
        communication_weight: 0.2,
        model_answer_keywords: ["conflict resolution", "active listening", "compromise", "data-driven"]
      }
    },
    {
      id: "fb_q3",
      type: "behavioral",
      question: "Give an example of a recent failure or mistake in your work. How did you handle it and what process improvements did you make?",
      why_this_matters: "Measures ownership and post-mortem analysis ability.",
      rubric: {
        structure_weight: 0.4,
        specificity_weight: 0.3,
        relevance_weight: 0.15,
        communication_weight: 0.15,
        model_answer_keywords: ["ownership", "root cause", "post-mortem", "preventative action"]
      }
    },
    {
      id: "fb_q4",
      type: "technical",
      question: "Walk me through your step-by-step methodology when analyzing a critical performance or operational bottleneck.",
      why_this_matters: "Assesses analytical rigor and technical problem decomposition.",
      rubric: {
        structure_weight: 0.3,
        specificity_weight: 0.4,
        relevance_weight: 0.15,
        communication_weight: 0.15,
        model_answer_keywords: ["profiling", "root cause analysis", "benchmarking", "optimization"]
      }
    },
    {
      id: "fb_q5",
      type: "technical",
      question: "How do you evaluate trade-offs when choosing between a fast short-term fix versus a scalable long-term solution?",
      why_this_matters: "Determines engineering judgment and technical debt awareness.",
      rubric: {
        structure_weight: 0.3,
        specificity_weight: 0.4,
        relevance_weight: 0.15,
        communication_weight: 0.15,
        model_answer_keywords: ["trade-off analysis", "technical debt", "scalability", "business impact"]
      }
    },
    {
      id: "fb_q6",
      type: "technical",
      question: "What key metrics or KPIs do you track to ensure the quality and reliability of your deliverables?",
      why_this_matters: "Measures data-driven focus and quality assurance standards.",
      rubric: {
        structure_weight: 0.25,
        specificity_weight: 0.45,
        relevance_weight: 0.15,
        communication_weight: 0.15,
        model_answer_keywords: ["KPIs", "benchmarks", "error rate", "quality assurance"]
      }
    },
    {
      id: "fb_q7",
      type: "culture",
      question: "What specific domain challenge or mission drives your interest in pursuing this role right now?",
      why_this_matters: "Gauges long-term career motivation and alignment.",
      rubric: {
        structure_weight: 0.2,
        specificity_weight: 0.3,
        relevance_weight: 0.3,
        communication_weight: 0.2,
        model_answer_keywords: ["career vision", "domain passion", "cultural fit"]
      }
    },
    {
      id: "fb_q8",
      type: "curveball",
      question: "If you had full autonomy to redesign one core operational process in your current field, what would it be?",
      why_this_matters: "Reveals high-level strategic vision and innovation mindset.",
      rubric: {
        structure_weight: 0.3,
        specificity_weight: 0.4,
        relevance_weight: 0.15,
        communication_weight: 0.15,
        model_answer_keywords: ["process improvement", "bottleneck elimination", "ROI metrics"]
      }
    }
  ]
};

async function callGeminiForQuestionsWithRetry(req: QuestionRequest) {
  const seniority = req.seniority || "mid-level";
  const companyStyle = req.companyStyle || "general industry standard";
  const previouslyAsked = req.previouslyAsked || [];

  // Call 1
  let raw = await generateVayloInterviewQuestions(req.targetRole, companyStyle, seniority, previouslyAsked);
  
  if (typeof raw === "string") {
    try {
      const validated = validateAndParseQuestionSet(raw);
      if (!validated.isError && validated.data) return validated.data;
    } catch {
      // Retry call once if string validation failed
    }
  } else if (raw && typeof raw === "object") {
    if ("error" in raw && raw.error) {
      throw new Error(String(raw.error));
    }
    const validated = validateAndParseQuestionSet(JSON.stringify(raw));
    if (!validated.isError && validated.data) return validated.data;
  }

  // Retry Call 2 with explicit strict reminder
  try {
    const rawRetry = await generateVayloInterviewQuestions(
      `${req.targetRole} (STRICT JSON ONLY)`,
      companyStyle,
      seniority,
      previouslyAsked
    );
    const retryStr = typeof rawRetry === "string" ? rawRetry : JSON.stringify(rawRetry);
    const validatedRetry = validateAndParseQuestionSet(retryStr);
    if (!validatedRetry.isError && validatedRetry.data) return validatedRetry.data;
  } catch (err) {
    console.warn("[getOrGenerateQuestions] Gemini retry failed:", err);
  }

  // Fallback to static generic question set if all Gemini calls fail validation
  return GENERIC_FALLBACK_QUESTION_SET;
}

export async function getOrGenerateQuestions(req: QuestionRequest) {
  const roleNormalized = normalizeRole(req.targetRole || "general");
  const companyStyle = req.companyStyle?.trim().toLowerCase() || null;
  const seniority = req.seniority || "mid-level";
  const previouslyAsked = req.previouslyAsked || [];

  const canUseCache = previouslyAsked.length === 0;

  // Supabase service-role client for shared server-side cache
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (canUseCache && supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: cached } = await supabase
        .from("interview_question_cache")
        .select("*")
        .eq("role_normalized", roleNormalized)
        .eq("seniority", seniority)
        .eq("company_style", companyStyle)
        .maybeSingle();

      if (cached && cached.question_set) {
        // Fire-and-forget hit counter update
        void (async () => {
          try {
            await supabase
              .from("interview_question_cache")
              .update({ hit_count: (cached.hit_count || 0) + 1, updated_at: new Date().toISOString() })
              .eq("id", cached.id);
          } catch {}
        })();

        return { source: "cache", questionSet: cached.question_set };
      }
    } catch (err) {
      console.warn("[getOrGenerateQuestions] Supabase cache read warning:", err);
    }
  }

  // Cache miss or previouslyAsked exclusion list present -> generate live
  const questionSet = await callGeminiForQuestionsWithRetry(req);

  if (canUseCache && supabaseUrl && supabaseKey && questionSet !== GENERIC_FALLBACK_QUESTION_SET) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase
        .from("interview_question_cache")
        .upsert(
          {
            role_normalized: roleNormalized,
            seniority: seniority,
            company_style: companyStyle,
            question_set: questionSet,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "role_normalized,seniority,company_style" }
        );
    } catch (err) {
      console.warn("[getOrGenerateQuestions] Supabase cache write warning:", err);
    }
  }

  return { source: "live", questionSet };
}
