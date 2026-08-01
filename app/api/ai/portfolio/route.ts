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

    const { analysisId, resumeText } = await request.json().catch(() => ({}));

    let text = resumeText || "";

    if (analysisId) {
      try {
        const supabase = await createClient();
        const { data: analysis, error } = await supabase
          .from("analyses")
          .select("original_resume_text, optimized_resume_text")
          .eq("id", analysisId)
          .single();

        if (error) {
          console.warn("[api/ai/portfolio] analysis fetch warning:", error.message);
        } else if (analysis) {
          text = analysis.optimized_resume_text || analysis.original_resume_text || "";
        }
      } catch (err) {
        console.warn("[api/ai/portfolio] analysis fetch exception:", err);
      }
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
