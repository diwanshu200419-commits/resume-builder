import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { generateTicketRef, sanitizeInput } from "@/lib/support/tickets";
import { createNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { subject, category = "other", message, paymentReference = "" } = body;

    const cleanSubject = sanitizeInput(subject, 150);
    const cleanMessage = sanitizeInput(message, 3000);
    const cleanPayRef = sanitizeInput(paymentReference, 50);

    if (!cleanSubject || cleanSubject.length < 3) {
      return NextResponse.json({ error: "Please enter a descriptive subject (at least 3 characters)." }, { status: 400 });
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      return NextResponse.json({ error: "Please enter a detailed support message (at least 10 characters)." }, { status: 400 });
    }

    const validCategories = ["payment_issue", "account_issue", "ats_resume", "feature_problem", "refund_request", "bug_report", "other"];
    const targetCategory = validCategories.includes(category) ? category : "other";

    const supabase = await createServiceClient();

    // Check rate limit: Max 5 tickets per candidate per hour
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { data: recentTickets } = await supabase
      .from("support_tickets")
      .select("id")
      .eq("user_id", profile.id)
      .gte("created_at", oneHourAgo);

    if (recentTickets && recentTickets.length >= 5) {
      return NextResponse.json(
        { error: "Ticket creation frequency limit reached. Please wait before creating another support ticket." },
        { status: 429 }
      );
    }

    const ticketRef = generateTicketRef();
    const isPaymentOrRefund = targetCategory === "payment_issue" || targetCategory === "refund_request";
    const priority = isPaymentOrRefund ? "high" : "normal";

    // 1. Insert support ticket into database
    const { data: insertedTicket, error: insertError } = await supabase
      .from("support_tickets")
      .insert({
        ticket_ref: ticketRef,
        user_id: profile.id,
        user_email: profile.email,
        subject: cleanSubject,
        category: targetCategory,
        message: cleanMessage,
        status: "open",
        priority,
        plan: profile.plan || "free",
        payment_reference: cleanPayRef || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (insertError) {
      console.warn("[Support Tickets API] support_tickets insert fallback:", insertError.message);
      // Fallback insert into user_feedback for database resilience
      await supabase.from("user_feedback").insert({
        user_id: profile.id,
        user_email: profile.email,
        category: targetCategory,
        message: `[${ticketRef}] ${cleanSubject}: ${cleanMessage}`,
        status: "open",
        created_at: new Date().toISOString(),
      });
    }

    const ticketId = insertedTicket?.id || ticketRef;

    // 2. Insert initial conversation thread message
    try {
      await supabase.from("support_messages").insert({
        ticket_id: insertedTicket?.id,
        sender_user_id: profile.id,
        sender_type: "user",
        sender_name: profile.full_name || profile.email,
        message: cleanMessage,
        created_at: new Date().toISOString(),
      });
    } catch {}

    // 3. Dispatch In-App Notification to User
    await createNotification({
      userId: profile.id,
      type: "ticket_created",
      title: `Support Ticket Received (${ticketRef})`,
      body: `Your support request '${cleanSubject}' has been received. Our team will review your account details.`,
      link: `/support?ticket=${ticketId}`,
    });

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticketId,
        ticket_ref: ticketRef,
        subject: cleanSubject,
        category: targetCategory,
        status: "open",
        priority,
        created_at: new Date().toISOString(),
      },
      message: `Support ticket ${ticketRef} created successfully. Our team will review your request.`,
    });
  } catch (error: any) {
    console.error("[POST /api/support/tickets Error]:", error);
    return NextResponse.json({ error: "Failed to create support ticket" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServiceClient();

    // Query candidate's support tickets from Supabase database
    const { data: ticketsData, error: ticketsErr } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });

    if (!ticketsErr && ticketsData) {
      return NextResponse.json({ tickets: ticketsData });
    }

    // Fallback query from user_feedback table if support_tickets not yet created
    const { data: feedbackData } = await supabase
      .from("user_feedback")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });

    const fallbackTickets = (feedbackData || []).map((f: any) => ({
      id: f.id,
      ticket_ref: `VAY-${f.id.slice(0, 5).toUpperCase()}`,
      user_id: f.user_id,
      user_email: f.user_email,
      subject: f.category.toUpperCase() + " Support Request",
      category: f.category,
      message: f.message,
      status: f.status || "open",
      priority: "normal",
      plan: profile.plan || "free",
      created_at: f.created_at,
      updated_at: f.created_at,
    }));

    return NextResponse.json({ tickets: fallbackTickets });
  } catch (error: any) {
    console.error("[GET /api/support/tickets Error]:", error);
    return NextResponse.json({ error: "Failed to fetch support tickets" }, { status: 500 });
  }
}
