import { type Metadata } from "next";
import { FreeATSCalculatorClient } from "@/components/marketing/FreeATSCalculatorClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Sparkles, BarChart3, ArrowRight, ShieldCheck } from "lucide-react";

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "ATS Score Checker — Test Your Resume Score Online | Vaylo AI",
  description:
    "Check your resume ATS score online with Vaylo AI. See your 0-100% score breakdown, missing skills, impact verb scores, and formatting health.",
  keywords: [
    "ats score checker",
    "check ats score",
    "resume ats score online",
    "ats score test",
    "resume score breakdown"
  ],
  alternates: {
    canonical: `${APP_URL}/ats-score-checker`,
  },
  openGraph: {
    title: "ATS Score Checker — Test Your Resume Score Online | Vaylo AI",
    description: "Check your resume ATS score online with Vaylo AI. See your 0-100% score breakdown.",
    url: `${APP_URL}/ats-score-checker`,
    siteName: "Vaylo AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vaylo AI ATS Score Checker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATS Score Checker — Test Your Resume Score Online | Vaylo AI",
    description: "Check your resume ATS score online with Vaylo AI. See your 0-100% score breakdown.",
    images: ["/og-image.png"],
  },
};

export default function ATSScoreCheckerPage() {
  return (
    <>
      <FreeATSCalculatorClient />
      <section className="bg-surface/40 border-t border-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Understand Your Resume ATS Score
          </h2>
          <p className="text-sm text-text-secondary max-w-2xl mx-auto">
            An ATS score reflects how effectively an Applicant Tracking System can read your qualifications and match them to open jobs. Learn where your resume loses points and how to fix it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
            <Card className="p-5 border-border bg-surface space-y-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-text-primary">5-Category Breakdown</h3>
              <p className="text-xs text-text-secondary">Keywords, Impact Verbs, Metrics, Formatting, and Structure.</p>
            </Card>
            <Card className="p-5 border-border bg-surface space-y-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-text-primary">Actionable Suggestions</h3>
              <p className="text-xs text-text-secondary">Specific recommendations to increase your score above 85%.</p>
            </Card>
            <Card className="p-5 border-border bg-surface space-y-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <h3 className="font-bold text-sm text-text-primary">Recruiter Ready</h3>
              <p className="text-xs text-text-secondary">Pass automated filters and reach human engineering hiring teams.</p>
            </Card>
          </div>
          <div className="pt-6">
            <Button asChild className="bg-accent hover:bg-accent-hover text-white font-bold text-xs">
              <Link href="/pricing">
                <Sparkles className="w-4 h-4 mr-2" /> Upgrade to Pro for 1-Click Auto-Fixes
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
