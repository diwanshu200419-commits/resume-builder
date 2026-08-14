import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface RouteProps {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticketId = params.id;
    if (!ticketId) {
      return NextResponse.json({ error: "Missing ticket id" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // 1. Query support ticket from database
    const { data: ticket, error: ticketErr } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("id", ticketId)
      .single();

    if (ticketErr || !ticket) {
      // Check fallback user_feedback table
      const { data: feedback } = await supabase
        .from("user_feedback")
        .select("*")
        .eq("id", ticketId)
        .single();

      if (!feedback) {
        return NextResponse.json({ error: "Support ticket not found" }, { status: 404 });
      }

      // Security check: Candidate can only read their own ticket unless admin
      if (profile.role !== "admin" && feedback.user_id !== profile.id) {
        return NextResponse.json({ error: "Forbidden: You do not have permission to view this ticket" }, { status: 403 });
      }

      return NextResponse.json({
        ticket: {
          id: feedback.id,
          ticket_ref: `VAY-${feedback.id.slice(0, 5).toUpperCase()}`,
          user_id: feedback.user_id,
          user_email: feedback.user_email,
          subject: `${feedback.category.toUpperCase()} Support Request`,
          category: feedback.category,
          message: feedback.message,
          status: feedback.status || "open",
          priority: "normal",
          plan: profile.plan || "free",
          created_at: feedback.created_at,
          updated_at: feedback.created_at,
          messages: [
            {
              id: `msg_orig_${feedback.id}`,
              ticket_id: feedback.id,
              sender_user_id: feedback.user_id,
              sender_type: "user",
              sender_name: feedback.user_email,
              message: feedback.message,
              created_at: feedback.created_at,
            },
            ...(feedback.admin_response ? [{
              id: `msg_admin_${feedback.id}`,
              ticket_id: feedback.id,
              sender_user_id: null,
              sender_type: "admin",
              sender_name: "Vaylo AI Support Admin",
              message: feedback.admin_response,
              created_at: feedback.responded_at || feedback.created_at,
            }] : [])
          ]
        }
      });
    }

    // Security check: Candidate can only read their own ticket unless admin
    if (profile.role !== "admin" && ticket.user_id !== profile.id) {
      return NextResponse.json({ error: "Forbidden: You do not have permission to view this ticket" }, { status: 403 });
    }

    // Strip private admin_notes for normal candidates
    if (profile.role !== "admin") {
      delete ticket.admin_notes;
    }

    // 2. Fetch conversation messages for thread
    const { data: messages } = await supabase
      .from("support_messages")
      .select("*")
      .eq("ticket_id", ticket.id)
      .order("created_at", { ascending: true });

    return NextResponse.json({
      ticket: {
        ...ticket,
        messages: messages || [],
      },
    });
  } catch (error: any) {
    console.error("[GET /api/support/tickets/[id] Error]:", error);
    return NextResponse.json({ error: "Failed to fetch ticket details" }, { status: 500 });
  }
}
