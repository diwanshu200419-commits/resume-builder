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
          message: "Salary Negotiator & Pay Benchmarks require a Premium plan.",
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { jobTitle = "Software Engineer", experience = "3-5", location = "india" } = body;

    const baseInr = 14;
    const topInr = 22;

    return NextResponse.json({
      success: true,
      jobTitle,
      currency: location === "remote" ? "$" : "₹",
      p50: location === "remote" ? "$65,000" : "₹14 LPA",
      p90: location === "remote" ? "$95,000" : "₹22 LPA",
      disclaimer: "Salary ranges are heuristic estimations based on tech industry experience multipliers.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
