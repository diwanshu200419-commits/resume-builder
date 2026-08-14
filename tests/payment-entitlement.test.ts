import { PLAN_CONFIG, getEffectivePlan, canAnalyze, canAutoFix, canAccessSTARVoice, canAccessBrandingStudio, canDeployPortfolio } from "../lib/plans";

export async function runPaymentEntitlementTests() {
  console.log("-----------------------------------------");
  console.log("🧪 Running Payment & Entitlement Audit Tests...");

  // Test 1: Authoritative Price Mapping Assertion
  if (PLAN_CONFIG.free.priceInr !== 0 ||
      PLAN_CONFIG.pro.priceInr !== 99 ||
      PLAN_CONFIG.premium.priceInr !== 299 ||
      PLAN_CONFIG.career_pack.priceInr !== 499) {
    throw new Error("Master plan price definitions mismatch!");
  }
  console.log("✓ [PASS] 1. Master Plan Price Definitions (Free: ₹0, Pro: ₹99, Premium: ₹299, Career Pack: ₹499)");

  // Test 2: Free User Entitlement & Feature Blocking
  const freeProfile: any = { id: "user_free", plan: "free", analyses_used: 0, expires_at: null };
  if (getEffectivePlan(freeProfile) !== "free") throw new Error("Free profile failed effective plan check");
  if (!canAnalyze(freeProfile)) throw new Error("Free profile denied allowed ATS scan");
  if (canAutoFix(freeProfile)) throw new Error("Free profile erroneously allowed Auto-Fix bullets");
  if (canAccessSTARVoice(freeProfile)) throw new Error("Free profile erroneously allowed STAR Voice");
  if (canDeployPortfolio(freeProfile)) throw new Error("Free profile erroneously allowed Portfolio deployment");
  console.log("✓ [PASS] 2. Free Tier Entitlement & Paid Feature Block Assertions");

  // Test 3: Pro User Entitlement
  const proProfile: any = { id: "user_pro", plan: "pro", subscription_status: "active", expires_at: new Date(Date.now() + 86400000).toISOString() };
  if (getEffectivePlan(proProfile) !== "pro") throw new Error("Pro profile failed effective plan check");
  if (!canAutoFix(proProfile)) throw new Error("Pro profile denied Auto-Fix bullets");
  if (!canAccessBrandingStudio(proProfile)) throw new Error("Pro profile denied LinkedIn Branding");
  if (canAccessSTARVoice(proProfile)) throw new Error("Pro profile erroneously allowed Premium STAR Voice");
  console.log("✓ [PASS] 3. Pro Tier Entitlement & Premium Block Assertions");

  // Test 4: Premium User Entitlement
  const premiumProfile: any = { id: "user_prem", plan: "premium", subscription_status: "active", expires_at: new Date(Date.now() + 86400000).toISOString() };
  if (getEffectivePlan(premiumProfile) !== "premium") throw new Error("Premium profile failed effective plan check");
  if (!canAccessSTARVoice(premiumProfile)) throw new Error("Premium profile denied STAR Voice");
  if (!canDeployPortfolio(premiumProfile)) throw new Error("Premium profile denied Portfolio deployment");
  console.log("✓ [PASS] 4. Premium Tier Entitlement Assertions");

  // Test 5: Career Pack One-Time Lifetime Entitlement
  const cpProfile: any = { id: "user_cp", plan: "career_pack", subscription_status: "active", expires_at: null };
  if (getEffectivePlan(cpProfile) !== "career_pack") throw new Error("Career Pack profile failed effective plan check");
  if (!canAccessSTARVoice(cpProfile)) throw new Error("Career Pack profile denied STAR Voice");
  if (!canDeployPortfolio(cpProfile)) throw new Error("Career Pack profile denied Portfolio deployment");
  console.log("✓ [PASS] 5. Career Pack One-Time Lifetime Entitlement Assertions");

  // Test 6: Subscription Expiry Revocation Test
  const expiredProProfile: any = {
    id: "user_exp",
    plan: "pro",
    subscription_status: "active",
    expires_at: new Date(Date.now() - 86400000).toISOString(), // Expired yesterday!
  };
  if (getEffectivePlan(expiredProProfile) !== "free") {
    throw new Error("Expired subscription failed to revert to free tier!");
  }
  if (canAutoFix(expiredProProfile)) {
    throw new Error("Expired subscription erroneously granted paid Auto-Fix access!");
  }
  console.log("✓ [PASS] 6. Subscription Expiry Revocation Test (Past expires_at automatically reverts to Free)");
}

if (process.argv[1]?.includes("payment-entitlement.test.ts")) {
  runPaymentEntitlementTests().catch((err) => {
    console.error("❌ Test failure:", err);
    process.exit(1);
  });
}
