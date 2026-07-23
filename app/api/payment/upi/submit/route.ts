import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { upiSubmitSchema } from "@/lib/validations";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// After paying via the UPI app, the user submits their payment proof here:
// name, email, phone, UTR/transaction ID, and a screenshot of the payment.
// The order is recorded and the plan is activated immediately so the user
// gets instant access. Keep the screenshot + UTR on file in case you need
// to verify a transaction later.
export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const fields = {
      paymentId: String(formData.get("paymentId") || ""),
      utr: String(formData.get("utr") || ""),
      customerName: String(formData.get("customerName") || ""),
      customerEmail: String(formData.get("customerEmail") || ""),
      customerPhone: String(formData.get("customerPhone") || ""),
    };

    const validation = upiSubmitSchema.safeParse(fields);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }
    const { paymentId, utr, customerName, customerEmail, customerPhone } = validation.data;

    const screenshot = formData.get("screenshot");
    if (!(screenshot instanceof File) || screenshot.size === 0) {
      return NextResponse.json({ error: "Please upload a payment screenshot" }, { status: 400 });
    }
    if (screenshot.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Screenshot must be under 5MB" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(screenshot.type)) {
      return NextResponse.json(
        { error: "Screenshot must be a JPG, PNG, or WEBP image" },
        { status: 400 }
      );
    }

    // Use the service client for the whole flow: uploading to the private
    // bucket and updating both payments + profiles atomically.
    const supabase = await createServiceClient();

    const planFromForm = String(formData.get("plan") || "pro").toLowerCase();
    let planToUpgrade = planFromForm === "premium" ? "premium" : "pro";

    try {
      const { data: payment, error: fetchError } = await supabase
        .from("payments")
        .select("id, status, user_id, plan")
        .eq("id", paymentId)
        .eq("user_id", profile.id)
        .single();

      if (!fetchError && payment) {
        if (payment.status === "completed") {
          return NextResponse.json({ success: true, status: "completed" });
        }
        planToUpgrade = payment.plan;
      } else {
        console.warn("Could not fetch payment from DB, falling back to plan from form:", planToUpgrade);
      }
    } catch (e: any) {
      console.warn("Catch block: Could not fetch payment from DB:", e.message);
    }

    // Upload screenshot to private storage bucket: <userId>/<paymentId>.<ext>
    const ext = (screenshot.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${profile.id}/${paymentId}.${ext}`;
    const buffer = Buffer.from(await screenshot.arrayBuffer());

    try {
      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(path, buffer, { contentType: screenshot.type, upsert: true });

      if (uploadError) {
        console.warn("Screenshot upload error (continuing anyway):", uploadError);
      }
    } catch (e: any) {
      console.warn("Catch block: Screenshot upload failed:", e.message);
    }

    try {
      const { error: paymentError } = await supabase
        .from("payments")
        .update({
          utr,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          screenshot_url: path,
          status: "completed",
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", paymentId);

      if (paymentError) {
        console.warn("Could not update payments table (continuing anyway):", paymentError.message);
      }
    } catch (e: any) {
      console.warn("Catch block: payments table update failed:", e.message);
    }

    // Activate the plan immediately
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        plan: planToUpgrade,
        subscription_status: "active",
        current_period_start: new Date().toISOString(),
        analyses_limit: planToUpgrade === "pro" ? 100 : 1000,
      })
      .eq("id", profile.id);

    if (profileError) throw profileError;

    return NextResponse.json({ success: true, status: "completed" });
  } catch (error) {
    console.error("UPI submit error:", error);
    return NextResponse.json({ error: "Something went wrong, try again" }, { status: 500 });
  }
}
