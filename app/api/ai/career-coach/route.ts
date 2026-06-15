import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { getCareerAdvice } from "@/lib/ai-engine/career-coach";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { query } = await request.json();
    const advice = await getCareerAdvice(profile.id, query);
    return NextResponse.json({ advice });
  } catch (error) {
    console.error("Error in career coach:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
