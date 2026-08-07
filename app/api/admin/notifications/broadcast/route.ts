import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { broadcastAdminAnnouncement } from "@/lib/notifications";
import { logAdminAudit } from "@/lib/admin/logger";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { error: authError, admin } = await requireAdmin();
    if (authError) return authError;

    const reqBody = await request.json().catch(() => ({}));
    const { title, body, link = "/dashboard", targetPlan = "all" } = reqBody;

    if (!title || !title.trim() || !body || !body.trim()) {
      return NextResponse.json(
        { error: "Title and body content are required for broadcast announcement" },
        { status: 400 }
      );
    }

    const result = await broadcastAdminAnnouncement({
      title: title.trim(),
      body: body.trim(),
      link,
      targetPlan,
    });

    await logAdminAudit({
      adminUserId: admin.userId,
      adminEmail: admin.email,
      action: "ADMIN_ROLE_CHANGED",
      targetUserId: admin.userId,
      targetEmail: "all_users@broadcast.invalid",
      previousState: {},
      newState: { broadcastCount: result.count, targetPlan },
      reason: `Broadcast announcement: ${title}`,
      metadata: { title, targetPlan },
    });

    return NextResponse.json({
      success: true,
      message: `Announcement broadcast successfully to ${result.count} candidates!`,
      broadcastCount: result.count,
    });
  } catch (error: any) {
    console.error("[Broadcast API Error]:", error);
    return NextResponse.json({ error: "Failed to broadcast notification" }, { status: 500 });
  }
}
