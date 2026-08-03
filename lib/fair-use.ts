try {
  require("server-only");
} catch {}
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

// In-Memory Daily Usage Fallback
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
  const resetAt = "00:00 UTC";
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD UTC

  // If feature limit is 0 for this tier
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

  let allowed = false;
  let currentUsage = 0;
  let remaining = 0;
  const memoryKey = getUsageKey(userId, featureKey, todayStr);

  try {
    const supabase = await createServiceClient();

    // Call atomic Postgres RPC consume_feature_usage (revoked from client, executable by service_role only)
    const { data, error } = await supabase.rpc("consume_feature_usage", {
      p_user_id: userId,
      p_feature_key: featureKey,
      p_daily_limit: limit,
    });

    if (!error && data && data.length > 0) {
      allowed = data[0].allowed;
      currentUsage = data[0].current_count;
      remaining = data[0].remaining;
    } else {
      // Memory fallback if RPC is unpopulated in local dev environment
      const memCount = inMemoryDailyUsage.get(memoryKey) || 0;
      if (memCount < limit) {
        allowed = true;
        currentUsage = memCount + 1;
        remaining = Math.max(0, limit - currentUsage);
        inMemoryDailyUsage.set(memoryKey, currentUsage);
      } else {
        allowed = false;
        currentUsage = memCount;
        remaining = 0;
      }
    }
  } catch (err) {
    const memCount = inMemoryDailyUsage.get(memoryKey) || 0;
    if (memCount < limit) {
      allowed = true;
      currentUsage = memCount + 1;
      remaining = Math.max(0, limit - currentUsage);
      inMemoryDailyUsage.set(memoryKey, currentUsage);
    } else {
      allowed = false;
      currentUsage = memCount;
      remaining = 0;
    }
  }

  if (!allowed) {
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

  return {
    allowed: true,
    limit,
    currentUsage,
    remaining,
    resetAt,
  };
}

/**
 * Refund AI Quota if Gemini call fails, times out, or errors.
 */
export async function refundFairUse(userId: string, featureKey: string): Promise<void> {
  const todayStr = new Date().toISOString().split("T")[0];
  const memoryKey = getUsageKey(userId, featureKey, todayStr);

  // Decrement memory fallback
  const memCount = inMemoryDailyUsage.get(memoryKey) || 0;
  if (memCount > 0) {
    inMemoryDailyUsage.set(memoryKey, memCount - 1);
  }

  try {
    const supabase = await createServiceClient();
    await supabase.rpc("refund_feature_usage", {
      p_user_id: userId,
      p_feature_key: featureKey,
    });
  } catch (err) {
    console.error("Fair-use refund failed:", err);
  }
}
