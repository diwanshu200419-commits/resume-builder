import fs from "fs";
import path from "path";

// Load environment variables manually
const envPath = path.join(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : "";
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    envVars[match[1]] = value;
  }
});

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

const res = await fetch(`${SUPABASE_URL}/rest/v1/?apikey=${SERVICE_ROLE_KEY}`);
const data = await res.json();

console.log("Tables found in PostgREST schema:");
console.log(Object.keys(data.paths));

const paymentsPath = data.paths["/payments"];
console.log("\nDetails of /payments endpoint:");
console.log(JSON.stringify(paymentsPath, null, 2));
