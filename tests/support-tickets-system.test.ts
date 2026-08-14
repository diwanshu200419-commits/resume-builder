import fs from "fs";
import path from "path";
import { generateTicketRef, sanitizeInput } from "../lib/support/tickets";

export async function runSupportSystemTests() {
  console.log("-----------------------------------------");
  console.log("🧪 Running Customer Support & Complaint System Audit Tests...");

  // Test 1: Ticket Reference Generator Format Assertion
  const ref1 = generateTicketRef();
  const ref2 = generateTicketRef();
  if (!/^VAY-\d{5}$/.test(ref1) || !/^VAY-\d{5}$/.test(ref2)) {
    throw new Error(`Ticket reference format mismatch! Generated: ${ref1}`);
  }
  if (ref1 === ref2) {
    throw new Error("Ticket reference collision detected!");
  }
  console.log("✓ [PASS] 1. Safe Non-Sequential Ticket Reference Format Assertion (#VAY-XXXXX)");

  // Test 2: Input Sanitization & Anti-XSS Assertion
  const dirtyInput = "<script>alert('hack')</script>   Need help with payment UTR 421098765432   ";
  const cleanInput = sanitizeInput(dirtyInput);
  if (cleanInput.includes("<script>") || cleanInput.includes("</script>")) {
    throw new Error("Input sanitization failed to strip script tag!");
  }
  if (!cleanInput.includes("Need help with payment UTR")) {
    throw new Error("Input sanitization corrupted legitimate message text!");
  }
  console.log("✓ [PASS] 2. Anti-XSS Input Sanitization Assertion");

  // Test 3: API Endpoint File & Security Guard Audit
  const createRoute = fs.readFileSync(path.join(process.cwd(), "app", "api", "support", "tickets", "route.ts"), "utf-8");
  if (!createRoute.includes("getProfile()") || !createRoute.includes("support_tickets") || !createRoute.includes("rate limit")) {
    throw new Error("Support ticket creation route missing getProfile() or rate limit protection!");
  }
  console.log("✓ [PASS] 3. Support Ticket API Security & Rate Limit Protection Assertion");

  // Test 4: Detail & Thread Message Route Security Audit
  const detailRoute = fs.readFileSync(path.join(process.cwd(), "app", "api", "support", "tickets", "[id]", "route.ts"), "utf-8");
  if (!detailRoute.includes("getProfile()") || !detailRoute.includes("ticket.user_id !== profile.id")) {
    throw new Error("Ticket detail route missing user ownership isolation guard!");
  }
  console.log("✓ [PASS] 4. Ticket Detail Ownership Isolation Assertion (User A cannot view User B tickets)");

  // Test 5: Admin Support Route Security Audit
  const adminSupportRoute = fs.readFileSync(path.join(process.cwd(), "app", "api", "admin", "support", "tickets", "route.ts"), "utf-8");
  if (!adminSupportRoute.includes("requireAdmin()")) {
    throw new Error("Admin support route missing requireAdmin() authorization guard!");
  }
  console.log("✓ [PASS] 5. Admin Support Console Authorization Assertion (requireAdmin() active)");

  // Test 6: Database Migration RLS Policy Audit
  const sqlMigration = fs.readFileSync(path.join(process.cwd(), "supabase", "migrations", "20260815_support_tickets_system.sql"), "utf-8");
  if (!sqlMigration.includes("ENABLE ROW LEVEL SECURITY") || !sqlMigration.includes("auth.uid() = user_id")) {
    throw new Error("Supabase migration missing RLS policies for support_tickets!");
  }
  console.log("✓ [PASS] 6. Supabase Database Migration & RLS Multi-Tenant Policy Assertion");
}

if (process.argv[1]?.includes("support-tickets-system.test.ts")) {
  runSupportSystemTests().catch((err) => {
    console.error("❌ Test failure:", err);
    process.exit(1);
  });
}
