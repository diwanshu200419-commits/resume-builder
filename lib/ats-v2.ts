import type { ATSAnalysisResult, ATSV2ScoreBreakdown, ATSV2RequirementMatch, ATSV2PriorityFix } from "@/types";

export const ATS_SCORING_WEIGHTS = {
  skills: 30,
  experience: 20,
  semantic: 15,
  projects: 10,
  education: 5,
  structure: 10,
  impact: 10,
} as const;

// Enforce exact 100 weight validation at compile/module load
const TOTAL_WEIGHT = Object.values(ATS_SCORING_WEIGHTS).reduce((a, b) => a + b, 0);
if (TOTAL_WEIGHT !== 100) {
  throw new Error(`ATS_SCORING_WEIGHTS must sum to 100, got ${TOTAL_WEIGHT}`);
}

// Curated technical alias mapping dictionary
const TECHNICAL_ALIASES: Record<string, string> = {
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
  "google cloud platform": "gcp",
  "azure": "azure",
  "microsoft azure": "azure",
  "rest": "rest_api",
  "restful": "rest_api",
  "rest api": "rest_api",
  "restful apis": "rest_api",
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
  "html5": "html",
  "css": "css",
  "css3": "css",
  "tailwind": "tailwindcss",
  "tailwindcss": "tailwindcss",
  "next.js": "nextjs",
  "nextjs": "nextjs",
  "next": "nextjs",
};

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
  aiSemanticBoost: number = 0
): ATSAnalysisResult {
  const hasJD = !!jobDescription && jobDescription.trim().length > 20;
  const candidateContext = detectCandidateContext(resumeText);
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
  // 1. SKILLS MATCH (30 POINTS)
  // ----------------------------------------------------
  const detailedRequirements: ATSV2RequirementMatch[] = [];
  const matchedMustHaves: string[] = [];
  const missingMustHaves: string[] = [];
  const matchedPreferred: string[] = [];
  const missingPreferred: string[] = [];

  let skillsScoreRaw = 0;

  if (hasJD) {
    // Extract potential skills/terms from JD
    const rawTerms = jdLower.match(/[a-z0-9.+#-]+(?:\s[a-z0-9.+#-]+)*/g) || [];
    const termCounts = new Map<string, number>();

    // Common non-technical stopwords
    const stopwords = new Set([
      "the", "a", "an", "and", "or", "for", "with", "in", "on", "at", "to", "of",
      "required", "preferred", "experience", "work", "ability", "strong", "good",
      "team", "role", "candidate", "responsibilities", "requirements", "knowledge",
      "years", "plus", "must", "have", "building", "working", "using", "support",
    ]);

    for (const term of rawTerms) {
      const norm = normalizeSkill(term);
      if (norm.length > 2 && !stopwords.has(norm)) {
        termCounts.set(norm, (termCounts.get(norm) || 0) + 1);
      }
    }

    // Identify Must-Have vs Preferred
    const extractedSkills = Array.from(termCounts.keys()).slice(0, 20);

    let mustHavePoints = 0;
    let mustHaveMax = 0;
    let prefPoints = 0;
    let prefMax = 0;

    for (const skillNorm of extractedSkills) {
      const isMust = /\b(required|must|essential|minimum|proficiency|strong)\b/i.test(jdLower);
      const isPref = /\b(preferred|nice to have|plus|bonus|advantage)\b/i.test(jdLower);
      const category: "must_have" | "preferred" = isPref && !isMust ? "preferred" : "must_have";

      // Anti-keyword stuffing & evidence confidence search
      let matched = false;
      let evidenceText: string | undefined;
      let evidenceSource: "Experience" | "Projects" | "Skills" | "Education" | undefined;
      let confidence: "STRONG" | "MEDIUM" | "WEAK" = "WEAK";

      // Check Experience first (STRONG evidence)
      const expLine = sectionLines.Experience.find((l) => normalizeSkill(l).includes(skillNorm));
      if (expLine) {
        matched = true;
        evidenceText = expLine;
        evidenceSource = "Experience";
        confidence = "STRONG";
      } else {
        // Check Projects second (MEDIUM evidence)
        const projLine = sectionLines.Projects.find((l) => normalizeSkill(l).includes(skillNorm));
        if (projLine) {
          matched = true;
          evidenceText = projLine;
          evidenceSource = "Projects";
          confidence = "MEDIUM";
        } else {
          // Check Skills third (WEAK evidence)
          const skillLine = sectionLines.Skills.find((l) => normalizeSkill(l).includes(skillNorm));
          if (skillLine || resumeLower.includes(skillNorm)) {
            matched = true;
            evidenceText = skillLine || skillNorm;
            evidenceSource = "Skills";
            confidence = "WEAK";
          }
        }
      }

      // Check for negated context (e.g. "no experience in AWS", "want to learn React")
      if (matched && evidenceText) {
        if (/\b(no experience|learning|want to learn|basic knowledge of|familiar with)\b/i.test(evidenceText)) {
          confidence = "WEAK";
        }
      }

      const displaySkill = skillNorm.toUpperCase();
      detailedRequirements.push({
        name: displaySkill,
        category,
        matched,
        evidence: evidenceText ? evidenceText.slice(0, 100) : undefined,
        evidenceSource,
        confidence: matched ? confidence : undefined,
      });

      if (category === "must_have") {
        mustHaveMax += 2;
        if (matched) {
          mustHavePoints += confidence === "STRONG" ? 2 : confidence === "MEDIUM" ? 1.5 : 1;
          matchedMustHaves.push(displaySkill);
        } else {
          missingMustHaves.push(displaySkill);
        }
      } else {
        prefMax += 1;
        if (matched) {
          prefPoints += 1;
          matchedPreferred.push(displaySkill);
        } else {
          missingPreferred.push(displaySkill);
        }
      }
    }

    const totalMustScore = mustHaveMax > 0 ? (mustHavePoints / mustHaveMax) * 22 : 22;
    const totalPrefScore = prefMax > 0 ? (prefPoints / prefMax) * 8 : 8;
    skillsScoreRaw = Math.min(30, Math.round(totalMustScore + totalPrefScore));
  } else {
    // No JD Mode: General Technical Skill Breadth (max 30)
    const techCount = Object.keys(TECHNICAL_ALIASES).filter((k) => resumeLower.includes(k)).length;
    skillsScoreRaw = Math.min(30, Math.max(12, techCount * 3));
  }

  // ----------------------------------------------------
  // 2. EXPERIENCE RELEVANCE (20 POINTS)
  // ----------------------------------------------------
  let experienceScore = 0;
  const isSeniorJd = /\b(senior|staff|principal|lead|architect|manager)\b/i.test(jdLower);
  const hasSenioritySignals = /\b(architected|spearheaded|led|mentored|system design|roadmap|cross-functional)\b/i.test(resumeLower);

  if (candidateContext === "Fresher/Student") {
    // Fresher mode: Projects & internships substitute for job experience
    const projectBulletCount = sectionLines.Projects.length;
    const internshipCount = (resumeLower.match(/\bintern(ship)?\b/g) || []).length;
    experienceScore = Math.min(20, Math.round(10 + projectBulletCount * 1.5 + internshipCount * 3));
  } else {
    const expBulletCount = sectionLines.Experience.length;
    const baseExpScore = Math.min(16, Math.max(6, expBulletCount * 2));
    const seniorityBonus = isSeniorJd ? (hasSenioritySignals ? 4 : 0) : 4;
    experienceScore = Math.min(20, baseExpScore + seniorityBonus);
  }

  // ----------------------------------------------------
  // 3. SEMANTIC / RESPONSIBILITY MATCH (15 POINTS)
  // ----------------------------------------------------
  let semanticScore = 0;
  if (hasJD) {
    const jdVerbs = jdLower.match(/\b(build|develop|architect|design|manage|optimize|scale|deploy|lead|collaborate|test|integrate|deliver)\b/g) || [];
    const verbSet = Array.from(new Set(jdVerbs));
    let semVerbMatches = 0;
    for (const v of verbSet) {
      if (resumeLower.includes(v)) semVerbMatches++;
    }
    const ratio = semVerbMatches / Math.max(1, verbSet.length);
    semanticScore = Math.min(15, Math.max(4, Math.round(ratio * 12 + (aiSemanticBoost > 0 ? 3 : 2))));
  } else {
    semanticScore = sectionLines.Summary.length > 0 ? 13 : 8;
  }

  // ----------------------------------------------------
  // 4. PROJECT & DOMAIN RELEVANCE (10 POINTS)
  // ----------------------------------------------------
  const projectCount = sectionLines.Projects.length;
  const projectScore = candidateContext === "Fresher/Student"
    ? Math.min(10, Math.max(5, projectCount * 2.5))
    : Math.min(10, Math.max(4, projectCount * 2));

  // ----------------------------------------------------
  // 5. EDUCATION & CERTIFICATIONS (5 POINTS)
  // ----------------------------------------------------
  const hasDegree = /\b(b\.tech|btech|b\.s\.|bs|b\.e\.|be|master|m\.s\.|ms|phd|bachelor|degree)\b/i.test(resumeLower);
  const hasCert = /\b(certified|aws certified|certificated|coursera|udemy|license)\b/i.test(resumeLower);
  const educationScore = hasDegree ? 5 : hasCert ? 4 : 3;

  // ----------------------------------------------------
  // 6. ATS STRUCTURE & PARSABILITY (10 POINTS)
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
  const structureScore = Math.max(3, 10 - structuralFlags.length * 2.5);

  // ----------------------------------------------------
  // 7. IMPACT & METRIC QUALITY (10 POINTS)
  // ----------------------------------------------------
  const metricRegex = /\b(\d+%\b|\$\d+|\d+\+|\d+x\b|\d+\s*(users|qps|ms|requests|k|m|gb|tb|hrs|days|months))\b/gi;
  const metricMatches = resumeText.match(metricRegex) || [];
  const actionVerbRegex = /\b(spearheaded|architected|engineered|reduced|increased|scaled|optimized|built|delivered|led|automated)\b/gi;
  const verbMatches = resumeText.match(actionVerbRegex) || [];

  const impactScore = Math.min(10, Math.round(Math.min(5, metricMatches.length * 1.2) + Math.min(5, verbMatches.length * 1.0)));

  // ----------------------------------------------------
  // Authoritative Final Score Mathematics
  // ----------------------------------------------------
  const finalScore = Math.min(100, Math.max(0, Math.round(
    skillsScoreRaw +
    experienceScore +
    semanticScore +
    projectScore +
    educationScore +
    structureScore +
    impactScore
  )));

  // Score breakdown object
  const scoreBreakdown: ATSV2ScoreBreakdown = {
    skills: { score: skillsScoreRaw, max: 30, label: "Skills Match" },
    experience: { score: experienceScore, max: 20, label: "Experience Relevance" },
    semantic: { score: semanticScore, max: 15, label: "Semantic / Responsibilities" },
    projects: { score: projectScore, max: 10, label: "Project & Domain Relevance" },
    education: { score: educationScore, max: 5, label: "Education & Certifications" },
    structure: { score: structureScore, max: 10, label: "ATS Structure & Parsability" },
    impact: { score: impactScore, max: 10, label: "Impact & Metric Quality" },
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
  };
}
