import { createClient } from "@supabase/supabase-js";

// IMPORTANT: Never hardcode service keys. Use environment variables only.
// Run this script with: SUPABASE_SERVICE_ROLE_KEY=... npx ts-node scripts/query-career-pack-users.ts
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ofirvweirnjgsyyedkci.supabase.co";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!serviceKey) {
  console.error("ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
  process.exit(1);
}

async function queryCareerPackUsers() {
  console.log("=================================================");
  console.log("EXECUTE SQL QUERY: SELECT id, email, plan, role, created_at FROM profiles WHERE plan = 'career_pack'");
  console.log("=================================================\n");

  const supabase = createClient(url, serviceKey);

  const { data: profiles, error: profileErr } = await supabase
    .from("profiles")
    .select("id, email, plan, role, created_at")
    .eq("plan", "career_pack");

  if (profileErr) {
    console.error("Profile query error:", profileErr);
  } else {
    console.log("--- PROFILES WHERE plan = 'career_pack' ---");
    console.log(JSON.stringify(profiles, null, 2));
  }

  console.log("\n=================================================");
  console.log("EXECUTE SQL QUERY: SELECT id, user_id, requested_plan, status, created_at FROM payment_requests WHERE requested_plan = 'career_pack'");
  console.log("=================================================\n");

  const { data: payments, error: paymentErr } = await supabase
    .from("payment_requests")
    .select("id, user_id, requested_plan, status, created_at")
    .eq("requested_plan", "career_pack");

  if (paymentErr) {
    console.error("Payment query error:", paymentErr);
  } else {
    console.log("--- PAYMENT REQUESTS WHERE requested_plan = 'career_pack' ---");
    console.log(JSON.stringify(payments, null, 2));
  }
}

queryCareerPackUsers().catch(console.error);
