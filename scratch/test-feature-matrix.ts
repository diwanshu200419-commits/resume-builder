import {
  canAnalyze,
  canAutoFix,
  canDownloadPDF,
  canDownloadDOCX,
  canDeployPortfolio,
  canAccessSTARVoice,
  canAccessRecruiterSim,
  canAccessHiringPredictor,
  canAccessBrandingStudio,
  canAccessSalaryNegotiator,
  canAccessTranslator,
  canAccessCoverLetter,
  canAccessPremium,
  canUseCustomDomain,
  getEffectivePlan,
  getRemainingAnalyses,
  PlanType,
} from "../lib/plans";

interface MockProfile {
  id: string;
  email: string;
  plan: PlanType;
  role?: "user" | "admin";
  analyses_used: number;
  total_resume_downloads: number;
}

const mockProfiles: Record<PlanType, MockProfile> = {
  free: { id: "user-free", email: "free@test.com", plan: "free", analyses_used: 0, total_resume_downloads: 0 },
  pro: { id: "user-pro", email: "pro@test.com", plan: "pro", analyses_used: 10, total_resume_downloads: 2 },
  premium: { id: "user-premium", email: "premium@test.com", plan: "premium", analyses_used: 50, total_resume_downloads: 10 },
  career_pack: { id: "user-cp", email: "cp@test.com", plan: "career_pack", analyses_used: 100, total_resume_downloads: 25 },
};

console.log("=================================================");
console.log("🧪 FULL FEATURE × PLAN MATRIX TEST EXECUTION");
console.log("=================================================\n");

const tiers: PlanType[] = ["free", "pro", "premium", "career_pack"];

tiers.forEach((t) => {
  const p = mockProfiles[t];
  console.log(`--- TIER: ${t.toUpperCase()} (${p.email}) ---`);
  console.log(`- ATS Scan (2 limit on Free): ${canAnalyze(p as any) ? "✅ Allowed" : "🔒 Blocked (2 Scans Exceeded)"}`);
  console.log(`- Auto-Fix Bullet Rewriter: ${canAutoFix(p as any) ? "✅ Allowed" : "🔒 Blocked (Pro Required)"}`);
  console.log(`- PDF Export: ${canDownloadPDF(p as any) ? "✅ Allowed (Standard)" : "🔒 Blocked"}`);
  console.log(`- DOCX Export: ${canDownloadDOCX(p as any) ? "✅ Allowed" : "🔒 Blocked (Pro Required)"}`);
  console.log(`- Cover Letter Generator: ${canAccessCoverLetter(p as any) ? "✅ Allowed" : "🔒 Blocked (Pro Required)"}`);
  console.log(`- Portfolio Preview: ✅ Allowed for All`);
  console.log(`- Portfolio Subdomain Deploy: ${canDeployPortfolio(p as any) ? "✅ Allowed (Live Subdomain)" : "🔒 Blocked (Premium Required)"}`);
  console.log(`- Portfolio Custom Domain: ${canUseCustomDomain(p as any) ? "✅ Allowed (Career Pack CNAME)" : "🔒 Blocked (Career Pack Required)"}`);
  console.log(`- STAR Voice Interview: ${canAccessSTARVoice(p as any) ? "✅ Allowed (Full Voice Practice)" : "🔒 Blocked (Premium Required)"}`);
  console.log(`- Recruiter Eye-Screen Sim: ${canAccessRecruiterSim(p as any) ? "✅ Allowed" : "🔒 Blocked (Premium Required)"}`);
  console.log(`- Hiring Probability Predictor: ${canAccessHiringPredictor(p as any) ? "✅ Allowed" : "🔒 Blocked (Premium Required)"}`);
  console.log(`- Branding Studio: ${canAccessBrandingStudio(p as any) ? "✅ Allowed" : "🔒 Blocked (Pro Required)"}`);
  console.log(`- Salary Negotiator: ${canAccessSalaryNegotiator(p as any) ? "✅ Allowed" : "🔒 Blocked (Premium Required)"}`);
  console.log(`- Multi-Language Translator: ${canAccessTranslator(p as any) ? "✅ Allowed" : "🔒 Blocked (Pro Required)"}`);
  console.log("----------------------------------------------------\n");
});
