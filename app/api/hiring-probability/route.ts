import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { canAccessHiringPredictor } from "@/lib/plans";
import { logAIUsage } from "@/lib/logging/ai-usage";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let profile: any = null;

  try {
    profile = await getProfile();
    const planAtTime = profile?.plan || (profile ? "free" : "unauthenticated");

    if (!canAccessHiringPredictor(profile)) {
      const httpStatus = profile ? 403 : 401;
      await logAIUsage({
        userId: profile?.id || null,
        route: "/api/hiring-probability",
        requestType: "hiring_readiness",
        planAtTime,
        status: profile ? "blocked_plan" : "blocked_auth",
        httpStatus,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json(
        {
          error: "Upgrade required",
          requiredPlan: "premium",
          message: "Hiring Probability Predictor requires a Premium or Career Pack plan.",
        },
        { status: httpStatus }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { atsScore = 85, experienceYears = 4, targetCompany = "Google" } = body;

    // Logistic regression P = 1 / (1 + e^-(beta0 + beta1*S + beta2*E))
    const sTerm = (atsScore - 50) * 0.05;
    const eTerm = Math.min(experienceYears, 10) * 0.2;
    const logit = -1.2 + sTerm + eTerm;
    const probability = Math.round((1 / (1 + Math.exp(-logit))) * 100);

    await logAIUsage({
      userId: profile.id,
      route: "/api/hiring-probability",
      requestType: "hiring_readiness",
      planAtTime,
      status: "success",
      httpStatus: 200,
      geminiModel: "logistic-regression-engine",
      estimatedTokens: 0,
      latencyMs: Date.now() - startTime,
    });

    return NextResponse.json({
      success: true,
      company: targetCompany,
      probability: Math.min(95, Math.max(15, probability)),
      confidence: "High (Heuristic Logistic Regression)",
    });
  } catch (error: any) {
    await logAIUsage({
      userId: profile?.id || null,
      route: "/api/hiring-probability",
      requestType: "hiring_readiness",
      planAtTime: profile?.plan || "unknown",
      status: "error",
      httpStatus: 500,
      errorMessage: error?.message || "Internal error",
      latencyMs: Date.now() - startTime,
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
