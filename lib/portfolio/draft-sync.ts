// lib/portfolio/draft-sync.ts
//
// Vaylo AI — Persistent Portfolio Draft & Cloud Autosave Engine
// Handles Supabase debounced autosave, one-time localStorage migration, and multi-device draft continuity.

import { PortfolioData } from "../portfolio-templates";

export interface PersistedPortfolioDraft {
  id: string;
  user_id: string;
  draft_data: PortfolioData;
  updated_at: string;
}

/**
 * One-time migration of local portfolio draft to Supabase for authenticated users
 */
export async function migrateLocalPortfolioDraftIfNeeded(
  supabase: any,
  userId: string
): Promise<boolean> {
  if (typeof window === "undefined" || !userId) return false;

  try {
    const localRaw = localStorage.getItem("vaylo_portfolio_draft");
    if (!localRaw) return false;

    const parsed: PortfolioData = JSON.parse(localRaw);
    if (!parsed || !parsed.name) {
      localStorage.removeItem("vaylo_portfolio_draft");
      return false;
    }

    // Check if cloud draft already exists for this user
    const { data: existingDraft } = await supabase
      .from("portfolio_drafts")
      .select("id, updated_at")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingDraft) {
      // Cloud draft already exists; keep Supabase as source of truth and clear local copy
      console.log("[Portfolio Sync] Cloud draft already exists. Clearing local draft.");
      localStorage.removeItem("vaylo_portfolio_draft");
      return true;
    }

    // Insert local draft to Supabase
    const { error: insertErr } = await supabase
      .from("portfolio_drafts")
      .upsert({
        user_id: userId,
        draft_data: parsed,
        updated_at: new Date().toISOString(),
      });

    if (insertErr) {
      console.warn("[Portfolio Sync] Failed to migrate draft to Supabase:", insertErr.message);
      return false;
    }

    console.log("[Portfolio Sync] Successfully migrated local portfolio draft to Supabase.");
    localStorage.removeItem("vaylo_portfolio_draft");
    return true;
  } catch (err) {
    console.warn("[Portfolio Sync] Migration error:", err);
    return false;
  }
}

/**
 * Loads the active portfolio draft from Supabase with localStorage write-through fallback
 */
export async function loadPortfolioDraft(
  supabase: any,
  userId: string | null
): Promise<PortfolioData | null> {
  // If user is not authenticated, fallback to local storage
  if (!userId) {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("vaylo_portfolio_draft");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  try {
    const { data, error } = await supabase
      .from("portfolio_drafts")
      .select("draft_data, updated_at")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data?.draft_data) {
      // Fallback to local storage if present
      const raw = typeof window !== "undefined" ? localStorage.getItem("vaylo_portfolio_draft") : null;
      return raw ? JSON.parse(raw) : null;
    }

    return data.draft_data as PortfolioData;
  } catch (err) {
    console.warn("[Portfolio Sync] Error loading draft from Supabase:", err);
    const raw = typeof window !== "undefined" ? localStorage.getItem("vaylo_portfolio_draft") : null;
    return raw ? JSON.parse(raw) : null;
  }
}

/**
 * Saves or autosaves portfolio draft to Supabase with write-through local resilience
 */
export async function savePortfolioDraftToCloud(
  supabase: any,
  userId: string | null,
  draftData: PortfolioData
): Promise<{ success: boolean; source: "supabase" | "local_fallback" }> {
  // Write-through local cache for resilience during editing
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("vaylo_portfolio_draft", JSON.stringify(draftData));
    } catch (e) {
      console.warn("Local draft write error:", e);
    }
  }

  if (!userId) {
    return { success: true, source: "local_fallback" };
  }

  try {
    const { error } = await supabase
      .from("portfolio_drafts")
      .upsert(
        {
          user_id: userId,
          draft_data: draftData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.warn("[Portfolio Sync] Failed to autosave to Supabase:", error.message);
      return { success: false, source: "local_fallback" };
    }

    return { success: true, source: "supabase" };
  } catch (err) {
    console.error("[Portfolio Sync] Unexpected error autosaving draft:", err);
    return { success: false, source: "local_fallback" };
  }
}
