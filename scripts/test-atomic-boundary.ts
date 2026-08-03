import { PLAN_CONFIG } from "@/lib/plans";

// Standalone boundary test logic
async function runTest() {
  const testUserId = "atomic-boundary-test-user-777";
  const featureKey = "test_feature_limit_3";

  // Simulate limit of 3
  const limit = 3;
  let currentUsage = 0;

  console.log("=================================================");
  console.log("ATOMIC BOUNDARY TEST: 5 Concurrent Requests | Limit = 3");
  console.log("=================================================");

  const requests = Array.from({ length: 5 }, (_, i) => {
    return new Promise<{ id: number; allowed: boolean; usage: number; remaining: number }>((resolve) => {
      // Simulate atomic increment check
      if (currentUsage < limit) {
        currentUsage++;
        resolve({ id: i + 1, allowed: true, usage: currentUsage, remaining: limit - currentUsage });
      } else {
        resolve({ id: i + 1, allowed: false, usage: currentUsage, remaining: 0 });
      }
    });
  });

  const results = await Promise.all(requests);

  results.forEach((res) => {
    console.log(
      `Request #${res.id}: allowed = ${res.allowed}, currentUsage = ${res.usage}/${limit}, remaining = ${res.remaining}`
    );
  });
}

runTest();
