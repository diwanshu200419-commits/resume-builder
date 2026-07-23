import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { generatePortfolioWebsite } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { analysisId, resumeText } = await request.json();

    let text = resumeText || "";

    if (analysisId) {
      const supabase = await createClient();
      const { data: analysis } = await supabase
        .from("analyses")
        .select("original_resume_text, optimized_resume_text")
        .eq("id", analysisId)
        .eq("user_id", profile.id)
        .single();

      if (analysis) {
        text = analysis.optimized_resume_text || analysis.original_resume_text || "";
      }
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "No resume content found to build portfolio" }, { status: 400 });
    }

    const htmlCode = await generatePortfolioWebsite(text);
    return NextResponse.json({ html: htmlCode });
  } catch (error) {
    console.error("Portfolio error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
