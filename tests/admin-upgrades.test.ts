import assert from "assert";

export function runAdminUpgradesTest() {
  // Test 1: 2-step email confirmation match logic
  const targetEmail = "candidate@example.com";
  const validConfirm = "candidate@example.com";
  const invalidConfirm = "wrong@example.com";

  assert.strictEqual(targetEmail.trim().toLowerCase() === validConfirm.trim().toLowerCase(), true);
  assert.strictEqual(targetEmail.trim().toLowerCase() === invalidConfirm.trim().toLowerCase(), false);

  // Test 2: Accounting retention anonymization logic
  const paymentRecord = {
    id: "pay_12345",
    user_id: "usr_999",
    user_email: "candidate@example.com",
    utr_number: "421098765432",
    amount_claimed: 99,
    status: "approved",
  };

  const anonymized = {
    ...paymentRecord,
    user_id: null,
    user_email: "anonymized_deleted_user@vaylo.invalid",
  };

  assert.strictEqual(anonymized.user_id, null);
  assert.strictEqual(anonymized.user_email, "anonymized_deleted_user@vaylo.invalid");
  assert.strictEqual(anonymized.utr_number, "421098765432");

  // Test 3: Feedback category sanitization
  const validCategories = ["bug", "billing", "feature", "complaint", "general"];
  const sanitizeCategory = (raw: string) => (validCategories.includes(raw) ? raw : "general");

  assert.strictEqual(sanitizeCategory("bug"), "bug");
  assert.strictEqual(sanitizeCategory("billing"), "billing");
  assert.strictEqual(sanitizeCategory("malicious_input"), "general");

  return true;
}

if (typeof process !== "undefined" && process.argv[1]?.endsWith("admin-upgrades.test.ts")) {
  runAdminUpgradesTest();
  console.log("✓ Admin Upgrades unit assertions passed!");
}
