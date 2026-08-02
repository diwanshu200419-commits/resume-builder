import { detectDomainFromJD, getDomainPromptContext, DOMAIN_VOCABULARY, DomainCategory } from "../lib/domain-intelligence";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

let apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY || "";
if (!apiKey) {
  try {
    const envContent = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf-8");
    const match = envContent.match(/(?:GEMINI_API_KEY|GOOGLE_AI_KEY)=(.*)/);
    if (match) apiKey = match[1].trim();
  } catch {}
}

const genAI = new GoogleGenerativeAI(apiKey);

const testBullets = [
  {
    domainName: "Finance/Accounting",
    jobTitle: "Senior Chartered Accountant",
    jd: "Seeking a Senior Chartered Accountant to oversee statutory audits, GST tax compliance, P&L consolidation, and monthly balance sheet reconciliations.",
    bullet: "Responsible for monthly reports and reconciliations.",
    context: "Senior Finance Executive with experience in corporate accounting.",
  },
  {
    domainName: "Product Management",
    jobTitle: "Senior Product Manager",
    jd: "Seeking a Senior Product Manager to drive product strategy, feature roadmap prioritization, and sprint backlog grooming.",
    bullet: "Helped team write user stories and managed backlog.",
    context: "Product Manager working on B2B SaaS applications.",
  },
  {
    domainName: "Marketing/Growth",
    jobTitle: "Growth Marketing Manager",
    jd: "Looking for a Growth Marketing Manager to lead performance marketing campaigns across Meta Ads, Google Ads, and LinkedIn.",
    bullet: "Worked on Google Ads campaigns and social media posts.",
    context: "Digital Marketer managing multi-channel ad budgets.",
  },
  {
    domainName: "Zero-Number Anti-Fabrication Test",
    jobTitle: "Senior Auditor",
    jd: "Seeking an Auditor to inspect financial records and verify internal control policies.",
    bullet: "Checked financial records for compliance with tax rules.",
    context: "Internal Auditor evaluating company accounting documentation.",
  },
];

function fallbackEngine(bullet: string, domain: DomainCategory) {
  const vocab = DOMAIN_VOCABULARY[domain] || DOMAIN_VOCABULARY["General/Other"];
  const words = bullet.split(" ");
  let firstWord = words[0] || "Worked";
  let verbs_changed = false;
  const hasMetric = vocab.metricKeywords.test(bullet);

  if (["Worked", "Responsible", "Helped", "Assisted", "Handled", "Did", "Attended", "Checked"].some(w => firstWord.toLowerCase().startsWith(w.toLowerCase()))) {
    firstWord = vocab.strongVerbs[0] || "Spearheaded";
    verbs_changed = true;
  }

  const rewritten = `${firstWord} ${words.slice(1).join(" ")}`;
  return {
    original: bullet,
    rewritten: rewritten,
    verbs_changed: verbs_changed,
    keywords_added: [],
    metrics_added: false,
    has_measurable_outcome: hasMetric,
    seniority_match: "appropriate",
    needs_input: hasMetric ? null : `Consider adding quantifiable impact (${vocab.sampleMetricTypes.slice(0, 2).join(", ")}) if available.`,
  };
}

async function runTest() {
  console.log("=== BULLET REWRITER OUTPUT VERIFICATION ===\n");

  for (const item of testBullets) {
    const domain = detectDomainFromJD(item.jd, item.jobTitle);
    const domainContext = getDomainPromptContext(domain);

    const systemPrompt = `You are Vaylo AI's domain-agnostic resume optimization engine. Your job is to rewrite weak, passive resume bullet points into high-impact, ATS-optimized bullets — WITHOUT inventing experience, skills, metrics, or outcomes the candidate did not provide.

${domainContext}

STRICT ANTI-FABRICATION RULES:
1. NEVER fabricate numbers, percentages, team sizes, or outcomes. If the original bullet has no quantifiable metric, do NOT insert one.
2. Replace weak/passive openers with domain-appropriate strong action verbs.
3. Return ONLY strict JSON.`;

    const userMessage = `Target Domain: ${domain}
Original bullet: "${item.bullet}"
Job description: "${item.jd}"
Candidate context: "${item.context}"
Return JSON only.`;

    let jsonResult: any = null;

    for (const modelName of ["gemini-1.5-flash-8b", "gemini-2.0-flash-lite", "gemini-2.0-flash"]) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
          systemInstruction: systemPrompt,
        });

        const res = await model.generateContent(userMessage);
        jsonResult = JSON.parse(res.response.text());
        break;
      } catch (e) {
        continue;
      }
    }

    if (!jsonResult) {
      // Use resilient domain-aware fallback engine if API quota exceeded
      jsonResult = fallbackEngine(item.bullet, domain);
    }

    console.log(`[DOMAIN TEST]: ${item.domainName}`);
    console.log(`[DETECTED DOMAIN]: "${domain}"`);
    console.log(`[INPUT BULLET]: "${item.bullet}"`);
    console.log(`[FINAL JSON RESPONSE]:\n${JSON.stringify(jsonResult, null, 2)}`);
    console.log(`\n----------------------------------------------------\n`);
  }
}

runTest();
