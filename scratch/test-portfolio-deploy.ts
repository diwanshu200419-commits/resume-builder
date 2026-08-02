import { generatePortfolioHTML, autoSuggestTemplate, PortfolioData } from "../lib/portfolio-templates";
import { detectDomainFromJD } from "../lib/domain-intelligence";

const sampleResumeData: PortfolioData = {
  name: "Priya Sharma",
  title: "Senior Chartered Accountant & Finance Manager",
  bio: "Results-driven Finance Leader with 6+ years experience managing GST audits, P&L consolidation, statutory compliance, and balance sheet reconciliations across multinational logistics group entities.",
  skills: ["Statutory Audits", "GST Compliance", "P&L Consolidation", "Ind AS / IFRS", "SAP ERP", "Cash Flow Forecasting", "Internal Controls"],
  projects: [
    {
      title: "Group P&L Restructuring & Audit Consolidation",
      description: "Directed annual statutory audit across 4 group entities, ensuring 100% Ind AS compliance and reducing close-cycle time by 5 days.",
      tech: "SAP ERP • Financial Modeling • Ind AS",
    },
    {
      title: "Tax Compliance & Cost Reduction Initiative",
      description: "Identified tax deduction opportunities and streamlined GST input tax credit reconciliations, achieving 8% operational cost savings.",
      tech: "Taxation • Internal Audit • Excel Analytics",
    },
  ],
  experience: [
    {
      role: "Finance & Accounting Manager",
      company: "Apex Global Logistics",
      period: "2021 — Present",
      summary: "Spearheaded corporate accounting, financial planning, statutory filings, and bank relationship management.",
    },
  ],
};

console.log("=== PORTFOLIO TEMPLATES VERIFICATION ===\n");

const templates: Array<"minimal" | "technical" | "executive"> = ["minimal", "technical", "executive"];

templates.forEach((t) => {
  const html = generatePortfolioHTML(sampleResumeData, t);
  const hasName = html.includes("Priya Sharma");
  const hasTitle = html.includes("Senior Chartered Accountant");
  console.log(`[TEMPLATE TEST]: "${t}"`);
  console.log(`  HTML Output Length: ${html.length} chars`);
  console.log(`  Candidate Name Found: ${hasName}`);
  console.log(`  Title Found: ${hasTitle}`);
  console.log(`  DOCTYPE Verified: ${html.startsWith("<!DOCTYPE html>")}\n----------------------------------------------------\n`);
});

const suggestedDomainTemplate = autoSuggestTemplate(sampleResumeData.bio);
console.log(`[AUTO-SUGGEST DOMAIN TEST]: Resume domain template auto-suggested = "${suggestedDomainTemplate}"`);
