import { NextRequest, NextResponse } from "next/server";
import { analyzeATS } from "@/lib/gemini";
import { withRateLimit } from "@/lib/rate-limit";
import { logAIUsage } from "@/lib/logging/ai-usage";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  return withRateLimit(request, async () => {
    try {
      const body = await request.json().catch(() => ({}));
      const { resumeText } = body;

      if (!resumeText || resumeText.trim().length < 100) {
        await logAIUsage({
          userId: null,
          route: "/api/public/analyze-ats",
          requestType: "public_ats_scan",
          planAtTime: "unauthenticated",
          status: "error",
          httpStatus: 400,
          errorMessage: "Resume text too short or invalid",
          latencyMs: Date.now() - startTime,
        });
        return NextResponse.json({ error: "Please provide a valid resume text" }, { status: 400 });
      }

      const atsResult = await analyzeATS(resumeText, "General Software Engineer role (entry to senior level)");

      await logAIUsage({
        userId: null,
        route: "/api/public/analyze-ats",
        requestType: "public_ats_scan",
        planAtTime: "unauthenticated",
        status: "success",
        httpStatus: 200,
        geminiModel: "ats-v2-deterministic",
        estimatedTokens: 0,
        latencyMs: Date.now() - startTime,
      });

      return NextResponse.json({
        atsScore: atsResult.ats_score,
        keywordMatchScore: atsResult.keyword_match_score,
        skillsMatchScore: atsResult.skills_match_score,
        readabilityScore: atsResult.readability_score,
        formatScore: atsResult.format_score,
        missingKeywords: atsResult.missing_keywords,
        missingSkills: atsResult.missing_skills,
        weakSections: atsResult.weak_sections,
        summaryAnalysis: atsResult.summary_analysis,
      });
    } catch (error: any) {
      console.error("Public ATS analyze error:", error);
      await logAIUsage({
        userId: null,
        route: "/api/public/analyze-ats",
        requestType: "public_ats_scan",
        planAtTime: "unauthenticated",
        status: "error",
        httpStatus: 500,
        errorMessage: error?.message || "Internal public scan error",
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json(
        { error: "Failed to analyze resume. Please try again." },
        { status: 500 }
      );
    }
  });
}
