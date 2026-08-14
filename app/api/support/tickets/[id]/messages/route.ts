import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { sanitizeInput } from "@/lib/support/tickets";
import { createNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

interface RouteProps {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: RouteProps) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticketId = params.id;
    const body = await request.json().catch(() => ({}));
    const { message } = body;

    const cleanMessage = sanitizeInput(message, 3000);
    if (!cleanMessage || cleanMessage.length < 2) {
      return NextResponse.json({ error: "Please enter a message response." }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // 1. Fetch ticket to verify ownership and existing state
    const { data: ticket } = await supabase
      .from("support_tickets")
      .select("id, user_id, user_email, ticket_ref, status")
      .eq("id", ticketId)
      .single();

    const isAdmin = profile.role === "admin";
    const senderType = isAdmin ? "admin" : "user";
    const senderName = isAdmin ? "Vaylo AI Support Team" : (profile.full_name || profile.email);

    if (!ticket) {
      // Check user_feedback fallback table
      const { data: feedback } = await supabase
        .from("user_feedback")
        .select("id, user_id, user_email, status")
        .eq("id", ticketId)
        .single();

      if (!feedback) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
      }

      if (!isAdmin && feedback.user_id !== profile.id) {
        return NextResponse.json({ error: "Forbidden: You cannot post to another user's support ticket" }, { status: 403 });
      }

      if (isAdmin) {
        await supabase
          .from("user_feedback")
          .update({
            admin_response: cleanMessage,
            responded_at: new Date().toISOString(),
            status: "resolved",
          })
          .eq("id", ticketId);

        await createNotification({
          userId: feedback.user_id,
          type: "ticket_reply",
          title: "New Support Reply from Vaylo AI Team",
          body: `Our support team has responded to your request: "${cleanMessage.slice(0, 100)}..."`,
          link: "/support",
        });
      }

      return NextResponse.json({ success: true, message: "Response posted successfully" });
    }

    // Security check: Candidate can only post to their own ticket
    if (!isAdmin && ticket.user_id !== profile.id) {
      return NextResponse.json({ error: "Forbidden: You cannot post to another user's support ticket" }, { status: 403 });
    }

    // 2. Insert message into support_messages
    const { data: insertedMsg, error: msgError } = await supabase
      .from("support_messages")
      .insert({
        ticket_id: ticket.id,
        sender_user_id: profile.id,
        sender_type: senderType,
        sender_name: senderName,
        message: cleanMessage,
        created_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (msgError) {
      console.error("[Support Messages API] Insert error:", msgError.message);
    }

    // 3. Update ticket updated_at and status
    const newStatus = isAdmin ? "in_progress" : "open";
    await supabase
      .from("support_tickets")
      .update({
        updated_at: new Date().toISOString(),
        status: ticket.status === "closed" ? "reopened" : newStatus,
      })
      .eq("id", ticket.id);

    // 4. Dispatch notification
    if (isAdmin) {
      await createNotification({
        userId: ticket.user_id,
        type: "ticket_reply",
        title: `New Support Reply (${ticket.ticket_ref})`,
        body: `Support team replied: "${cleanMessage.slice(0, 100)}..."`,
        link: `/support?ticket=${ticket.id}`,
      });
    } else {
      // Notify Admin Queue
      await createNotification({
        userId: profile.id,
        type: "ticket_updated",
        title: `Candidate Replied on Ticket (${ticket.ticket_ref})`,
        body: `${senderName}: "${cleanMessage.slice(0, 100)}..."`,
        link: `/admin?tab=support&ticket=${ticket.id}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: insertedMsg || {
        id: `msg_${Date.now()}`,
        ticket_id: ticket.id,
        sender_user_id: profile.id,
        sender_type: senderType,
        sender_name: senderName,
        message: cleanMessage,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("[POST /api/support/tickets/[id]/messages Error]:", error);
    return NextResponse.json({ error: "Failed to post message to support thread" }, { status: 500 });
  }
}
