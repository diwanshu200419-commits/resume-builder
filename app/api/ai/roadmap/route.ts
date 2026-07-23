import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { generateCareerRoadmap } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentSkills, targetRole, dreamCompany, experienceLevel } = await request.json();

    if (!targetRole || !dreamCompany) {
      return NextResponse.json({ error: "Target role and dream company are required" }, { status: 400 });
    }

    const roadmap = await generateCareerRoadmap(
      currentSkills || "Basic coding",
      targetRole,
      dreamCompany,
      experienceLevel || "Entry Level"
    );

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("Roadmap error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
