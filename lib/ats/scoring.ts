import { TECHNICAL_ALIASES } from "@/lib/ats-v2";

export interface CanonicalATSScoreResult {
  overall: number; // 0-100
  categories: {
    keyword_match: {
      score: number;
      weight: 0.35;
      matched: string[];
      missing: string[];
    };
    skills_alignment: {
      score: number;
      weight: 0.30;
      note: string;
    };
    readability: {
      score: number;
      weight: 0.20;
      note: string;
    };
    formatting_impact: {
      score: number;
      weight: 0.15;
      issues: string[];
    };
  };
  matched_keywords: string[];
  missing_keywords: string[];
  issues: string[];
}

export interface CalculateATSScoreInput {
  resumeText: string;
  jobDescription?: string;
  aiKeywordMatch?: number;
  aiSkillsMatch?: number;
  aiReadability?: number;
  aiFormat?: number;
}

/**
 * Single Canonical ATS Scoring Engine for VayloAI.
 * Guaranteed 100% deterministic score calculation across all routes and tools.
 *
 * Canonical Weights:
 * - Keyword Match: 35%
 * - Skills Alignment: 30%
 * - Readability: 20%
 * - Formatting & Impact: 15%
 */
export function calculateATSScore(input: CalculateATSScoreInput): CanonicalATSScoreResult {
  const resumeText = input.resumeText || "";
  const jobDescription = input.jobDescription || "";
  const lowerResume = resumeText.toLowerCase();
  const lowerJD = jobDescription.toLowerCase();
  const hasJD = lowerJD.trim().length > 20;

  // 1. KEYWORD MATCH (35% Weight)
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  let keywordScore = 75; // Default for resume-quality mode (no JD)

  if (hasJD) {
    const rawTerms = lowerJD.match(/[a-z0-9.+#-]+(?:\s[a-z0-9.+#-]+)*/g) || [];
    const termCounts = new Map<string, number>();

    const stopwords = new Set([
      "the", "a", "an", "and", "or", "for", "with", "in", "on", "at", "to", "of",
      "required", "preferred", "experience", "work", "ability", "strong", "good",
      "team", "role", "candidate", "responsibilities", "requirements", "knowledge",
      "years", "plus", "must", "have", "building", "working", "using", "support",
    ]);

    for (const term of rawTerms) {
      const clean = term.toLowerCase().trim().replace(/[^a-z0-9.+#\s-]/g, "");
      const norm = TECHNICAL_ALIASES[clean] || clean;
      if (norm.length > 2 && !stopwords.has(norm)) {
        termCounts.set(norm, (termCounts.get(norm) || 0) + 1);
      }
    }

    const extractedKeywords = Array.from(termCounts.keys()).slice(0, 15);
    let matchedCount = 0;

    for (const kw of extractedKeywords) {
      const hasExact = lowerResume.includes(kw);
      const aliased = TECHNICAL_ALIASES[kw];
      const hasAlias = aliased ? lowerResume.includes(aliased) : false;

      if (hasExact || hasAlias) {
        matchedCount++;
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    }

    const ratio = extractedKeywords.length > 0 ? matchedCount / extractedKeywords.length : 0.8;
    keywordScore = Math.min(100, Math.max(20, Math.round(ratio * 100)));
  } else {
    // Quality mode: count known technical keywords present
    const techCount = Object.keys(TECHNICAL_ALIASES).filter((k) => lowerResume.includes(k)).length;
    keywordScore = Math.min(95, Math.max(50, 60 + techCount * 3));
    matchedKeywords.push(...Object.keys(TECHNICAL_ALIASES).filter((k) => lowerResume.includes(k)).slice(0, 8));
  }

  if (input.aiKeywordMatch !== undefined) {
    keywordScore = Math.min(100, Math.max(0, Math.round((keywordScore + input.aiKeywordMatch) / 2)));
  }

  // 2. SKILLS ALIGNMENT (30% Weight)
  const hasSkillsSection = /skills|technical skills|competencies|expertise/i.test(resumeText);
  let skillsScore = hasSkillsSection ? 85 : 60;

  if (hasJD && matchedKeywords.length > 0) {
    const alignmentRatio = matchedKeywords.length / Math.max(1, matchedKeywords.length + missingKeywords.length);
    skillsScore = Math.min(100, Math.max(30, Math.round(alignmentRatio * 95)));
  }

  if (input.aiSkillsMatch !== undefined) {
    skillsScore = Math.min(100, Math.max(0, Math.round((skillsScore + input.aiSkillsMatch) / 2)));
  }

  const skillsNote = hasJD
    ? matchedKeywords.length > 0
      ? `Matches ${matchedKeywords.length} key technical & role skill requirements.`
      : "Missing key required technical skills from job description."
    : "Evaluated core skills presence and technical section organization.";

  // 3. READABILITY & STRUCTURE (20% Weight)
  const lines = resumeText.split("\n").filter((l) => l.trim().length > 0);
  const bulletLines = lines.filter((l) => l.trim().startsWith("•") || l.trim().startsWith("-") || l.trim().startsWith("*") || /^\d+\./.test(l.trim()));
  let readabilityScore = 80;

  if (lines.length > 5 && bulletLines.length / lines.length > 0.4) {
    readabilityScore = 90;
  } else if (lines.length < 5) {
    readabilityScore = 50;
  }

  if (input.aiReadability !== undefined) {
    readabilityScore = Math.min(100, Math.max(0, Math.round((readabilityScore + input.aiReadability) / 2)));
  }

  const readabilityNote = readabilityScore >= 85
    ? "Excellent bullet hierarchy and active verb openers."
    : "Use more bullet points and active action verbs to improve scanner parsing.";

  // 4. FORMATTING & IMPACT (15% Weight)
  const issues: string[] = [];
  let formatScore = 85;

  if (!/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(resumeText)) {
    issues.push("Missing email contact information.");
    formatScore -= 15;
  }

  if (!/\b(20\d\d|19\d\d)\b/.test(resumeText)) {
    issues.push("Missing employment/education dates.");
    formatScore -= 10;
  }

  const metricMatches = resumeText.match(/\b(\d+%\b|\$\d+|\d+\+|\d+x\b|\d+\s*(users|qps|ms|requests|k|m|gb|tb|hrs|days|months))\b/gi) || [];
  if (metricMatches.length < 2) {
    issues.push("Add more quantifiable metrics (%, $, scale, users) to experience bullets.");
    formatScore -= 10;
  }

  if (input.aiFormat !== undefined) {
    formatScore = Math.min(100, Math.max(0, Math.round((formatScore + input.aiFormat) / 2)));
  }

  formatScore = Math.min(100, Math.max(30, formatScore));

  // CANONICAL WEIGHTED OVERALL SCORE
  const overall = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        keywordScore * 0.35 +
        skillsScore * 0.30 +
        readabilityScore * 0.20 +
        formatScore * 0.15
      )
    )
  );

  return {
    overall,
    categories: {
      keyword_match: {
        score: keywordScore,
        weight: 0.35,
        matched: matchedKeywords,
        missing: missingKeywords,
      },
      skills_alignment: {
        score: skillsScore,
        weight: 0.30,
        note: skillsNote,
      },
      readability: {
        score: readabilityScore,
        weight: 0.20,
        note: readabilityNote,
      },
      formatting_impact: {
        score: formatScore,
        weight: 0.15,
        issues,
      },
    },
    matched_keywords: matchedKeywords,
    missing_keywords: missingKeywords,
    issues,
  };
}
