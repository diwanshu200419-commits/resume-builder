import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { generateResumeRoast } from "@/lib/gemini";
import { checkDailyRateLimit } from "@/lib/rate-limit";
import { logAIUsage } from "@/lib/logging/ai-usage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let profile: any = null;

  try {
    profile = await getProfile();
    const planAtTime = profile?.plan || (profile ? "free" : "unauthenticated");

    if (!profile) {
      await logAIUsage({
        userId: null,
        route: "/api/ai/roast",
        requestType: "resume_roast",
        planAtTime: "unauthenticated",
        status: "blocked_auth",
        httpStatus: 401,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Daily rate limit check to prevent runaway Gemini API billing abuse
    const rateCheck = await checkDailyRateLimit(profile.id);
    if (!rateCheck.success) {
      await logAIUsage({
        userId: profile.id,
        route: "/api/ai/roast",
        requestType: "resume_roast",
        planAtTime,
        status: "blocked_rate_limit",
        httpStatus: 429,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: rateCheck.message }, { status: 429 });
    }

    const { analysisId, resumeText } = await request.json().catch(() => ({}));

    let text = resumeText || "";

    if (analysisId) {
      try {
        const supabase = await createClient();
        const { data: analysis, error } = await supabase
          .from("analyses")
          .select("original_resume_text, optimized_resume_text")
          .eq("id", analysisId)
          .eq("user_id", profile.id)
          .single();

        if (error) {
          console.warn("[api/ai/roast] DB fetch warning:", error.message);
        } else if (analysis) {
          text = analysis.optimized_resume_text || analysis.original_resume_text || "";
        }
      } catch (err) {
        console.warn("[api/ai/roast] DB fetch exception:", err);
      }
    }

    if (!text.trim()) {
      await logAIUsage({
        userId: profile.id,
        route: "/api/ai/roast",
        requestType: "resume_roast",
        planAtTime,
        status: "error",
        httpStatus: 400,
        errorMessage: "No resume content found to roast",
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: "No resume content found to roast" }, { status: 400 });
    }

    const roast = await generateResumeRoast(text);

    await logAIUsage({
      userId: profile.id,
      route: "/api/ai/roast",
      requestType: "resume_roast",
      planAtTime,
      status: "success",
      httpStatus: 200,
      geminiModel: "gemini-2.0-flash",
      estimatedTokens: 600,
      latencyMs: Date.now() - startTime,
    });

    return NextResponse.json(roast);
  } catch (error: any) {
    console.error("Roast error:", error);
    await logAIUsage({
      userId: profile?.id || null,
      route: "/api/ai/roast",
      requestType: "resume_roast",
      planAtTime: profile?.plan || "unknown",
      status: "error",
      httpStatus: 500,
      errorMessage: error?.message || "Internal error",
      latencyMs: Date.now() - startTime,
    });
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
