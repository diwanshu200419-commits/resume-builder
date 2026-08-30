import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { getOrGenerateQuestions } from "@/lib/interview/getOrGenerateQuestions";
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
        route: "/api/ai/interview-questions",
        requestType: "interview_questions",
        planAtTime: "unauthenticated",
        status: "blocked_auth",
        httpStatus: 401,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Daily rate limit check
    const rateCheck = await checkDailyRateLimit(profile.id);
    if (!rateCheck.success) {
      await logAIUsage({
        userId: profile.id,
        route: "/api/ai/interview-questions",
        requestType: "interview_questions",
        planAtTime,
        status: "blocked_rate_limit",
        httpStatus: 429,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: rateCheck.message }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const {
      target_role,
      company_style = null,
      seniority = "mid-level",
      previously_asked = [],
    } = body;

    if (!target_role || typeof target_role !== "string" || target_role.trim().length < 2) {
      await logAIUsage({
        userId: profile.id,
        route: "/api/ai/interview-questions",
        requestType: "interview_questions",
        planAtTime,
        status: "error",
        httpStatus: 400,
        errorMessage: "Invalid job role",
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: "Please enter a valid job role or field." }, { status: 400 });
    }

    const { source, questionSet } = await getOrGenerateQuestions({
      targetRole: target_role.trim(),
      seniority,
      companyStyle: company_style,
      previouslyAsked: Array.isArray(previously_asked) ? previously_asked : [],
    });

    await logAIUsage({
      userId: profile.id,
      route: "/api/ai/interview-questions",
      requestType: "interview_questions",
      planAtTime,
      status: "success",
      httpStatus: 200,
      geminiModel: source === "cache" ? "cache-hit" : "gemini-2.0-flash",
      estimatedTokens: source === "cache" ? 0 : 800,
      latencyMs: Date.now() - startTime,
    });

    return NextResponse.json({
      source,
      ...questionSet,
    });
  } catch (error: any) {
    console.error("[Interview Questions API Error]:", error);
    await logAIUsage({
      userId: profile?.id || null,
      route: "/api/ai/interview-questions",
      requestType: "interview_questions",
      planAtTime: profile?.plan || "unknown",
      status: "error",
      httpStatus: 500,
      errorMessage: error?.message || "Internal error",
      latencyMs: Date.now() - startTime,
    });
    return NextResponse.json({ error: error.message || "Failed to generate interview question set." }, { status: 500 });
  }
}
