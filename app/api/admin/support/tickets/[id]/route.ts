import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { sanitizeInput } from "@/lib/support/tickets";
import { logAdminAudit } from "@/lib/admin/logger";
import { createNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

interface RouteProps {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  try {
    const { error: authError, admin } = await requireAdmin();
    if (authError) return authError;

    const ticketId = params.id;
    const body = await request.json().catch(() => ({}));
    const { status, priority, adminNotes } = body;

    const supabase = await createServiceClient();

    // Fetch existing ticket
    const { data: ticket } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("id", ticketId)
      .single();

    if (!ticket) {
      // Check user_feedback fallback table
      const { data: feedback } = await supabase
        .from("user_feedback")
        .select("*")
        .eq("id", ticketId)
        .single();

      if (!feedback) {
        return NextResponse.json({ error: "Support ticket not found" }, { status: 404 });
      }

      if (status) {
        await supabase
          .from("user_feedback")
          .update({ status })
          .eq("id", ticketId);
      }

      return NextResponse.json({ success: true, message: "Ticket updated successfully" });
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      const validStatuses = ["open", "in_progress", "resolved", "closed"];
      if (validStatuses.includes(status)) {
        updates.status = status;
        if (status === "resolved" || status === "closed") {
          updates.resolved_at = new Date().toISOString();
        }
      }
    }

    if (priority) {
      const validPriorities = ["low", "normal", "high", "urgent"];
      if (validPriorities.includes(priority)) {
        updates.priority = priority;
      }
    }

    if (adminNotes !== undefined) {
      updates.admin_notes = sanitizeInput(adminNotes, 2000);
    }

    const { error: updateErr } = await supabase
      .from("support_tickets")
      .update(updates)
      .eq("id", ticket.id);

    if (updateErr) {
      console.error("[PATCH /api/admin/support/tickets/[id]] Update error:", updateErr.message);
      return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
    }

    // Log admin audit entry
    await logAdminAudit({
      adminUserId: admin.userId,
      adminEmail: admin.email,
      action: "SUPPORT_TICKET_UPDATED",
      targetUserId: ticket.user_id,
      targetEmail: ticket.user_email,
      previousState: { status: ticket.status, priority: ticket.priority },
      newState: updates,
      reason: "Admin ticket status / priority update",
      metadata: { ticketId: ticket.id, ticketRef: ticket.ticket_ref },
    });

    // Send In-App Notification if resolved
    if (status === "resolved") {
      await createNotification({
        userId: ticket.user_id,
        type: "ticket_resolved",
        title: `Support Ticket Resolved (${ticket.ticket_ref})`,
        body: `Your support ticket '${ticket.subject}' has been marked as resolved by our team.`,
        link: `/support?ticket=${ticket.id}`,
      });
    }

    return NextResponse.json({
      success: true,
      updates,
      message: `Ticket ${ticket.ticket_ref} updated successfully.`,
    });
  } catch (error: any) {
    console.error("[PATCH /api/admin/support/tickets/[id] Error]:", error);
    return NextResponse.json({ error: "Failed to update support ticket" }, { status: 500 });
  }
}
