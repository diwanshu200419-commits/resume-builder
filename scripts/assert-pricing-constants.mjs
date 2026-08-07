// Vaylo AI — Permanent Pricing & Entitlement Assertion Test
import fs from "fs";
import path from "path";

console.log("🔒 Running Vaylo AI Pricing Assertion Test...");

const plansFilePath = path.join(process.cwd(), "lib", "plans.ts");
const plansContent = fs.readFileSync(plansFilePath, "utf-8");

// Assertion 1: Free === 0
const hasFreeZero = /free:\s*\{[^}]*priceInr:\s*0/s.test(plansContent);
if (!hasFreeZero) {
  throw new Error("REGRESSION: Free plan priceInr must be 0 in lib/plans.ts");
}

// Assertion 2: Pro === 99 & recurring
const hasPro99 = /pro:\s*\{[^}]*priceInr:\s*99/s.test(plansContent) && /pro:\s*\{[^}]*billingType:\s*"recurring"/s.test(plansContent);
if (!hasPro99) {
  throw new Error("REGRESSION: Pro plan must be priceInr: 99 and billingType: 'recurring' in lib/plans.ts");
}

// Assertion 3: Premium === 299 & recurring
const hasPremium299 = /premium:\s*\{[^}]*priceInr:\s*299/s.test(plansContent) && /premium:\s*\{[^}]*billingType:\s*"recurring"/s.test(plansContent);
if (!hasPremium299) {
  throw new Error("REGRESSION: Premium plan must be priceInr: 299 and billingType: 'recurring' in lib/plans.ts");
}

// Assertion 4: Career Pack === 499 & lifetime
const hasCareerPack499 = /career_pack:\s*\{[^}]*priceInr:\s*499/s.test(plansContent) && /career_pack:\s*\{[^}]*billingType:\s*"lifetime"/s.test(plansContent);
if (!hasCareerPack499) {
  throw new Error("REGRESSION: Career Pack must be priceInr: 499 and billingType: 'lifetime' in lib/plans.ts");
}

console.log("✅ All Vaylo AI Authoritative Pricing Constants Verified:");
console.log("  - Free: ₹0");
console.log("  - Pro: ₹99/month");
console.log("  - Premium: ₹299/month");
console.log("  - Career Pack: ₹499 one-time (lifetime)");
