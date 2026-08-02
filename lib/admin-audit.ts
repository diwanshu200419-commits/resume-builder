import { createServiceClient } from "@/lib/supabase/server";

export interface LogAdminActionParams {
  adminUserId?: string;
  adminEmail?: string;
  action: string; // e.g. 'approve_payment', 'reject_payment', 'manual_plan_override'
  targetUserId?: string;
  targetEmail?: string;
  details?: Record<string, any>;
}

export async function logAdminAction({
  adminUserId,
  adminEmail,
  action,
  targetUserId,
  targetEmail,
  details = {},
}: LogAdminActionParams) {
  try {
    const supabase = await createServiceClient();
    const { error } = await supabase.from("admin_audit_log").insert({
      admin_user_id: adminUserId || null,
      admin_email: adminEmail || null,
      action,
      target_user_id: targetUserId || null,
      target_email: targetEmail || null,
      details,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.warn("[admin-audit] Warning saving audit log:", error.message);
    }
  } catch (err: any) {
    console.warn("[admin-audit] Error saving audit log:", err?.message || err);
  }
}
