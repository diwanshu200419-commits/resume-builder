import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required to submit feedback" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { category = "general", message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message content cannot be empty" }, { status: 400 });
    }

    const validCategories = ["bug", "billing", "feature", "complaint", "general"];
    const cleanCategory = validCategories.includes(category) ? category : "general";

    const { data: inserted, error: insertError } = await supabase
      .from("user_feedback")
      .insert({
        user_id: user.id,
        user_email: user.email || "candidate@vaylo.ai",
        category: cleanCategory,
        message: message.trim(),
        status: "open",
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Feedback Submit Error]:", insertError.message);
      return NextResponse.json({ error: "Could not save feedback" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your feedback has been sent to our support team.",
      feedback: inserted,
    });
  } catch (error: any) {
    console.error("[Feedback Submit Exception]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
