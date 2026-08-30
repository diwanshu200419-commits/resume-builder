import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { analyzeATS, optimizeResume } from "@/lib/gemini";
import { canAnalyze } from "@/lib/plans";
import { analyzeSchema } from "@/lib/validations";
import { withRateLimit } from "@/lib/rate-limit";
import { detectDomainFromJD } from "@/lib/domain-intelligence";
import { logAIUsage } from "@/lib/logging/ai-usage";

// In-memory fallback cache for high availability
const analysisCache = new Map<string, any>();

export async function GET(request: NextRequest) {
  const profile = await getProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // Check cache first (with ownership check)
  if (analysisCache.has(id)) {
    const cached = analysisCache.get(id);
    if (cached.user_id === profile.id) {
      return NextResponse.json({ analysis: cached });
    }
  }

  try {
    const supabase = await createClient();
    if (id === "latest") {
      const { data: latestAnalysis } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestAnalysis) {
        return NextResponse.json({ analysis: latestAnalysis });
      }
    } else {
      const { data: analysis } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", id)
        .eq("user_id", profile.id)
        .maybeSingle();

      if (analysis) {
        return NextResponse.json({ analysis });
      }
    }
  } catch {}

  // Analysis not found in DB or cache — return proper 404
  return NextResponse.json(
    { error: "Analysis not found. Please re-run your ATS scan." },
    { status: 404 }
  );
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let profile: any = null;

  return withRateLimit(request, async () => {
    try {
      profile = await getProfile();
      const planAtTime = profile?.plan || (profile ? "free" : "unauthenticated");

      if (!profile) {
        await logAIUsage({
          userId: null,
          route: "/api/analyze",
          requestType: "ats_scan",
          planAtTime: "unauthenticated",
          status: "blocked_auth",
          httpStatus: 401,
          latencyMs: Date.now() - startTime,
        });
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!canAnalyze(profile)) {
        await logAIUsage({
          userId: profile.id,
          route: "/api/analyze",
          requestType: "ats_scan",
          planAtTime,
          status: "blocked_rate_limit",
          httpStatus: 403,
          latencyMs: Date.now() - startTime,
        });
        return NextResponse.json({ error: "limit_reached" }, { status: 403 });
      }

      const body = await request.json();
      const validation = analyzeSchema.safeParse(body);

      if (!validation.success) {
        await logAIUsage({
          userId: profile.id,
          route: "/api/analyze",
          requestType: "ats_scan",
          planAtTime,
          status: "error",
          httpStatus: 400,
          errorMessage: validation.error.issues[0].message,
          latencyMs: Date.now() - startTime,
        });
        return NextResponse.json({
          error: validation.error.issues[0].message
        }, { status: 400 });
      }

      const { resumeText, jobDescription, jobTitle } = validation.data;
      const industry = body.industry || undefined;

      const analysisId = `ans-${Date.now()}`;
      let dbAnalysisId = analysisId;

      try {
        const supabase = await createClient();
        const { data: analysis } = await supabase
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

        if (analysis?.id) {
          dbAnalysisId = analysis.id;
        }
      } catch {}

      // Run AI evaluation with resilient fallbacks & industry profile
      const atsResult = await analyzeATS(resumeText, jobDescription, industry);
      const optimization = await optimizeResume(
        resumeText,
        jobDescription,
        atsResult.missing_keywords
      );

      const resultObject = {
        id: dbAnalysisId,
        user_id: profile.id,
        original_resume_text: resumeText,
        job_description: jobDescription,
        job_title: jobTitle || "Software Engineer",
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
        created_at: new Date().toISOString(),
      };

      // Save into cache for immediate zero-lag results rendering
      analysisCache.set(dbAnalysisId, resultObject);

      // Async database background update
      try {
        const supabase = await createClient();
        await supabase
          .from("analyses")
          .update({
            original_ats_score: atsResult.ats_score,
            optimized_ats_score: optimization.optimized_ats_score,
            missing_keywords: atsResult.missing_keywords,
            weak_sections: atsResult.weak_sections,
            optimized_resume_text: optimization.optimized_full_text,
            status: "done",
          })
          .eq("id", dbAnalysisId);

        // Increment user's analyses_used count
        const serviceClient = await createServiceClient();
        await serviceClient
          .from("profiles")
          .update({
            analyses_used: (profile.analyses_used || 0) + 1,
            total_ats_checks: (profile.total_ats_checks || 0) + 1,
          })
          .eq("id", profile.id);
      } catch {}

      await logAIUsage({
        userId: profile.id,
        route: "/api/analyze",
        requestType: "ats_scan",
        planAtTime,
        status: "success",
        httpStatus: 200,
        geminiModel: "gemini-2.0-flash",
        estimatedTokens: 2200,
        latencyMs: Date.now() - startTime,
      });

      return NextResponse.json({ id: dbAnalysisId });
    } catch (error: any) {
      console.error("Server error:", error);
      await logAIUsage({
        userId: profile?.id || null,
        route: "/api/analyze",
        requestType: "ats_scan",
        planAtTime: profile?.plan || "unknown",
        status: "error",
        httpStatus: 500,
        errorMessage: error?.message || "Internal error",
        latencyMs: Date.now() - startTime,
      });
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

  if (analysisCache.has(id)) {
    const cached = analysisCache.get(id);
    if (cached.user_id === profile.id) {
      cached.optimized_resume_text = optimized_resume_text;
      analysisCache.set(id, cached);
    }
  }

  try {
    const supabase = await createClient();
    await supabase
      .from("analyses")
      .update({ optimized_resume_text })
      .eq("id", id)
      .eq("user_id", profile.id);
  } catch {}

  return NextResponse.json({ success: true });
}
