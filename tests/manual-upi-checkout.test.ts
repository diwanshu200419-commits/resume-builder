import fs from "fs";
import path from "path";
import { PLAN_CONFIG } from "../lib/plans";
import { getUpiConfig } from "../lib/upi";

export async function runManualUpiCheckoutTests() {
  console.log("-----------------------------------------");
  console.log("🧪 Running Manual UPI & Checkout Audit Tests...");

  // Test 1: Payee VPA & Configuration
  const upiConfig = getUpiConfig();
  if (upiConfig.upiId !== "jattshiv32@okaxis") {
    throw new Error(`Payee VPA mismatch! Expected jattshiv32@okaxis but got ${upiConfig.upiId}`);
  }
  console.log("✓ [PASS] 1. Payee VPA Configuration Assertion (jattshiv32@okaxis)");

  // Test 2: Master Plan Server-Side Pricing Integrity
  if (PLAN_CONFIG.pro.priceInr !== 99 ||
      PLAN_CONFIG.premium.priceInr !== 299 ||
      PLAN_CONFIG.career_pack.priceInr !== 499) {
    throw new Error("Server-side plan pricing integrity assertion failed!");
  }
  console.log("✓ [PASS] 2. Server-Side Price Integrity (Pro: ₹99, Premium: ₹299, Career Pack: ₹499)");

  // Test 3: Customer Checkout Page Code Audit (No Fake Razorpay / No False Instant Claims)
  const checkoutCode = fs.readFileSync(path.join(process.cwd(), "app", "(dashboard)", "checkout", "[plan]", "page.tsx"), "utf-8");
  if (checkoutCode.includes("Razorpay logo") || checkoutCode.includes("Powered by Razorpay")) {
    throw new Error("Checkout page erroneously displays Razorpay UI elements while inactive!");
  }
  if (!checkoutCode.includes("Verification Required") || !checkoutCode.includes("Submit Payment for Verification")) {
    throw new Error("Checkout page missing truthful manual verification notice!");
  }
  console.log("✓ [PASS] 3. Customer Checkout Truthfulness & Razorpay Inactive Masking Assertion");

  // Test 4: UTR Submission Endpoint Audit (Status must be 'pending', never auto-upgraded)
  const upiSubmitCode = fs.readFileSync(path.join(process.cwd(), "app", "api", "payment", "upi", "submit", "route.ts"), "utf-8");
  if (!upiSubmitCode.includes('status: "pending"') || !upiSubmitCode.includes("payment_pending")) {
    throw new Error("UPI submission route does not enforce 'pending' status!");
  }
  if (upiSubmitCode.includes("upgradeUserPlan(")) {
    throw new Error("SECURITY FAILURE: UPI submit route erroneously upgrades entitlement before admin verification!");
  }
  console.log("✓ [PASS] 4. UTR Submission Status Assertion (status = 'pending', zero raw upgrade)");

  // Test 5: Admin Verification Route Security Audit
  const adminVerifyCode = fs.readFileSync(path.join(process.cwd(), "app", "api", "admin", "verify", "route.ts"), "utf-8");
  if (!adminVerifyCode.includes("requireAdmin()") || !adminVerifyCode.includes("profiles")) {
    throw new Error("Admin verify route missing requireAdmin() security guard or profiles table update!");
  }
  console.log("✓ [PASS] 5. Admin Payment Verification Security Assertion (requireAdmin() guard active)");
}

if (process.argv[1]?.includes("manual-upi-checkout.test.ts")) {
  runManualUpiCheckoutTests().catch((err) => {
    console.error("❌ Test failure:", err);
    process.exit(1);
  });
}
