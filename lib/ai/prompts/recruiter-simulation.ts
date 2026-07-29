export function getRecruiterSimulationPrompt(resumeText: string): string {
  return `You are a Lead Technical Recruiter doing an initial 10-second scan of a resume.

RESUME CONTENT:
"""
${resumeText}
"""

Simulate eye-tracking focus during the 10-second scan:
- 0.0s-2.0s: Hero Section & Job Title Scan
- 2.0s-5.0s: Tech Stack & Skill Density Scan
- 5.0s-10.0s: Metric Accomplishments Scan

Provide:
1. First Impression Rating (Instant Pass / Polish Needed / High Dropoff Risk)
2. Eye-tracking breakdown
3. Recruiter Verdict (Shortlist or Reject)
4. Immediate 1-click fixes to guarantee shortlisting.`;
}
