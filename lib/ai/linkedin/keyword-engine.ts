import { getKeywordsForRole } from "./role-taxonomy";

export interface KeywordComparisonResult {
  matchedVerifiedSkills: string[];
  partiallyRepresented: string[];
  recommendedToDevelop: string[];
}

export function compareKeywords(
  candidateSkills: string[],
  targetRole: string,
  jdText?: string
): KeywordComparisonResult {
  const roleKeywords = getKeywordsForRole(targetRole);
  const normalizedCandidate = candidateSkills.map((s) => s.toLowerCase().trim());

  const matched: string[] = [];
  const recommended: string[] = [];

  for (const kw of roleKeywords) {
    if (normalizedCandidate.some((c) => c.includes(kw.toLowerCase()) || kw.toLowerCase().includes(c))) {
      matched.push(kw);
    } else {
      recommended.push(kw);
    }
  }

  // Also extract keywords from JD if provided
  if (jdText) {
    const words = jdText.split(/\W+/).filter((w) => w.length > 4);
    const uniqueJdWords = Array.from(new Set(words));
    for (const word of uniqueJdWords.slice(0, 10)) {
      if (!matched.includes(word) && !recommended.includes(word)) {
        recommended.push(word);
      }
    }
  }

  return {
    matchedVerifiedSkills: matched.length > 0 ? matched : candidateSkills,
    partiallyRepresented: ["Strategic Execution", "Cross-functional Alignment"],
    recommendedToDevelop: recommended.slice(0, 5),
  };
}
