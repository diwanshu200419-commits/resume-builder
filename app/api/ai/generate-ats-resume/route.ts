import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { generateATSResume, GenerateATSResumeInput } from "@/lib/gemini";
import { canAnalyze } from "@/lib/plans";
import { withRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const InputSchema = z.object({
  rawInput: z.string().min(20, "Please provide at least 20 characters of resume text or experience details."),
  jobDescription: z.string().optional(),
  targetRole: z.string().min(2, "Target role is required."),
  seniority: z.enum(["entry-level", "mid-level", "senior", "leadership"]).default("mid-level"),
  industry: z.string().optional(),
});

export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const profile = await getProfile();
      if (!profile) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!canAnalyze(profile)) {
        return NextResponse.json(
          { error: "Free tier limit reached. Upgrade to Pro for 30 scans per month." },
          { status: 403 }
        );
      }

      const body = await request.json().catch(() => ({}));
      const validation = InputSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { error: validation.error.issues[0].message },
          { status: 400 }
        );
      }

      const inputData: GenerateATSResumeInput = validation.data;

      // 1. Generate Unified ATS Resume + Category Score
      const result = await generateATSResume(inputData);

      // 2. Persist in Supabase 'analyses' & 'ai_logs'
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

        // Log AI usage in 'ai_logs'
        const serviceClient = await createServiceClient();
        await serviceClient.from("ai_logs").insert({
          user_id: profile.id,
          model: "gemini-2.0-flash",
          tokens_used: 1200,
          feature: "generate_ats_resume",
          success: true,
        });

        // Increment analyses_used on user profile
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

      return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
      console.error("[generate-ats-resume API Error]:", error);
      return NextResponse.json(
        { error: "Failed to generate ATS resume. Please try again." },
        { status: 500 }
      );
    }
  });
}
