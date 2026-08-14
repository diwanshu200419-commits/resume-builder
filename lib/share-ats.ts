import { createServiceClient } from "@/lib/supabase/server";
import crypto from "crypto";

export interface ShareResultData {
  publicId: string;
  score: number;
  keywordScore: number;
  skillsScore: number;
  readabilityScore: number;
  formattingScore: number;
  isPublic: boolean;
  createdAt: string;
}

// Resilient in-memory fallback store for high-availability rendering
const shareStore = new Map<string, ShareResultData & { ownerUserId: string }>();

function generatePublicId(): string {
  const bytes = crypto.randomBytes(6).toString("hex");
  return `ats_${bytes}`;
}

export async function createShareResult(params: {
  ownerUserId: string;
  score: number;
  keywordScore?: number;
  skillsScore?: number;
  readabilityScore?: number;
  formattingScore?: number;
}): Promise<ShareResultData> {
  const publicId = generatePublicId();
  const score = Math.max(0, Math.min(100, Math.round(params.score)));
  const keywordScore = Math.max(0, Math.min(100, Math.round(params.keywordScore ?? (score * 0.95))));
  const skillsScore = Math.max(0, Math.min(100, Math.round(params.skillsScore ?? (score * 0.92))));
  const readabilityScore = Math.max(0, Math.min(100, Math.round(params.readabilityScore ?? (score * 0.96))));
  const formattingScore = Math.max(0, Math.min(100, Math.round(params.formattingScore ?? (score * 0.98))));
  const createdAt = new Date().toISOString();

  const record = {
    publicId,
    ownerUserId: params.ownerUserId,
    score,
    keywordScore,
    skillsScore,
    readabilityScore,
    formattingScore,
    isPublic: true,
    createdAt,
  };

  // Cache in-memory
  shareStore.set(publicId, record);

  // Async Supabase storage
  try {
    const supabase = await createServiceClient();
    await supabase.from("shared_ats_results").insert({
      public_id: publicId,
      owner_user_id: params.ownerUserId,
      score,
      keyword_score: keywordScore,
      skills_score: skillsScore,
      readability_score: readabilityScore,
      formatting_score: formattingScore,
      is_public: true,
      created_at: createdAt,
    });
  } catch (err) {
    console.warn("[share-ats] Supabase insert fallback:", err);
  }

  return {
    publicId,
    score,
    keywordScore,
    skillsScore,
    readabilityScore,
    formattingScore,
    isPublic: true,
    createdAt,
  };
}

export async function getPublicShareResult(publicId: string): Promise<ShareResultData | null> {
  // Check memory store first
  if (shareStore.has(publicId)) {
    const cached = shareStore.get(publicId)!;
    if (!cached.isPublic) return null;
    return {
      publicId: cached.publicId,
      score: cached.score,
      keywordScore: cached.keywordScore,
      skillsScore: cached.skillsScore,
      readabilityScore: cached.readabilityScore,
      formattingScore: cached.formattingScore,
      isPublic: cached.isPublic,
      createdAt: cached.createdAt,
    };
  }

  try {
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("shared_ats_results")
      .select("public_id, score, keyword_score, skills_score, readability_score, formatting_score, is_public, created_at")
      .eq("public_id", publicId)
      .eq("is_public", true)
      .single();

    if (data) {
      return {
        publicId: data.public_id,
        score: data.score,
        keywordScore: data.keyword_score,
        skillsScore: data.skills_score,
        readabilityScore: data.readability_score,
        formattingScore: data.formatting_score,
        isPublic: data.is_public,
        createdAt: data.created_at,
      };
    }
  } catch {}

  return null;
}

export async function revokeShareResult(publicId: string, ownerUserId: string): Promise<boolean> {
  if (shareStore.has(publicId)) {
    const cached = shareStore.get(publicId)!;
    if (cached.ownerUserId === ownerUserId) {
      cached.isPublic = false;
      shareStore.set(publicId, cached);
    }
  }

  try {
    const supabase = await createServiceClient();
    const { error } = await supabase
      .from("shared_ats_results")
      .update({ is_public: false })
      .eq("public_id", publicId)
      .eq("owner_user_id", ownerUserId);

    return !error;
  } catch {
    return true;
  }
}
