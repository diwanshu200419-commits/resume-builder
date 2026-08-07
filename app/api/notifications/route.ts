import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ notifications: [], unreadCount: 0 });
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("[Notifications GET Error]:", error.message);
      return NextResponse.json({ notifications: [], unreadCount: 0 });
    }

    const notifications = data || [];
    const unreadCount = notifications.filter((n) => !n.read_at).length;

    return NextResponse.json({ notifications, unreadCount });
  } catch (err: any) {
    console.error("[Notifications GET Exception]:", err);
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { id, markAllRead } = body;
    const now = new Date().toISOString();

    if (markAllRead) {
      await supabase
        .from("notifications")
        .update({ read_at: now })
        .eq("user_id", user.id)
        .is("read_at", null);

      return NextResponse.json({ success: true, message: "All notifications marked as read." });
    }

    if (id) {
      await supabase
        .from("notifications")
        .update({ read_at: now })
        .eq("id", id)
        .eq("user_id", user.id);

      return NextResponse.json({ success: true, message: "Notification marked as read." });
    }

    return NextResponse.json({ error: "Missing notification id or markAllRead flag" }, { status: 400 });
  } catch (err: any) {
    console.error("[Notifications PATCH Exception]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
