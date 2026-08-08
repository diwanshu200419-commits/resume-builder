import { z } from "zod";

const RubricSchema = z.object({
  structure_weight: z.number().min(0).max(1),
  specificity_weight: z.number().min(0).max(1),
  relevance_weight: z.number().min(0).max(1),
  communication_weight: z.number().min(0).max(1),
  model_answer_keywords: z.array(z.string()).min(1).max(10),
});

const QuestionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["behavioral", "technical", "culture", "curveball"]),
  question: z.string().min(10),
  why_this_matters: z.string().min(5),
  rubric: RubricSchema,
});

const QuestionSetSchema = z.object({
  role: z.string().min(1),
  seniority: z.string().min(1),
  company_style: z.string().nullable().optional(),
  questions: z.array(QuestionSchema).length(8),
});

const ErrorSchema = z.object({
  error: z.string(),
});

export function validateAndParseQuestionSet(rawText: string) {
  // Strip markdown fences Gemini Flash sometimes adds despite instructions
  const cleaned = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Interview question generator returned invalid JSON: ${err}`);
  }

  const errorCheck = ErrorSchema.safeParse(parsed);
  if (errorCheck.success) {
    return { isError: true, error: errorCheck.data.error, data: null };
  }

  const result = QuestionSetSchema.safeParse(parsed);
  if (!result.success) {
    console.error("Question set validation failed:", result.error.flatten());
    throw new Error("Generated question set failed validation.");
  }

  return { isError: false, error: null, data: result.data };
}
