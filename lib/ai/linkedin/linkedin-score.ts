// lib/ai/linkedin/linkedin-score.ts
//
// Vaylo AI — Deterministic LinkedIn Profile Scoring Engine
// 100-Point Rule-Based Explainable Algorithm (Zero LLM Guesswork)
// Reuses evidence-matching taxonomy and deterministic rubric math.

const ROLE_KEYWORD_MAP: Record<string, string[]> = {
  technology: ["Software Architecture", "TypeScript", "React", "Node.js", "Cloud Infrastructure", "APIs", "System Design", "PostgreSQL", "CI/CD", "Docker"],
  "data & ai": ["Python", "SQL", "Machine Learning", "Data Pipelines", "PyTorch", "Tableau", "Statistical Modeling", "TensorFlow", "Pandas", "Scikit-Learn"],
  "product & design": ["Product Strategy", "User Research", "Agile", "Roadmapping", "Wireframing", "Figma", "UI/UX Design", "A/B Testing", "GTM Strategy"],
  "management & consulting": ["Strategic Planning", "Stakeholder Management", "P&L Management", "Business Transformation", "Process Optimization", "Executive Leadership"],
  "banking & finance": ["Financial Modeling", "Risk Management", "Investment Analysis", "Portfolio Optimization", "Valuation", "Accounting", "Corporate Finance"],
  marketing: ["Growth Marketing", "SEO", "Content Strategy", "Performance Marketing", "Brand Positioning", "Google Analytics", "Lead Generation"],
  sales: ["B2B Sales", "Enterprise Account Management", "Lead Conversion", "Pipeline Management", "Contract Negotiation", "Revenue Growth"],
  healthcare: ["Clinical Operations", "Patient Care", "Medical Terminology", "Healthcare Compliance", "Pharmacology", "Public Health"],
};

export function getKeywordsForRole(role: string): string[] {
  const normalized = (role || "").toLowerCase().trim();
  for (const [cat, keywords] of Object.entries(ROLE_KEYWORD_MAP)) {
    if (normalized.includes(cat) || keywords.some((k) => normalized.includes(k.toLowerCase()))) {
      return keywords;
    }
  }
  return ["Software Architecture", "TypeScript", "React", "Node.js", "APIs", "System Design", "Project Management", "Strategic Execution"];
}

export interface LinkedInProfileInput {
  targetRole: string;
  industry?: string;
  experienceLevel?: string;
  currentHeadline?: string;
  currentAbout?: string;
  skills?: string[];
  achievements?: string;
  education?: string;
  certifications?: string;
  projects?: string;
  targetLocation?: string;
  targetCompanies?: string;
}

export interface LinkedInScoreBreakdown {
  total: number; // 0-100
  headline: number; // 0-20
  about: number; // 0-20
  keywords: number; // 0-20
  experience: number; // 0-15
  skills: number; // 0-10
  completeness: number; // 0-10
  discoverability: number; // 0-5
  scoreExplanation: string;
  breakdown: {
    headline: { score: number; max: 20; issues: string[]; strengths: string[] };
    about: { score: number; max: 20; issues: string[]; strengths: string[] };
    keywords: { score: number; max: 20; matched: string[]; missing: string[] };
    experience: { score: number; max: 15; issues: string[]; strengths: string[] };
    skills: { score: number; max: 10; count: number; issues: string[] };
    completeness: { score: number; max: 10; missingFields: string[] };
    discoverability: { score: number; max: 5; issues: string[] };
  };
}

const BUZZWORDS = ["passionate", "rockstar", "ninja", "guru", "visionary", "hardworking", "go-getter", "dynamic"];
const ACTION_VERBS = ["built", "led", "architected", "optimized", "developed", "scaled", "designed", "engineered", "delivered", "implemented", "reduced", "increased", "launched"];
const METRIC_PATTERNS = [/\d+%/i, /\$\d+/i, /₹\d+/i, /\d+x/i, /\d+\s*(ms|s|sec|min|hours|days|weeks|months)/i, /\d+\s*(k|m|million|billion|users|customers|clients|requests|qps)/i];

/**
 * Deterministically scores a LinkedIn profile input out of 100 points
 */
