import { NextRequest, NextResponse } from "next/server";
import { analyzeATS } from "@/lib/gemini";
import { withRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const body = await request.json();
      const { resumeText } = body;

      if (!resumeText || resumeText.trim().length < 100) {
        return NextResponse.json({ error: "Please provide a valid resume text" }, { status: 400 });
      }

      const atsResult = await analyzeATS(resumeText, "General Software Engineer role (entry to senior level)");

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
    } catch (error) {
      console.error("Public ATS analyze error:", error);
      return NextResponse.json(
        { error: "Failed to analyze resume. Please try again." },
        { status: 500 }
      );
    }
  });
}
