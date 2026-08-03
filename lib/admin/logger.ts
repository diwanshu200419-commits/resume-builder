import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import { calculateAiCostInr } from "@/lib/ai/pricing";

export interface LogAuditParams {
  adminUserId: string;
  adminEmail: string;
  action:
    | "PLAN_CHANGED"
    | "PLAN_EXTENDED"
    | "PLAN_EXPIRED"
    | "PAYMENT_APPROVED"
    | "PAYMENT_REJECTED"
    | "SCAN_USAGE_RESET"
    | "USER_DISABLED"
    | "USER_RESTORED"
    | "ADMIN_ROLE_CHANGED";
  targetUserId: string;
  targetEmail: string;
  previousState?: Record<string, any>;
  newState?: Record<string, any>;
  reason?: string;
  metadata?: Record<string, any>;
}

export async function logAdminAudit(params: LogAuditParams) {
  try {
    const supabase = await createServiceClient();
    await supabase.from("admin_audit_log").insert({
      admin_user_id: params.adminUserId,
      admin_email: params.adminEmail,
      action: params.action,
      target_user_id: params.targetUserId,
      target_email: params.targetEmail,
      previous_state: params.previousState || {},
      new_state: params.newState || {},
      reason: params.reason || "Administrative action",
      metadata: params.metadata || {},
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[logAdminAudit] Failed to log audit event:", err);
  }
}

export interface LogAiUsageParams {
  userId?: string;
  feature: string;
  provider?: string;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  requestStatus?: "success" | "error";
  latencyMs?: number;
  errorCode?: string;
}

export async function logAiUsage(params: LogAiUsageParams) {
  try {
    const supabase = await createServiceClient();
    const model = params.model || "gemini-1.5-flash";
    const estimatedCostInr = calculateAiCostInr(
      model,
      params.inputTokens,
      params.outputTokens
    );

    await supabase.from("ai_usage_logs").insert({
      user_id: params.userId || null,
      feature: params.feature,
      provider: params.provider || "google",
      model,
      input_tokens: params.inputTokens || 0,
      output_tokens: params.outputTokens || 0,
      total_tokens: params.totalTokens || (params.inputTokens || 0) + (params.outputTokens || 0),
      estimated_cost_inr: estimatedCostInr,
      request_status: params.requestStatus || "success",
      latency_ms: params.latencyMs || 0,
      error_code: params.errorCode || null,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    // Fail silently in production so AI requests never crash due to analytics logging
    console.warn("[logAiUsage] Logging failed:", err);
  }
}

export async function logAnalyticsEvent(userId: string | undefined, eventName: string, feature: string, metadata: Record<string, any> = {}) {
  try {
    const supabase = await createServiceClient();
    await supabase.from("analytics_events").insert({
      user_id: userId || null,
      event_name: eventName,
      feature,
      metadata,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("[logAnalyticsEvent] Logging failed:", err);
  }
}

export async function logSystemError(service: string, route: string, errorCode: string, safeMessage: string, userId?: string) {
  try {
    const supabase = await createServiceClient();
    await supabase.from("system_errors").insert({
      service,
      route,
      error_code: errorCode,
      safe_message: safeMessage,
      user_id: userId || null,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("[logSystemError] Logging failed:", err);
  }
}
