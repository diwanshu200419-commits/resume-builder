import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { canAccessBrandingStudio } from "@/lib/plans";
import { createServiceClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildLinkedinSystemInstruction, buildLinkedinUserPrompt } from "@/lib/ai/linkedin/prompts";
import { linkedinOptimizationSchema } from "@/lib/ai/linkedin/linkedin-schema";
import { scoreLinkedInProfile } from "@/lib/ai/linkedin/linkedin-score";
import { logAiUsage } from "@/lib/admin/logger";
import { logAIUsage } from "@/lib/logging/ai-usage";

export const dynamic = "force-dynamic";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let profile: any = null;

  try {
    // 1. Auth & Server-Side Plan Gating
    profile = await getProfile();
    const planAtTime = profile?.plan || (profile ? "free" : "unauthenticated");

    if (!profile) {
      await logAIUsage({
        userId: null,
        route: "/api/branding-studio",
        requestType: "linkedin_branding",
        planAtTime: "unauthenticated",
        status: "blocked_auth",
        httpStatus: 401,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: "Unauthorized: Authentication required" }, { status: 401 });
    }

    if (!canAccessBrandingStudio(profile)) {
      await logAIUsage({
        userId: profile.id,
        route: "/api/branding-studio",
        requestType: "linkedin_branding",
        planAtTime,
        status: "blocked_plan",
        httpStatus: 403,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json(
        {
          error: "Upgrade required",
          requiredPlan: "pro",
          message: "LinkedIn Branding Studio V2 requires a Pro or Premium plan.",
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      targetRole = "Software Engineer",
      industry,
      experienceLevel = "1–3 years",
      currentRole,
      targetLocation,
      targetCompanies,
      employmentType,
      skills = [],
      achievements,
      education,
      certifications,
      projects,
      currentHeadline,
      currentAbout,
      resumeText,
      targetJobDescription,
      tone = "Professional",
    } = body;

    if (!targetRole.trim()) {
      await logAIUsage({
        userId: profile.id,
        route: "/api/branding-studio",
        requestType: "linkedin_branding",
        planAtTime,
        status: "error",
        httpStatus: 400,
        errorMessage: "Target Role is required",
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: "Target Role is required" }, { status: 400 });
    }

    // 2. Pure Deterministic Mathematical Scoring (0ms, 0 AI tokens, 100% reproducible)
    const deterministicScore = scoreLinkedInProfile({
      targetRole,
      industry,
      experienceLevel,
      currentHeadline,
      currentAbout,
      skills: Array.isArray(skills) ? skills : [skills],
      achievements,
      education,
      certifications,
      projects,
      targetLocation,
      targetCompanies,
    });

    // 3. Build AI Prompts for text generation ONLY
    const systemInstruction = buildLinkedinSystemInstruction();
    const userPrompt = buildLinkedinUserPrompt({
      targetRole,
      industry,
      experienceLevel,
      currentRole,
      targetLocation,
      targetCompanies,
      employmentType,
      skills: Array.isArray(skills) ? skills : [skills],
      achievements,
      education,
      certifications,
      projects,
      currentHeadline,
      currentAbout,
      resumeText,
      targetJobDescription,
      tone,
    });

    let optimizationResult: any = null;

    if (apiKey) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: { responseMimeType: "application/json" },
        });

        const response = await model.generateContent([
          { text: systemInstruction },
          { text: userPrompt },
        ]);

        const rawText = response.response.text();
        const parsedJson = JSON.parse(rawText);

        // Validate structure with Zod schema
        const validated = linkedinOptimizationSchema.safeParse(parsedJson);

        if (validated.success) {
          optimizationResult = validated.data;
        } else {
          console.warn("[Branding Studio API] Zod validation fallback:", validated.error.flatten());
          optimizationResult = parsedJson;
        }
      } catch (geminiErr: any) {
        console.error("[Branding Studio API] Gemini call error:", geminiErr);
      }
    }

    // High availability fallback response if Gemini is unavailable or rate limited
    if (!optimizationResult || !optimizationResult.headlines) {
      optimizationResult = generateHighAvailabilityFallback({
        targetRole,
        experienceLevel,
        skills: Array.isArray(skills) ? skills : [],
        currentHeadline,
        deterministicScore,
      });
    }

    // ALWAYS enforce the deterministic mathematical score over any AI-hallucinated score
    optimizationResult.profileScore = {
      total: deterministicScore.total,
      headline: deterministicScore.headline,
      about: deterministicScore.about,
      keywords: deterministicScore.keywords,
      experience: deterministicScore.experience,
      skills: deterministicScore.skills,
      completeness: deterministicScore.completeness,
      discoverability: deterministicScore.discoverability,
      scoreExplanation: deterministicScore.scoreExplanation,
      breakdown: deterministicScore.breakdown,
    };

    const latencyMs = Date.now() - startTime;

    // 4. Log AI Usage & Costs
    await logAIUsage({
      userId: profile.id,
      route: "/api/branding-studio",
      requestType: "linkedin_branding",
      planAtTime,
      status: "success",
      httpStatus: 200,
      geminiModel: "gemini-1.5-flash",
      estimatedTokens: 1500,
      latencyMs,
    });

    // 5. Save to Database History (`linkedin_optimizations` table)
    try {
      const supabase = await createServiceClient();
      await supabase.from("linkedin_optimizations").insert({
        user_id: profile.id,
        target_role: targetRole,
        industry: industry || "General",
        experience_level: experienceLevel,
        score: deterministicScore.total,
        output_json: optimizationResult,
        created_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn("[Branding Studio API] Failed to save history entry:", dbErr);
    }

    return NextResponse.json({
      success: true,
      optimization: optimizationResult,
    });
  } catch (error: any) {
    console.error("[Branding Studio API Error]:", error);
    await logAIUsage({
      userId: profile?.id || null,
      route: "/api/branding-studio",
      requestType: "linkedin_branding",
      planAtTime: profile?.plan || "unknown",
      status: "error",
      httpStatus: 500,
      errorMessage: error?.message || "Internal error",
      latencyMs: Date.now() - startTime,
    });
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

function generateHighAvailabilityFallback(params: {
  targetRole: string;
  experienceLevel: string;
  skills: string[];
  currentHeadline?: string;
  deterministicScore?: any;
}) {
  const roleTitle = params.targetRole || "Professional";
  const skillList = params.skills.length > 0 ? params.skills.slice(0, 4).join(" • ") : "Core Expertise • Strategy • Execution";

  const defaultScore = params.deterministicScore || {
    total: 75,
    headline: 15,
    about: 15,
    keywords: 15,
    experience: 12,
    skills: 8,
    completeness: 7,
    discoverability: 3,
    scoreExplanation: "Your profile has strong core positioning. Aligning keywords with target recruiter searches will boost discoverability.",
  };

  return {
    profileScore: defaultScore,
    roleAnalysis: {
      targetRole: roleTitle,
      industry: "Technology & Business",
      experienceLevel: params.experienceLevel,
      isFresherMode: params.experienceLevel.includes("Student") || params.experienceLevel.includes("Fresher"),
      isCareerSwitchMode: false,
    },
    headlineAnalysis: {
      currentHeadline: params.currentHeadline || null,
      currentHeadlineScore: params.currentHeadline ? 60 : null,
      identifiedWeaknesses: ["Missing specific role positioning", "Needs top recruiter search keywords"],
      improvedHeadline: `${roleTitle} | ${skillList} | Driving High-Impact Business Results`,
      whyBetterExplanation: "Includes target role title upfront, lists core verified skills, and establishes value outcome.",
    },
    headlines: [
      {
        type: "Recruiter Search",
        text: `${roleTitle} | ${skillList} | Specialized Professional`,
        reason: "Optimized for LinkedIn Recruiter search keyword algorithms.",
      },
      {
        type: "Value-Driven",
        text: `${roleTitle} • Delivering Quality & Business Growth through ${params.skills[0] || "Strategic Execution"}`,
        reason: "Focuses on direct value delivered to employers.",
      },
      {
        type: "Technical / Domain",
        text: `${roleTitle} Specialist | ${skillList}`,
        reason: "Clean technical focus for domain-specific recruiters.",
      },
      {
        type: "Clean Professional",
        text: `${roleTitle} at Target Industry | ${skillList}`,
        reason: "Minimalist, executive-ready presentation.",
      },
      {
        type: "Aspirational / Growth",
        text: `Building Next-Gen Solutions as a ${roleTitle} | ${skillList}`,
        reason: "Forward-looking positioning for ambitious roles.",
      },
    ],
    aboutVersions: {
      recruiterOptimized: `I am a ${roleTitle} specializing in ${skillList}. With expertise in delivering scalable solutions, I focus on transforming complex requirements into reliable outcomes.\n\nCore Technical Expertise:\n• ${skillList}\n\nI am open to new opportunities and strategic collaborations.`,
      humanPersonal: `Driven by a passion for solving real-world problems as a ${roleTitle}. My work revolves around ${skillList}, focusing on continuous improvement and team collaboration.\n\nOutside of work, I am passionate about technology trends and industry mentorship.`,
      conciseProfessional: `${roleTitle} with hands-on experience in ${skillList}. Track record of delivering quality projects and driving operational efficiency.`,
    },
    experienceBullets: [
      {
        originalText: "Worked on core team projects and features.",
        optimizedBullet: `Collaborated with cross-functional teams to deliver key ${roleTitle} requirements using ${params.skills[0] || "industry best practices"}.`,
        improvementReason: "Replaced passive phrasing with strong action verbs and specific technical context.",
        addedVerifiedMetric: false,
      },
    ],
    keywords: {
      matchedVerifiedSkills: params.skills.length > 0 ? params.skills : ["Project Management", "Communication"],
      partiallyRepresented: ["Strategic Execution", "Cross-functional Collaboration"],
      recommendedToDevelop: ["Cloud Architecture", "System Design"],
    },
    skillsStrategy: {
      top5MustPin: params.skills.length >= 5 ? params.skills.slice(0, 5) : [roleTitle, "Problem Solving", "Team Leadership", "Data Analysis", "Strategic Planning"],
      coreSkills: [roleTitle, "Technical Architecture", "Process Optimization"],
      toolsAndPlatforms: ["Jira", "Git", "Excel / Analytics Tools"],
      domainKnowledge: ["Industry Best Practices", "Product Development Lifecycle"],
      recommendedSkillsToLearn: ["Advanced Cloud Services", "MLOps / Automation"],
    },
    recruiterSearchKeywords: {
      primaryRoleKeywords: [roleTitle, "Engineering", "Development"],
      secondaryKeywords: ["Agile", "Scrum", "CI/CD"],
      placementGuidance: "Place primary keywords in your Headline, top line of About section, and Skills section.",
    },
    profileAssets: {
      bannerTextIdea: `${roleTitle.toUpperCase()} • ${skillList.toUpperCase()} • BUILDING HIGH-IMPACT SOLUTIONS`,
      featuredSectionRecommendations: ["Add link to portfolio or GitHub", "Include top project case study", "Feature key certification badge"],
      recruiterRealityCheckRoast: "Your profile has good foundation text, but recruiters scan in 6 seconds. Make sure your target role is explicit in your headline!",
    },
    actionPlan: [
      {
        stepNumber: 1,
        title: "Update LinkedIn Headline",
        impact: "HIGH",
        instruction: "Copy the Recruiter Search Headline to instantly improve search discoverability.",
      },
      {
        stepNumber: 2,
        title: "Revamp About Section",
        impact: "HIGH",
        instruction: "Paste the Recruiter-Optimized About section and pin your core skills at the bottom.",
      },
      {
        stepNumber: 3,
        title: "Pin Top 5 Skills",
        impact: "MEDIUM",
        instruction: "Reorder your LinkedIn Skills section so recruiters see your top 5 relevant skills first.",
      },
    ],
  };
}
