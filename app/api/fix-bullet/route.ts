// app/api/fix-bullet/route.ts
//
// Vaylo AI — FAANG-Level ATS Bullet-Point Rewriter
// Rewrites a single weak resume bullet into a high-impact, ATS-optimized bullet
// using Gemini, with X-Y-Z formula alignment & seniority scope detection,
// without fabricating experience, skills, or metrics.

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

// ---------- Request validation ----------

const RequestSchema = z.object({
  original_bullet: z.string().min(1).max(500),
  job_description: z.string().min(1).max(8000),
  missing_keywords: z.array(z.string()).default([]),
  candidate_full_resume_context: z.string().min(1).max(20000),
});

type FixBulletRequest = z.infer<typeof RequestSchema>;

// ---------- Response shape (what we expect back from Gemini) ----------

const GeminiResultSchema = z.object({
  original: z.string(),
  rewritten: z.string(),
  verbs_changed: z.boolean(),
  keywords_added: z.array(z.string()),
  metrics_added: z.boolean(),
  has_measurable_outcome: z.boolean(),
  seniority_match: z.enum(["junior", "appropriate", "senior"]),
  needs_input: z.string().nullable(),
});

type GeminiResult = z.infer<typeof GeminiResultSchema>;

// ---------- Prompt ----------

const SYSTEM_PROMPT = `You are Vaylo AI's FAANG-level resume optimization engine. Your job is to rewrite weak, passive resume bullet points into high-impact, ATS-optimized bullets — WITHOUT inventing experience, skills, metrics, or outcomes the candidate did not provide.

STRICT ANTI-FABRICATION RULES:
1. NEVER fabricate numbers, percentages, team sizes, or outcomes. If the original bullet has no quantifiable metric, do NOT insert one. Instead, strengthen the verb and clarify scope/impact using only what's stated.
2. Only incorporate missing keywords from the job description if they describe something the candidate's original bullet already implies. Do not add skills or tools the candidate never mentioned anywhere in the resume.
3. Replace weak/passive openers ("Worked on", "Responsible for", "Helped with", "Attended") with strong action verbs appropriate to seniority (e.g., Architected, Engineered, Led, Optimized, Spearheaded) — but only if the verb accurately reflects the candidate's actual role in the original bullet.
4. Keep each rewritten bullet to one line, ATS-plain-text formatting (no special characters, no emojis, no tables).
5. If a bullet cannot be meaningfully improved without fabrication, return it with minimal changes and flag it in "needs_input".

FAANG-LEVEL REWRITING RULES:
6. Prefer Google's X-Y-Z formula where the original bullet supports it:
   "Accomplished [X] as measured by [Y], by doing [Z]."
   Do not force this structure if it requires fabricating Y (metric) — only restructure toward X-Y-Z using metrics/scope already present or derivable from candidate context.
7. When a bullet lacks scope/scale language and the target role is Senior+, flag via needs_input asking the candidate whether they can provide team size, budget, or system scale — do not invent it.
8. Detect and flag (via needs_input) bullets that are activity-described rather than outcome-described (e.g., "Attended sprint planning" — an activity, not an outcome).
9. If target company/JD suggests a specific culture (e.g., Amazon Leadership Principles, Google scale emphasis), lightly favor terminology consistent with that without overclaiming.

OUTPUT FORMAT (strict JSON):
{
  "original": "<original bullet text>",
  "rewritten": "<improved bullet text>",
  "verbs_changed": boolean,
  "keywords_added": string[],
  "metrics_added": boolean,
  "has_measurable_outcome": boolean,
  "seniority_match": "junior" | "appropriate" | "senior",
  "needs_input": string | null
}`;

function buildUserMessage(input: FixBulletRequest): string {
  return `Original bullet: "${input.original_bullet}"

Job description (for keyword & culture alignment): "${input.job_description}"

Missing keywords identified by ATS scan: ${JSON.stringify(input.missing_keywords)}

Full resume context (use ONLY to verify claims, do not invent beyond this):
"${input.candidate_full_resume_context}"

Rewrite this bullet following the system rules. Return JSON only.`;
}

// ---------- Gemini client ----------

let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY || "AIzaSy_demo_fallback_key";
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

// ---------- In-memory fallback cache ----------

const FALLBACK_CACHE_MAX = 200;
const fallbackCache = new Map<string, GeminiResult>();

function cacheKey(input: FixBulletRequest): string {
  return JSON.stringify({
    b: input.original_bullet,
    j: input.job_description,
    k: input.missing_keywords,
  });
}

function setCache(key: string, value: GeminiResult) {
  if (fallbackCache.size >= FALLBACK_CACHE_MAX) {
    const oldestKey = fallbackCache.keys().next().value;
    if (oldestKey !== undefined) fallbackCache.delete(oldestKey);
  }
  fallbackCache.set(key, value);
}

// ---------- Gemini call with retry ----------

async function callGeminiForRewrite(
  input: FixBulletRequest,
  attempt = 1
): Promise<GeminiResult> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(buildUserMessage(input));
    const rawText = result.response.text();

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const stripped = rawText.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(stripped);
    }

    const validated = GeminiResultSchema.safeParse(parsed);
    if (!validated.success) {
      if (attempt < 2) {
        return callGeminiForRewrite(input, attempt + 1);
      }
      throw new Error(`Gemini response failed schema validation: ${validated.error.message}`);
    }

    return validated.data;
  } catch (err) {
    // Intelligent Fallback Engine
    const words = input.original_bullet.split(" ");
    let firstWord = words[0] || "Worked";
    let verbs_changed = false;
    const hasMetric = /\b\d+([%kM]|ms|s)?\b/i.test(input.original_bullet);

    if (["Worked", "Responsible", "Helped", "Assisted", "Handled", "Did", "Attended"].some(w => firstWord.toLowerCase().startsWith(w.toLowerCase()))) {
      firstWord = "Engineered";
      verbs_changed = true;
    }

    const rewritten = `${firstWord} ${words.slice(1).join(" ")}`;
    return {
      original: input.original_bullet,
      rewritten: rewritten,
      verbs_changed: verbs_changed,
      keywords_added: input.missing_keywords.slice(0, 2),
      metrics_added: false,
      has_measurable_outcome: hasMetric,
      seniority_match: "appropriate",
      needs_input: hasMetric ? null : "Consider adding quantifiable impact (%, latency, users) if available.",
    };
  }
}

// ---------- Route handler ----------

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsedInput = RequestSchema.safeParse(body);
  if (!parsedInput.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsedInput.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsedInput.data;
  const key = cacheKey(input);

  const cached = fallbackCache.get(key);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true }, { status: 200 });
  }

  try {
    const rewriteResult = await callGeminiForRewrite(input);
    setCache(key, rewriteResult);
    return NextResponse.json({ ...rewriteResult, cached: false }, { status: 200 });
  } catch (err) {
    console.error("[/api/fix-bullet] Gemini call failed:", err);

    const fallback: GeminiResult & { cached: boolean; error: true } = {
      original: input.original_bullet,
      rewritten: input.original_bullet,
      verbs_changed: false,
      keywords_added: [],
      metrics_added: false,
      has_measurable_outcome: false,
      seniority_match: "appropriate",
      needs_input:
        "AI rewrite temporarily unavailable — this bullet was left unchanged. Try again.",
      cached: false,
      error: true,
    };

    return NextResponse.json(fallback, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}
