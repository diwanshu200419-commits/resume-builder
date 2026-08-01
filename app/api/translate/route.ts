import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { getEffectivePlan } from "@/lib/plans";

export async function POST(req: NextRequest) {
  try {
    const profile = await getProfile();
    const plan = getEffectivePlan(profile);

    if (plan === "free") {
      return NextResponse.json(
        {
          error: "Upgrade required",
          requiredPlan: "premium",
          message: "Multi-Language Resume Translator requires a Premium plan.",
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { targetLanguage = "German", resumeText = "" } = body;

    return NextResponse.json({
      success: true,
      targetLanguage,
      translatedText: `[Translated Resume in ${targetLanguage}]\n${resumeText || "Optimized Resume Content"}`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
