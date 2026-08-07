import { createServiceClient } from "@/lib/supabase/server";

export type NotificationType =
  | "scan_complete"
  | "payment_approved"
  | "payment_rejected"
  | "feedback_replied"
  | "plan_expiring"
  | "admin_announcement";

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
}

/**
 * Creates a server-side notification record for a user.
 * Uses service role to bypass client restrictions and dispatch live Supabase Realtime event.
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        body: params.body,
        link: params.link || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[Notifications] Failed to create notification:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("[Notifications] Exception creating notification:", err);
    return null;
  }
}

/**
 * Broadcasts an announcement notification to all candidates or a target plan tier.
 */
export async function broadcastAdminAnnouncement(params: {
  title: string;
  body: string;
  link?: string;
  targetPlan?: string;
}) {
  try {
    const supabase = await createServiceClient();

    let query = supabase.from("profiles").select("id, email");
    if (params.targetPlan && params.targetPlan !== "all") {
      query = query.eq("plan", params.targetPlan);
    }

    const { data: users, error: fetchErr } = await query;
    if (fetchErr || !users || users.length === 0) {
      return { count: 0 };
    }

    const rows = users.map((u) => ({
      user_id: u.id,
      type: "admin_announcement" as NotificationType,
      title: params.title,
      body: params.body,
      link: params.link || "/dashboard",
      created_at: new Date().toISOString(),
    }));

    const { error: insertErr } = await supabase.from("notifications").insert(rows);
    if (insertErr) {
      console.error("[Notifications] Broadcast insert error:", insertErr.message);
      return { count: 0, error: insertErr.message };
    }

    return { count: rows.length };
  } catch (err: any) {
    console.error("[Notifications] Broadcast exception:", err);
    return { count: 0, error: err.message };
  }
}
