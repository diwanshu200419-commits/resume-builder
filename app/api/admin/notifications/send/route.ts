import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { logAdminAudit } from "@/lib/admin/logger";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function cleanRequiredText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: NextRequest) {
  try {
    const { error: authError, admin } = await requireAdmin();
    if (authError) return authError;

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Malformed JSON request" }, { status: 400 });
    }

    const userId = cleanRequiredText((body as any).userId);
    const title = cleanRequiredText((body as any).title);
    const notificationBody = cleanRequiredText((body as any).body);

    if (!userId || !title || !notificationBody) {
      return NextResponse.json(
        { error: "userId, title, and body are required" },
        { status: 400 }
      );
    }

    if (userId !== "all" && !UUID_RE.test(userId)) {
      return NextResponse.json(
        { error: "userId must be a valid UUID or \"all\"" },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();
    const createdAt = new Date().toISOString();

    if (userId === "all") {
      const { data: users, error: usersError } = await supabase
        .from("profiles")
        .select("id")
        .not("id", "is", null);

      if (usersError) {
        console.error("[Admin Notifications Send] User fetch error:", usersError.message);
        return NextResponse.json({ error: "Failed to load notification recipients" }, { status: 500 });
      }

      const rows = (users || []).map((user) => ({
        user_id: user.id,
        title,
        body: notificationBody,
        type: "admin_broadcast",
        read: false,
        created_at: createdAt,
      }));

      if (rows.length === 0) {
        return NextResponse.json({ success: true, createdCount: 0 });
      }

      const { error: insertError } = await supabase.from("notifications").insert(rows);
      if (insertError) {
        console.error("[Admin Notifications Send] Broadcast insert error:", insertError.message);
        return NextResponse.json({ error: "Failed to create notifications" }, { status: 500 });
      }

      await logAdminAudit({
        adminUserId: admin.userId,
        adminEmail: admin.email,
        action: "ADMIN_NOTIFICATION_SENT",
        targetUserId: admin.userId,
        targetEmail: "all_users@broadcast.invalid",
        previousState: {},
        newState: { createdCount: rows.length, title },
        reason: `Admin notification broadcast: ${title}`,
        metadata: { userId, createdCount: rows.length },
      });

      return NextResponse.json({ success: true, createdCount: rows.length });
    }

    const { data: targetProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("id", userId)
      .single();

    if (profileError || !targetProfile) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    const { error: insertError } = await supabase.from("notifications").insert({
      user_id: userId,
      title,
      body: notificationBody,
      type: "admin_broadcast",
      read: false,
      created_at: createdAt,
    });

    if (insertError) {
      console.error("[Admin Notifications Send] Insert error:", insertError.message);
      return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
    }

    await logAdminAudit({
      adminUserId: admin.userId,
      adminEmail: admin.email,
      action: "ADMIN_NOTIFICATION_SENT",
      targetUserId: userId,
      targetEmail: targetProfile.email || "unknown@vaylo.invalid",
      previousState: {},
      newState: { createdCount: 1, title },
      reason: `Admin notification sent: ${title}`,
      metadata: { userId },
    });

    return NextResponse.json({ success: true, createdCount: 1 });
  } catch (error: any) {
    console.error("[Admin Notifications Send] Error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
