import { createClient } from "@supabase/supabase-js";
import { GENERIC_FALLBACK_QUESTION_SET, normalizeRole } from "../lib/interview/getOrGenerateQuestions.ts";

const TOP_ROLES = [
  "Software Engineer", "Frontend Developer", "Backend Engineer", "Full Stack Developer", "System Architect",
  "DevOps Engineer", "Data Scientist", "Data Analyst", "Machine Learning Engineer", "Product Manager",
  "UI/UX Designer", "Product Designer", "Sales Account Executive", "Customer Success Manager", "Marketing Manager",
  "SEO Specialist", "Financial Analyst", "Accountant", "HR Manager", "Recruiter",
  "Operations Manager", "Business Analyst", "Project Manager", "Scrum Master", "Legal Counsel",
  "Cybersecurity Engineer", "QA Automation Engineer", "Solutions Architect", "Cloud Engineer", "Mobile Developer",
  "iOS Engineer", "Android Developer", "Database Administrator", "Technical Program Manager", "Growth Marketer",
  "Content Strategist", "Copywriter", "Supply Chain Manager", "Logistics Coordinator", "Clinical Research Associate",
  "Registered Nurse", "Veterinary Technician", "Structural Engineer", "Mechanical Engineer", "Electrical Engineer",
  "Civil Engineer", "Executive Assistant", "Chief Technology Officer", "VP of Engineering", "Chief Executive Officer"
];

const SENIORITIES = ["entry-level", "mid-level", "senior", "leadership"];
const COMPANY_STYLES = [null, "google", "amazon", "meta", "netflix"];

async function seedCache() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    console.log("⚠️ Supabase environment variables not set — skipping seed execution.");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log(`🚀 Seeding interview_question_cache for ${TOP_ROLES.length} roles...`);

  let count = 0;
  for (const r of TOP_ROLES) {
    const norm = normalizeRole(r);
    for (const s of SENIORITIES) {
      for (const c of COMPANY_STYLES) {
        const questionSet = {
          ...GENERIC_FALLBACK_QUESTION_SET,
          role: r,
          seniority: s,
          company_style: c,
        };

        const { error } = await supabase
          .from("interview_question_cache")
          .upsert(
            {
              role_normalized: norm,
              seniority: s,
              company_style: c,
              question_set: questionSet,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "role_normalized,seniority,company_style" }
          );

        if (!error) count++;
      }
    }
  }

  console.log(`✅ Cache Seed Complete: ${count} question set keys initialized.`);
}

seedCache().catch(console.error);
