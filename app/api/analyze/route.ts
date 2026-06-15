import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { analyzeATS, optimizeResume } from "@/lib/gemini";
import { canAnalyze } from "@/lib/plans";
import { analyzeSchema } from "@/lib/validations";
import { updateCareerProfileFromResume } from "@/lib/ai-engine/career-memory";
import { calculateCareerScore, saveMonthlyScore } from "@/lib/ai-engine/career-scorer";
import { withRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const profile = await getProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .eq("user_id", profile.id)
    .single();

  if (!analysis) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ analysis });
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const profile = await getProfile();
      if (!profile) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!canAnalyze(profile)) {
        return NextResponse.json({ error: "limit_reached" }, { status: 403 });
      }

      const body = await request.json();
      const validation = analyzeSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json({ 
          error: validation.error.issues[0].message 
        }, { status: 400 });
      }

      const { resumeText, jobDescription, jobTitle } = validation.data;

      const supabase = await createClient();
      const serviceSupabase = await createServiceClient();

      // 1. Create pending analysis
      const { data: analysis, error: createError } = await supabase
        .from("analyses")
        .insert({
          user_id: profile.id,
          original_resume_text: resumeText,
          job_description: jobDescription,
          job_title: jobTitle || null,
          status: "analyzing",
        })
        .select()
        .single();

      if (createError || !analysis) {
        console.error("Create analysis error:", createError);
        return NextResponse.json({ error: "Something went wrong, try again" }, { status: 500 });
      }

      // 2. Pre-increment usage to prevent concurrent abuse
      // Use service role to bypass RLS restrictions on profile updates
      await serviceSupabase
        .from("profiles")
        .update({ 
          analyses_used: profile.analyses_used + 1,
          total_ats_checks: (profile.total_ats_checks || 0) + 1
        })
        .eq("id", profile.id);

      try {
        const atsResult = await analyzeATS(resumeText, jobDescription);
        const optimization = await optimizeResume(
          resumeText,
          jobDescription,
          atsResult.missing_keywords
        );

        const { error: updateError } = await supabase
          .from("analyses")
          .update({
            original_ats_score: atsResult.ats_score,
            optimized_ats_score: optimization.optimized_ats_score,
            missing_keywords: atsResult.missing_keywords,
            weak_sections: atsResult.weak_sections,
            optimized_resume_text: optimization.optimized_full_text,
            before_summary: optimization.professional_summary.before,
            after_summary: optimization.professional_summary.after,
            before_skills: optimization.skills_section.before,
            after_skills: optimization.skills_section.after,
            before_experience: optimization.experience_section.before,
            after_experience: optimization.experience_section.after,
            keyword_match_score: atsResult.keyword_match_score,
            skills_match_score: atsResult.skills_match_score,
            readability_score: atsResult.readability_score,
            format_score: atsResult.format_score,
            optimized_keyword_match: Math.min(
              100,
              atsResult.keyword_match_score + Math.round((optimization.optimized_ats_score - atsResult.ats_score) * 0.6)
            ),
            optimized_skills_match: Math.min(
              100,
              atsResult.skills_match_score + Math.round((optimization.optimized_ats_score - atsResult.ats_score) * 0.5)
            ),
            optimized_readability: Math.min(
              100,
              atsResult.readability_score + Math.round((optimization.optimized_ats_score - atsResult.ats_score) * 0.3)
            ),
            optimized_format: Math.min(
              100,
              atsResult.format_score + Math.round((optimization.optimized_ats_score - atsResult.ats_score) * 0.2)
            ),
            status: "done",
          })
          .eq("id", analysis.id);

        if (updateError) throw updateError;

        // Update AI Memory & Career Score
        await updateCareerProfileFromResume(profile.id, resumeText, optimization.optimized_ats_score);
        const careerScore = await calculateCareerScore(profile.id);
        await saveMonthlyScore(profile.id, careerScore);

        return NextResponse.json({ id: analysis.id });
      } catch (err) {
        console.error("AI Analysis error:", err);
        // Rollback usage if it failed? Or keep it as a used credit?
        // For SaaS, usually we keep it or mark as error.
        await serviceSupabase.from("analyses").update({ status: "error" }).eq("id", analysis.id);
        return NextResponse.json({ error: "AI analysis failed. Please try again." }, { status: 500 });
      }
    } catch (error) {
      console.error("Server error:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  });
}

export async function PATCH(request: NextRequest) {
  const profile = await getProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, optimized_resume_text } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("analyses")
    .update({ optimized_resume_text })
    .eq("id", id)
    .eq("user_id", profile.id);

  if (error) {
    return NextResponse.json({ error: "Something went wrong, try again" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
