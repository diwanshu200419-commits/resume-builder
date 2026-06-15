import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { calculateCareerScore, saveMonthlyScore } from "@/lib/ai-engine/career-scorer";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentScore = await calculateCareerScore(profile.id);
    await saveMonthlyScore(profile.id, currentScore);

    const supabase = await createSupabaseClient();
    
    // Get history for growth comparison
    const { data: history } = await supabase
      .from("career_scores")
      .select("*")
      .eq("user_id", profile.id)
      .order("month", { ascending: false })
      .limit(2);

    const previousMonth = history?.[1];
    const growth = previousMonth 
      ? currentScore.overall_score - previousMonth.overall_score
      : 0;

    return NextResponse.json({
      current: currentScore,
      previous: previousMonth,
      growth: `${growth > 0 ? "+" : ""}${growth}%`,
      month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      next_goals: [
        "Improve TypeScript proficiency",
        "Add 2 more projects to portfolio",
        "Optimize LinkedIn headline"
      ]
    });
  } catch (error) {
    console.error("Error in monthly report:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
