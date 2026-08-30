import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { generateATSResume, GenerateATSResumeInput } from "@/lib/gemini";
import { canAnalyze } from "@/lib/plans";
import { withRateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { logAIUsage } from "@/lib/logging/ai-usage";

const InputSchema = z.object({
  rawInput: z.string().min(20, "Please provide at least 20 characters of resume text or experience details."),
  jobDescription: z.string().optional(),
  targetRole: z.string().min(2, "Target role is required."),
  seniority: z.enum(["entry-level", "mid-level", "senior", "leadership"]).default("mid-level"),
  industry: z.string().optional(),
});

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
          route: "/api/ai/generate-ats-resume",
          requestType: "generate_ats_resume",
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
          route: "/api/ai/generate-ats-resume",
          requestType: "generate_ats_resume",
          planAtTime,
          status: "blocked_rate_limit",
          httpStatus: 403,
          latencyMs: Date.now() - startTime,
        });
        return NextResponse.json(
          { error: "Free tier limit reached. Upgrade to Pro for 30 scans per month." },
          { status: 403 }
        );
      }

      const body = await request.json().catch(() => ({}));
      const validation = InputSchema.safeParse(body);

      if (!validation.success) {
        await logAIUsage({
          userId: profile.id,
          route: "/api/ai/generate-ats-resume",
          requestType: "generate_ats_resume",
          planAtTime,
          status: "error",
          httpStatus: 400,
          errorMessage: validation.error.issues[0].message,
          latencyMs: Date.now() - startTime,
        });
        return NextResponse.json(
          { error: validation.error.issues[0].message },
          { status: 400 }
        );
      }

      const inputData: GenerateATSResumeInput = validation.data;

      // 1. Generate Unified ATS Resume + Category Score
      const result = await generateATSResume(inputData);

      // 2. Persist in Supabase 'analyses' & 'ai_usage_logs'
      try {
        const supabase = await createClient();
        const { data: dbAnalysis } = await supabase
          .from("analyses")
          .insert({
            user_id: profile.id,
            original_resume_text: inputData.rawInput,
            job_description: inputData.jobDescription || null,
            job_title: inputData.targetRole,
            original_ats_score: result.ats_score.overall,
            optimized_ats_score: Math.min(98, result.ats_score.overall + 8),
            missing_keywords: result.ats_score.categories.keyword_match.missing,
            optimized_resume_text: JSON.stringify(result.resume),
            status: "done",
          })
          .select()
          .single();

        // Increment analyses_used on user profile
        const serviceClient = await createServiceClient();
        await serviceClient
          .from("profiles")
          .update({
            analyses_used: (profile.analyses_used || 0) + 1,
            total_ats_checks: (profile.total_ats_checks || 0) + 1,
          })
          .eq("id", profile.id);

        if (dbAnalysis?.id) {
          (result as any).id = dbAnalysis.id;
        }
      } catch (err) {
        console.warn("[generate-ats-resume] Supabase logging warning:", err);
      }

      await logAIUsage({
        userId: profile.id,
        route: "/api/ai/generate-ats-resume",
        requestType: "generate_ats_resume",
        planAtTime,
        status: "success",
        httpStatus: 200,
        geminiModel: "gemini-2.0-flash",
        estimatedTokens: 1200,
        latencyMs: Date.now() - startTime,
      });

      return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
      console.error("[generate-ats-resume API Error]:", error);
      await logAIUsage({
        userId: profile?.id || null,
        route: "/api/ai/generate-ats-resume",
        requestType: "generate_ats_resume",
        planAtTime: profile?.plan || "unknown",
        status: "error",
        httpStatus: 500,
        errorMessage: error?.message || "Internal error",
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json(
        { error: "Failed to generate ATS resume. Please try again." },
        { status: 500 }
      );
    }
  });
}
