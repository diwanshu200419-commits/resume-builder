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
          message: "Personal Branding Studio requires a Premium plan.",
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { name = "Software Engineer", skills = [] } = body;

    return NextResponse.json({
      success: true,
      readmeMarkdown: `# Hi, I'm ${name} 👋\n\n### 🚀 Full Stack & AI Specialist\n- 🔭 Working on high-throughput microservices\n- 🌱 Tech Stack: ${skills.join(", ") || "TypeScript, React, Python"}`,
      bioSummary: `Results-driven software engineer building modern web applications.`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
