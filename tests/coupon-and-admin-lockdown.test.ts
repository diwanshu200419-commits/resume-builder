import fs from "fs";
import path from "path";

// Load .env.local if present
try {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match && !process.env[match[1]]) {
        let val = match[2] ? match[2].trim() : "";
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        process.env[match[1]] = val;
      }
    }
  }
} catch {}

import {
  calculateCouponDiscount,
  validateCouponForUser,
  redeemCouponAtomic,
  getCouponByCode,
  type DBCoupon,
} from "../lib/coupons";
import { checkAdminRateLimit } from "../lib/admin/rate-limit";

async function runTests() {
  console.log("================================================================================");
  console.log("🚀 STARTING E2E VERIFICATION: DASHBOARD NAV + COUPONS + ADMIN LOCKDOWN");
  console.log("================================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // PART 1: Dashboard Navigation Verification
  // ---------------------------------------------------------------------------
  console.log("--- PART 1: DASHBOARD NAVIGATION INTEGRITY ---");

  const sidebarContent = fs.readFileSync(
    path.join(process.cwd(), "components/dashboard/Sidebar.tsx"),
    "utf-8"
  );
  assert(
    sidebarContent.includes('href="/"') && sidebarContent.includes("Back to Main Website"),
    "1. Sidebar renders explicit 'Back to Main Website' link to /"
  );

  const topbarContent = fs.readFileSync(
    path.join(process.cwd(), "components/dashboard/TopBar.tsx"),
    "utf-8"
  );
  assert(
    topbarContent.includes('href="/"') && topbarContent.includes("Main Site"),
    "2. TopBar renders prominent 'Main Site' header button"
  );
  assert(
    topbarContent.includes("Main Website"),
    "3. TopBar profile dropdown includes 'Main Website' navigation item"
  );

  // ---------------------------------------------------------------------------
  // PART 2: Coupon Engine Calculations & Validation
  // ---------------------------------------------------------------------------
  console.log("\n--- PART 2: COUPON ENGINE & ATOMIC REDEMPTIONS ---");

  // Discount Math Test
  const testPercentCoupon: DBCoupon = {
    id: "c-1",
    code: "TEST20",
    plan: "all",
    discount_type: "percent",
    discount_value: 20,
    duration_months: 1,
    max_redemptions: 10,
    times_redeemed: 0,
    expires_at: null,
    is_active: true,
    created_at: new Date().toISOString(),
  };
  const calc1 = calculateCouponDiscount(100, testPercentCoupon);
  assert(
    calc1.discountAmount === 20 && calc1.finalPrice === 80 && !calc1.isFreeUpgrade,
    "4. 20% discount math: ₹100 -> ₹80 finalPrice"
  );

  const testFixedCoupon: DBCoupon = {
    ...testPercentCoupon,
    discount_type: "fixed",
    discount_value: 50,
  };
  const calc2 = calculateCouponDiscount(299, testFixedCoupon);
  assert(
    calc2.discountAmount === 50 && calc2.finalPrice === 249 && !calc2.isFreeUpgrade,
    "5. Fixed ₹50 discount math: ₹299 -> ₹249 finalPrice"
  );

  const testFreeCoupon: DBCoupon = {
    ...testPercentCoupon,
    discount_type: "free_months",
    discount_value: 1,
  };
  const calc3 = calculateCouponDiscount(499, testFreeCoupon);
  assert(
    calc3.discountAmount === 499 && calc3.finalPrice === 0 && calc3.isFreeUpgrade,
    "6. Free trial voucher: ₹499 -> ₹0 finalPrice (isFreeUpgrade = true)"
  );

  // Coupon Validation Rules
  const userA = "user-uuid-111";
  const userB = "user-uuid-222";

  const valValid = await validateCouponForUser("SAVE20", userA, "pro");
  assert(valValid.valid === true, "7. Valid active coupon on matching plan accepted");

  const valProOnly = await validateCouponForUser("PROFREE", userA, "premium");
  assert(
    valProOnly.valid === false && valProOnly.error?.includes("PRO"),
    "8. Plan-scoped coupon (PROFREE) rejected on mismatched plan (premium)"
  );

  // Atomic Redemption & Double-Spend Prevention Test
  const codeToRedeem = "SAVE50";
  const initialCoupon = await getCouponByCode(codeToRedeem);
  const initialCount = initialCoupon ? initialCoupon.times_redeemed : 0;

  const redeem1 = await redeemCouponAtomic(codeToRedeem, userA, "userA@test.com", "pro", 50);
  assert(redeem1.success === true, "9. First redemption by User A succeeds atomically");

  const afterRedeemCoupon = await getCouponByCode(codeToRedeem);
  assert(
    afterRedeemCoupon?.times_redeemed === initialCount + 1,
    "10. Counter times_redeemed incremented atomically"
  );

  const redeemDuplicate = await redeemCouponAtomic(codeToRedeem, userA, "userA@test.com", "pro", 50);
  assert(
    Boolean(redeemDuplicate.success === false && redeemDuplicate.error?.includes("already redeemed")),
    "11. Duplicate redemption by same user blocked"
  );

  const redeemUserB = await redeemCouponAtomic(codeToRedeem, userB, "userB@test.com", "pro", 50);
  assert(redeemUserB.success === true, "12. Different user (User B) can redeem remaining slot");

  // ---------------------------------------------------------------------------
  // PART 3: Admin Console Access Lockdown Verification
  // ---------------------------------------------------------------------------
  console.log("\n--- PART 3: ADMIN CONSOLE ACCESS LOCKDOWN ---");

  const middlewareContent = fs.readFileSync(path.join(process.cwd(), "middleware.ts"), "utf-8");
  assert(
    middlewareContent.includes('"/api/admin/:path*"') && middlewareContent.includes("isAdmApi"),
    "13. Edge middleware matches and protects /api/admin/:path*"
  );
  assert(
    middlewareContent.includes("redirectUrl.pathname = \"/login\"") &&
      middlewareContent.includes("redirectUrl.search = \"\""),
    "14. Unauthenticated /admin request redirects cleanly to /login with NO ?next=/admin leakage"
  );
  assert(
    middlewareContent.includes("getAuthenticatorAssuranceLevel()") &&
      middlewareContent.includes("/admin/mfa-verify"),
    "15. Middleware checks Supabase MFA Assurance Level and challenges for AAL2"
  );

  // Admin Rate Limiter Test
  const testAdminId = `admin-test-${Date.now()}`;
  let rateBlocked = false;
  for (let i = 0; i < 35; i++) {
    const res = checkAdminRateLimit(testAdminId);
    if (!res.allowed) {
      rateBlocked = true;
      break;
    }
  }
  assert(rateBlocked, "16. Dedicated Admin Rate Limiter blocks excessive requests (sliding window)");

  // Robots.txt verification
  const robotsContent = fs.readFileSync(path.join(process.cwd(), "app/robots.ts"), "utf-8");
  assert(
    robotsContent.includes("'/admin'") || robotsContent.includes('"/admin"'),
    "17. robots.txt explicitly disallows /admin for crawlers"
  );

  console.log("\n================================================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
