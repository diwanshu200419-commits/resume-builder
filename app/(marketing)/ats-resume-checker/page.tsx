import { type Metadata } from "next";
import { FreeATSCalculatorClient } from "@/components/marketing/FreeATSCalculatorClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Sparkles, ShieldCheck, ArrowRight, Zap, Target } from "lucide-react";

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "ATS Resume Checker Online | Scan & Fix — VayloAI",
  description:
    "Scan your resume with VayloAI ATS checker in 30 seconds. Identify missing keywords and formatting errors for Greenhouse, Workday & Lever.",
  keywords: [
    "ATS resume checker",
    "resume ATS scanner",
    "free ATS score checker",
    "ATS resume checker India",
    "online resume checker",
    "VayloAI"
  ],
  alternates: {
    canonical: `${APP_URL}/ats-resume-checker`,
  },
  openGraph: {
    title: "ATS Resume Checker Online | Scan & Fix — VayloAI",
    description: "Scan your resume with VayloAI ATS checker in 30 seconds. Identify missing keywords and formatting errors for Greenhouse, Workday & Lever.",
    url: `${APP_URL}/ats-resume-checker`,
    siteName: "VayloAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATS Resume Checker Online | Scan & Fix — VayloAI",
    description: "Scan your resume with VayloAI ATS checker in 30 seconds. Identify missing keywords and formatting errors for Greenhouse, Workday & Lever.",
    creator: "@vayloai",
  },
};

export default function ATSResumeCheckerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VayloAI ATS Resume Checker",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "description":
      "Scan your resume with VayloAI ATS resume checker in 30 seconds. Instantly discover missing keywords, score breakdown, and format compatibility for Greenhouse, Workday & Lever.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FreeATSCalculatorClient />
      <section className="bg-surface/40 border-t border-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Why Job Seekers Rely on VayloAI's ATS Resume Checker
          </h2>
          <p className="text-sm text-text-secondary max-w-2xl mx-auto">
            Traditional resume reviewers charge hundreds of dollars for subjective opinions. VayloAI analyzes your resume deterministically using real Applicant Tracking System scoring criteria in seconds.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
            <Card className="p-5 border-border bg-surface space-y-2">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="font-bold text-sm text-text-primary">Under 10-Second Scan</h3>
              <p className="text-xs text-text-secondary">Instant parsing of PDF and DOCX files without waiting.</p>
            </Card>
            <Card className="p-5 border-border bg-surface space-y-2">
              <Target className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-text-primary">Keyword Gap Analysis</h3>
              <p className="text-xs text-text-secondary">See exact skills missing from your target role description.</p>
            </Card>
            <Card className="p-5 border-border bg-surface space-y-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-text-primary">100% Privacy First</h3>
              <p className="text-xs text-text-secondary">Your resume is parsed securely without public exposure.</p>
            </Card>
          </div>
          <div className="pt-6">
            <Button asChild className="bg-accent hover:bg-accent-hover text-white font-bold text-xs">
              <Link href="/builder">
                <Sparkles className="w-4 h-4 mr-2" /> Optimize Your Resume with AI Now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