export function scoreLinkedInProfile(input: LinkedInProfileInput): LinkedInScoreBreakdown {
  const targetRole = input.targetRole.trim().toLowerCase();
  const headline = (input.currentHeadline || "").trim();
  const about = (input.currentAbout || "").trim();
  const userSkills = (input.skills || []).map((s) => s.trim().toLowerCase()).filter(Boolean);
  const achievements = (input.achievements || "").trim();
  const projects = (input.projects || "").trim();
  const education = (input.education || "").trim();

  // -------------------------------------------------------------
  // 1. HEADLINE SCORING (Max 20 pts)
  // -------------------------------------------------------------
  let headlineScore = 0;
  const headlineIssues: string[] = [];
  const headlineStrengths: string[] = [];

  if (headline.length === 0) {
    headlineIssues.push("Headline is completely empty.");
  } else {
    // Length checks (LinkedIn limit is 220 chars; optimal is 60-180 chars)
    if (headline.length >= 30 && headline.length <= 220) {
      headlineScore += 5;
      headlineStrengths.push("Good length within LinkedIn 220-character limit.");
    } else if (headline.length < 30) {
      headlineScore += 2;
      headlineIssues.push("Headline is too short (< 30 chars) to establish domain authority.");
    } else {
      headlineScore += 2;
      headlineIssues.push("Headline exceeds LinkedIn 220-character limit.");
    }

    // Role keyword presence
    const roleTokens = targetRole.split(/\s+/).filter((t) => t.length > 2);
    const hasRoleInHeadline = roleTokens.some((token) => headline.toLowerCase().includes(token));
    if (hasRoleInHeadline) {
      headlineScore += 6;
      headlineStrengths.push("Directly targets core job title keywords.");
    } else {
      headlineIssues.push(`Missing explicit target title terms ('${input.targetRole}').`);
    }

    // Value / Metric / Domain terms
    const hasMetricInHeadline = METRIC_PATTERNS.some((p) => p.test(headline)) || headline.includes("|") || headline.includes("•");
    if (hasMetricInHeadline) {
      headlineScore += 5;
      headlineStrengths.push("Uses professional separator structure or quantified impact.");
    } else {
      headlineIssues.push("Lacks structured separator formatting or specialization areas.");
    }

    // Buzzword deduction
    const foundBuzzwords = BUZZWORDS.filter((b) => headline.toLowerCase().includes(b));
    if (foundBuzzwords.length === 0) {
      headlineScore += 4;
      headlineStrengths.push("Avoids generic buzzwords (ninja, guru, rockstar).");
    } else {
      headlineIssues.push(`Contains generic buzzwords: ${foundBuzzwords.join(", ")}.`);
    }
  }
  headlineScore = Math.min(20, Math.max(0, headlineScore));

  // -------------------------------------------------------------
  // 2. ABOUT SECTION SCORING (Max 20 pts)
  // -------------------------------------------------------------
  let aboutScore = 0;
  const aboutIssues: string[] = [];
  const aboutStrengths: string[] = [];

  if (about.length === 0) {
    aboutIssues.push("About summary is missing.");
  } else {
    // Length depth
    if (about.length >= 350) {
      aboutScore += 6;
      headlineStrengths.push("Comprehensive summary depth (> 350 characters).");
    } else if (about.length >= 150) {
      aboutScore += 3;
      aboutIssues.push("About summary is brief; expand to showcase career narrative.");
    } else {
      aboutScore += 1;
      aboutIssues.push("About section is under 150 characters.");
    }

    // Structuring / Paragraphing
    if (about.includes("\n") || about.includes("•") || about.includes("-")) {
      aboutScore += 5;
      aboutStrengths.push("Well-structured with clean paragraphing or bullet points.");
    } else {
      aboutIssues.push("Dense wall of text; use bullet points or line breaks.");
    }

    // Technical / Domain keywords in About
    const expectedKeywords = getKeywordsForRole(input.targetRole);
    const matchedInAbout = expectedKeywords.filter((kw) => about.toLowerCase().includes(kw.toLowerCase()));
    if (matchedInAbout.length >= 3) {
      aboutScore += 5;
      aboutStrengths.push(`Rich domain keyword coverage (${matchedInAbout.length} industry terms).`);
    } else if (matchedInAbout.length >= 1) {
      aboutScore += 3;
      aboutIssues.push("Include more target tech stack and domain keywords.");
    } else {
      aboutIssues.push("Lacks expected industry keywords in About section.");
    }

    // Call to action / Contact hook
    const hasCta = /reach out|contact|email|let's connect|open to|collaborate|github/i.test(about);
    if (hasCta) {
      aboutScore += 4;
      aboutStrengths.push("Includes clear networking / contact call to action.");
    } else {
      aboutIssues.push("Missing clear call-to-action or contact invitation at bottom.");
    }
  }
  aboutScore = Math.min(20, Math.max(0, aboutScore));

  // -------------------------------------------------------------
  // 3. KEYWORD MATCHING SCORING (Max 20 pts)
  // -------------------------------------------------------------
  const roleKeywords = getKeywordsForRole(input.targetRole);
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  const combinedText = `${headline} ${about} ${userSkills.join(" ")} ${achievements} ${projects}`.toLowerCase();

  for (const kw of roleKeywords) {
    if (combinedText.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  const matchRatio = roleKeywords.length > 0 ? matchedKeywords.length / roleKeywords.length : 0.5;
  let keywordScore = Math.round(matchRatio * 20);
  keywordScore = Math.min(20, Math.max(0, keywordScore));

  // -------------------------------------------------------------
  // 4. EXPERIENCE & ACHIEVEMENTS SCORING (Max 15 pts)
  // -------------------------------------------------------------
  let experienceScore = 0;
  const experienceIssues: string[] = [];
  const experienceStrengths: string[] = [];

  const expText = `${achievements} ${projects}`;
  if (expText.trim().length === 0) {
    experienceIssues.push("No achievements or project bullets provided.");
  } else {
    // Action verbs
    const hasActionVerbs = ACTION_VERBS.some((v) => expText.toLowerCase().includes(v));
    if (hasActionVerbs) {
      experienceScore += 5;
      experienceStrengths.push("Uses strong active leadership verbs.");
    } else {
      experienceIssues.push("Lacks active impact verbs (built, optimized, architected).");
    }

    // Numerical metrics
    const hasMetrics = METRIC_PATTERNS.some((p) => p.test(expText));
    if (hasMetrics) {
      experienceScore += 5;
      experienceStrengths.push("Quantified accomplishments with concrete metrics.");
    } else {
      experienceIssues.push("No quantifiable numbers or percentages found in achievements.");
    }

    // Projects / Scope
    if (projects.length > 20) {
      experienceScore += 5;
      experienceStrengths.push("Concrete project references documented.");
    } else {
      experienceIssues.push("Highlight specific high-impact projects or case studies.");
    }
  }
  experienceScore = Math.min(15, Math.max(0, experienceScore));

  // -------------------------------------------------------------
  // 5. SKILLS STRATEGY SCORING (Max 10 pts)
  // -------------------------------------------------------------
  let skillsScore = 0;
  const skillsIssues: string[] = [];

  if (userSkills.length >= 8) {
    skillsScore = 10;
  } else if (userSkills.length >= 5) {
    skillsScore = 7;
    skillsIssues.push("Add at least 8 verified skills to maximize recruiter search matches.");
  } else if (userSkills.length >= 1) {
    skillsScore = 4;
    skillsIssues.push("Fewer than 5 skills listed; LinkedIn allows up to 50.");
  } else {
    skillsScore = 0;
    skillsIssues.push("No skills listed.");
  }

  // -------------------------------------------------------------
  // 6. PROFILE COMPLETENESS (Max 10 pts)
  // -------------------------------------------------------------
  let completenessScore = 0;
  const missingFields: string[] = [];

  if (headline.length > 0) completenessScore += 2;
  else missingFields.push("Headline");

  if (about.length > 0) completenessScore += 2;
  else missingFields.push("About Section");

  if (education.length > 0) completenessScore += 2;
  else missingFields.push("Education");

  if (projects.length > 0 || achievements.length > 0) completenessScore += 2;
  else missingFields.push("Projects / Work Evidence");

  if (input.targetLocation && input.targetLocation.trim().length > 0) completenessScore += 2;
  else missingFields.push("Location");

  completenessScore = Math.min(10, Math.max(0, completenessScore));

  // -------------------------------------------------------------
  // 7. DISCOVERABILITY (Max 5 pts)
  // -------------------------------------------------------------
  let discoverabilityScore = 0;
  const discoverabilityIssues: string[] = [];

  if (targetRole.length > 0 && headline.toLowerCase().includes(targetRole.split(" ")[0])) {
    discoverabilityScore += 3;
  } else {
    discoverabilityIssues.push("Primary job title is not in the first 40 characters of headline.");
  }

  if (input.targetLocation && (input.targetLocation.includes("Remote") || input.targetLocation.includes(","))) {
    discoverabilityScore += 2;
  } else {
    discoverabilityIssues.push("Specify a standard metro region or Remote preference.");
  }
  discoverabilityScore = Math.min(5, Math.max(0, discoverabilityScore));

  // -------------------------------------------------------------
  // TOTAL MATHEMATICAL SUM
  // -------------------------------------------------------------
  const total = headlineScore + aboutScore + keywordScore + experienceScore + skillsScore + completenessScore + discoverabilityScore;

  let explanation = "";
  if (total >= 85) {
    explanation = "Top Tier: Your profile exhibits strong recruiter search indexing, active metrics, and clear domain specialization.";
  } else if (total >= 70) {
    explanation = "Competitive: Solid foundation, but adding quantifiable metrics and pinning high-demand skills will boost inbound recruiter messages.";
  } else if (total >= 50) {
    explanation = "Needs Optimization: Missing key role-specific search terms and structured impact bullets. Follow the action plan below.";
  } else {
    explanation = "Incomplete: Critical sections (headline, about, metrics) require immediate optimization to appear in recruiter searches.";
  }

  return {
    total,
    headline: headlineScore,
    about: aboutScore,
    keywords: keywordScore,
    experience: experienceScore,
    skills: skillsScore,
    completeness: completenessScore,
    discoverability: discoverabilityScore,
    scoreExplanation: explanation,
    breakdown: {
      headline: { score: headlineScore, max: 20, issues: headlineIssues, strengths: headlineStrengths },
      about: { score: aboutScore, max: 20, issues: aboutIssues, strengths: aboutStrengths },
      keywords: { score: keywordScore, max: 20, matched: matchedKeywords, missing: missingKeywords },
      experience: { score: experienceScore, max: 15, issues: experienceIssues, strengths: experienceStrengths },
      skills: { score: skillsScore, max: 10, count: userSkills.length, issues: skillsIssues },
      completeness: { score: completenessScore, max: 10, missingFields },
      discoverability: { score: discoverabilityScore, max: 5, issues: discoverabilityIssues },
    },
  };
}
