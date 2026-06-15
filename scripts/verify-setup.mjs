import fs from "fs";
import path from "path";

function loadEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return false;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
  return true;
}

function normalizeSupabaseUrl(url) {
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

const envFiles = [".env.local", ".env"];
const found = envFiles.filter(loadEnvFile);

if (!found.length) {
  console.error("FAIL: No .env or .env.local file found.");
  process.exit(1);
}

console.log(`Loaded env from: ${found.join(", ")}`);

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "GEMINI_API_KEY",
];

const missing = required.filter((key) => !process.env[key]?.trim());
if (missing.length) {
  console.error(`FAIL: Missing required variables: ${missing.join(", ")}`);
  process.exit(1);
}

const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Checking Supabase connection...");
const healthRes = await fetch(`${supabaseUrl}/auth/v1/health`, {
  headers: { apikey: anonKey },
});
if (!healthRes.ok) {
  console.error(`FAIL: Supabase health check returned ${healthRes.status}`);
  process.exit(1);
}
console.log("OK: Supabase auth endpoint reachable");

console.log("Checking database schema (profiles table)...");
const profilesRes = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id&limit=1`, {
  headers: {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  },
});

if (profilesRes.status === 404) {
  console.error(
    "FAIL: profiles table not found. Run supabase/schema.sql in Supabase SQL Editor."
  );
  process.exit(1);
}

if (!profilesRes.ok) {
  const body = await profilesRes.text();
  if (body.includes("relation") && body.includes("does not exist")) {
    console.error(
      "FAIL: Database tables missing. Run supabase/schema.sql in Supabase SQL Editor."
    );
    process.exit(1);
  }
  console.log(`OK: profiles table exists (status ${profilesRes.status})`);
} else {
  console.log("OK: profiles table exists");
}

if (process.env.GEMINI_API_KEY?.startsWith("AIza")) {
  console.log("OK: Gemini API key format looks valid");
} else if (process.env.GEMINI_API_KEY?.startsWith("AQ.")) {
  console.log("WARN: Gemini key uses AQ.* format (Vertex/Express). App expects Google AI Studio key (AIza...).");
} else {
  console.log("WARN: Gemini API key format unrecognized — verify in Google AI Studio");
}

console.log("\nSetup verification passed. Run: npm run dev");
