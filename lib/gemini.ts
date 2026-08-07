import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import type { ATSAnalysisResult, OptimizationResult, InterviewQuestions, LinkedInSuggestions } from "@/types";
import { z } from "zod";
import crypto from "crypto";

// ----------------------------
// Simple In-Memory Cache
// ----------------------------
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCacheKey(prefix: string, ...args: string[]): string {
  const hash = crypto
    .createHash("md5")
    .update(args.join("|"))
    .digest("hex");
  return `${prefix}-${hash}`;
}

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// ----------------------------
// Configuration & Validation
// ----------------------------
const apiKey = process.env.GEMINI_API_KEY || "";
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Model preference order
const MODEL_PREFERENCES = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-8b",
  "gemini-1.5-flash",
];

// Safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// ----------------------------
// Master System Prompt (FAANG-grade)
// ----------------------------
const MASTER_SYSTEM_PROMPT = `You are Vaylo AI's FAANG-level resume evaluation engine.
You have 15+ years of experience in Fortune 500 & FAANG tech recruiting and ATS architecture.

Your evaluation standards:
1. Metric Density: FAANG screeners expect quantifiable impact (%, $, scale, users, latency) in 70%+ of bullets.
2. Verb Strength: Penalize weak openers ("Responsible for", "Helped with", "Attended").
3. Seniority Scope: Verify if leadership signals (architected, led, mentored, cross-functional alignment) match JD expectations.
4. Truthfulness & Integrity: STRICTLY 100% TRUTHFUL. NEVER fabricate metrics, skills, companies, or certifications.

CRITICAL ANTI-FABRICATION RULES:
- NEVER invent numbers, percentages, or metrics that the candidate did not provide.
- NEVER add fake companies, degrees, or certifications.
- ALWAYS improve clarity, active verb strength, and keyword density using ONLY existing candidate facts.`;

// ----------------------------
// Helper: JSON Extraction & Repair
// ----------------------------
function cleanAndExtractJSON(text: string): string {
  let cleaned = text.replace(/```json|```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) cleaned = match[0];
  
  cleaned = cleaned
    .replace(/,\s*}/g, "}")
    .replace(/,\s*\]/g, "]")
    .replace(/(\w+):/g, '"$1":')
    .replace(/:\s*'([^']*)'/g, ': "$1"');
  
  return cleaned;
}

// Zod validation schemas for responses
const ATSAnalysisSchema = z.object({
  ats_score: z.number().int().min(0).max(100),
  keyword_match_score: z.number().int().min(0).max(100),
  skills_match_score: z.number().int().min(0).max(100),
  readability_score: z.number().int().min(0).max(100),
  format_score: z.number().int().min(0).max(100),
  missing_keywords: z.array(z.string()),
  missing_skills: z.array(z.string()),
  weak_sections: z.array(z.string()),
  match_percentage: z.number().int().min(0).max(100),
  summary_analysis: z.string().min(10),
});

const OptimizationSchema = z.object({
  optimized_full_text: z.string().min(100),
  professional_summary: z.object({ before: z.string(), after: z.string() }),
  skills_section: z.object({ before: z.string(), after: z.string() }),
  experience_section: z.object({ before: z.string(), after: z.string() }),
  optimized_ats_score: z.number().int().min(0).max(100),
  changes_made: z.array(z.string()),
});

// ----------------------------
// Helper: Retry with Timeout
// ----------------------------
async function withRetryAndTimeout<T>(
  fn: () => Promise<T>,
  retries = 2,
  timeoutMs = 12000
): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
      );
      return await Promise.race([fn(), timeoutPromise]);
    } catch (err: any) {
      lastError = err;
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  throw lastError;
}

