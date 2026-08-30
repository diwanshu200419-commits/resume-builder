// app/api/ai/portfolio/route.ts
//
// Vaylo AI — Multi-Design Portfolio Generator API
// Generates responsive single-page portfolio HTML across 6 modern design themes:
// 1. Technical / Neo-Terminal
// 2. Minimal / Bento Studio
// 3. Executive / Modern Glass
// 4. Vibrant / Gradient SaaS
// 5. Editorial / Warm Serif
// 6. Aurora / Deep Space

import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  generatePortfolioHTML,
  autoSuggestTemplate,
  validatePortfolioInput,
  PortfolioData,
  PortfolioTemplateId,
} from "@/lib/portfolio-templates";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logAIUsage } from "@/lib/logging/ai-usage";

export const dynamic = "force-dynamic";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const MODEL_PREFERENCES = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-8b",
  "gemini-1.5-flash",
];

async function extractPortfolioWithGemini(
  text: string,
  targetRole?: string,
  candidateName?: string
): Promise<PortfolioData | null> {
  if (!apiKey) return null;

  const prompt = `You are an elite developer and career portfolio architect.
Extract and structure a rich, accurate portfolio profile from the candidate's resume/background text.

CRITICAL FACT-PRESERVATION RULE:
- NEVER fabricate companies, fake project titles, or unsupported metrics not grounded in the candidate's text.
- Cleanly organize and polish the real achievements, skills, and projects provided.
- If a specific field (like github or linkedin) is not present, use reasonable placeholders or omit.

Target Role Context: ${targetRole || "Extracted from background"}
Candidate Full Name: ${candidateName || "Extracted from background"}

Candidate Text:
${text}

Return ONLY valid raw JSON matching this exact TypeScript structure:
{
  "name": "Candidate Full Name",
  "title": "Professional Title / Headline",
  "bio": "2-3 impactful sentences summarizing their expertise and value proposition.",
  "location": "City, Country or Remote",
  "email": "contact email if found",
  "linkedin": "linkedin URL or profile handle",
  "github": "github URL or handle",
  "stats": [
    { "label": "e.g. Years Experience", "value": "e.g. 4+" },
    { "label": "e.g. Key Metric / Projects", "value": "e.g. 15+" },
    { "label": "e.g. Core Focus / Uptime", "value": "e.g. 99.9%" }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"],
  "projects": [
    {
      "title": "Project Title",
      "description": "2-3 sentences explaining what was built, architecture, and impact.",
      "tech": "Tech1 • Tech2 • Tech3",
      "metrics": "Key quantifiable result if mentioned in text"
    }
  ],
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "period": "Start Year — End Year / Present",
      "summary": "Key responsibilities and achievements delivered."
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University / College",
      "year": "Graduation Year"
    }
  ]
}`;

  for (const modelName of MODEL_PREFERENCES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      });

      const response = await model.generateContent(prompt);
      const output = response.response.text();
      if (output) {
        let clean = output.trim();
        if (clean.startsWith("```json")) {
          clean = clean.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
        } else if (clean.startsWith("```")) {
          clean = clean.replace(/^```\s*/, "").replace(/```\s*$/, "");
        }
        const parsed = JSON.parse(clean.trim());
        if (parsed && parsed.name && parsed.title && Array.isArray(parsed.skills)) {
          return parsed as PortfolioData;
        }
      }
    } catch (err) {
      console.warn(`[portfolio-extract] ${modelName} failed, trying next fallback:`, err);
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let profile: any = null;

  try {
    profile = await getProfile();
    const planAtTime = profile?.plan || (profile ? "free" : "unauthenticated");

    if (!profile) {
      await logAIUsage({
        userId: null,
        route: "/api/ai/portfolio",
        requestType: "portfolio_generation",
        planAtTime: "unauthenticated",
        status: "blocked_auth",
        httpStatus: 401,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const {
      analysisId,
      resumeText,
      targetRole,
      avatarUrl,
      template: requestedTemplate,
      projects: structuredProjects,
      experience: structuredExperience,
      skills: structuredSkills,
    } = body;

    let text = resumeText || "";

    if (analysisId) {
      try {
        const supabase = await createClient();
        const { data: analysis } = await supabase
          .from("analyses")
          .select("original_resume_text, optimized_resume_text")
          .eq("id", analysisId)
          .single();

        if (analysis) {
          text = analysis.optimized_resume_text || analysis.original_resume_text || "";
        }
      } catch (err) {
        console.warn("[api/ai/portfolio] analysis fetch exception:", err);
      }
    }

    // MINIMUM-INPUT VALIDATION
    const validation = validatePortfolioInput({
      rawResumeText: text,
      projects: structuredProjects,
      experience: structuredExperience,
      skills: structuredSkills,
    });

    if (!validation.valid) {
      await logAIUsage({
        userId: profile.id,
        route: "/api/ai/portfolio",
        requestType: "portfolio_generation",
        planAtTime,
        status: "error",
        httpStatus: 400,
        errorMessage: validation.reason,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json(
        { error: validation.reason },
        { status: 400 }
      );
    }

    const selectedTemplate: PortfolioTemplateId =
      requestedTemplate || autoSuggestTemplate(targetRole || text);

    // AI Extraction
    let portfolioData: PortfolioData | null = await extractPortfolioWithGemini(
      text,
      targetRole,
      profile.full_name || undefined
    );

    const usedModel = portfolioData ? "gemini-2.0-flash" : "rule-based-fallback";

    // Fallback if AI offline or returned null
    if (!portfolioData) {
      const lines = text.split("\n").map((l: string) => l.trim()).filter(Boolean);
      const candidateName = profile.full_name || lines[0] || "Candidate Portfolio";
      const candidateTitle = targetRole || lines[1] || "Senior Professional";

      const skillsMatch = text.match(/skills:?\s*([^\n]+)/i);
      const skillsList = skillsMatch
        ? skillsMatch[1].split(/[,|•]/).map((s: string) => s.trim()).filter(Boolean)
        : ["Problem Solving", "Domain Strategy", "Project Delivery", "Cross-Functional Collaboration", "Technical Architecture"];

      portfolioData = {
        name: candidateName,
        title: candidateTitle,
        bio: text.slice(0, 320).trim() + "...",
        email: profile.email || "contact@vayloai.online",
        skills: skillsList.slice(0, 10),
        stats: [
          { label: "Experience Focus", value: "3+ Years" },
          { label: "Projects Delivered", value: "10+" },
          { label: "Core Competencies", value: `${skillsList.length}+` },
        ],
        projects: [
          {
            title: `${candidateTitle} Initiatives & Architecture`,
            description: "Led key project lifecycle initiatives, architected solutions, and optimized core deliverables.",
            tech: skillsList.slice(0, 3).join(" • "),
          },
        ],
        experience: [
          {
            role: candidateTitle,
            company: "Enterprise Solutions",
            period: "Recent",
            summary: "Executed core projects, collaborated across teams, and drove measurable results.",
          },
        ],
      };
    }

    if (avatarUrl && typeof avatarUrl === "string" && avatarUrl.trim()) {
      portfolioData.avatarUrl = avatarUrl.trim();
    }

    const htmlCode = generatePortfolioHTML(portfolioData, selectedTemplate);

    await logAIUsage({
      userId: profile.id,
      route: "/api/ai/portfolio",
      requestType: "portfolio_generation",
      planAtTime,
      status: "success",
      httpStatus: 200,
      geminiModel: usedModel,
      estimatedTokens: 1200,
      latencyMs: Date.now() - startTime,
    });

    return NextResponse.json({
      html: htmlCode,
      data: portfolioData,
      template: selectedTemplate,
      suggestedTemplate: autoSuggestTemplate(targetRole || text),
    });
  } catch (error: any) {
    console.error("Portfolio error:", error);
    await logAIUsage({
      userId: profile?.id || null,
      route: "/api/ai/portfolio",
      requestType: "portfolio_generation",
      planAtTime: profile?.plan || "unknown",
      status: "error",
      httpStatus: 500,
      errorMessage: error?.message || "Internal error",
      latencyMs: Date.now() - startTime,
    });
    return NextResponse.json(
      { error: error.message || "Failed to generate portfolio" },
      { status: 500 }
    );
  }
}

