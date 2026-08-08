import { parseResumeForSimulation, computeFixationPath, generateVerdict } from "../lib/recruiter-sim/fixationModel.ts";

console.log("=========================================");
console.log("🔬 Recruiter Simulation Deep Determinism & Edge Case Audit");
console.log("=========================================\n");

// TEST 1a: Repeat-run identity
const RESUME_1A = `Senior Full Stack Engineer with 4+ years of experience architecting React, Next.js, and PostgreSQL web applications. Reduced API latency by 45% and spearheaded microservice development for 100k+ daily active users.`;

function runFullPipeline(text) {
  const parsed = parseResumeForSimulation(text);
  const zones = computeFixationPath(parsed);
  const verdict = generateVerdict(zones, parsed);
  return { parsed, zones, verdict };
}

const run1 = runFullPipeline(RESUME_1A);
const run2 = runFullPipeline(RESUME_1A);
const run3 = runFullPipeline(RESUME_1A);

const json1 = JSON.stringify(run1, null, 2);
const json2 = JSON.stringify(run2, null, 2);
const json3 = JSON.stringify(run3, null, 2);

console.log("--- TEST 1a: Repeat-run Identity Check ---");
const isIdentical = (json1 === json2) && (json2 === json3);
console.log("Run 1 vs Run 2 Byte Identical:", json1 === json2);
console.log("Run 2 vs Run 3 Byte Identical:", json2 === json3);
console.log("Result:", isIdentical ? "PASS" : "FAIL");

// TEST 1b: Whitespace / formatting sensitivity
const RESUME_1B_EXTRA_SPACES = `Senior Full Stack Engineer   with 4+ years of experience architecting React, Next.js, and PostgreSQL web applications. Reduced API latency by 45% and spearheaded microservice development for 100k+ daily active users.\n\n`;

const run1b = runFullPipeline(RESUME_1B_EXTRA_SPACES);
const json1b = JSON.stringify(run1b, null, 2);

console.log("\n--- TEST 1b: Whitespace Sensitivity Check ---");
console.log("Raw JSON Equal:", json1 === json1b);
console.log("Verdict Equal:", run1.verdict.outcome === run1b.verdict.outcome);
console.log("Fixation Durations Equal:", JSON.stringify(run1.zones.map(z => z.fixationDurationMs)) === JSON.stringify(run1b.zones.map(z => z.fixationDurationMs)));

// TEST 2a: Zero-bullet dense paragraph
const RESUME_2A = `John Smith is a software engineer who has worked at three companies over the past six years building web applications and has experience with React, Node, and databases and has led small teams on several projects delivering results on time.`;

const run2a = runFullPipeline(RESUME_2A);
console.log("\n--- TEST 2a: Zero-Bullet Dense Paragraph Check ---");
console.log("isDensePlainText:", run2a.parsed.isDensePlainText);
console.log("Outcome:", run2a.verdict.outcome);
console.log("Findings Count:", run2a.verdict.keyFindings.length);
console.log("Dense Penalty Finding Present:", run2a.verdict.keyFindings.some(f => f.type === "dense_text_penalty"));

// TEST 2b: Metric in name/header line
const RESUME_2B = `Jane Doe — #1 Ranked Sales Rep (Q3 2024)\nAccount Executive at Acme Corp\n- Closed deals with enterprise clients\n- Managed a book of business`;

const run2b = runFullPipeline(RESUME_2B);
console.log("\n--- TEST 2b: Metric in Header Line Check ---");
console.log("Header Metrics:", run2b.parsed.titleCompanyLine ? run2b.zones.find(z => z.zoneId === "zone_name")?.metricMatches : []);
console.log("Header Zone Weight:", run2b.zones.find(z => z.zoneId === "zone_name")?.finalWeight);
console.log("Bullet 1 Weight:", run2b.zones.find(z => z.zoneId === "bullet_1")?.finalWeight);

// TEST 2c: Short resume (full budget unused)
const RESUME_2C = `Alex Kim\nMarketing Coordinator at Nova Inc\n- Grew email list by 20%`;

const run2c = runFullPipeline(RESUME_2C);
console.log("\n--- TEST 2c: Short Resume (Full Budget Unused) Check ---");
console.log("Total Zones:", run2c.zones.length);
console.log("Reached Zones Count:", run2c.zones.filter(z => z.reached).length);
console.log("Unreached Zones Count:", run2c.zones.filter(z => !z.reached).length);

// TEST 2d: Extremely long single bullet
const RESUME_2D = `Alex Kim\nSenior Product Manager\n- Led a cross-functional initiative spanning engineering, product, design, and customer success teams to redesign the entire onboarding flow from the ground up, resulting in a significant improvement to activation metrics that was noticed by leadership and presented at the quarterly all-hands meeting to widespread positive feedback`;

const run2d = runFullPipeline(RESUME_2D);
console.log("\n--- TEST 2d: Extremely Long Single Bullet Check ---");
console.log("Bullet 1 Word Count:", run2d.parsed.bullets[0]?.wordCount);
console.log("Bullet 1 Reached:", run2d.zones.find(z => z.zoneId === "bullet_1")?.reached);
console.log("Bullet 1 Fixation Duration (ms):", run2d.zones.find(z => z.zoneId === "bullet_1")?.fixationDurationMs);
