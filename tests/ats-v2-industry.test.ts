import assert from "assert";
import { evaluateATSV2, INDUSTRY_PROFILES, detectIndustryProfile } from "../lib/ats-v2";

export function runIndustryProfileTests() {
  // Test 1: Assert all industry profile weights sum to 100
  for (const [key, profile] of Object.entries(INDUSTRY_PROFILES)) {
    const sum = Object.values(profile.weights).reduce((a, b) => a + b, 0);
    assert.strictEqual(sum, 100, `Profile '${key}' weights must sum to 100`);
  }

  // Test 2: Auto-detection assertions
  const techResume = "Senior Software Engineer with experience in React, Node.js, Python, AWS, and Docker.";
  const financeResume = "Senior Financial Analyst specializing in banking, portfolio risk, audit, and CFA investment models.";
  const marketingResume = "Growth Marketing Manager skilled in SEO, SEM, social media campaigns, CAC, and sales funnels.";
  const healthcareResume = "Registered Nurse (RN) providing clinical patient care in hospital emergency room settings.";
  const execResume = "Chief Technology Officer (CTO) leading cross-functional teams, corporate strategy, P&L, and roadmaps.";

  assert.strictEqual(detectIndustryProfile(techResume), "tech");
  assert.strictEqual(detectIndustryProfile(financeResume), "finance");
  assert.strictEqual(detectIndustryProfile(marketingResume), "marketing");
  assert.strictEqual(detectIndustryProfile(healthcareResume), "healthcare");
  assert.strictEqual(detectIndustryProfile(execResume), "executive");

  // Test 3: Tech Profile gives higher Skills & Projects max (35 & 15 pts)
  const techEval = evaluateATSV2(techResume, "Software Engineer React Node.js", 0, "tech");
  assert.strictEqual(techEval.score_breakdown?.skills.max, 35);
  assert.strictEqual(techEval.score_breakdown?.projects.max, 15);
  assert.strictEqual(techEval.industry_profile, "tech");

  // Test 4: Finance Profile gives higher Impact max (25 pts)
  const finEval = evaluateATSV2(financeResume, "Finance Analyst Banking Portfolio", 0, "finance");
  assert.strictEqual(finEval.score_breakdown?.impact.max, 25);
  assert.strictEqual(finEval.industry_profile, "finance");

  // Test 5: Healthcare Profile gives higher Education/Certs max (20 pts)
  const healthEval = evaluateATSV2(healthcareResume, "Clinical Nurse Patient Care RN", 0, "healthcare");
  assert.strictEqual(healthEval.score_breakdown?.education.max, 20);
  assert.strictEqual(healthEval.industry_profile, "healthcare");

  // Test 6: Determinism Assertion
  const eval1 = evaluateATSV2(techResume, "React Developer", 0, "tech");
  const eval2 = evaluateATSV2(techResume, "React Developer", 0, "tech");
  assert.strictEqual(eval1.ats_score, eval2.ats_score);

  return true;
}

if (typeof process !== "undefined" && process.argv[1]?.endsWith("ats-v2-industry.test.ts")) {
  runIndustryProfileTests();
  console.log("✓ ATS V2 Industry Profiles tests passed!");
}
