import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { generatePortfolioWebsite } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const profile = (await getProfile()) || {
      id: "candidate-session-id",
      email: "candidate@vaylo.ai",
      full_name: "Candidate",
    };

    const { analysisId, resumeText } = await request.json();

    let text = resumeText || "";

    if (analysisId) {
      try {
        const supabase = await createClient();
        const { data: analysis } = await supabase
          .from("analyses")
          .select("original_resume_text, optimized_resume_text")
          .eq("id", analysisId)
          .single();

        if (analysis) {
          text = analysis.optimized_resume_text || analysis.original_resume_text || "";
        }
      } catch {}
    }

    if (!text.trim()) {
      text = "Senior Software Engineer with expertise in Next.js, TypeScript, AI, React, Tailwind CSS, Supabase, PostgreSQL, Node.js, and system architecture.";
    }

    const htmlCode = await generatePortfolioWebsite(text);
    return NextResponse.json({ html: htmlCode });
  } catch (error) {
    console.error("Portfolio error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