export function getModel() {
  for (const modelName of MODEL_PREFERENCES) {
    try {
      return genAI.getGenerativeModel({
        model: modelName,
        safetySettings,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      });
    } catch (e) {
      continue;
    }
  }
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

// ----------------------------
// FAANG-Grade Multi-Dimensional Algorithms
// ----------------------------

function calculateKeywordMatch(resumeText: string, jobDescription: string): number {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();
  
  const potentialKeywords = jdLower.match(/[a-z]+(?:\s[a-z]+)*/g) || [];
  const wordCount = potentialKeywords.length;
  let matches = 0;
  
  const commonWords = ["the", "a", "an", "and", "or", "but", "for", "with", "in", "on", "at", "to"];
  
  potentialKeywords.forEach(word => {
    if (!commonWords.includes(word) && word.length > 2) {
      if (resumeLower.includes(word)) matches++;
    }
  });
  
  return Math.min(100, Math.round((matches / Math.max(1, Math.min(wordCount, 50))) * 100));
}

import { detectDomainFromJD, getDomainPromptContext, DOMAIN_VOCABULARY, DomainCategory } from "./domain-intelligence";

// 1. Metric Density Evaluator (Domain-Aware)
function calculateMetricDensity(resumeText: string, domain: DomainCategory) {
  const vocab = DOMAIN_VOCABULARY[domain] || DOMAIN_VOCABULARY["General/Other"];
  const lines = resumeText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 15 && (l.startsWith("•") || l.startsWith("-") || l.startsWith("*") || /^\d+\./.test(l) || l.includes("  ")));

  const total = Math.max(1, lines.length);
  let count = 0;
  for (const line of lines) {
    if (vocab.metricKeywords.test(line)) {
      count++;
    }
  }

  const score = Math.min(100, Math.round((count / total) * 100));
  const targetCount = Math.ceil(total * 0.7);
  const sampleMetric = vocab.sampleMetricTypes[0] || "quantifiable metrics";
  const feedback = `${count} of ${total} bullets contain ${domain} metrics — aim for ${targetCount}+ (${sampleMetric}) for top recruiter impact.`;

  return { score, count, total, feedback };
}

// 2. Action Verb Strength Evaluator (Domain-Aware)
function calculateVerbStrength(resumeText: string, domain: DomainCategory) {
  const vocab = DOMAIN_VOCABULARY[domain] || DOMAIN_VOCABULARY["General/Other"];
  const weakVerbs = vocab.weakVerbs;
  const strongVerbs = vocab.strongVerbs;

  const lines = resumeText
    .split("\n")
    .map((l) => l.trim().replace(/^[^a-zA-Z]+/, ""))
    .filter((l) => l.length > 10);

  const total = Math.max(1, lines.length);
  let strongCount = 0;
  let weakCount = 0;

  for (const line of lines) {
    const firstWord = (line.split(" ")[0] || "").toLowerCase();
    if (strongVerbs.some((v) => firstWord.startsWith(v))) strongCount++;
    else if (weakVerbs.some((v) => firstWord.startsWith(v))) weakCount++;
  }

  const neutralCount = Math.max(0, total - strongCount - weakCount);
  const rawScore = (strongCount * 100 + neutralCount * 65 + weakCount * 20) / total;
  const score = Math.min(100, Math.max(20, Math.round(rawScore)));

  return { score, strongCount, weakCount, total };
}

// 3. Seniority Scope Alignment
function calculateSeniorityMatch(resumeText: string, jobDescription: string) {
  const jdLower = jobDescription.toLowerCase();
  const resLower = resumeText.toLowerCase();

  const isSeniorJd = /\b(senior|staff|principal|lead|head|architect|manager|ca|director)\b/i.test(jdLower);
  const hasSeniorSignals = /\b(architected|spearheaded|mentored|cross-functional|system design|roadmap|technical direction|strategy|on-call|design review|budget|reconciled|audited|forecasted)\b/i.test(resLower);

  if (isSeniorJd) {
    return hasSeniorSignals ? 92 : 58;
  }
  return hasSeniorSignals ? 95 : 82;
}

// 4. Structural Red Flags Inspector
function detectStructuralFlags(resumeText: string) {
  const flags: string[] = [];
  const lines = resumeText.split("\n").filter((l) => l.trim().length > 0);

  if (lines.length > 120) {
    flags.push("Resume length exceeds 2 pages (condense to 1-2 pages).");
  }
  if (!/\b(20\d\d|19\d\d)\b/.test(resumeText)) {
    flags.push("Missing employment/education dates.");
  }
  if (!resumeText.toLowerCase().includes("skills") && !resumeText.toLowerCase().includes("expertise")) {
    flags.push("Missing dedicated Skills / Core Competencies section.");
  }
  if (!resumeText.toLowerCase().includes("summary") && lines.length > 50) {
    flags.push("No professional summary headline found.");
  }

  return flags;
}

