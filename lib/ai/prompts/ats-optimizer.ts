export function getATSOptimizerPrompt(resumeText: string, missingKeywords: string[]): string {
  return `You are an expert ATS Resume Writer. Re-write the candidate's experience bullets to seamlessly inject missing technical keywords while upgrading action verbs.

MISSING KEYWORDS TO INJECT:
${missingKeywords.join(", ")}

ORIGINAL RESUME TEXT:
"""
${resumeText}
"""

Rules:
1. Preserve 100% truthful facts.
2. Upgrade weak verbs like 'worked on' to 'Spearheaded', 'Architected', 'Engineered'.
3. Include quantifiable metric achievements (e.g. '% speed increase', 'DAU growth').`;
}
