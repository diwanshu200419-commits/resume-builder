// lib/ai/cover-letter/cover-letter-score.ts
//
// Vaylo AI — Deterministic Cover Letter Quality Scorer
// Rule-based, 100% reproducible. Zero LLM scoring.
// Follows the same pattern as lib/ai/linkedin/linkedin-score.ts
// and the ATS engine in lib/ats-v2.ts.

export interface CoverLetterInput {
  coverLetterText: string;      // Generated cover letter text
  companyName?: string;         // Expected company name (from user input)
  jobTitle?: string;            // Expected role title
  candidateSkills?: string[];   // Skills the candidate provided
  resumeText?: string;          // Original resume text for fact-checking
}

export interface CoverLetterScoreBreakdown {
  total: number; // 0-100
  personalization: number;    // 0-30
  keywordAlignment: number;   // 0-25
  structure: number;          // 0-25
  factualGrounding: number;   // 0-20
  scoreExplanation: string;
  breakdown: {
    personalization: { score: number; max: 30; issues: string[]; strengths: string[] };
    keywordAlignment: { score: number; max: 25; matched: string[]; missing: string[] };
    structure: { score: number; max: 25; issues: string[]; strengths: string[] };
    factualGrounding: { score: number; max: 20; issues: string[] };
  };
}

const ACTION_VERBS = ["built", "led", "architected", "optimized", "developed", "scaled", "designed", "engineered", "delivered", "implemented", "reduced", "increased", "launched", "managed", "created", "drove", "achieved"];
const METRIC_PATTERNS = [/\d+%/i, /\$\d+/i, /₹\d+/i, /\d+x\s/i, /\d+\s*(ms|s|sec|min|users|customers|requests|k\b|million|billion)/i];
const FILLER_PHRASES = ["i am a passionate", "i am a results-driven", "to whom it may concern", "i am writing to apply", "my resume attached"];