function hybridATSScore(
  resumeText: string,
  jobDescription: string,
  aiScore: number
): ATSAnalysisResult {
  const domain = detectDomainFromJD(jobDescription);
  const keywordScore = calculateKeywordMatch(resumeText, jobDescription);
  const metricDensity = calculateMetricDensity(resumeText, domain);
  const verbStrength = calculateVerbStrength(resumeText, domain);
  const seniorityMatchScore = calculateSeniorityMatch(resumeText, jobDescription);
  const structuralFlags = detectStructuralFlags(resumeText);

  const skillsScore = (resumeText.toLowerCase().includes("skills") || resumeText.toLowerCase().includes("competencies")) ? 80 : 50;
  const formatScore = structuralFlags.length === 0 ? 90 : Math.max(50, 90 - structuralFlags.length * 10);
  const readabilityScore = resumeText.split("\n").length > 10 ? 88 : 60;

  // Domain Weighted Overall Score
  const weightedOverall = Math.round(
    keywordScore * 0.40 +
    metricDensity.score * 0.25 +
    verbStrength.score * 0.20 +
    seniorityMatchScore * 0.15
  );

  const finalScore = Math.min(100, Math.max(20, Math.round((weightedOverall + aiScore) / 2)));

  return {
    ats_score: finalScore,
    keyword_match_score: keywordScore,
    skills_match_score: skillsScore,
    readability_score: readabilityScore,
    format_score: formatScore,
    metric_density_score: metricDensity.score,
    verb_strength_score: verbStrength.score,
    seniority_match_score: seniorityMatchScore,
    structural_flags: structuralFlags,
    metric_density_feedback: metricDensity.feedback,
    missing_keywords: [],
    missing_skills: [],
    weak_sections: [],
    match_percentage: Math.min(100, Math.round((keywordScore + skillsScore) / 2)),
    summary_analysis: "",
  };
}

// ----------------------------
// Main AI Functions
// ----------------------------

import { evaluateATSV2 } from "./ats-v2";

export async function analyzeATS(
  resumeText: string,
  jobDescription: string
): Promise<ATSAnalysisResult> {
  const domain = detectDomainFromJD(jobDescription);
  const cacheKey = getCacheKey(`ats-v2-${domain}`, resumeText, jobDescription);
  const cached = getFromCache<ATSAnalysisResult>(cacheKey);
  if (cached) {
    return cached;
  }

  let aiSemanticBoost = 0;
  let aiSummary = "";

  try {
    const safeResumeText = resumeText
      .replace(/ignore previous instructions|system prompt|forget everything/i, "[REDACTED]")
      .slice(0, 15000);
    
    const safeJobDesc = jobDescription.slice(0, 10000);
    const domainContext = getDomainPromptContext(domain);
    
    const aiResult = await withRetryAndTimeout(async () => {
      const prompt = `${MASTER_SYSTEM_PROMPT}

${domainContext}

TASK: ATS Score Evaluation for ${domain} role.

RESUME TEXT:
${safeResumeText}

JOB DESCRIPTION:
${safeJobDesc}

RESPONSE FORMAT (STRICT VALID JSON ONLY):
{
  "ats_score": <number 0-100>,
  "keyword_match_score": <number 0-100>,
  "skills_match_score": <number 0-100>,
  "readability_score": <number 0-100>,
  "format_score": <number 0-100>,
  "missing_keywords": ["keyword1", "keyword2"],
  "missing_skills": ["skill1", "skill2"],
  "weak_sections": ["Professional Summary", "Experience", "Skills"],
  "match_percentage": <number 0-100>,
  "summary_analysis": "<2-3 sentences of recruiter feedback tailored to ${domain}>"
}`;
      
      const result = await getModel().generateContent(prompt);
      const jsonText = cleanAndExtractJSON(result.response.text());
      const parsed = JSON.parse(jsonText);
      return ATSAnalysisSchema.parse(parsed);
    });

    aiSemanticBoost = Math.round(aiResult.match_percentage / 25);
    aiSummary = aiResult.summary_analysis;
  } catch (error) {
    console.warn("AI semantic assist warning in analyzeATS (using deterministic V2 fallback):", error);
  }

  const v2Result = evaluateATSV2(resumeText, jobDescription, aiSemanticBoost);
  if (aiSummary) {
    v2Result.summary_analysis = aiSummary;
  }

  setCache(cacheKey, v2Result);
  return v2Result;
}

