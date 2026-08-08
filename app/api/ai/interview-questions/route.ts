import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { generateVayloInterviewQuestions } from "@/lib/gemini";
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
      company_style = "general industry standard",
      seniority = "mid-level",
      previously_asked = [],
    } = body;

    if (!target_role || typeof target_role !== "string" || target_role.trim().length < 2) {
      return NextResponse.json({ error: "Please enter a valid job role or field." }, { status: 400 });
    }

    const result = await generateVayloInterviewQuestions(
      target_role.trim(),
      company_style,
      seniority,
      previously_asked
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[Interview Questions API Error]:", error);
    return NextResponse.json({ error: "Failed to generate interview question set." }, { status: 500 });
  }
}
