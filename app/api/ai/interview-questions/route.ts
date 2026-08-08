import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { getOrGenerateQuestions } from "@/lib/interview/getOrGenerateQuestions";
import { checkDailyRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Daily rate limit check
    const rateCheck = await checkDailyRateLimit(profile.id);
    if (!rateCheck.success) {
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
      return NextResponse.json({ error: "Please enter a valid job role or field." }, { status: 400 });
    }

    const { source, questionSet } = await getOrGenerateQuestions({
      targetRole: target_role.trim(),
      seniority,
      companyStyle: company_style,
      previouslyAsked: Array.isArray(previously_asked) ? previously_asked : [],
    });

    return NextResponse.json({
      source,
      ...questionSet,
    });
  } catch (error: any) {
    console.error("[Interview Questions API Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to generate interview question set." }, { status: 500 });
  }
}