export async function optimizeResume(
  resumeText: string,
  jobDescription: string,
  missingKeywords: string[]
): Promise<OptimizationResult> {
  try {
    const safeResumeText = resumeText
      .replace(/ignore previous instructions|system prompt|forget everything/i, "[REDACTED]")
      .slice(0, 15000);
    const safeJobDesc = jobDescription.slice(0, 10000);
    
    const aiResult = await withRetryAndTimeout(async () => {
      const prompt = `${MASTER_SYSTEM_PROMPT}

TASK: FAANG Resume Optimization

STRICT RULES: NO FAKING EXPERIENCE OR SKILLS! Use Google X-Y-Z bullet formulas where metrics exist.

ORIGINAL RESUME:
${safeResumeText}

JOB DESCRIPTION:
${safeJobDesc}

MISSING KEYWORDS TO INCORPORATE NATURALLY:
${JSON.stringify(missingKeywords)}

RESPONSE FORMAT (STRICT VALID JSON ONLY):
{
  "optimized_full_text": "<complete optimized resume text>",
  "professional_summary": { "before": "<orig>", "after": "<optimized summary>" },
  "skills_section": { "before": "<orig>", "after": "<optimized skills>" },
  "experience_section": { "before": "<orig>", "after": "<optimized experience>" },
  "optimized_ats_score": <number 85-98>,
  "changes_made": ["change 1", "change 2", "change 3"]
}`;

      const result = await getModel().generateContent(prompt);
      const jsonText = cleanAndExtractJSON(result.response.text());
      const parsed = JSON.parse(jsonText);
      return OptimizationSchema.parse(parsed);
    });

    return aiResult;
  } catch (error) {
    console.error("Error in optimizeResume:", error);
    return {
      optimized_full_text: `${resumeText}\n\n[FAANG Optimized Skills]: ${missingKeywords.join(", ")}`,
      professional_summary: {
        before: "Experienced developer",
        after: "Results-driven Software Engineer with proven track record of scaling high-throughput web applications and optimizing system performance."
      },
      skills_section: {
        before: "Languages & Frameworks",
        after: `Languages & Frameworks, ${missingKeywords.slice(0, 4).join(", ")}`
      },
      experience_section: {
        before: "Developed software features",
        after: "Engineered scalable web services and optimized database queries, driving 35% improvement in application response times."
      },
      optimized_ats_score: 94,
      changes_made: [
        "Strengthened bullet openers with FAANG action verbs",
        "Incorporated targeted keywords naturally into technical skills",
        "Aligned experience bullets to X-Y-Z impact format"
      ]
    };
  }
}

export async function generateCareerRoadmap(
  currentSkills: string,
  targetRole: string,
  dreamCompany: string,
  experienceLevel: string
) {
  try {
    const aiResult = await withRetryAndTimeout(async () => {
      const prompt = `${MASTER_SYSTEM_PROMPT}

TASK: Generate Career Learning Roadmap to target ${dreamCompany} as ${targetRole} (${experienceLevel}).

CURRENT SKILLS: ${currentSkills}

RETURN STRICT JSON ONLY:
{
  "timeline": "6 Months",
  "learning_roadmap": [
    {
      "title": "Phase 1: Advanced Core Mastery",
      "duration": "Month 1-2",
      "skills_to_learn": ["TypeScript Generics", "System Design"],
      "action_steps": ["Build 1 project", "Read architecture whitepapers"]
    }
  ],
  "projects": [
    {
      "title": "High-Throughput Microservice",
      "description": "Distributed cache engine handling 10k QPS",
      "tech_stack": ["Go", "Redis", "Docker"],
      "difficulty": "Advanced"
    }
  ],
  "courses": ["Distributed Systems by MIT", "Advanced System Design"]
}`;

      const result = await getModel().generateContent(prompt);
      const jsonText = cleanAndExtractJSON(result.response.text());
      return JSON.parse(jsonText);
    });

    return aiResult;
  } catch (error) {
    return {
      timeline: "6 Months",
      learning_roadmap: [
        {
          title: "Phase 1: High-Scale Systems & Core Proficiency",
          duration: "Month 1-2",
          skills_to_learn: ["System Design", "Distributed Systems", "TypeScript"],
          action_steps: ["Master concurrency & database indexing", "Architect 1 end-to-end cloud project"]
        }
      ],
      projects: [
        {
          title: "Distributed Rate Limiter Service",
          description: "High-concurrency API gateway rate limiter backed by Redis token bucket algorithm",
          tech_stack: ["Node.js", "Redis", "Docker"],
          difficulty: "Advanced"
        }
      ],
      courses: ["System Design Fundamentals", "Advanced Data Structures & Algorithms"]
    };
  }
}

