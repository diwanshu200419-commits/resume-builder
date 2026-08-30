// lib/interview/history-sync.ts
//
// Vaylo AI — Persistent Interview History & Cloud Sync Engine
// Handles Supabase persistence, one-time localStorage migration, write-through caching, and cross-device sync.

// Types only
export interface PersistedInterviewSession {
  id: string;
  user_id?: string;
  role: string;
  seniority?: string;
  company_style?: string;
  persona_id: string;
  questions: any[];
  star_scores: any[];
  overall_score: number;
  filler_word_density: number;
  speaking_pace_wpm: number;
  webcam_metrics?: any | null;
  completed: boolean;
  created_at: string;
}

export interface SessionPersistPayload {
  id?: string;
  role: string;
  seniority?: string;
  companyStyle?: string;
  personaId: string;
  turns: any[];
  questionReviews: any[];
  overallScore: number;
  fillerWordDensity: number;
  speakingPaceWpm: number;
  webcamMetrics?: any | null;
  completed: boolean;
}

/**
 * Maps an existing legacy localStorage entry to the canonical Supabase schema
 */
export function mapLegacySessionToSchema(s: any, userId: string): Partial<PersistedInterviewSession> {
  const persona = s.personaName ? { id: s.personaStyle ? `${s.personaName.toLowerCase()}_${s.personaStyle.toLowerCase()}` : "josh_neutral" } : { id: "josh_neutral" };

  return {
    user_id: userId,
    role: s.role || "General Role",
    seniority: s.seniority || "mid-level",
    company_style: s.companyStyle || "Standard",
    persona_id: s.personaId || persona.id || "josh_neutral",
    questions: s.questions || [],
    star_scores: s.star_scores || [],
    overall_score: Number(s.overallScore || s.overall_score || 70),
    filler_word_density: Number(s.fillerWordDensity || s.filler_word_density || 2),
    speaking_pace_wpm: Number(s.speakingPaceWpm || s.speaking_pace_wpm || 140),
    webcam_metrics: s.gazePercent != null ? { gazeOnCameraPercent: s.gazePercent, postureStabilityPercent: s.posturePercent } : s.webcam_metrics || null,
    completed: s.completed !== undefined ? Boolean(s.completed) : true,
    created_at: s.created_at || (s.date ? new Date(s.date).toISOString() : new Date().toISOString()),
  };
}

/**
 * One-time migration for legacy localStorage interview history
 * If Supabase already contains records for this user, keeps Supabase as truth and clears stale local copy.
 */
export async function migrateLocalHistoryIfNeeded(supabase: any, userId: string): Promise<boolean> {
  if (typeof window === "undefined" || !userId) return false;

  try {
    const localRaw = localStorage.getItem("vaylo_interview_history");
    if (!localRaw) return false;

    let parsed = JSON.parse(localRaw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.removeItem("vaylo_interview_history");
      return false;
    }

    // Check if user already has rows in Supabase
    const { count, error: countErr } = await supabase
      .from("interview_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countErr) {
      console.warn("[History Sync] Supabase check error:", countErr.message);
      return false;
    }

    if (count && count > 0) {
      // Supabase already has data for this user; clear local copy without overwriting
      console.log("[History Sync] Supabase already contains interview records for user. Clearing local cache.");
      localStorage.removeItem("vaylo_interview_history");
      return true;
    }

    // Migrate all local rows to Supabase
    const rows = parsed.map((s: any) => mapLegacySessionToSchema(s, userId));
    const { error: insertErr } = await supabase
      .from("interview_sessions")
      .insert(rows);

    if (insertErr) {
      console.warn("[History Sync] Migration insert failed:", insertErr.message);
      return false;
    }

    console.log(`[History Sync] Successfully migrated ${rows.length} interview sessions to Supabase.`);
    localStorage.removeItem("vaylo_interview_history");
    return true;
  } catch (err) {
    console.warn("[History Sync] Migration error:", err);
    return false;
  }
}

/**
 * Persists an active or completed interview session to Supabase with write-through local resilience
 */
