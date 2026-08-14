import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin();
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const priority = searchParams.get("priority") || "all";
    const category = searchParams.get("category") || "all";
    const plan = searchParams.get("plan") || "all";
    const search = (searchParams.get("search") || "").trim().toLowerCase();

    const supabase = await createServiceClient();

    let query = supabase.from("support_tickets").select("*").order("updated_at", { ascending: false });

    if (status !== "all") query = query.eq("status", status);
    if (priority !== "all") query = query.eq("priority", priority);
    if (category !== "all") query = query.eq("category", category);
    if (plan !== "all") query = query.eq("plan", plan);

    if (search) {
      query = query.or(`user_email.ilike.%${search}%,subject.ilike.%${search}%,ticket_ref.ilike.%${search}%,payment_reference.ilike.%${search}%`);
    }

    const { data: tickets, error } = await query;

    if (!error && tickets) {
      // Calculate dashboard summary counts
      const counts = {
        total: tickets.length,
        new: tickets.filter((t) => t.status === "open").length,
        open: tickets.filter((t) => t.status === "open").length,
        in_progress: tickets.filter((t) => t.status === "in_progress").length,
        urgent: tickets.filter((t) => t.priority === "urgent" && t.status !== "resolved" && t.status !== "closed").length,
        resolved: tickets.filter((t) => t.status === "resolved").length,
      };
      return NextResponse.json({ tickets, counts });
    }

    // Fallback: Query user_feedback table if support_tickets is empty
    const { data: feedbackData } = await supabase
      .from("user_feedback")
      .select("*")
      .order("created_at", { ascending: false });

    const fallbackTickets = (feedbackData || []).map((f: any) => ({
      id: f.id,
      ticket_ref: `VAY-${f.id.slice(0, 5).toUpperCase()}`,
      user_id: f.user_id,
      user_email: f.user_email,
      subject: `${f.category.toUpperCase()} Support Complaint`,
      category: f.category,
      message: f.message,
      status: f.status || "open",
      priority: f.category === "billing" || f.category === "complaint" ? "high" : "normal",
      plan: "free",
      created_at: f.created_at,
      updated_at: f.created_at,
    }));

    const counts = {
      total: fallbackTickets.length,
      new: fallbackTickets.filter((t: any) => t.status === "open").length,
      open: fallbackTickets.filter((t: any) => t.status === "open").length,
      in_progress: fallbackTickets.filter((t: any) => t.status === "in_progress").length,
      urgent: fallbackTickets.filter((t: any) => t.priority === "high").length,
      resolved: fallbackTickets.filter((t: any) => t.status === "resolved").length,
    };

    return NextResponse.json({ tickets: fallbackTickets, counts });
  } catch (error: any) {
    console.error("[GET /api/admin/support/tickets Error]:", error);
    return NextResponse.json({ error: "Failed to fetch admin support tickets" }, { status: 500 });
  }
}
