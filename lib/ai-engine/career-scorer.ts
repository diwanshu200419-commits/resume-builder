import { createClient as createSupabaseClient, createServiceClient } from "@/lib/supabase/server";
import { getCareerProfile } from "./career-memory";

export interface CareerScoreBreakdown {
  overall_score: number;
  resume_score: number;
  skills_score: number;
  projects_score: number;
  experience_score: number;
  linkedin_score: number;
}

export async function calculateCareerScore(userId: string): Promise<CareerScoreBreakdown> {
  const profile = await getCareerProfile(userId);
  const supabase = await createSupabaseClient();

  // 1. Resume Score (30%) - Based on latest ATS analysis
  const { data: latestAnalysis } = await supabase
    .from("analyses")
    .select("optimized_ats_score, original_ats_score")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const resume_score = latestAnalysis?.optimized_ats_score || latestAnalysis?.original_ats_score || 50;

  // 2. Skills Score (25%) - Based on career profile skills
  const skillsCount = Array.isArray(profile?.skills) ? profile.skills.length : 0;
  const skills_score = Math.min(100, (skillsCount / 10) * 100);

  // 3. Projects Score (20%) - Based on projects in learning history
  const projectsCount = Array.isArray(profile?.learning_history) ? profile.learning_history.length : 0;
  const projects_score = Math.min(100, (projectsCount / 5) * 100);

  // 4. Experience Score (15%) - Based on experience level
  let experience_score = 60;
  if (profile?.experience_level === "mid") experience_score = 80;
  if (profile?.experience_level === "senior") experience_score = 95;

  // 5. LinkedIn Score (10%) - Default 70 if profile exists
  const linkedin_score = profile?.industry ? 80 : 50;

  // Final Weighted Calculation
  const overall_score = Math.round(
    resume_score * 0.30 +
    skills_score * 0.25 +
    projects_score * 0.20 +
    experience_score * 0.15 +
    linkedin_score * 0.10
  );

  return {
    overall_score,
    resume_score,
    skills_score,
    projects_score,
    experience_score,
    linkedin_score,
  };
}

export async function saveMonthlyScore(userId: string, breakdown: CareerScoreBreakdown) {
  try {
    const serviceSupabase = await createServiceClient();
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM

    const { error } = await serviceSupabase.from("career_scores").upsert({
      user_id: userId,
      month,
      ...breakdown,
      created_at: new Date().toISOString(),
    }, { onConflict: "user_id,month" });

    if (error) {
      console.warn("Could not save monthly score (table career_scores might be missing):", error.message);
    }
  } catch (err: any) {
    console.warn("Error in saveMonthlyScore:", err.message);
  }
}
