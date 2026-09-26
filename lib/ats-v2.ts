import type { ATSAnalysisResult, ATSV2ScoreBreakdown, ATSV2RequirementMatch, ATSV2PriorityFix } from "@/types";

export const TECHNICAL_ALIASES: Record<string, string> = {
  // JavaScript ecosystem
  "react.js": "react", "reactjs": "react", "react": "react",
  "node": "nodejs", "node.js": "nodejs", "nodejs": "nodejs",
  "next.js": "nextjs", "nextjs": "nextjs",
  "vue.js": "vue", "vuejs": "vue", "vue": "vue",
  "angular": "angular", "angularjs": "angular",
  "express.js": "express", "expressjs": "express", "express": "express",
  "javascript": "javascript", "js": "javascript",
  "typescript": "typescript", "ts": "typescript",
  "webpack": "webpack", "vite": "vite", "babel": "babel",
  "tailwind": "tailwind", "tailwindcss": "tailwind",

  // Python ecosystem
  "python": "python", "django": "django", "flask": "flask",
  "fastapi": "fastapi", "pytorch": "pytorch", "tensorflow": "tensorflow",
  "scikit-learn": "scikit_learn", "sklearn": "scikit_learn", "pandas": "pandas",
  "numpy": "numpy", "langchain": "langchain",

  // Databases
  "postgresql": "postgresql", "postgres": "postgresql", "psql": "postgresql",
  "mongodb": "mongodb", "mongo": "mongodb",
  "mysql": "mysql", "sqlite": "sqlite", "redis": "redis",
  "elasticsearch": "elasticsearch", "cassandra": "cassandra",
  "dynamodb": "dynamodb", "firestore": "firestore",

  // Cloud & DevOps
  "aws": "aws", "amazon web services": "aws",
  "gcp": "gcp", "google cloud": "gcp",
  "azure": "azure",
  "docker": "docker", "containerization": "docker",
  "kubernetes": "kubernetes", "k8s": "kubernetes",
  "terraform": "terraform", "ansible": "ansible",
  "ci/cd": "cicd", "cicd": "cicd", "github actions": "github_actions",
  "jenkins": "jenkins", "vercel": "vercel", "netlify": "netlify",

  // APIs & Architecture
  "rest": "rest_api", "restful": "rest_api", "rest api": "rest_api",
  "graphql": "graphql", "grpc": "grpc",
  "microservices": "microservices", "serverless": "serverless",
  "websockets": "websockets", "websocket": "websockets",

  // Other languages
  "java": "java", "golang": "golang", "go": "golang",
  "c++": "cpp", "cpp": "cpp", "c#": "csharp", "csharp": "csharp",
  "rust": "rust", "kotlin": "kotlin", "swift": "swift", "scala": "scala",
  "ruby": "ruby", "php": "php",

  // Markup / styling
  "html": "html", "css": "css", "sass": "sass", "scss": "sass",

  // Data / ML
  "machine learning": "machine_learning", "ml": "machine_learning",
  "deep learning": "deep_learning", "nlp": "nlp",
  "sql": "sql", "nosql": "nosql",

  // Auth & security
  "oauth": "oauth", "jwt": "jwt", "oauth2": "oauth",
  "authentication": "authentication", "authorization": "authorization",

  // Testing
  "jest": "jest", "cypress": "cypress", "playwright": "playwright",
  "selenium": "selenium", "pytest": "pytest",

  // Tooling / misc
  "git": "git", "github": "git", "gitlab": "git",
  "linux": "linux", "unix": "unix", "bash": "bash",
  "agile": "agile", "scrum": "scrum", "jira": "jira",
  "figma": "figma",
};

