import "server-only";
import { PLAN_CONFIG, PlanType } from "@/lib/plans";
import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export interface FairUseCheckResult {
  allowed: boolean;
  limit: number;
  currentUsage: number;
  remaining: number;
  resetAt: string;
  errorResponse?: NextResponse;
}

// Memory fallback store for high availability if DB table is unpopulated
const inMemoryDailyUsage = new Map<string, number>();

function getUsageKey(userId: string, featureKey: string, dateStr: string): string {
  return `${userId}:${featureKey}:${dateStr}`;
}

export async function checkAndConsumeFairUse(
  userId: string,
  userPlan: PlanType,
  featureKey: string
): Promise<FairUseCheckResult> {
  const planConfig = PLAN_CONFIG[userPlan] || PLAN_CONFIG.free;
  const limit = planConfig.limits[featureKey] ?? 10;

  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD UTC
  const resetAt = "00:00 UTC";

  // If feature limit is 0 (unsupported on this plan tier)
  if (limit === 0 && userPlan !== "career_pack") {
    return {
      allowed: false,
      limit: 0,
      currentUsage: 0,
      remaining: 0,
      resetAt,
      errorResponse: NextResponse.json(
        {
          error: "FEATURE_NOT_INCLUDED",
          feature: featureKey,
          message: `The ${featureKey} feature is not included in your current plan (${userPlan.toUpperCase()}). Please upgrade to access this feature.`,
        },
        { status: 403 }
      ),
    };
  }

  let currentUsage = 0;
  const memoryKey = getUsageKey(userId, featureKey, todayStr);

  try {
    const supabase = await createServiceClient();

    // Query daily usage from ai_usage_logs for today
    const startOfDay = `${todayStr}T00:00:00.000Z`;
    const { count, error } = await supabase
      .from("ai_usage_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("feature", featureKey)
      .gte("created_at", startOfDay);

    if (!error && count !== null) {
      currentUsage = count;
    } else {
      currentUsage = inMemoryDailyUsage.get(memoryKey) || 0;
    }
  } catch (err) {
    currentUsage = inMemoryDailyUsage.get(memoryKey) || 0;
  }

  if (currentUsage >= limit) {
    const isLifetime = userPlan === "career_pack";
    return {
      allowed: false,
      limit,
      currentUsage,
      remaining: 0,
      resetAt,
      errorResponse: NextResponse.json(
        {
          error: "FAIR_USE_LIMIT_REACHED",
          feature: featureKey,
          limit,
          remaining: 0,
          resetAt,
          isLifetimeOwner: isLifetime,
          message: isLifetime
            ? `You've reached today's fair-use limit for this AI feature (${currentUsage}/${limit}). Your lifetime access remains active. Usage resets at ${resetAt}.`
            : `You've reached today's AI usage limit (${currentUsage}/${limit}). Usage resets at ${resetAt}.`,
        },
        { status: 429 }
      ),
    };
  }

  // Increment memory counter as backup
  inMemoryDailyUsage.set(memoryKey, currentUsage + 1);

  return {
    allowed: true,
    limit,
    currentUsage: currentUsage + 1,
    remaining: Math.max(0, limit - (currentUsage + 1)),
    resetAt,
  };
}
