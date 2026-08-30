// lib/logging/ai-usage.ts
//
// Vaylo AI — Centralized AI Usage & Observability Logger
// Logs every AI-powered request (both successful generations and blocked/rejected attempts).

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export interface LogAIUsageParams {
  userId?: string | null;
  route: string;
  requestType?: string;
  planAtTime?: string;
  status: "success" | "blocked_auth" | "blocked_plan" | "blocked_rate_limit" | "error";
  httpStatus: number;
  geminiModel?: string;
  estimatedTokens?: number;
  ipAddress?: string;
  errorMessage?: string;
  latencyMs?: number;
}

function getServiceRoleKey(): string {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
  // Local/script fallback
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const env = fs.readFileSync(envPath, "utf8");
      const match = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
      if (match && match[1]) return match[1].trim();
    }
  } catch {}
  return "";
}

function getServiceClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ofirvweirnjgsyyedkci.supabase.co";
  const serviceRoleKey = getServiceRoleKey();

  return createClient(supabaseUrl, serviceRoleKey || "dummy-key-for-offline", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function logAIUsage(params: LogAIUsageParams): Promise<void> {
  try {
    const supabase = getServiceClient();

    const planAtTime = params.planAtTime || (params.userId ? "free" : "unauthenticated");
    const model = params.geminiModel || (params.status === "success" ? "gemini-2.0-flash" : undefined);
    const feature = params.requestType || params.route.replace(/^\/api\//, "").replace(/\//g, "_");

    // Full schema payload
    const primaryPayload: Record<string, any> = {
      user_id: params.userId || null,
      route: params.route,
      request_type: params.requestType || null,
      plan_at_time: planAtTime,
      status: params.status,
      http_status: params.httpStatus,
      gemini_model_used: model || null,
      estimated_tokens: params.estimatedTokens || 0,
      ip_address: params.ipAddress || null,
      // Legacy/fallback fields
      feature,
      model: model || "unknown",
      request_status: params.status,
      total_tokens: params.estimatedTokens || 0,
      error_code: params.errorMessage || null,
      latency_ms: params.latencyMs || 0,
    };

    const { error } = await supabase.from("ai_usage_logs").insert(primaryPayload);

    if (error) {
      // If error is due to missing new column in older schema, retry with legacy schema subset
      const legacyPayload = {
        user_id: params.userId || null,
        feature,
        provider: "google",
        model: model || "unknown",
        input_tokens: 0,
        output_tokens: 0,
        total_tokens: params.estimatedTokens || 0,
        estimated_cost_inr: 0,
        request_status: params.status,
        latency_ms: params.latencyMs || 0,
        error_code: params.errorMessage || null,
      };

      const { error: legacyError } = await supabase.from("ai_usage_logs").insert(legacyPayload);
      if (legacyError) {
        console.error("[AI_USAGE_LOG_FAILURE]", { primaryError: error, legacyError, params });
      }
    }
  } catch (err) {
    // Non-blocking: Logging failure must never crash user request
    console.error("[AI_USAGE_LOG_EXCEPTION]", err, params);
  }
}
