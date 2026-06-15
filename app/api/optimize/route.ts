import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  generateCoverLetter,
  generateInterviewPrep,
  generateLinkedInSuggestions,
} from "@/lib/gemini";
import { canAccessCoverLetter, canAccessPremium } from "@/lib/plans";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { analysisId, type } = await request.json();
    if (!analysisId || !type) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: analysis } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", analysisId)
      .eq("user_id", profile.id)
      .single();

    if (!analysis) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const resumeText = analysis.optimized_resume_text || analysis.original_resume_text;
    const jobDescription = analysis.job_description;

    if (type === "cover-letter") {
      if (!canAccessCoverLetter(profile)) {
        return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
      }

      const coverLetter = await generateCoverLetter(resumeText, jobDescription);
      await supabase.from("analyses").update({ cover_letter: coverLetter }).eq("id", analysisId);

      return NextResponse.json({ coverLetter });
    }

    if (type === "interview") {
      if (!canAccessPremium(profile)) {
        return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
      }

      const interviewQuestions = await generateInterviewPrep(resumeText, jobDescription);
      await supabase
        .from("analyses")
        .update({ interview_questions: interviewQuestions })
        .eq("id", analysisId);

      return NextResponse.json({ interviewQuestions });
    }

    if (type === "linkedin") {
      if (!canAccessPremium(profile)) {
        return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
      }

      const linkedinSuggestions = await generateLinkedInSuggestions(
        resumeText,
        analysis.job_title || "Target Role"
      );
      await supabase
        .from("analyses")
        .update({ linkedin_suggestions: linkedinSuggestions })
        .eq("id", analysisId);

      return NextResponse.json({ linkedinSuggestions });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error in optimize route:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Something went wrong, try again" }, { status: 500 });
  }
}
