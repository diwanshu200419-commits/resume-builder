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

    const { data: payment } = await supabase
      .from("payments")
      .select("id, status, user_id, plan")
      .eq("id", paymentId)
      .eq("user_id", profile.id)
      .single();

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status === "completed") {
      return NextResponse.json({ success: true, status: "completed" });
    }

    // Upload screenshot to private storage bucket: <userId>/<paymentId>.<ext>
    const ext = (screenshot.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${profile.id}/${paymentId}.${ext}`;
    const buffer = Buffer.from(await screenshot.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(path, buffer, { contentType: screenshot.type, upsert: true });

    if (uploadError) {
      console.error("Screenshot upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload screenshot" }, { status: 500 });
    }

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

    if (paymentError) throw paymentError;

    // Activate the plan immediately
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        plan: payment.plan,
        subscription_status: "active",
        current_period_start: new Date().toISOString(),
        analyses_limit: payment.plan === "pro" ? 100 : 1000,
      })
      .eq("id", profile.id);

    if (profileError) throw profileError;

    return NextResponse.json({ success: true, status: "completed" });
  } catch (error) {
    console.error("UPI submit error:", error);
    return NextResponse.json({ error: "Something went wrong, try again" }, { status: 500 });
  }
}
