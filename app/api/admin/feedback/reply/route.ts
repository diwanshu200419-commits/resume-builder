import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { logAdminAudit } from "@/lib/admin/logger";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { error: authError, admin } = await requireAdmin();
    if (authError) return authError;

    const body = await request.json().catch(() => ({}));
    const { feedbackId, adminResponse, newStatus = "resolved" } = body;

    if (!feedbackId || !adminResponse || !adminResponse.trim()) {
      return NextResponse.json(
        { error: "Missing required parameters: feedbackId and adminResponse" },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    const { data: updated, error: updateError } = await supabase
      .from("user_feedback")
      .update({
        admin_response: adminResponse.trim(),
        status: newStatus,
        responded_at: new Date().toISOString(),
      })
      .eq("id", feedbackId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    await logAdminAudit({
      adminUserId: admin.userId,
      adminEmail: admin.email,
      action: "FEEDBACK_REPLIED",
      targetUserId: updated.user_id,
      targetEmail: updated.user_email,
      previousState: { status: "open" },
      newState: { status: newStatus, admin_response: adminResponse },
      reason: "Admin replied to user complaint/feedback",
      metadata: { feedbackId },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback response saved and candidate updated.",
      feedback: updated,
    });
  } catch (error: any) {
    console.error("[Admin Reply Exception]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
