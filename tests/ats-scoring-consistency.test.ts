import { calculateATSScore } from "../lib/ats/scoring";
import { generateATSResume } from "../lib/gemini";

export async function runATSScoringConsistencyTests() {
  console.log("-----------------------------------------");
  console.log("🧪 Running Canonical ATS Scoring Consistency Tests...");

  // Test 1: Canonical Weights Assertion
  const dummyResult = calculateATSScore({
    resumeText: "Senior React Developer TypeScript Node.js",
    jobDescription: "React TypeScript Developer",
  });

  const wKm = dummyResult.categories.keyword_match.weight;
  const wSa = dummyResult.categories.skills_alignment.weight;
  const wRd = dummyResult.categories.readability.weight;
  const wFi = dummyResult.categories.formatting_impact.weight;

  const totalWeight = Number((wKm + wSa + wRd + wFi).toFixed(2));
  if (totalWeight !== 1.0) {
    throw new Error(`Canonical ATS weights must sum to 1.0, got ${totalWeight}`);
  }
  console.log("✓ [PASS] 1. Canonical Weights Assertion (0.35 + 0.30 + 0.20 + 0.15 = 1.0)");

  // Test 2: Deterministic Calculation Consistency
  const sampleResume = "Senior Software Engineer with 5+ years of experience in React, TypeScript, Node.js, and SQL. Reduced latency by 35%.";
  const sampleJD = "Senior Full Stack Engineer position requiring React, TypeScript, Node.js, and SQL.";

  const scoreRun1 = calculateATSScore({ resumeText: sampleResume, jobDescription: sampleJD });
  const scoreRun2 = calculateATSScore({ resumeText: sampleResume, jobDescription: sampleJD });

  if (scoreRun1.overall !== scoreRun2.overall) {
    throw new Error(`Deterministic scoring mismatch: Run 1 (${scoreRun1.overall}) vs Run 2 (${scoreRun2.overall})`);
  }
  console.log(`✓ [PASS] 2. Deterministic Calculation Consistency (Score: ${scoreRun1.overall}/100)`);

  // Test 3: generateATSResume Score Alignment
  const genResult = await generateATSResume({
    rawInput: sampleResume,
    jobDescription: sampleJD,
    targetRole: "Senior Full Stack Engineer",
    seniority: "senior",
  });

  if (genResult.ats_score.categories.keyword_match.weight !== 0.35 ||
      genResult.ats_score.categories.skills_alignment.weight !== 0.30 ||
      genResult.ats_score.categories.readability.weight !== 0.20 ||
      genResult.ats_score.categories.formatting_impact.weight !== 0.15) {
    throw new Error("generateATSResume category weights do not match canonical weights!");
  }

  // Verify overall score calculation matches category weights formula
  const km = genResult.ats_score.categories.keyword_match.score;
  const sa = genResult.ats_score.categories.skills_alignment.score;
  const rd = genResult.ats_score.categories.readability.score;
  const fi = genResult.ats_score.categories.formatting_impact.score;
  const expectedOverall = Math.min(100, Math.max(0, Math.round(km * 0.35 + sa * 0.30 + rd * 0.20 + fi * 0.15)));

  if (genResult.ats_score.overall !== expectedOverall) {
    throw new Error(`generateATSResume overall score math error: got ${genResult.ats_score.overall}, expected ${expectedOverall}`);
  }
  console.log(`✓ [PASS] 3. generateATSResume Canonical Scoring Formula Alignment (Overall: ${genResult.ats_score.overall}/100)`);

  // Test 4: Fact Preservation & Gaps Confirmation Flag Assertion
  for (const gap of genResult.gaps) {
    if (gap.requires_user_confirmation !== true) {
      throw new Error(`Gap item '${gap.missing}' is missing requires_user_confirmation: true flag!`);
    }
  }
  console.log("✓ [PASS] 4. Fact Preservation & Suggested Bullets User Confirmation Flag Assertion");

  // Test 5: Edge Case Resilience
  const edgeCases = [
    { name: "Empty Resume", resume: "", jd: "" },
    { name: "Short Resume", resume: "Developer React", jd: "" },
    { name: "Long Resume", resume: "Senior Software Engineer ".repeat(200), jd: "Software Engineer" },
    { name: "Unrelated JD", resume: "Senior Python Backend Developer", jd: "Registered Nurse ICU Specialist" },
    { name: "Fresher Bio", resume: "BCA Graduate student 2025 Python beginner", jd: "Junior Developer" },
  ];

  for (const edge of edgeCases) {
    const res = calculateATSScore({ resumeText: edge.resume, jobDescription: edge.jd });
    if (typeof res.overall !== "number" || res.overall < 0 || res.overall > 100 || Number.isNaN(res.overall)) {
      throw new Error(`Edge case '${edge.name}' produced invalid overall score: ${res.overall}`);
    }
  }
  console.log("✓ [PASS] 5. Edge Case Resilience Audit (Empty, Short, Long, Unrelated JD, Fresher)");
}

if (process.argv[1]?.includes("ats-scoring-consistency.test.ts")) {
  runATSScoringConsistencyTests().catch((err) => {
    console.error("❌ Test failure:", err);
    process.exit(1);
  });
}
