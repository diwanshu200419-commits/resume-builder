export function getHiringProbabilityPrompt(company: string, jobTitle: string, resumeSnippet: string, jobDescription: string): string {
  return `Calculate statistical interview callback probability for a candidate applying to ${company} as ${jobTitle}.

RESUME HIGHLIGHTS:
"${resumeSnippet}"

JOB DESCRIPTION:
"${jobDescription}"

Generate:
1. Overall Probability Score (0-100%)
2. Grade Rating (A+, A, B, C, D)
3. Callback Odds Summary
4. Breakdown across ATS Match, Experience Relevance, Skill Density, and Formatting.
5. Strengths, Blockers, and 4-step Action Plan.`;
}
