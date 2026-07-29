export const HIRING_PROBABILITY_PROMPT = `
Predict

Interview Probability

Offer Probability

Recruiter Confidence

ATS Confidence

Explain

Factors increasing probability.

Factors reducing probability.

Provide a step-by-step action plan.

Never guarantee that someone will get an interview or job. Present estimates as AI-based predictions with clear uncertainty.
`;

export function getHiringProbabilityPrompt(company: string, jobTitle: string, resumeSnippet: string, jobDescription: string): string {
  return `${HIRING_PROBABILITY_PROMPT}

TARGET COMPANY: ${company}
TARGET ROLE: ${jobTitle}

RESUME HIGHLIGHTS:
"${resumeSnippet}"

JOB DESCRIPTION:
"${jobDescription}"
`;
}
