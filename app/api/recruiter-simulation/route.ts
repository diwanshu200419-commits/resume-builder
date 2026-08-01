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
          message: "Recruiter 10-Second Eye-Screening Simulation requires a Premium plan.",
        },
        { status: 403 }
      );
    }

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
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
