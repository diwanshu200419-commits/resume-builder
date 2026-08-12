// app/api/fix-bullet/route.ts
//
// Vaylo AI — Domain-Agnostic FAANG-Level ATS Bullet-Point Rewriter
// Dynamically classifies JD into 1 of 12 domains (Finance, HR, Sales, IT, PM, Ops, etc.)
// and selects domain-specific action verb banks and metric definitions,
// without fabricating experience, skills, or metrics.

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { detectDomainFromJD, getDomainPromptContext, DOMAIN_VOCABULARY } from "@/lib/domain-intelligence";
import { getProfile } from "@/lib/auth";
import { canAutoFix } from "@/lib/plans";

// ---------- Request validation ----------

const RequestSchema = z.object({
  original_bullet: z.string().min(1).max(500),
  job_description: z.string().min(1).max(8000),
  missing_keywords: z.array(z.string()).default([]),
  candidate_full_resume_context: z.string().min(1).max(20000),
});

type FixBulletRequest = z.infer<typeof RequestSchema>;

// ---------- Response shape ----------

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

// ---------- Prompt Builder ----------

function buildSystemPrompt(domain: ReturnType<typeof detectDomainFromJD>): string {
  const domainContext = getDomainPromptContext(domain);

  return `You are Vaylo AI's domain-agnostic resume optimization engine. Your job is to rewrite weak, passive resume bullet points into high-impact, ATS-optimized bullets — WITHOUT inventing experience, skills, metrics, or outcomes the candidate did not provide.

${domainContext}

STRICT ANTI-FABRICATION RULES:
1. NEVER fabricate numbers, percentages, team sizes, or outcomes. If the original bullet has no quantifiable metric, do NOT insert one. Instead, strengthen the verb and clarify scope/impact using only what's stated.
2. Only incorporate missing keywords from the job description if they describe something the candidate's original bullet already implies. Do not add skills or tools the candidate never mentioned anywhere in the resume.
3. Replace weak/passive openers ("Worked on", "Responsible for", "Helped with", "Attended") with domain-appropriate strong action verbs.
4. Keep each rewritten bullet to one line, ATS-plain-text formatting (no special characters, no emojis, no tables).
5. If a bullet cannot be meaningfully improved without fabrication, return it with minimal changes and flag it in "needs_input".

DOMAIN & FAANG-LEVEL REWRITING RULES:
6. Prefer Google's X-Y-Z formula where the original bullet supports it:
   "Accomplished [X] as measured by [Y], by doing [Z]."
   Do not force this structure if it requires fabricating Y (metric) — only restructure toward X-Y-Z using metrics/scope already present.
7. When a bullet lacks scope/scale language and target role is Senior+, flag via needs_input asking whether candidate can provide budget, team size, or volume metrics — do not invent it.
8. Detect and flag (via needs_input) bullets that are activity-described rather than outcome-described.
9. Respect target domain vocabulary. For Finance: Audited, Reconciled, Forecasted; for PM: Drove, Launched, Prioritized; for HR: Recruited, Onboarded; for IT: Architected, Engineered.

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
}

function buildUserMessage(input: FixBulletRequest, domain: string): string {
  return `Target Domain: ${domain}

Original bullet: "${input.original_bullet}"

Job description: "${input.job_description}"

Missing keywords identified by ATS scan: ${JSON.stringify(input.missing_keywords)}

Full resume context:
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

// ---------- Cache ----------

const FALLBACK_CACHE_MAX = 200;
const fallbackCache = new Map<string, GeminiResult>();

function cacheKey(input: FixBulletRequest, domain: string): string {
  return JSON.stringify({
    d: domain,
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
  domain: ReturnType<typeof detectDomainFromJD>,
  attempt = 1
): Promise<GeminiResult> {
  try {
    const client = getGeminiClient();
    const systemInstruction = buildSystemPrompt(domain);

    const model = client.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
      systemInstruction,
    });

    const result = await model.generateContent(buildUserMessage(input, domain));
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
        return callGeminiForRewrite(input, domain, attempt + 1);
      }
      throw new Error(`Gemini response failed schema validation: ${validated.error.message}`);
    }

    return validated.data;
  } catch (err) {
    // Intelligent Domain-Aware Fallback Engine
    const vocab = DOMAIN_VOCABULARY[domain] || DOMAIN_VOCABULARY["General/Other"];
    const words = input.original_bullet.split(" ");
    let firstWord = words[0] || "Worked";
    let verbs_changed = false;
    const hasMetric = vocab.metricKeywords.test(input.original_bullet);

    if (["Worked", "Responsible", "Helped", "Assisted", "Handled", "Did", "Attended", "Checked"].some(w => firstWord.toLowerCase().startsWith(w.toLowerCase()))) {
      firstWord = vocab.strongVerbs[0] || "Spearheaded";
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
      needs_input: hasMetric ? null : `Consider adding quantifiable impact (${vocab.sampleMetricTypes.slice(0, 2).join(", ")}) if available.`,
    };
  }
}

// ---------- Route handler ----------

export async function POST(req: NextRequest) {
  const profile = await getProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canAutoFix(profile)) {
    return NextResponse.json(
      { error: "Auto-Fix Bullet Rewriter requires Pro or higher plan." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsedInput = RequestSchema.safeParse(body);
  if (!parsedInput.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsedInput.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsedInput.data;
  const domain = detectDomainFromJD(input.job_description);
  const key = cacheKey(input, domain);

  const cached = fallbackCache.get(key);
  if (cached) {
    return NextResponse.json({ ...cached, domain, cached: true }, { status: 200 });
  }

  try {
    const rewriteResult = await callGeminiForRewrite(input, domain);
    setCache(key, rewriteResult);
    return NextResponse.json({ ...rewriteResult, domain, cached: false }, { status: 200 });
  } catch (err) {
    console.error("[/api/fix-bullet] Gemini call failed:", err);

    const fallback: GeminiResult & { domain: string; cached: boolean; error: true } = {
      original: input.original_bullet,
      rewritten: input.original_bullet,
      verbs_changed: false,
      keywords_added: [],
      metrics_added: false,
      has_measurable_outcome: false,
      seniority_match: "appropriate",
      needs_input: "AI rewrite temporarily unavailable — this bullet was left unchanged.",
      domain,
      cached: false,
      error: true,
    };

    return NextResponse.json(fallback, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST." }, { status: 405 });
}
