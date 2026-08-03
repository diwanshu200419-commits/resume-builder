export interface ProfileScoreBreakdown {
  total: number;
  headline: number;
  about: number;
  keywords: number;
  experience: number;
  skills: number;
  completeness: number;
  discoverability: number;
  scoreExplanation: string;
}

export function computeDeterministicProfileScore(params: {
  headline?: string;
  about?: string;
  skills?: string[];
  experienceLevel?: string;
  hasProjects?: boolean;
}): ProfileScoreBreakdown {
  let headlineScore = 0;
  if (params.headline) {
    if (params.headline.length > 20) headlineScore += 10;
    if (params.headline.length > 50 && params.headline.length <= 220) headlineScore += 10;
  } else {
    headlineScore = 5;
  }

  let aboutScore = 0;
  if (params.about) {
    if (params.about.length > 100) aboutScore += 10;
    if (params.about.length > 300) aboutScore += 10;
  } else {
    aboutScore = 6;
  }

  const skillCount = params.skills?.length || 0;
  const keywordsScore = Math.min(20, skillCount * 4);
  const skillsScore = Math.min(10, skillCount * 2);

  const experienceScore = params.experienceLevel?.includes("Executive") || params.experienceLevel?.includes("Senior") ? 14 : 11;
  const completenessScore = params.hasProjects ? 9 : 7;
  const discoverabilityScore = headlineScore >= 15 && keywordsScore >= 12 ? 5 : 3;

  const total = Math.min(
    100,
    headlineScore + aboutScore + keywordsScore + experienceScore + skillsScore + completenessScore + discoverabilityScore
  );

  return {
    total,
    headline: headlineScore,
    about: aboutScore,
    keywords: keywordsScore,
    experience: experienceScore,
    skills: skillsScore,
    completeness: completenessScore,
    discoverability: discoverabilityScore,
    scoreExplanation: `Your profile score is ${total}/100 based on headline strength (${headlineScore}/20), summary depth (${aboutScore}/20), and keyword density (${keywordsScore}/20).`,
  };
}