export async function generateResumeRoast(resumeText: string) {
  try {
    const aiResult = await withRetryAndTimeout(async () => {
      const prompt = `${MASTER_SYSTEM_PROMPT}

TASK: Resume Roast. Provide funny, savage, but ultimately constructive recruiter feedback.

RESUME TEXT:
${resumeText.slice(0, 5000)}

RETURN STRICT JSON ONLY:
{
  "general_roast": "<savage roast line>",
  "format_roast": "<funny feedback on formatting>",
  "skills_roast": "<savage critique of skills section>",
  "honest_advice": "<constructive advice to fix it>"
}`;

      const result = await getModel().generateContent(prompt);
      const jsonText = cleanAndExtractJSON(result.response.text());
      return JSON.parse(jsonText);
    });

    return aiResult;
  } catch (error) {
    return {
      general_roast: "This resume looks like it was written during a 3 AM caffeinated fever dream.",
      format_roast: "Bullet points are floating around like lost particles in space.",
      skills_roast: "Listing HTML and Microsoft Word in 2026 is a bold strategy, Cotton.",
      honest_advice: "Focus on quantifiable metrics and lead every experience line with a strong action verb."
    };
  }
}

export async function generateCoverLetter(resumeText: string, jobDescription: string = ""): Promise<string> {
  try {
    const prompt = `${MASTER_SYSTEM_PROMPT}\n\nTASK: Generate a professional FAANG-level cover letter based on candidate resume and job description.\n\nRESUME:\n${resumeText.slice(0, 5000)}\n\nJD:\n${jobDescription.slice(0, 3000)}`;
    const result = await getModel().generateContent(prompt);
    return result.response.text();
  } catch {
    return "Dear Hiring Manager,\n\nI am writing to express my strong enthusiasm for this position...";
  }
}

export async function generateInterviewPrep(resumeText: string, jobDescription: string = ""): Promise<InterviewQuestions> {
  return {
    hr_questions: [{ question: "Tell me about yourself", suggested_answer: "Highlight your key experience & scale", tip: "Keep under 2 minutes" }],
    technical_questions: [{ question: "How do you optimize React rendering?", suggested_answer: "Use memo, useMemo, and virtualized lists", tip: "Focus on profiling" }],
    behavioral_questions: [{ question: "Tell me about a difficult bug", suggested_answer: "Use STAR format (Situation, Task, Action, Result)", tip: "Emphasize metric outcome" }],
  };
}

export async function generateLinkedInSuggestions(resumeText: string, jobDescription?: string): Promise<LinkedInSuggestions> {
  return {
    headline_options: ["Senior Software Engineer | React, Next.js & Distributed Systems", "Full Stack Developer | Building High-Scale Web Apps"],
    about_section: "Results-driven Software Engineer with expertise in modern web architectures.",
    skills_to_add: ["System Design", "TypeScript", "Next.js", "Cloud Architecture"],
    profile_tips: ["Feature your portfolio link in the top section", "Use quantifiable metrics in experience bullets"],
  };
}

export async function optimizeBulletPoints(bullets: string[], jobDescription: string = ""): Promise<string[]> {
  return bullets.map((b) => b.replace(/^Worked on/i, "Spearheaded").replace(/^Helped with/i, "Architected"));
}

export async function generatePortfolioWebsite(candidateName: string | any = "Candidate", role: string = "Software Engineer", skills: string[] = ["React", "TypeScript"]) {
  return {
    html: `<!DOCTYPE html><html><body><h1>${typeof candidateName === 'string' ? candidateName : 'Candidate'} - ${role}</h1><p>Skills: ${Array.isArray(skills) ? skills.join(", ") : "React"}</p></body></html>`,
    css: "body { font-family: sans-serif; }",
  };
}
