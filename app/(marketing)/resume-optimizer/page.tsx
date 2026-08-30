import { type Metadata } from "next";
import { FreeATSCalculatorClient } from "@/components/marketing/FreeATSCalculatorClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Sliders, CheckCircle2, ArrowRight, Layers, FileText } from "lucide-react";

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "Resume Optimizer — Optimize Your Resume for ATS & Recruiters | Vaylo AI",
  description:
    "Optimize your resume for any job description in seconds. Boost your ATS match score, rewrite bullet points, and land more technical interviews with Vaylo AI.",
  keywords: [
    "resume optimizer",
    "ai resume optimizer",
    "optimize resume for job",
    "tailor resume to job description",
    "ats resume optimization"
  ],
  alternates: {
    canonical: `${APP_URL}/resume-optimizer`,
  },
  openGraph: {
    title: "Resume Optimizer — Optimize Your Resume for ATS & Recruiters | Vaylo AI",
    description: "Optimize your resume for any job description in seconds with Vaylo AI.",
    url: `${APP_URL}/resume-optimizer`,
    siteName: "Vaylo AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vaylo AI Resume Optimizer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Optimizer — Optimize Your Resume for ATS & Recruiters | Vaylo AI",
    description: "Optimize your resume for any job description in seconds with Vaylo AI.",
    images: ["/og-image.png"],
  },
};

export default function ResumeOptimizerPage() {
  return (
    <>
      <FreeATSCalculatorClient />
      <section className="bg-surface/40 border-t border-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Tailor Your Resume to Any Job in 3 Simple Steps
          </h2>
          <p className="text-sm text-text-secondary max-w-2xl mx-auto">
            Applying with a generic resume leads to automatic ATS rejections. Vaylo AI optimizes your skills and accomplishments to match each specific job posting.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
            <Card className="p-5 border-border bg-surface space-y-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-text-primary">1. Upload Resume</h3>
              <p className="text-xs text-text-secondary">Upload your PDF or DOCX file to extract existing experience.</p>
            </Card>
            <Card className="p-5 border-border bg-surface space-y-2">
              <Sliders className="w-5 h-5 text-accent" />
              <h3 className="font-bold text-sm text-text-primary">2. Target Job Role</h3>
              <p className="text-xs text-text-secondary">Match against your target job title and required technical skills.</p>
            </Card>
            <Card className="p-5 border-border bg-surface space-y-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-text-primary">3. Auto-Fix & Export</h3>
              <p className="text-xs text-text-secondary">Apply 1-click AI bullet fixes and export ATS-compliant PDFs.</p>
            </Card>
          </div>
          <div className="pt-6">
            <Button asChild className="bg-accent hover:bg-accent-hover text-white font-bold text-xs">
              <Link href="/builder">
                <Sparkles className="w-4 h-4 mr-2" /> Launch Resume Optimizer Studio
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
