import { evaluateATSV2, ATS_SCORING_WEIGHTS, normalizeSkill } from "../lib/ats-v2.ts";

console.log("🧪 Running Vaylo ATS V2 Unit & Integration Tests...\n");

let passed = 0;
let total = 0;

function assert(condition, name) {
  total++;
  if (condition) {
    console.log(`✓ [PASS] ${name}`);
    passed++;
  } else {
    console.error(`✗ [FAIL] ${name}`);
    throw new Error(`Test failed: ${name}`);
  }
}

// Test 1: Weight Sum Validation
const weightSum = Object.values(ATS_SCORING_WEIGHTS).reduce((a, b) => a + b, 0);
assert(weightSum === 100, "1. ATS_SCORING_WEIGHTS sum equals exactly 100 points");

// Test 2: Keyword Normalization
assert(normalizeSkill("React.js") === "react", "2a. Normalizes 'React.js' -> 'react'");
assert(normalizeSkill("PostgreSQL") === "postgresql", "2b. Normalizes 'PostgreSQL' -> 'postgresql'");
assert(normalizeSkill("Machine Learning") === "machine_learning", "2c. Normalizes 'Machine Learning' -> 'machine_learning'");

const strongResume = `
John Doe
john@example.com | 2024 - Present
Senior Software Engineer

SKILLS
React, TypeScript, Node.js, PostgreSQL, Docker, AWS

EXPERIENCE
Lead Software Engineer — Tech Corp (2022 - 2026)
• Architected high-throughput React and Node.js microservices handling 500k monthly active users.
• Spearheaded database query optimizations in PostgreSQL, reducing query latency by 42%.
• Deployed cloud containerized services using Docker and AWS ECS.

PROJECTS
E-Commerce Platform (2024)
• Built responsive React frontend with TypeScript and state management.

EDUCATION
B.Tech Computer Science (2022)
`;

const partialResume = `
Jane Smith
jane@example.com
Developer

SKILLS
HTML, CSS, JavaScript, React

EXPERIENCE
Developer — Small Web Shop (2023 - 2024)
• Worked on website features using JavaScript.
`;

const poorResume = `
Bob
Bob's Resume
Looking for a job.
`;

const keywordStuffedResume = `
Alex
alex@example.com
React React React React React Node Node Node PostgreSQL AWS AWS AWS
`;

const fresherResume = `
Sam Student
sam@example.com | B.Tech Graduate 2026 | Student

SKILLS
React, TypeScript, Python, SQL

PROJECTS
Full-Stack Web App (2025)
• Architected a React and Node.js application for student portal management.
• Integrated PostgreSQL database with REST API endpoints.
`;

const targetJD = `
Senior Full Stack Engineer Position
Requirements:
Must have 4+ years experience with React, TypeScript, Node.js, and PostgreSQL.
Required: Docker, AWS cloud infrastructure.
Preferred: GraphQL, Next.js.
`;

// Test 3: Relative Score Ranking (Strong Match > Partial Match > Poor Match)
const strongResult = evaluateATSV2(strongResume, targetJD);
const partialResult = evaluateATSV2(partialResume, targetJD);
const poorResult = evaluateATSV2(poorResume, targetJD);

assert(strongResult.ats_score > partialResult.ats_score, `3a. Strong match (${strongResult.ats_score}) > Partial match (${partialResult.ats_score})`);
assert(partialResult.ats_score > poorResult.ats_score, `3b. Partial match (${partialResult.ats_score}) > Poor match (${poorResult.ats_score})`);

// Test 4: Keyword Stuffing Penalty / Diminishing Returns
const stuffedResult = evaluateATSV2(keywordStuffedResume, targetJD);
assert(strongResult.ats_score > stuffedResult.ats_score, `4. Genuinely structured evidence (${strongResult.ats_score}) outperforms keyword stuffing (${stuffedResult.ats_score})`);

// Test 5: Fresher Project Credit
const fresherResult = evaluateATSV2(fresherResume, targetJD);
assert(fresherResult.candidate_context === "Fresher/Student", "5a. Correctly detects candidate_context as Fresher/Student");
assert(fresherResult.score_breakdown.projects.score > 0, "5b. Awards meaningful project score to fresher");

// Test 6: No-JD Mode Handling
const noJDResult = evaluateATSV2(strongResume, "");
assert(noJDResult.analysis_type === "RESUME_QUALITY", "6a. Sets analysis_type to RESUME_QUALITY when no JD provided");
assert(noJDResult.confidence === "MEDIUM", "6b. Flags confidence as MEDIUM when no JD provided");

// Test 7: Deterministic Score Mathematics
const runA = evaluateATSV2(strongResume, targetJD);
const runB = evaluateATSV2(strongResume, targetJD);
assert(runA.ats_score === runB.ats_score, `7a. Deterministic execution score stability (${runA.ats_score} === ${runB.ats_score})`);

const categorySum = Object.values(runA.score_breakdown).reduce((sum, item) => sum + item.score, 0);
assert(categorySum === runA.ats_score, `7b. Category breakdown sum (${categorySum}) equals final ATS score (${runA.ats_score})`);

console.log(`\n=========================================`);
console.log(`Results: ${passed}/${total} Vaylo ATS V2 Tests Passed (100% Success)`);
console.log(`=========================================\n`);
