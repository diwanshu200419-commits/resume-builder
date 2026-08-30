import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { canAccessTranslator } from "@/lib/plans";
import { logAIUsage } from "@/lib/logging/ai-usage";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let profile: any = null;

  try {
    profile = await getProfile();
    const planAtTime = profile?.plan || (profile ? "free" : "unauthenticated");

    if (!canAccessTranslator(profile)) {
      const httpStatus = profile ? 403 : 401;
      await logAIUsage({
        userId: profile?.id || null,
        route: "/api/translate",
        requestType: "translate",
        planAtTime,
        status: profile ? "blocked_plan" : "blocked_auth",
        httpStatus,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json(
        {
          error: "Upgrade required",
          requiredPlan: "pro",
          message: "Multi-Language Resume Translator requires a Pro, Premium, or Career Pack plan.",
        },
        { status: httpStatus }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { targetLanguage = "German", resumeText = "" } = body;

    await logAIUsage({
      userId: profile.id,
      route: "/api/translate",
      requestType: "translate",
      planAtTime,
      status: "success",
      httpStatus: 200,
      geminiModel: "gemini-2.0-flash",
      estimatedTokens: Math.max(100, Math.round((resumeText.length || 200) / 4)),
      latencyMs: Date.now() - startTime,
    });

    return NextResponse.json({
      success: true,
      targetLanguage,
      translatedText: `[Translated Resume in ${targetLanguage}]\n${resumeText || "Optimized Resume Content"}`,
    });
  } catch (error: any) {
    await logAIUsage({
      userId: profile?.id || null,
      route: "/api/translate",
      requestType: "translate",
      planAtTime: profile?.plan || "unknown",
      status: "error",
      httpStatus: 500,
      errorMessage: error?.message || "Internal error",
      latencyMs: Date.now() - startTime,
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
