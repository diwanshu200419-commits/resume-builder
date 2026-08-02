import { detectDomainFromJD } from "../lib/domain-intelligence";

const testJDs = [
  {
    name: "1. Chartered Accountant / Finance JD",
    title: "Senior Chartered Accountant",
    text: "We are seeking a Senior Chartered Accountant to oversee statutory audits, GST tax compliance, P&L consolidation, and monthly balance sheet reconciliations. The ideal candidate will manage internal controls, treasury operations, and tax returns for our group entities.",
  },
  {
    name: "2. Senior Product Manager JD",
    title: "Senior Technical Product Manager",
    text: "Seeking a Senior Technical Product Manager to drive product strategy, feature roadmap prioritization, and sprint backlog grooming. You will collaborate with engineering and design teams to launch high-impact SaaS features, track retention metrics, and conduct user research.",
  },
  {
    name: "3. Performance Marketing / Growth JD",
    title: "Growth Marketing Manager",
    text: "Looking for a Growth Marketing Manager to lead performance marketing campaigns across Meta Ads, Google Ads, and LinkedIn. You will optimize customer acquisition cost (CAC), track return on ad spend (ROAS), and improve landing page conversion funnels.",
  },
  {
    name: "4. HR / Talent Acquisition JD",
    title: "HR & Talent Acquisition Lead",
    text: "Hiring an HR & Talent Acquisition Lead to manage full-cycle recruitment across technical and business functions. You will lead candidate sourcing, employee onboarding programs, performance appraisals, labor law compliance, and employee retention strategies.",
  },
  {
    name: "5. Software/Backend Engineer JD (Control)",
    title: "Senior Backend Engineer",
    text: "We are hiring a Senior Backend Engineer to architect microservices, optimize PostgreSQL query performance, and deploy containerized services on Kubernetes. You will build high-throughput REST and GraphQL APIs using Node.js, Redis, and TypeScript.",
  },
  {
    name: "6. Ambiguous / Mixed JD (Growth Product Manager)",
    title: "Growth Product Manager",
    text: "We are looking for a Growth Product Manager who sits at the intersection of product roadmap execution and user acquisition funnels. You will run growth A/B experiments, optimize onboarding conversion rates, define feature requirements, and partner with performance marketing.",
  },
];

console.log("=== DOMAIN CLASSIFIER VERIFICATION ===\n");
testJDs.forEach((jd) => {
  const domain = detectDomainFromJD(jd.text, jd.title);
  console.log(`[TEST]: ${jd.name}`);
  console.log(`[JOB TITLE]: "${jd.title}"`);
  console.log(`[JD TEXT]: "${jd.text}"`);
  console.log(`[DETECTED DOMAIN]: "${domain}"\n----------------------------------------------------\n`);
});
