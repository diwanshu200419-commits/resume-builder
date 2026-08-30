import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { generateCareerRoadmap } from "@/lib/gemini";
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
        route: "/api/ai/roadmap",
        requestType: "career_roadmap",
        planAtTime: "unauthenticated",
        status: "blocked_auth",
        httpStatus: 401,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentSkills, targetRole, dreamCompany, experienceLevel } = await request.json().catch(() => ({}));

    if (!targetRole || !dreamCompany) {
      await logAIUsage({
        userId: profile.id,
        route: "/api/ai/roadmap",
        requestType: "career_roadmap",
        planAtTime,
        status: "error",
        httpStatus: 400,
        errorMessage: "Target role and dream company are required",
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: "Target role and dream company are required" }, { status: 400 });
    }

    const roadmap = await generateCareerRoadmap(
      currentSkills || "Basic coding",
      targetRole,
      dreamCompany,
      experienceLevel || "Entry Level"
    );

    await logAIUsage({
      userId: profile.id,
      route: "/api/ai/roadmap",
      requestType: "career_roadmap",
      planAtTime,
      status: "success",
      httpStatus: 200,
      geminiModel: "gemini-2.0-flash",
      estimatedTokens: 900,
      latencyMs: Date.now() - startTime,
    });

    return NextResponse.json(roadmap);
  } catch (error: any) {
    console.error("Roadmap error:", error);
    await logAIUsage({
      userId: profile?.id || null,
      route: "/api/ai/roadmap",
      requestType: "career_roadmap",
      planAtTime: profile?.plan || "unknown",
      status: "error",
      httpStatus: 500,
      errorMessage: error?.message || "Internal error",
      latencyMs: Date.now() - startTime,
    });
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
