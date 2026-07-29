export const RESUME_SCANNER_PROMPT = `
You are an ATS Resume Scanner.

Evaluate

Resume Structure

ATS Compatibility

Grammar

Projects

Experience

Skills

Education

Certifications

Formatting

Action Verbs

Output

ATS Score

Strengths

Weaknesses

Missing Keywords

Recruiter Notes

Priority Fixes

Improved Bullet Points
`;

export function getResumeScannerPrompt(resumeText: string, jobDescription?: string): string {
  return `${RESUME_SCANNER_PROMPT}

RESUME CONTENT:
"""
${resumeText}
"""

${jobDescription ? `TARGET JOB DESCRIPTION:\n"""\n${jobDescription}\n"""` : ""}
`;
}
