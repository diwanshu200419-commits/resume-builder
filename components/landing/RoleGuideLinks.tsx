import Link from "next/link";
import { FileText } from "lucide-react";

const ROLE_GUIDES = [
  { href: "/resume/software-engineer", label: "Software Engineer" },
  { href: "/resume/frontend-developer", label: "Frontend Developer" },
  { href: "/resume/backend-developer", label: "Backend Developer" },
  { href: "/resume/full-stack-developer", label: "Full-Stack Developer" },
  { href: "/resume/ai-engineer", label: "AI Engineer" },
  { href: "/resume/data-analyst", label: "Data Analyst" },
  { href: "/resume/data-scientist", label: "Data Scientist" },
  { href: "/resume/machine-learning-engineer", label: "ML Engineer" },
  { href: "/resume/devops-engineer", label: "DevOps Engineer" },
  { href: "/resume/cloud-architect", label: "Cloud Architect" },
  { href: "/resume/product-manager", label: "Product Manager" },
  { href: "/resume/qa-automation-engineer", label: "QA / Automation" },
  { href: "/resume/cybersecurity-analyst", label: "Cybersecurity Analyst" },
  { href: "/resume/web-developer", label: "Web Developer" },
  { href: "/resume/digital-marketer", label: "Digital Marketer" },
  { href: "/resume/fresher", label: "Fresher / Student" },
  { href: "/resume/btech", label: "B.Tech CSE" },
  { href: "/resume/bca", label: "BCA Graduate" },
  { href: "/resume/mca", label: "MCA Graduate" },
  { href: "/resume/usa", label: "USA Tech Resume" },
  { href: "/resume/germany", label: "Germany Resume" },
];

export function RoleGuideLinks() {
  return (
    <section className="py-14 px-4 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold text-text-primary">
            ATS Resume Guides — By Role, Degree &amp; Country
          </h2>
        </div>
        <p className="text-text-secondary text-sm mb-6 max-w-2xl">
          Every guide includes ATS-optimized keywords, Google X-Y-Z bullet formulas, and a free ATS score check
          specific to your target role.
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {ROLE_GUIDES.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                         bg-background border border-border text-text-secondary
                         hover:border-accent hover:text-accent transition-colors"
            >
              {guide.label}
            </Link>
          ))}
        </div>

        <div className="pt-6 border-t border-border/60">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
            Featured Case Studies &amp; ATS Engineering Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/blog/case-study-fresher-to-sde-ats-transformation"
              className="p-4 rounded-xl bg-background border border-border hover:border-accent group transition-all"
            >
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">Case Study</span>
              <h4 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors mt-1">
                Tier-3 Fresher: 48 to 89 ATS Score Delta &rarr;
              </h4>
              <p className="text-xs text-text-muted mt-1">Real before/after diagnostics, Google X-Y-Z bullet rewrites, and 4 tech interview callbacks.</p>
            </Link>

            <Link
              href="/blog/step-by-step-guide-100-point-ats-analyzer"
              className="p-4 rounded-xl bg-background border border-border hover:border-accent group transition-all"
            >
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wide">Algorithm Deep-Dive</span>
              <h4 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors mt-1">
                The 100-Point ATS Scoring Engine &rarr;
              </h4>
              <p className="text-xs text-text-muted mt-1">Transparent breakdown of all 7 scoring dimensions and dynamic industry weighting tables.</p>
            </Link>

            <Link
              href="/blog/how-to-optimize-resume-for-ats-india"
              className="p-4 rounded-xl bg-background border border-border hover:border-accent group transition-all"
            >
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Playbook</span>
              <h4 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors mt-1">
                India Tech ATS Optimization Playbook &rarr;
              </h4>
              <p className="text-xs text-text-muted mt-1">Master Naukri and LinkedIn recruiter filters, notice period tactics, and DPDP Act privacy.</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
