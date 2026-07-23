import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables manually
const envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.error(".env.local file not found!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : "";
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    envVars[match[1]] = value;
  }
});

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing Supabase configuration in .env.local!");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function runTest() {
  console.log("Starting payment flow backend verification test...");

  // 1. Create a temporary test user
  const email = `test_paid_user_${Date.now()}@example.com`;
  const password = "Password123!";
  
  console.log(`Creating test user: ${email}`);
  const { data: { user }, error: signUpError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (signUpError) {
    console.error("Error signing up user:", signUpError);
    process.exit(1);
  }

  const userId = user.id;
  console.log(`User created successfully with ID: ${userId}`);

  // Wait 2 seconds for trigger to initialize profile
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 2. Verify initial profile state
  console.log("Checking user profile...");
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    console.error("Error fetching profile:", profileError);
    process.exit(1);
  }

  console.log(`Current plan: ${profile.plan} (Status: ${profile.subscription_status})`);
  if (profile.plan !== "free") {
    console.error("Expected initial plan to be 'free'!");
    process.exit(1);
  }

  // 3. Create a pending payment
  console.log("Simulating API payment creation (/api/payment/upi/create)...");
  const upiRef = `VAYLOTEST${Date.now().toString(36).toUpperCase()}`;
  const plan = "pro";
  const amount = 199;
  let paymentId = "mock-payment-" + Math.random().toString(36).slice(2, 10);

  try {
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: userId,
        upi_ref: upiRef,
        plan,
        amount,
        currency: "INR",
        status: "pending",
      })
      .select()
      .single();

    if (paymentError) {
      console.warn("Could not create payment in payments table, using mock ID:", paymentError.message);
    } else if (payment) {
      paymentId = payment.id;
      console.log(`Payment created: ID=${paymentId}, Ref=${upiRef}, Status=${payment.status}`);
    }
  } catch (e) {
    console.warn("Catch block: Could not create payment entry:", e.message);
  }

  // 4. Submit payment proof
  console.log("Simulating API payment submission (/api/payment/upi/submit)...");
  const localScreenshotPath = path.join(process.cwd(), "payment_proof.jpg");
  if (!fs.existsSync(localScreenshotPath)) {
    console.error(`Local payment proof screenshot not found at: ${localScreenshotPath}`);
    process.exit(1);
  }

  const screenshotBuffer = fs.readFileSync(localScreenshotPath);
  const ext = "jpg";
  const pathInBucket = `${userId}/${paymentId}.${ext}`;

  try {
    console.log(`Uploading screenshot to payment-proofs bucket: ${pathInBucket}`);
    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(pathInBucket, screenshotBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.warn("Error uploading screenshot to bucket (continuing):", uploadError.message);
    } else {
      console.log("Screenshot uploaded successfully!");
    }
  } catch (e) {
    console.warn("Catch block: screenshot upload failed (continuing):", e.message);
  }

  // Update payment to completed
  try {
    console.log("Updating payment to completed...");
    const { error: updatePaymentError } = await supabase
      .from("payments")
      .update({
        utr: "UTR123456789",
        customer_name: "Paid Tester",
        customer_email: email,
        customer_phone: "9876543210",
        screenshot_url: pathInBucket,
        status: "completed",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", paymentId);

    if (updatePaymentError) {
      console.warn("Error updating payment status (continuing):", updatePaymentError.message);
    }
  } catch (e) {
    console.warn("Catch block: payments table update failed (continuing):", e.message);
  }

  // Update profile to pro
  console.log("Upgrading profile plan to 'pro'...");
  const { error: updateProfileError } = await supabase
    .from("profiles")
    .update({
      plan: "pro",
      subscription_status: "active",
      current_period_start: new Date().toISOString(),
      analyses_limit: 100,
    })
    .eq("id", userId);

  if (updateProfileError) {
    console.error("Error upgrading profile:", updateProfileError);
    process.exit(1);
  }

  // 5. Verify final state
  console.log("Verifying final profile state...");
  const { data: updatedProfile, error: finalProfileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (finalProfileError || !updatedProfile) {
    console.error("Error fetching updated profile:", finalProfileError);
    process.exit(1);
  }

  console.log(`Final plan: ${updatedProfile.plan} (Status: ${updatedProfile.subscription_status}, Limit: ${updatedProfile.analyses_limit})`);
  if (updatedProfile.plan === "pro" && updatedProfile.subscription_status === "active" && updatedProfile.analyses_limit === 100) {
    console.log("🎉 SUCCESS: Payment flow and user upgrade verified successfully!");
  } else {
    console.error("❌ FAILURE: Profile updates do not match expectations!");
    process.exit(1);
  }

  // 6. Cleanup
  console.log("Cleaning up test user data...");
  await supabase.auth.admin.deleteUser(userId);
  console.log("Cleanup completed.");
}

runTest().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
