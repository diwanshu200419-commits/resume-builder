// Generic evidence-matching engine shared across ATS V2 scan scoring & STAR Voice Interview scoring

export const TECHNICAL_ALIASES: Record<string, string> = {
  "react.js": "react",
  "reactjs": "react",
  "react": "react",
  "node": "nodejs",
  "node.js": "nodejs",
  "nodejs": "nodejs",
  "postgresql": "postgresql",
  "postgres": "postgresql",
  "psql": "postgresql",
  "machine learning": "machine_learning",
  "ml": "machine_learning",
  "javascript": "javascript",
  "js": "javascript",
  "typescript": "typescript",
  "ts": "typescript",
  "aws": "aws",
  "amazon web services": "aws",
  "docker": "docker",
  "containerization": "docker",
  "kubernetes": "kubernetes",
  "k8s": "kubernetes",
  "gcp": "gcp",
  "google cloud": "gcp",
  "rest": "rest_api",
  "restful": "rest_api",
  "rest api": "rest_api",
  "graphql": "graphql",
  "python": "python",
  "java": "java",
  "c++": "cpp",
  "cpp": "cpp",
  "c#": "csharp",
  "csharp": "csharp",
  "golang": "golang",
  "go": "golang",
  "sql": "sql",
  "mongodb": "mongodb",
  "mongo": "mongodb",
  "redis": "redis",
  "ci/cd": "cicd",
  "cicd": "cicd",
  "html": "html",
  "css": "css",
  "next.js": "nextjs",
  "nextjs": "nextjs",
};

export interface MatchResult {
  matchCount: number;
  totalKeywords: number;
  matchPercentage: number; // 0 to 1
  matchedKeywords: string[];
  missingKeywords: string[];
}

export function matchEvidence(candidateText: string, targetKeywords: string[]): MatchResult {
  if (!candidateText || !targetKeywords || targetKeywords.length === 0) {
    return {
      matchCount: 0,
      totalKeywords: targetKeywords?.length || 0,
      matchPercentage: 0,
      matchedKeywords: [],
      missingKeywords: targetKeywords || [],
    };
  }

  const lowerText = candidateText.toLowerCase();
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of targetKeywords) {
    const cleanKw = kw.trim().toLowerCase();
    if (!cleanKw) continue;

    const hasExact = lowerText.includes(cleanKw);
    const aliased = TECHNICAL_ALIASES[cleanKw];
    const hasAlias = aliased ? lowerText.includes(aliased) : false;

    if (hasExact || hasAlias) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  const totalKeywords = targetKeywords.length;
  const matchCount = matchedKeywords.length;
  const matchPercentage = totalKeywords > 0 ? matchCount / totalKeywords : 0;

  return {
    matchCount,
    totalKeywords,
    matchPercentage,
    matchedKeywords,
    missingKeywords,
  };
}
