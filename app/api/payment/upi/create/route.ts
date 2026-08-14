import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getPlanAmount, generateUpiRef, buildUpiLink, buildUpiQrUrl, getUpiConfig } from "@/lib/upi";
import type { Plan } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();
    if (!plan || (plan !== "pro" && plan !== "premium" && plan !== "career" && plan !== "career-pack" && plan !== "career_pack")) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const config = getUpiConfig();
    const upiId = config.upiId || "jattshiv32@okaxis";

    const amount = getPlanAmount(plan as Exclude<Plan, "free">);
    const ref = generateUpiRef(profile.id);
    
    // Pure P2P UPI link without merchant note parameter to prevent Axis Bank/GPay fraud flags
    const upiLink = buildUpiLink({
      amount,
      ref,
    });
    const qrUrl = buildUpiQrUrl(upiLink, amount);

    let paymentId = "mock-payment-" + Math.random().toString(36).slice(2, 10);
    try {
      const supabase = await createClient();
      const { data: payment, error } = await supabase
        .from("payments")
        .insert({
          user_id: profile.id,
          upi_ref: ref,
          plan,
          amount,
          currency: "INR",
          status: "pending",
        })
        .select("id")
        .single();

      if (error) {
        console.warn("Could not record payment in DB, falling back to mock payment ID:", error.message);
      } else if (payment) {
        paymentId = payment.id;
      }
    } catch (e: any) {
      console.warn("Catch block: Could not record payment in DB, falling back:", e.message);
    }

    return NextResponse.json({
      paymentId,
      ref,
      amount,
      upiId,
      upiLink,
      qrUrl,
    });
  } catch (error) {
    console.error("UPI payment creation error:", error);
    return NextResponse.json({ error: "Something went wrong, try again" }, { status: 500 });
  }
}
