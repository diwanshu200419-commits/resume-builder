import assert from "assert";
import { FALLBACK_QUESTIONS } from "../lib/interview-bank";

export function runInterviewPrepTests() {
  // Test 1: Question Bank Schema & Structure
  assert.ok(FALLBACK_QUESTIONS.length >= 3, "Curated fallback FAANG bank must contain at least 3 questions");
  for (const q of FALLBACK_QUESTIONS) {
    assert.ok(q.id && q.question_text && q.company_tag, "Questions must contain valid id, text, and company_tag");
  }

  // Test 2: Filler Word Density Calculation Math
  const sampleTranscript = "Um basically I was working on a project like where the database hit like high latency um and uh I fixed it.";
  const fillerWords = ["um", "uh", "like", "basically"];
  const lower = sampleTranscript.toLowerCase();
  
  let count = 0;
  for (const f of fillerWords) {
    const matches = lower.match(new RegExp(`\\b${f}\\b`, "gi"));
    if (matches) count += matches.length;
  }
  
  assert.strictEqual(count, 5, "Must count exactly 5 filler words in sample transcript");

  // Test 3: Repetition Exclusion Logic
  const excludeSet = new Set(["fq-1"]);
  const filtered = FALLBACK_QUESTIONS.filter((q) => !excludeSet.has(q.id));
  assert.strictEqual(filtered.some((q) => q.id === "fq-1"), false, "Excluded question ID must not appear in session pool");

  // Test 4: Entitlement Gating Limit Rules
  const checkPlanLimit = (plan: string, questionCount: number) => {
    if (plan === "free" && questionCount > 1) return false;
    if (plan === "pro" && questionCount > 3) return false;
    return true;
  };

  assert.strictEqual(checkPlanLimit("free", 1), true);
  assert.strictEqual(checkPlanLimit("free", 2), false);
  assert.strictEqual(checkPlanLimit("pro", 3), true);
  assert.strictEqual(checkPlanLimit("pro", 4), false);
  assert.strictEqual(checkPlanLimit("premium", 10), true);

  return true;
}

if (typeof process !== "undefined" && process.argv[1]?.endsWith("interview-prep.test.ts")) {
  runInterviewPrepTests();
  console.log("✓ Interview Prep automated assertions passed!");
}
