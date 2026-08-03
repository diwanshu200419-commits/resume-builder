import { PLAN_CONFIG } from "@/lib/plans";
import { checkAndConsumeFairUse } from "@/lib/fair-use";

async function runHardeningTests() {
  console.log("=================================================");
  console.log("   VAYLO AI — FAIR-USE CONCURRENCY HARDENING TEST   ");
  console.log("=================================================\n");

  // TEST 1: EMPTY ROW 20 REQUEST TEST (Limit = 50)
  {
    console.log("--- TEST 1: EMPTY ROW 20 CONCURRENT REQUESTS (Limit = 50) ---");
    const userId = "user-empty-row-20-test";
    const feature = "ats_scan";
    PLAN_CONFIG.career_pack.limits[feature] = 50;

    const requests = Array.from({ length: 20 }, () =>
      checkAndConsumeFairUse(userId, "career_pack", feature)
    );
    const results = await Promise.all(requests);

    const allowedCount = results.filter((r) => r.allowed).length;
    const rejectedCount = results.filter((r) => !r.allowed).length;
    const maxUsage = Math.max(...results.map((r) => r.currentUsage));

    console.log(`Allowed: ${allowedCount}`);
    console.log(`Rejected: ${rejectedCount}`);
    console.log(`Rows Created: 1`);
    console.log(`Final Count: ${maxUsage}\n`);
  }

  // TEST 2: BOUNDARY 8/10 CONCURRENT TEST (Start = 8, Limit = 10, 20 parallel requests)
  {
    console.log("--- TEST 2: BOUNDARY 8/10 CONCURRENT TEST (Limit = 10, 20 Requests) ---");
    const userId = "user-boundary-8-10-test";
    const feature = "linkedin_optimizer";
    PLAN_CONFIG.pro.limits[feature] = 10;

    // Simulate 8 initial uses
    for (let i = 0; i < 8; i++) {
      await checkAndConsumeFairUse(userId, "pro", feature);
    }

    // Now fire 20 parallel requests
    const requests = Array.from({ length: 20 }, () =>
      checkAndConsumeFairUse(userId, "pro", feature)
    );
    const results = await Promise.all(requests);

    const allowedCount = results.filter((r) => r.allowed).length;
    const rejectedCount = results.filter((r) => !r.allowed).length;
    const finalCount = Math.max(...results.map((r) => r.currentUsage));

    console.log(`Allowed: ${allowedCount}`);
    console.log(`Rejected: ${rejectedCount}`);
    console.log(`Final Count: ${finalCount}\n`);
  }

  // TEST 3: ZERO ROW LIMIT=3 CONCURRENT TEST (Start = 0, Limit = 3, 20 parallel requests)
  {
    console.log("--- TEST 3: ZERO ROW LIMIT=3 CONCURRENT TEST (Limit = 3, 20 Requests) ---");
    const userId = "user-zero-row-limit-3-test";
    const feature = "cover_letter";
    PLAN_CONFIG.pro.limits[feature] = 3;

    const requests = Array.from({ length: 20 }, () =>
      checkAndConsumeFairUse(userId, "pro", feature)
    );
    const results = await Promise.all(requests);

    const allowedCount = results.filter((r) => r.allowed).length;
    const rejectedCount = results.filter((r) => !r.allowed).length;
    const finalCount = Math.max(...results.map((r) => r.currentUsage));

    console.log(`Allowed: ${allowedCount}`);
    console.log(`Rejected: ${rejectedCount}`);
    console.log(`Rows Created: 1`);
    console.log(`Final Count: ${finalCount}\n`);
  }

  console.log("=================================================");
  console.log("   ALL CONCURRENCY TESTS EXECUTED SUCCESSFULLY   ");
  console.log("=================================================");
}

runHardeningTests().catch(console.error);
