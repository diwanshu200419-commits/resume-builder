import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ADMIN_EMAILS = [
  "admin@vaylo.ai",
  "jattshiv32@gmail.com",
  "paid_tester_123@example.com",
  "diwanshu200419@gmail.com"
];

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile || !profile.email || !ADMIN_EMAILS.includes(profile.email)) {
      return NextResponse.json(
        { error: "Unauthorized admin access" },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { userId, requestId, plan = "pro", status = "approve", reason = "" } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    if (status === "approve") {
      // Calculate Expiration Date: 30 days for Pro/Premium, null (lifetime) for Career Pack
      let expiresAt: string | null = null;
      if (plan === "pro" || plan === "premium") {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        expiresAt = date.toISOString();
      }

      // Update User Profile Plan
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          plan: plan,
          subscription_status: "active",
          current_period_start: new Date().toISOString(),
          expires_at: expiresAt,
          analyses_limit: plan === "pro" ? 100 : 1000,
        })
        .eq("id", userId);

      if (profileError) console.warn("Supabase profile update warning:", profileError.message);

      // Update payment_requests table status
      try {
        if (requestId) {
          await supabase
            .from("payment_requests")
            .update({
              status: "approved",
              reviewed_at: new Date().toISOString(),
              reviewed_by: profile.id,
            })
            .eq("id", requestId);
        } else {
          await supabase
            .from("payment_requests")
            .update({
              status: "approved",
              reviewed_at: new Date().toISOString(),
              reviewed_by: profile.id,
            })
            .eq("user_id", userId)
            .eq("status", "pending");
        }
      } catch {}

      // Update mock database for full offline/mock environment resilience
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/mock-db`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "approve_payment_request",
            payload: { userId, plan, expiresAt },
          }),
        });
      } catch {}

      return NextResponse.json({
        success: true,
        status: "approved",
        plan: plan,
        expires_at: expiresAt,
        message: `Plan upgraded to ${plan.toUpperCase()} successfully. ${expiresAt ? "Valid for 30 days." : "Lifetime access active."}`,
      });
    } else {
      // Reject Payment Request
      try {
        if (requestId) {
          await supabase
            .from("payment_requests")
            .update({
              status: "rejected",
              rejection_reason: reason || "Invalid UTR reference number or payment verification failed.",
              reviewed_at: new Date().toISOString(),
              reviewed_by: profile.id,
            })
            .eq("id", requestId);
        }
      } catch {}

      return NextResponse.json({
        success: true,
        status: "rejected",
        message: "Payment request rejected.",
      });
    }
  } catch (error: any) {
    console.error("Admin verification error:", error);
    return NextResponse.json({ error: error?.message || "Failed to perform admin update" }, { status: 500 });
  }
}
