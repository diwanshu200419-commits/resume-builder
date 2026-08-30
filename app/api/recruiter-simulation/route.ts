import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { canAccessRecruiterSim } from "@/lib/plans";
import { logAIUsage } from "@/lib/logging/ai-usage";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let profile: any = null;

  try {
    profile = await getProfile();
    const planAtTime = profile?.plan || (profile ? "free" : "unauthenticated");

    if (!canAccessRecruiterSim(profile)) {
      const httpStatus = profile ? 403 : 401;
      await logAIUsage({
        userId: profile?.id || null,
        route: "/api/recruiter-simulation",
        requestType: "recruiter_simulation",
        planAtTime,
        status: profile ? "blocked_plan" : "blocked_auth",
        httpStatus,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json(
        {
          error: "Upgrade required",
          requiredPlan: "premium",
          message: "Recruiter 10-Second Eye-Screening Simulation requires a Premium or Career Pack plan.",
        },
        { status: httpStatus }
      );
    }

    await logAIUsage({
      userId: profile.id,
      route: "/api/recruiter-simulation",
      requestType: "recruiter_simulation",
      planAtTime,
      status: "success",
      httpStatus: 200,
      geminiModel: "recruiter-fixation-engine",
      estimatedTokens: 0,
      latencyMs: Date.now() - startTime,
    });

    return NextResponse.json({
      success: true,
      verdict: "YES",
      score: 92,
      focalPoints: [
        { label: "Candidate Name & Target Role", score: 95 },
        { label: "Quantified Accomplishments", score: 90 },
        { label: "Technical Skills Matrix", score: 92 },
      ],
    });
  } catch (error: any) {
    await logAIUsage({
      userId: profile?.id || null,
      route: "/api/recruiter-simulation",
      requestType: "recruiter_simulation",
      planAtTime: profile?.plan || "unknown",
      status: "error",
      httpStatus: 500,
      errorMessage: error?.message || "Internal error",
      latencyMs: Date.now() - startTime,
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
