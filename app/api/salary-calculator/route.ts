import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { canAccessSalaryNegotiator } from "@/lib/plans";
import { logAIUsage } from "@/lib/logging/ai-usage";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let profile: any = null;

  try {
    profile = await getProfile();
    const planAtTime = profile?.plan || (profile ? "free" : "unauthenticated");

    if (!canAccessSalaryNegotiator(profile)) {
      const httpStatus = profile ? 403 : 401;
      await logAIUsage({
        userId: profile?.id || null,
        route: "/api/salary-calculator",
        requestType: "salary_analysis",
        planAtTime,
        status: profile ? "blocked_plan" : "blocked_auth",
        httpStatus,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json(
        {
          error: "Upgrade required",
          requiredPlan: "premium",
          message: "Salary Negotiator & Pay Benchmarks require a Premium or Career Pack plan.",
        },
        { status: httpStatus }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { jobTitle = "Software Engineer", experience = "3-5", location = "india" } = body;

    await logAIUsage({
      userId: profile.id,
      route: "/api/salary-calculator",
      requestType: "salary_analysis",
      planAtTime,
      status: "success",
      httpStatus: 200,
      geminiModel: "salary-heuristics-engine",
      estimatedTokens: 0,
      latencyMs: Date.now() - startTime,
    });

    return NextResponse.json({
      success: true,
      jobTitle,
      currency: location === "remote" ? "$" : "₹",
      p50: location === "remote" ? "$65,000" : "₹14 LPA",
      p90: location === "remote" ? "$95,000" : "₹22 LPA",
      disclaimer: "Salary ranges are heuristic estimations based on tech industry experience multipliers.",
    });
  } catch (error: any) {
    await logAIUsage({
      userId: profile?.id || null,
      route: "/api/salary-calculator",
      requestType: "salary_analysis",
      planAtTime: profile?.plan || "unknown",
      status: "error",
      httpStatus: 500,
      errorMessage: error?.message || "Internal error",
      latencyMs: Date.now() - startTime,
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
