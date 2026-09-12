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
        <div className="flex flex-wrap gap-2">
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
      </div>
    </section>
  );
}
