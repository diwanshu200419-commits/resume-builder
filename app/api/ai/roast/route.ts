import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { generateResumeRoast } from "@/lib/gemini";
import { checkDailyRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Daily rate limit check to prevent runaway Gemini API billing abuse
    const rateCheck = await checkDailyRateLimit(profile.id);
    if (!rateCheck.success) {
      return NextResponse.json({ error: rateCheck.message }, { status: 429 });
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
          .eq("user_id", profile.id)
          .single();

        if (error) {
          console.warn("[api/ai/roast] DB fetch warning:", error.message);
        } else if (analysis) {
          text = analysis.optimized_resume_text || analysis.original_resume_text || "";
        }
      } catch (err) {
        console.warn("[api/ai/roast] DB fetch exception:", err);
      }
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "No resume content found to roast" }, { status: 400 });
    }

    const roast = await generateResumeRoast(text);
    return NextResponse.json(roast);
  } catch (error) {
    console.error("Roast error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
