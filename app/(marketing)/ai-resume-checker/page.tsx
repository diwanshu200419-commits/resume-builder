import { type Metadata } from "next";
import { FreeATSCalculatorClient } from "@/components/marketing/FreeATSCalculatorClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Bot, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "AI Resume Checker for Naukri & LinkedIn | Score — VayloAI",
  description:
    "Scan your resume with AI before applying on Naukri, LinkedIn, and corporate portals. Instant feedback on keywords and ATS score. Try VayloAI free.",
  keywords: [
    "AI resume checker",
    "AI resume checker for Naukri",
    "AI resume checker India",
    "resume keyword optimizer",
    "AI resume scanner",
    "VayloAI"
  ],
  alternates: {
    canonical: `${APP_URL}/ai-resume-checker`,
  },
  openGraph: {
    title: "AI Resume Checker for Naukri & LinkedIn | Score — VayloAI",
    description: "Scan your resume with AI before applying on Naukri, LinkedIn, and corporate portals. Instant feedback on keywords and ATS score. Try VayloAI free.",
    url: `${APP_URL}/ai-resume-checker`,
    siteName: "VayloAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Resume Checker for Naukri & LinkedIn | Score — VayloAI",
    description: "Scan your resume with AI before applying on Naukri, LinkedIn, and corporate portals. Instant feedback on keywords and ATS score. Try VayloAI free.",
    creator: "@vayloai",
  },
};

export default function AIResumeCheckerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VayloAI AI Resume Checker",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "description":
      "Scan your resume with AI before applying on Naukri, LinkedIn, and corporate portals. Instant feedback on keywords and ATS score. Try VayloAI free.",
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
            Next-Generation AI Resume Evaluation
          </h2>
          <p className="text-sm text-text-secondary max-w-2xl mx-auto">
            VayloAI combines deterministic ATS scoring with advanced generative AI to rewrite weak bullets into high-impact accomplishments following Google's X-Y-Z formula.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
            <Card className="p-5 border-border bg-surface space-y-2">
              <Bot className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-text-primary">AI Bullet Rewriting</h3>
              <p className="text-xs text-text-secondary">Turn basic task descriptions into quantified technical wins.</p>
            </Card>
            <Card className="p-5 border-border bg-surface space-y-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="font-bold text-sm text-text-primary">Keyword Intelligence</h3>
              <p className="text-xs text-text-secondary">Extract industry-specific technical vocabulary automatically.</p>
            </Card>
            <Card className="p-5 border-border bg-surface space-y-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-text-primary">Instant Exports</h3>
              <p className="text-xs text-text-secondary">Download clean, ATS-compliant PDF resumes in 1 click.</p>
            </Card>
          </div>
          <div className="pt-6">
            <Button asChild className="bg-accent hover:bg-accent-hover text-white font-bold text-xs">
              <Link href="/builder">
                <Sparkles className="w-4 h-4 mr-2" /> Start Building with VayloAI
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
