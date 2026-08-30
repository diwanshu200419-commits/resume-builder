import { type Metadata } from "next";
import { FreeATSCalculatorClient } from "@/components/marketing/FreeATSCalculatorClient";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Sparkles, FileText, Zap, ShieldCheck, ArrowRight, HelpCircle, Target, Search, BarChart3, Layers } from "lucide-react";

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "Free ATS Resume Checker – Check Your Resume Score | Vaylo AI",
  description:
    "Check your resume's ATS score for free. Identify missing keywords, formatting traps, and keyword match percentage against Greenhouse, Workday & Lever before applying.",
  keywords: [
    "ats resume checker",
    "free ats resume checker",
    "ats score checker",
    "resume ats checker",
    "ats resume checker free",
    "ai resume checker",
    "resume checker",
    "ats score",
    "resume optimization"
  ],
  alternates: {
    canonical: `${APP_URL}/free-ats-resume-checker`,
  },
  openGraph: {
    title: "Free ATS Resume Checker – Check Your Resume Score | Vaylo AI",
    description:
      "Check your resume's ATS score, identify missing keywords and formatting issues, and improve your resume before applying.",
    url: `${APP_URL}/free-ats-resume-checker`,
    siteName: "Vaylo AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vaylo AI Free ATS Resume Checker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free ATS Resume Checker – Check Your Resume Score | Vaylo AI",
    description: "Check your resume's ATS score, identify missing keywords and formatting issues, and improve your resume before applying.",
    images: ["/og-image.png"],
  },
};

export default function PrimaryFreeATSResumeCheckerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Vaylo AI Free ATS Resume Checker",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "url": `${APP_URL}/free-ats-resume-checker`,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": APP_URL
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Free ATS Resume Checker",
            "item": `${APP_URL}/free-ats-resume-checker`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is an ATS and how does ATS screening work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "An Applicant Tracking System (ATS) is software used by employers to collect, sort, scan, and rank job applications. It converts resumes into plain text, extracts candidate skills, dates, and titles, and scores their relevance against the recruiter's job description."
            }
          },
          {
            "@type": "Question",
            "name": "How is the Vaylo AI ATS score calculated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Vaylo AI uses a deterministic 100-point rubric assessing 5 dimensions: Keyword Match (30 pts), Impact Action Verbs (25 pts), Quantified Metrics (20 pts), Structural Parseability (15 pts), and Anti-Keyword-Stuffing Context (10 pts)."
            }
          },
          {
            "@type": "Question",
            "name": "What ATS score is required to pass screening?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "An ATS score of 80% or higher is considered strong and puts your resume into the top tier reviewed by human hiring managers."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Real Interactive ATS Scanner Component */}
      <FreeATSCalculatorClient />

      {/* Comprehensive SEO Content & Educational Authority Section */}
      <section className="bg-surface/50 border-t border-border py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Section 1: What is ATS & How it Works */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
              <Search className="w-3.5 h-3.5" /> ATS Mechanics Explained
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
              What is an ATS and How Does ATS Screening Work?
            </h2>
            <p className="text-text-secondary text-base leading-relaxed">
              An <strong>Applicant Tracking System (ATS)</strong> is automated recruiting software used by over 98% of Fortune 500 companies and growing tech employers—including <strong>Greenhouse, Workday, Lever, Taleo, and SmartRecruiters</strong>.
            </p>
            <p className="text-text-secondary text-base leading-relaxed">
              When you submit a resume online, human recruiters do not read through hundreds of raw documents. Instead, the ATS parser ingests your file, strips out unformatted visual elements, indexes keywords, and computes an automated match percentage. Candidates with match scores below 75% are routinely archived into candidate databases without human review.
            </p>
          </div>

          {/* Section 2: What Vaylo AI Checks */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-2">
              <Layers className="w-6 h-6 text-accent" /> What Vaylo AI Checks in Your Resume
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border bg-surface p-6 space-y-3">
                <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-400" /> 1. Keyword & Skill Matching
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Identifies missing hard technical skills, tools, programming languages, and industry terminology required for your target job title.
                </p>
              </Card>
              <Card className="border-border bg-surface p-6 space-y-3">
                <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" /> 2. Formatting & Parsing Traps
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Flags multi-column tables, graphics, text boxes, non-standard section titles, and header/footer contact info that cause parsing errors.
                </p>
              </Card>
              <Card className="border-border bg-surface p-6 space-y-3">
                <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" /> 3. Quantified Impact & X-Y-Z Bullets
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Audits your work experience bullets for high-impact action verbs and measurable business results (%, $, users, scale metrics).
                </p>
              </Card>
              <Card className="border-border bg-surface p-6 space-y-3">
                <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" /> 4. Anti-Keyword Stuffing Validation
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Ensures keywords appear naturally in context to prevent spam penalties from modern AI parsers.
                </p>
              </Card>
            </div>
          </div>

          {/* Section 3: How to Improve ATS Score */}
          <div className="bg-surface-elevated/40 border border-border rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
              How to Boost Your ATS Score from 60% to 90%+
            </h2>
            <div className="space-y-4 text-sm text-text-secondary">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p><strong>Use Single-Column Layouts:</strong> Keep text linear so ATS parsers never merge dates or company names across columns.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p><strong>Use Standard Headings:</strong> Label sections <code>Work Experience</code>, <code>Technical Skills</code>, <code>Projects</code>, and <code>Education</code>.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p><strong>Embed Google X-Y-Z Bullets:</strong> Frame accomplishments as <em>"Accomplished [X], measured by [Y], by doing [Z]"</em>.</p>
              </div>
            </div>
            <div className="pt-4 flex flex-wrap gap-4">
              <Button asChild className="bg-accent hover:bg-accent-hover text-white font-bold text-xs shadow-lg">
                <Link href="/builder">
                  <Sparkles className="w-4 h-4 mr-2" /> Build ATS-Proof Resume with AI
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-border text-text-primary hover:bg-surface text-xs font-semibold">
                <Link href="/blog/how-to-improve-ats-score">
                  Read Full ATS Improvement Guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Section 4: Role-Specific Resume Guides Cross-Linking */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
              Explore Role-Specific ATS Keywords & Resume Guides
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
              {[
                { name: "Software Engineer", href: "/resume/software-engineer" },
                { name: "Data Analyst", href: "/resume/data-analyst" },
                { name: "AI Engineer", href: "/resume/ai-engineer" },
                { name: "Frontend Developer", href: "/resume/frontend-developer" },
                { name: "Backend Developer", href: "/resume/backend-developer" },
                { name: "Full-Stack Developer", href: "/resume/full-stack-developer" },
                { name: "Web Developer", href: "/resume/web-developer" },
                { name: "Digital Marketer", href: "/resume/digital-marketer" },
                { name: "DevOps Engineer", href: "/resume/devops-engineer" },
                { name: "Fresher / Student", href: "/resume/fresher" },
              ].map((role) => (
                <Link
                  key={role.href}
                  href={role.href}
                  className="p-3 rounded-xl border border-border bg-surface hover:border-accent/50 hover:bg-accent/5 transition-all text-text-secondary hover:text-text-primary font-medium text-center"
                >
                  {role.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