export async function saveInterviewSessionToCloud(
  supabase: any,
  userId: string | null,
  payload: SessionPersistPayload
): Promise<{ success: boolean; id?: string; source: "supabase" | "local_fallback" }> {
  // Temporary write-through cache for active session resilience
  if (typeof window !== "undefined") {
    try {
      const existingRaw = localStorage.getItem("vaylo_interview_history");
      const history = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [
        {
          id: payload.id || `sess-${Date.now()}`,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          role: payload.role,
          seniority: payload.seniority,
          personaId: payload.personaId,
          personaName: payload.personaId.split("_")[0] ? payload.personaId.split("_")[0].charAt(0).toUpperCase() + payload.personaId.split("_")[0].slice(1) : "Josh",
          personaStyle: payload.personaId.split("_")[1] || "neutral",
          overallScore: payload.overallScore,
          questionsCount: payload.questionReviews.length,
          fillerWordDensity: payload.fillerWordDensity,
          speakingPaceWpm: payload.speakingPaceWpm,
          gazePercent: payload.webcamMetrics?.enabled ? payload.webcamMetrics.gazeOnCameraPercent : null,
          posturePercent: payload.webcamMetrics?.enabled ? payload.webcamMetrics.postureStabilityPercent : null,
          completed: payload.completed,
        },
        ...history.filter((h: any) => h.id !== payload.id),
      ];
      localStorage.setItem("vaylo_interview_history", JSON.stringify(updated.slice(0, 30)));
    } catch (e) {
      console.warn("Failed local write-through caching", e);
    }
  }

  // If user is not logged in, local storage is the only available tier
  if (!userId) {
    return { success: true, id: payload.id, source: "local_fallback" };
  }

  // Persist directly to Supabase
  try {
    const row = {
      user_id: userId,
      role: payload.role,
      seniority: payload.seniority || "mid-level",
      company_style: payload.companyStyle || "Standard",
      persona_id: payload.personaId,
      questions: payload.turns.map((t) => ({
        id: t.questionId,
        type: t.questionType,
        question: t.question,
        candidateAnswer: t.candidateAnswer,
        followUpQuestion: t.followUpQuestion || null,
        followUpAnswer: t.followUpAnswer || null,
      })),
      star_scores: payload.questionReviews,
      overall_score: payload.overallScore,
      filler_word_density: payload.fillerWordDensity,
      speaking_pace_wpm: payload.speakingPaceWpm,
      webcam_metrics: payload.webcamMetrics ? {
        enabled: payload.webcamMetrics.enabled,
        gazeOnCameraPercent: payload.webcamMetrics.gazeOnCameraPercent,
        postureStabilityPercent: payload.webcamMetrics.postureStabilityPercent,
      } : null,
      completed: payload.completed,
    };

    const { data, error } = await supabase
      .from("interview_sessions")
      .insert([row])
      .select("id")
      .single();

    if (error) {
      console.warn("[History Sync] Failed to write session to Supabase:", error.message);
      return { success: false, source: "local_fallback" };
    }

    return { success: true, id: data?.id, source: "supabase" };
  } catch (err) {
    console.error("[History Sync] Unexpected error persisting to Supabase:", err);
    return { success: false, source: "local_fallback" };
  }
}

/**
 * Reads all historical sessions from Supabase for the current user
 */
export async function loadInterviewSessionHistory(
  supabase: any,
  userId: string | null
): Promise<PersistedInterviewSession[]> {
  if (!userId) {
    // Fallback to local storage if user is not authenticated
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("vaylo_interview_history");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map((p) => mapLegacySessionToSchema(p, "anonymous") as PersistedInterviewSession) : [];
    } catch {
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.warn("[History Sync] Could not fetch sessions from Supabase:", error.message);
      // Fallback to local storage
      const raw = typeof window !== "undefined" ? localStorage.getItem("vaylo_interview_history") : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.map((p) => mapLegacySessionToSchema(p, userId) as PersistedInterviewSession) : [];
      }
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("[History Sync] Error loading sessions:", err);
    return [];
  }
}

/**
 * Clears interview history from Supabase for the current user
 */
export async function clearInterviewSessionHistory(
  supabase: any,
  userId: string | null
): Promise<boolean> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("vaylo_interview_history");
  }

  if (!userId) return true;

  try {
    const { error } = await supabase
      .from("interview_sessions")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.warn("[History Sync] Could not delete sessions from Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[History Sync] Error clearing history:", err);
    return false;
  }
}