// Generic job-description words that look like skills but are not
export const JUNK_TERMS = new Set([
  "senior", "junior", "engineer", "developer", "full", "stack", "backend", "frontend",
  "software", "web", "applications", "application", "scalable", "performance",
  "high-performance", "infrastructure", "cloud", "services", "service", "platform",
  "systems", "system", "solutions", "solution", "tools", "tool", "technologies",
  "technology", "tech", "data", "code", "coding", "programming", "digital",
  "products", "product", "projects", "project", "features", "feature",
  "environment", "environments", "practices", "best", "practices",
  "role", "position", "team", "teams", "company", "organization",
  "hands-on", "fast-paced", "startup", "communication", "skills",
  "ability", "knowledge", "understanding", "excellent", "strong",
  "proficient", "proficiency", "experience", "relevant", "related",
  "modern", "latest", "current", "various", "multiple", "general",
  "architecture", "patterns", "design", "patterns", "principles",
  "frameworks", "framework", "library", "libraries", "tools",
]);


export interface MatchResult {
  matchCount: number;
  totalKeywords: number;
  matchPercentage: number;
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

export type IndustryProfileKey = "tech" | "finance" | "marketing" | "healthcare" | "executive" | "general";

export const INDUSTRY_PROFILES: Record<
  IndustryProfileKey,
  {
    name: string;
    weights: {
      skills: number;
      experience: number;
      semantic: number;
      projects: number;
      education: number;
      structure: number;
      impact: number;
    };
    keywords: string[];
  }
> = {
  tech: {
    name: "Tech & Software Engineering",
    weights: { skills: 35, experience: 15, semantic: 15, projects: 15, education: 5, structure: 10, impact: 5 },
    keywords: ["react", "node", "python", "java", "aws", "docker", "developer", "software", "api", "database", "git", "code"],
  },
  finance: {
    name: "Finance, Banking & Accounting",
    weights: { skills: 20, experience: 25, semantic: 10, projects: 5, education: 5, structure: 10, impact: 25 },
    keywords: ["finance", "banking", "financial", "accounting", "audit", "portfolio", "investment", "equity", "p&l", "revenue", "roi", "cpa", "cfa"],
  },
  marketing: {
    name: "Marketing, Growth & Creative",
    weights: { skills: 20, experience: 15, semantic: 25, projects: 5, education: 5, structure: 10, impact: 20 },
    keywords: ["marketing", "seo", "sem", "growth", "campaign", "social media", "content", "brand", "conversion", "cac", "funnel", "copywriting"],
  },
  healthcare: {
    name: "Healthcare, Clinical & Nursing",
    weights: { skills: 25, experience: 25, semantic: 10, projects: 5, education: 20, structure: 10, impact: 5 },
    keywords: ["patient", "clinical", "nursing", "hospital", "medical", "healthcare", "hipaa", "treatment", "care", "doctor", "rn", "license"],
  },
  executive: {
    name: "Executive & Senior Leadership",
    weights: { skills: 15, experience: 25, semantic: 20, projects: 5, education: 5, structure: 10, impact: 20 },
    keywords: ["director", "vp", "chief", "head of", "strategy", "roadmap", "leadership", "budget", "p&l", "governance", "cross-functional"],
  },
  general: {
    name: "General / Standard Model",
    weights: { skills: 30, experience: 20, semantic: 15, projects: 10, education: 5, structure: 10, impact: 10 },
    keywords: [],
  },
};

export const ATS_SCORING_WEIGHTS = INDUSTRY_PROFILES.general.weights;

export function detectIndustryProfile(text: string): IndustryProfileKey {
  const lower = text.toLowerCase();
  let bestMatch: IndustryProfileKey = "general";
  let maxCount = 0;

  for (const [key, config] of Object.entries(INDUSTRY_PROFILES)) {
    if (key === "general") continue;
    let count = 0;
    for (const kw of config.keywords) {
      if (lower.includes(kw)) count++;
    }
    if (count > maxCount) {
      maxCount = count;
      bestMatch = key as IndustryProfileKey;
    }
  }

  return maxCount >= 2 ? bestMatch : "general";
}

// Enforce exact 100 weight validation across all industry profiles
for (const [profKey, profConfig] of Object.entries(INDUSTRY_PROFILES)) {
  const sum = Object.values(profConfig.weights).reduce((a, b) => a + b, 0);
  if (sum !== 100) {
    throw new Error(`INDUSTRY_PROFILES weights for '${profKey}' must sum to 100, got ${sum}`);
  }
}

export function normalizeSkill(term: string): string {
  const clean = term.toLowerCase().trim().replace(/[^a-z0-9.+#\s-]/g, "");
  return TECHNICAL_ALIASES[clean] || clean;
}

export function detectCandidateContext(resumeText: string): "Fresher/Student" | "Early Career" | "Experienced" | "Senior/Lead" {
  const lower = resumeText.toLowerCase();
  const isSenior = /\b(senior|staff|principal|lead|head|architect|manager|director)\b/i.test(lower);
  if (isSenior) return "Senior/Lead";

  const isFresher = /\b(student|fresher|undergraduate|b\.tech|btech|intern|internship|entry-level|graduate 2024|graduate 2025|graduate 2026)\b/i.test(lower);
  if (isFresher) return "Fresher/Student";

  const dates = lower.match(/\b(20\d\d|19\d\d)\b/g) || [];
  if (dates.length >= 4) return "Experienced";
  return "Early Career";
}

export function evaluateATSV2(
  resumeText: string,
  jobDescription?: string,
  aiSemanticBoost: number = 0,
  inputIndustryProfile?: IndustryProfileKey
): ATSAnalysisResult {
  const hasJD = !!jobDescription && jobDescription.trim().length > 20;
  const candidateContext = detectCandidateContext(resumeText);
  const industryKey: IndustryProfileKey = inputIndustryProfile || detectIndustryProfile(resumeText + " " + (jobDescription || ""));
  const profileConfig = INDUSTRY_PROFILES[industryKey] || INDUSTRY_PROFILES.general;
  const weights = profileConfig.weights;

  const resumeLower = resumeText.toLowerCase();
  const jdLower = (jobDescription || "").toLowerCase();

  // ----------------------------------------------------
  // Section Parsing & Source Evidence Extraction
  // ----------------------------------------------------
  const resumeLines = resumeText.split("\n").map((l) => l.trim()).filter(Boolean);
  let currentSection: "Experience" | "Projects" | "Skills" | "Education" | "Summary" = "Summary";
  
  const sectionLines: Record<string, string[]> = {
    Experience: [],
    Projects: [],
    Skills: [],
    Education: [],
    Summary: [],
  };

  for (const line of resumeLines) {
    const lLower = line.toLowerCase();
    if (/^\s*(experience|work experience|employment|history|professional experience)\b/i.test(lLower)) {
      currentSection = "Experience";
      continue;
    }
    if (/^\s*(projects|personal projects|key projects|academic projects)\b/i.test(lLower)) {
      currentSection = "Projects";
      continue;
    }
    if (/^\s*(skills|technical skills|technologies|core competencies)\b/i.test(lLower)) {
      currentSection = "Skills";
      continue;
    }
    if (/^\s*(education|academic background|certifications|degrees)\b/i.test(lLower)) {
      currentSection = "Education";
      continue;
    }
    sectionLines[currentSection].push(line);
  }

  // ----------------------------------------------------
  // 1. SKILLS MATCH (BASE MAX 30 -> SCALED TO weights.skills)
  // ----------------------------------------------------
  const detailedRequirements: ATSV2RequirementMatch[] = [];
  const matchedMustHaves: string[] = [];
  const missingMustHaves: string[] = [];
  const matchedPreferred: string[] = [];
  const missingPreferred: string[] = [];

  let skillsScoreRaw = 0;

  if (hasJD) {
    // ── Strict keyword extraction ──────────────────────────────────────────
    // Step 1: Split JD into individual sentences/phrases to prevent sentence
    //         fragments being treated as single multi-word "skills".
    const jdPhrases = jdLower.split(/[.\n,;!?()[\]{}]+/).map(s => s.trim()).filter(Boolean);

    const stopwords = new Set([
      "the", "a", "an", "and", "or", "for", "with", "in", "on", "at", "to", "of",
      "required", "preferred", "experience", "work", "ability", "strong", "good",
      "team", "role", "candidate", "responsibilities", "requirements", "knowledge",
      "years", "plus", "must", "have", "building", "working", "using", "support",
      "looking", "will", "our", "your", "you", "we", "are", "is", "be", "that",
      "this", "also", "well", "key", "high", "new", "large", "across", "within",
      "help", "ensure", "design", "develop", "build", "create", "lead", "manage",
      "implement", "include", "provide", "maintain", "deliver", "collaborate",
      "communicate", "understand", "join", "apply", "demonstrate", "drive",
    ]);

    const termCounts = new Map<string, number>();

    for (const phrase of jdPhrases) {
      // Extract 1-word and 2-word tokens only (max 3 words for compound tech terms)
      const words = phrase.split(/\s+/).map(w => w.replace(/[^a-z0-9.+#-]/g, "")).filter(w => w.length > 1);

      // Single-word tokens
      for (const w of words) {
        const norm = normalizeSkill(w);
        if (norm.length > 1 && !stopwords.has(norm) && !JUNK_TERMS.has(norm) && !JUNK_TERMS.has(w)) {
          termCounts.set(norm, (termCounts.get(norm) || 0) + 1);
        }
      }

      // Two-word compound terms (e.g. "next.js", "machine learning", "rest api")
      for (let i = 0; i < words.length - 1; i++) {
        const twoWord = `${words[i]} ${words[i + 1]}`;
        const norm = normalizeSkill(twoWord);
        // Only keep if both words are non-stopwords and the combined token is in aliases or looks technical
        const w1 = words[i].replace(/[^a-z0-9]/g, "");
        const w2 = words[i + 1].replace(/[^a-z0-9]/g, "");
        if (
          norm.length > 3 &&
          !stopwords.has(w1) &&
          !stopwords.has(w2) &&
          !JUNK_TERMS.has(w1) &&
          !JUNK_TERMS.has(w2) &&
          (TECHNICAL_ALIASES[twoWord] || /[0-9.+#]/.test(twoWord) || TECHNICAL_ALIASES[w1] || TECHNICAL_ALIASES[w2])
        ) {
          termCounts.set(norm, (termCounts.get(norm) || 0) + 1);
        }
      }
    }

    // Filter: only keep tokens ≤ 30 chars, not junk, not stopwords
    const extractedSkills = Array.from(termCounts.entries())
      .filter(([key]) => key.length <= 30 && !JUNK_TERMS.has(key))
      .sort((a, b) => b[1] - a[1])
      .map(([key]) => key)
      .slice(0, 20);

    let mustHavePoints = 0;
    let mustHaveMax = 0;
    let prefPoints = 0;
    let prefMax = 0;

    extractedSkills.forEach((skill, idx) => {
      const isMustHave = idx < 10;
      const termWeight = isMustHave ? 2.0 : 1.0;

      if (isMustHave) mustHaveMax += termWeight;
      else prefMax += termWeight;

      const hasExact = resumeLower.includes(skill);
      const aliased = TECHNICAL_ALIASES[skill];
      const hasAlias = aliased ? resumeLower.includes(aliased) : false;

      const sectionMatch = sectionLines.Skills.some((l) => l.toLowerCase().includes(skill))
        || sectionLines.Experience.some((l) => l.toLowerCase().includes(skill))
        || sectionLines.Projects.some((l) => l.toLowerCase().includes(skill));

      let matchType: "EXACT" | "SYNONYM" | "MISSING" = "MISSING";

      if (hasExact) {
        matchType = "EXACT";
        if (isMustHave) {
          mustHavePoints += termWeight;
          matchedMustHaves.push(skill);
        } else {
          prefPoints += termWeight;
          matchedPreferred.push(skill);
        }
      } else if (hasAlias) {
        matchType = "SYNONYM";
        const partialWeight = termWeight * 0.8;
        if (isMustHave) {
          mustHavePoints += partialWeight;
          matchedMustHaves.push(`${skill} (via ${aliased})`);
        } else {
          prefPoints += partialWeight;
          matchedPreferred.push(`${skill} (via ${aliased})`);
        }
      } else {
        if (isMustHave) missingMustHaves.push(skill);
        else missingPreferred.push(skill);
      }

      detailedRequirements.push({
        name: skill,
        category: isMustHave ? "must_have" : "preferred",
        matched: matchType !== "MISSING",
        evidenceSource: sectionMatch ? "Skills" : undefined,
      });
    });

    const mustRatio = mustHaveMax > 0 ? mustHavePoints / mustHaveMax : 1.0;
    const prefRatio = prefMax > 0 ? prefPoints / prefMax : 1.0;
    skillsScoreRaw = Math.round(mustRatio * 22 + prefRatio * 8);
  } else {
    const techCount = Object.keys(TECHNICAL_ALIASES).filter((k) => resumeLower.includes(k)).length;
    skillsScoreRaw = Math.min(30, Math.max(12, techCount * 3));
  }

  // ----------------------------------------------------
  // 2. EXPERIENCE RELEVANCE (BASE MAX 20)
  // ----------------------------------------------------
  let experienceScoreRaw = 0;
  const isSeniorJd = /\b(senior|staff|principal|lead|architect|manager)\b/i.test(jdLower);
  const hasSenioritySignals = /\b(architected|spearheaded|led|mentored|system design|roadmap|cross-functional)\b/i.test(resumeLower);

  if (candidateContext === "Fresher/Student") {
    const projectBulletCount = sectionLines.Projects.length;
    const internshipCount = (resumeLower.match(/\bintern(ship)?\b/g) || []).length;
    experienceScoreRaw = Math.min(20, Math.round(10 + projectBulletCount * 1.5 + internshipCount * 3));
  } else {
    const expBulletCount = sectionLines.Experience.length;
    const baseExpScore = Math.min(16, Math.max(6, expBulletCount * 2));
    const seniorityBonus = isSeniorJd ? (hasSenioritySignals ? 4 : 0) : 4;
    experienceScoreRaw = Math.min(20, baseExpScore + seniorityBonus);
  }

  // ----------------------------------------------------
  // 3. SEMANTIC / RESPONSIBILITY MATCH (BASE MAX 15)
  // ----------------------------------------------------
  let semanticScoreRaw = 0;
  if (hasJD) {
    const jdVerbs = jdLower.match(/\b(build|develop|architect|design|manage|optimize|scale|deploy|lead|collaborate|test|integrate|deliver)\b/g) || [];
    const verbSet = Array.from(new Set(jdVerbs));
    let semVerbMatches = 0;
    for (const v of verbSet) {
      if (resumeLower.includes(v)) semVerbMatches++;
    }
    const ratio = semVerbMatches / Math.max(1, verbSet.length);
    semanticScoreRaw = Math.min(15, Math.max(4, Math.round(ratio * 12 + (aiSemanticBoost > 0 ? 3 : 2))));
  } else {
    semanticScoreRaw = sectionLines.Summary.length > 0 ? 13 : 8;
  }

  // ----------------------------------------------------
  // 4. PROJECT & DOMAIN RELEVANCE (BASE MAX 10)
  // ----------------------------------------------------
  const projectCount = sectionLines.Projects.length;
  const projectScoreRaw = candidateContext === "Fresher/Student"
    ? Math.min(10, Math.max(5, projectCount * 2.5))
    : Math.min(10, Math.max(4, projectCount * 2));

  // ----------------------------------------------------
  // 5. EDUCATION & CERTIFICATIONS (BASE MAX 5)
  // ----------------------------------------------------
  const hasDegree = /\b(b\.tech|btech|b\.s\.|bs|b\.e\.|be|master|m\.s\.|ms|phd|bachelor|degree)\b/i.test(resumeLower);
  const hasCert = /\b(certified|aws certified|certificated|coursera|udemy|license|cpa|cfa|rn)\b/i.test(resumeLower);
  const educationScoreRaw = hasDegree ? 5 : hasCert ? 4 : 3;

  // ----------------------------------------------------
  // 6. ATS STRUCTURE & PARSABILITY (BASE MAX 10)
  // ----------------------------------------------------
  const structuralFlags: string[] = [];
  if (!/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(resumeText)) {
    structuralFlags.push("Missing email contact information.");
  }
  if (!/\b(20\d\d|19\d\d)\b/.test(resumeText)) {
    structuralFlags.push("Missing dates in experience or education.");
  }
  if (sectionLines.Skills.length === 0 && !resumeLower.includes("skills")) {
    structuralFlags.push("Missing dedicated Skills / Core Competencies section.");
  }
  const structureScoreRaw = Math.max(3, 10 - structuralFlags.length * 2.5);

  // ----------------------------------------------------
  // 7. IMPACT & METRIC QUALITY (BASE MAX 10)
  // ----------------------------------------------------
  const metricRegex = /\b(\d+%\b|\$\d+|\d+\+|\d+x\b|\d+\s*(users|qps|ms|requests|k|m|gb|tb|hrs|days|months))\b/gi;
  const metricMatches = resumeText.match(metricRegex) || [];
  const actionVerbRegex = /\b(spearheaded|architected|engineered|reduced|increased|scaled|optimized|built|delivered|led|automated)\b/gi;
  const verbMatches = resumeText.match(actionVerbRegex) || [];

  const impactScoreRaw = Math.min(10, Math.round(Math.min(5, metricMatches.length * 1.2) + Math.min(5, verbMatches.length * 1.0)));

  // ----------------------------------------------------
  // Dynamic Industry Weight Scaling Mathematics
  // ----------------------------------------------------
  const skillsScore = Math.round((skillsScoreRaw / 30) * weights.skills);
  const experienceScore = Math.round((experienceScoreRaw / 20) * weights.experience);
  const semanticScore = Math.round((semanticScoreRaw / 15) * weights.semantic);
  const projectScore = Math.round((projectScoreRaw / 10) * weights.projects);
  const educationScore = Math.round((educationScoreRaw / 5) * weights.education);
  const structureScore = Math.round((structureScoreRaw / 10) * weights.structure);
  const impactScore = Math.round((impactScoreRaw / 10) * weights.impact);

  const finalScore = Math.min(100, Math.max(0,
    skillsScore +
    experienceScore +
    semanticScore +
    projectScore +
    educationScore +
    structureScore +
    impactScore
  ));

  // Dynamic Score breakdown object matching Industry Profile
  const scoreBreakdown: ATSV2ScoreBreakdown = {
    skills: { score: skillsScore, max: weights.skills, label: "Skills Match" },
    experience: { score: experienceScore, max: weights.experience, label: "Experience Relevance" },
    semantic: { score: semanticScore, max: weights.semantic, label: "Semantic / Responsibilities" },
    projects: { score: projectScore, max: weights.projects, label: "Project & Domain Relevance" },
    education: { score: educationScore, max: weights.education, label: "Education & Certifications" },
    structure: { score: structureScore, max: weights.structure, label: "ATS Structure & Parsability" },
    impact: { score: impactScore, max: weights.impact, label: "Impact & Metric Quality" },
  };

  // Top 3 Priority Fixes
  const priorityFixes: ATSV2PriorityFix[] = [];
  let rank = 1;

  if (missingMustHaves.length > 0) {
    priorityFixes.push({
      rank: rank++,
      title: `Demonstrate evidence for missing required skills: ${missingMustHaves.slice(0, 3).join(", ")}`,
      recommendation: `If you have experience with ${missingMustHaves[0]}, add specific bullet points in your Experience or Projects section showing where you applied it. Do not add skills you have not used.`,
      estimatedImpact: "HIGH",
      category: "skills",
    });
  }

  if (metricMatches.length < 3) {
    priorityFixes.push({
      rank: rank++,
      title: "Add measurable outcome metrics to experience bullets",
      recommendation: "Quantify your achievements using metrics like percentages, latency improvements, user scale, or time saved (e.g. 'Reduced load times by 35%').",
      estimatedImpact: "HIGH",
      category: "impact",
    });
  }

  if (structuralFlags.length > 0) {
    priorityFixes.push({
      rank: rank++,
      title: "Fix ATS parsability and formatting issues",
      recommendation: structuralFlags[0],
      estimatedImpact: "MEDIUM",
      category: "structure",
    });
  }

  if (priorityFixes.length < 3 && missingPreferred.length > 0) {
    priorityFixes.push({
      rank: rank++,
      title: `Highlight preferred qualifications: ${missingPreferred.slice(0, 2).join(", ")}`,
      recommendation: `If you possess experience in ${missingPreferred[0]}, feature it clearly in your skills matrix or project descriptions.`,
      estimatedImpact: "MEDIUM",
      category: "skills",
    });
  }

  // Confidence calculation
  const textLength = resumeText.trim().length;
  let confidence: "HIGH" | "MEDIUM" | "LOW" = "HIGH";
  let confidenceReason = "Sufficient resume text and structured requirements extracted.";

  if (textLength < 200) {
    confidence = "LOW";
    confidenceReason = "Resume text is too brief to extract complete evidence.";
  } else if (!hasJD) {
    confidence = "MEDIUM";
    confidenceReason = "No job description provided; evaluated overall resume quality.";
  }

  return {
    ats_score: finalScore,
    keyword_match_score: Math.round((skillsScoreRaw / 30) * 100),
    skills_match_score: Math.round((skillsScoreRaw / 30) * 100),
    readability_score: Math.round((structureScore / 10) * 100),
    format_score: Math.round((structureScore / 10) * 100),
    metric_density_score: Math.round((impactScore / 10) * 100),
    verb_strength_score: Math.round((impactScore / 10) * 100),
    seniority_match_score: Math.round((experienceScore / 20) * 100),
    structural_flags: structuralFlags,
    metric_density_feedback: `${metricMatches.length} metric indicators found.`,
    missing_keywords: missingMustHaves.concat(missingPreferred).slice(0, 8),
    missing_skills: missingMustHaves.slice(0, 5),
    weak_sections: structuralFlags,
    match_percentage: finalScore,
    summary_analysis: hasJD
      ? `ATS V2 evaluated resume against target role requirements. Category breakdown: Skills (${skillsScoreRaw}/30), Experience (${experienceScore}/20), Impact (${impactScore}/10).`
      : `ATS V2 evaluated general resume health score (${finalScore}/100). Provide a job description for targeted JD matching.`,

    // V2 Properties
    ats_version: "v2",
    analysis_type: hasJD ? "JOB_MATCH" : "RESUME_QUALITY",
    score_breakdown: scoreBreakdown,
    matched_must_haves: matchedMustHaves,
    missing_must_haves: missingMustHaves,
    matched_preferred: matchedPreferred,
    missing_preferred: missingPreferred,
    detailed_requirements: detailedRequirements,
    priority_fixes: priorityFixes,
    confidence,
    confidence_reason: confidenceReason,
    candidate_context: candidateContext,
    industry_profile: industryKey,
  };
}