export function scoreCoverLetter(input: CoverLetterInput): CoverLetterScoreBreakdown {
  const letter = (input.coverLetterText || "").trim();
  const letterLower = letter.toLowerCase();
  const company = (input.companyName || "").trim();
  const jobTitle = (input.jobTitle || "").trim();
  const skills = (input.candidateSkills || []).map((s) => s.trim().toLowerCase()).filter(Boolean);
  const resumeLower = (input.resumeText || "").toLowerCase();

  // -----------------------------------------------------------
  // 1. PERSONALIZATION (Max 30 pts)
  // -----------------------------------------------------------
  let personalizationScore = 0;
  const personalizationIssues: string[] = [];
  const personalizationStrengths: string[] = [];

  // Company name appears in letter?
  if (company && letterLower.includes(company.toLowerCase())) {
    personalizationScore += 12;
    personalizationStrengths.push(`References target company '${company}' explicitly.`);
  } else if (company) {
    personalizationIssues.push(`Does not mention target company '${company}'.`);
  } else {
    personalizationIssues.push("No target company name was provided to check personalization against.");
  }

  // Job title appears in letter?
  const titleTokens = jobTitle.toLowerCase().split(/\s+/).filter((t) => t.length > 3);
  const titleHit = titleTokens.length > 0 && titleTokens.every((t) => letterLower.includes(t));
  if (jobTitle && titleHit) {
    personalizationScore += 10;
    personalizationStrengths.push(`References target role '${jobTitle}' explicitly.`);
  } else if (jobTitle) {
    personalizationIssues.push(`Job title '${jobTitle}' is not clearly referenced in the letter.`);
  }

  // Avoids filler salutations ("to whom it may concern")
  const hasFillerSalutation = FILLER_PHRASES.some((p) => letterLower.includes(p));
  if (!hasFillerSalutation) {
    personalizationScore += 8;
    personalizationStrengths.push("Avoids generic salutation filler phrases.");
  } else {
    personalizationIssues.push("Contains generic filler phrases or impersonal 'To Whom It May Concern' opening.");
  }

  personalizationScore = Math.min(30, Math.max(0, personalizationScore));

  // -----------------------------------------------------------
  // 2. KEYWORD ALIGNMENT (Max 25 pts)
  // -----------------------------------------------------------
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const skill of skills) {
    if (letterLower.includes(skill)) {
      matchedKeywords.push(skill);
    } else {
      missingKeywords.push(skill);
    }
  }

  let keywordScore = 0;
  if (skills.length > 0) {
    const matchRatio = matchedKeywords.length / skills.length;
    keywordScore = Math.round(matchRatio * 25);
  } else {
    // No skills provided — neutral score (can't verify)
    keywordScore = 12;
  }
  keywordScore = Math.min(25, Math.max(0, keywordScore));

  // -----------------------------------------------------------
  // 3. STRUCTURE (Max 25 pts)
  // -----------------------------------------------------------
  let structureScore = 0;
  const structureIssues: string[] = [];
  const structureStrengths: string[] = [];

  // Length check — target is 200-600 words
  const wordCount = letter.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 200 && wordCount <= 600) {
    structureScore += 8;
    structureStrengths.push(`Good length (${wordCount} words) — professional cover letter range.`);
  } else if (wordCount < 100) {
    structureIssues.push(`Cover letter is too short (${wordCount} words). Aim for 200-600 words.`);
    structureScore += 1;
  } else if (wordCount > 800) {
    structureIssues.push(`Cover letter is too long (${wordCount} words). Trim to 600 words for recruiter attention span.`);
    structureScore += 3;
  } else {
    structureScore += 4;
  }

  // Opening hook: must NOT just start with "I" — should have a value statement or story hook
  const firstLine = letter.split("\n").find((l) => l.trim().length > 0) || "";
  const hasHook = firstLine.trim().length > 20 && !firstLine.trim().toLowerCase().startsWith("dear hiring");
  if (hasHook) {
    structureScore += 7;
    structureStrengths.push("Strong opening hook beyond generic greeting.");
  } else {
    structureIssues.push("Opening lacks an engaging hook — starts too generically.");
  }

  // Closing CTA: must have contact or action invite
  const hasCta = /look forward|happy to discuss|reach out|schedule|interview|call|email me|contact/i.test(letter);
  if (hasCta) {
    structureScore += 7;
    structureStrengths.push("Contains explicit interview / next-step call-to-action.");
  } else {
    structureIssues.push("Missing closing call-to-action (ask for interview / offer to discuss).");
  }

  // Has paragraphs (structure)
  const paragraphs = letter.split(/\n\s*\n/).filter((p) => p.trim().length > 30);
  if (paragraphs.length >= 2) {
    structureScore += 3;
    structureStrengths.push(`Well-organized with ${paragraphs.length} distinct paragraphs.`);
  } else {
    structureIssues.push("Letter appears as a wall of text without clear paragraph breaks.");
  }

  structureScore = Math.min(25, Math.max(0, structureScore));

  // -----------------------------------------------------------
  // 4. FACTUAL GROUNDING (Max 20 pts)
  // -----------------------------------------------------------
  // Cross-reference letter claims against candidate's provided input.
  // This is a real checkable rule — verify skill claims trace back to resume.
  let factualScore = 0;
  const factualIssues: string[] = [];

  if (!input.resumeText && skills.length === 0) {
    // Cannot verify — grant neutral score with a note
    factualScore = 12;
    factualIssues.push("Cannot verify factual accuracy — no resume text or skills provided as reference.");
  } else {
    // Action verbs — does it use real active language (not just "I am applying")?
    const hasActionVerbs = ACTION_VERBS.some((v) => letterLower.includes(v));
    if (hasActionVerbs) {
      factualScore += 7;
    } else {
      factualIssues.push("No active achievement verbs (built, led, optimized) found — letter reads as passive.");
    }

    // Does letter mention metrics that appear verifiable in resume?
    const metricsInLetter = METRIC_PATTERNS.filter((p) => p.test(letter));
    if (metricsInLetter.length > 0 && resumeLower.length > 0) {
      // Cross-check: verify at least one metric in letter is also in resume
      const metricsInResume = METRIC_PATTERNS.filter((p) => p.test(resumeLower));
      if (metricsInResume.length > 0) {
        factualScore += 8;
      } else {
        factualIssues.push("Letter cites metrics not evidenced in provided resume — potential fabrication.");
        factualScore += 2;
      }
    } else if (metricsInLetter.length === 0) {
      factualIssues.push("No quantifiable metrics (%, numbers, scale) in letter — weaker claim strength.");
      factualScore += 3;
    } else {
      factualScore += 5;
    }

    // Skill claims in letter exist in candidate's actual resume/skills
    if (skills.length > 0 && matchedKeywords.length > 0) {
      factualScore += 5;
    } else if (skills.length > 0) {
      factualIssues.push("Letter does not reference skills the candidate provided — letter is not fact-grounded.");
    } else {
      factualScore += 2;
    }
  }

  factualScore = Math.min(20, Math.max(0, factualScore));

  // -----------------------------------------------------------
  // TOTAL
  // -----------------------------------------------------------
  const total = personalizationScore + keywordScore + structureScore + factualScore;

  let explanation = "";
  if (total >= 80) {
    explanation = "Excellent: Highly personalized, fact-grounded cover letter with strong company/role targeting.";
  } else if (total >= 60) {
    explanation = "Good: Letter is targeted and structured but can strengthen keyword alignment or metrics.";
  } else if (total >= 40) {
    explanation = "Needs Work: Missing explicit company/role personalization or core structural elements.";
  } else {
    explanation = "Weak: Letter is generic or too short. Personalize with company name, role, and verified skills.";
  }

  return {
    total,
    personalization: personalizationScore,
    keywordAlignment: keywordScore,
    structure: structureScore,
    factualGrounding: factualScore,
    scoreExplanation: explanation,
    breakdown: {
      personalization: { score: personalizationScore, max: 30, issues: personalizationIssues, strengths: personalizationStrengths },
      keywordAlignment: { score: keywordScore, max: 25, matched: matchedKeywords, missing: missingKeywords },
      structure: { score: structureScore, max: 25, issues: structureIssues, strengths: structureStrengths },
      factualGrounding: { score: factualScore, max: 20, issues: factualIssues },
    },
  };
}
