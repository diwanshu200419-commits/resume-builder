import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { canAccessHiringPredictor } from "@/lib/plans";

export async function POST(req: NextRequest) {
  try {
    const profile = await getProfile();

    if (!canAccessHiringPredictor(profile)) {
      return NextResponse.json(
        {
          error: "Upgrade required",
          requiredPlan: "premium",
          message: "Hiring Probability Predictor requires a Premium or Career Pack plan.",
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { atsScore = 85, experienceYears = 4, targetCompany = "Google" } = body;

    // Logistic regression P = 1 / (1 + e^-(beta0 + beta1*S + beta2*E))
    const sTerm = (atsScore - 50) * 0.05;
    const eTerm = Math.min(experienceYears, 10) * 0.2;
    const logit = -1.2 + sTerm + eTerm;
    const probability = Math.round((1 / (1 + Math.exp(-logit))) * 100);

    return NextResponse.json({
      success: true,
      company: targetCompany,
      probability: Math.min(95, Math.max(15, probability)),
      confidence: "High (Heuristic Logistic Regression)",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
