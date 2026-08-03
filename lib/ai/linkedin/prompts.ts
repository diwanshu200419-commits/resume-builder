import { getKeywordsForRole } from "./role-taxonomy";

export interface LinkedinPromptParams {
  targetRole: string;
  industry?: string;
  experienceLevel: string;
  currentRole?: string;
  targetLocation?: string;
  targetCompanies?: string;
  employmentType?: string;
  skills?: string[];
  achievements?: string;
  education?: string;
  certifications?: string;
  projects?: string;
  currentHeadline?: string;
  currentAbout?: string;
  resumeText?: string;
  targetJobDescription?: string;
  tone?: string;
}

export function buildLinkedinSystemInstruction(): string {
  return `You are Vaylo AI's Lead LinkedIn Branding Specialist and Senior Executive Recruiter.
Your job is to generate a role-aware, recruiter-optimized LinkedIn Profile Strategy tailored specifically to the candidate's career level and verified skills.

STRICT EXPERIENCE LEVEL STRATEGY RULES:
- STUDENT / FRESHER: Prioritize education, academic projects, internships, skills, certifications, hackathons, leadership roles, and verified project outcomes. NEVER fabricate professional employment history.
- MID-LEVEL (0-1yr, 1-3yr, 3-5yr): Prioritize technical ownership, business impact, domain specialization, system scale, cross-team collaboration, and verified results.
- SENIOR (5-8yr, 8-12yr): Prioritize system architecture, team leadership, strategic decision-making, mentorship, business outcomes, and cross-functional influence.
- EXECUTIVE (12+yr, Manager, Director, VP, C-Level/Founder): Prioritize organizational impact, revenue growth, corporate strategy, P&L management, leadership transformation, and market expansion.

STRICT ZERO-HALLUCINATION POLICY:
1. NEVER invent companies, jobs, internships, degrees, awards, or certifications the candidate did not explicitly state.
2. NEVER invent specific numerical metrics (e.g. "increased revenue by 40%", "served 100k users") unless the candidate provided that exact number in their input or resume.
3. If candidate built a project or wrote code, improve wording using strong action verbs and technical clarity WITHOUT inventing fake traffic or fake metrics.
4. Keep personal claims strictly tied to verified evidence in their resume/input.
5. Missing skills for the target role should be labeled as "Recommended to Develop", NEVER inserted into their verified profile claims.

STYLE & TONAL GUIDELINES:
- Write in clean, human, executive-ready language.
- Avoid robotic AI buzzwords like "passionate rockstar", "synergy", "cutting-edge maven", "dynamic visionary".
- Avoid excessive emojis (e.g. 🚀🔥💯). Use subtle professional formatting bullets (• | —).
- Respect LinkedIn character limits: Headline max 220 chars. About section structured logically.`;
}

export function buildLinkedinUserPrompt(params: LinkedinPromptParams): string {
  const roleKeywords = getKeywordsForRole(params.targetRole);

  return `Optimize a LinkedIn Profile for the following candidate profile:

TARGET ROLE: ${params.targetRole}
INDUSTRY: ${params.industry || "General Industry"}
EXPERIENCE LEVEL: ${params.experienceLevel}
CURRENT ROLE / TITLE: ${params.currentRole || "Not specified"}
TARGET LOCATION: ${params.targetLocation || "Global / Remote"}
TARGET COMPANIES: ${params.targetCompanies || "Top companies in field"}
EMPLOYMENT TYPE: ${params.employmentType || "Full-time"}

CANDIDATE INPUTS & RESUME EVIDENCE:
Current Headline: ${params.currentHeadline || "None provided"}
Current About Section: ${params.currentAbout || "None provided"}
Verified Skills: ${params.skills?.join(", ") || "Extracted from resume/projects"}
Achievements / Highlights: ${params.achievements || "Listed in resume"}
Education: ${params.education || "Listed in resume"}
Certifications: ${params.certifications || "None listed"}
Key Projects: ${params.projects || "Listed in resume"}

RESUME TEXT:
${params.resumeText || "No additional resume text provided."}

${params.targetJobDescription ? `TARGET JOB DESCRIPTION (Paste from recruiter posting):\n${params.targetJobDescription}` : ""}

PREFERRED TONE: ${params.tone || "Professional & Recruiter-Optimized"}

EXPECTED INDUSTRY KEYWORDS FOR ${params.targetRole.toUpperCase()}:
${roleKeywords.join(", ")}

Generate a complete structured JSON object matching the requested schema. Ensure all fields are returned precisely in valid JSON.`;
}
