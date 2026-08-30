import { type Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, FileText, Layers, Laptop } from "lucide-react";

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "AI Resume Builder — Create ATS-Friendly Resumes Fast | Vaylo AI",
  description:
    "Build a professional, ATS-friendly resume in minutes with Vaylo AI Resume Builder. Choose from recruiter-tested templates, generate high-impact bullets, and export clean PDFs.",
  keywords: [
    "ai resume builder",
    "free ai resume builder",
    "ats resume builder",
    "best resume builder 2026",
    "online resume maker"
  ],
  alternates: {
    canonical: `${APP_URL}/ai-resume-builder`,
  },
  openGraph: {
    title: "AI Resume Builder — Create ATS-Friendly Resumes Fast | Vaylo AI",
    description: "Build a professional, ATS-friendly resume in minutes with Vaylo AI.",
    url: `${APP_URL}/ai-resume-builder`,
    siteName: "Vaylo AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vaylo AI AI Resume Builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Resume Builder — Create ATS-Friendly Resumes Fast | Vaylo AI",
    description: "Build a professional, ATS-friendly resume in minutes with Vaylo AI.",
    images: ["/og-image.png"],
  },
};

export default function AIResumeBuilderLandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Vaylo AI Resume Builder",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "url": `${APP_URL}/ai-resume-builder`,
        "offers": [
          { "@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "INR" },
          { "@type": "Offer", "name": "Pro", "price": "99", "priceCurrency": "INR" }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Hero */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <Badge className="bg-accent/10 text-accent border-accent/20 text-xs px-3 py-1 font-bold">
              100% ATS-Compliant Templates
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight">
              Build an ATS-Proof Resume with <span className="text-gradient">AI Power</span>
            </h1>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              Create recruiter-approved resumes designed to pass Greenhouse, Workday, and Lever screening filters. Generate impact bullets using Google's X-Y-Z formula.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button asChild size="lg" className="bg-accent hover:bg-accent-hover text-white font-bold shadow-lg shadow-accent/20">
                <Link href="/builder">
                  <Sparkles className="w-4 h-4 mr-2" /> Start Building Free Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border text-text-primary hover:bg-surface">
                <Link href="/free-ats-resume-checker">
                  Check Existing Resume Score <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-border bg-surface space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-text-primary">Recruiter Tested Layouts</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Single-column, typography-optimized formats guaranteed to parse cleanly into any ATS without dropping text.
              </p>
            </Card>

            <Card className="p-6 border-border bg-surface space-y-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-text-primary">Google X-Y-Z AI Formulas</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Transform passive job duties into quantifiable achievement bullets with real numbers, percentages, and tech stack tags.
              </p>
            </Card>

            <Card className="p-6 border-border bg-surface space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-text-primary">Live ATS Score Sync</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Watch your ATS compatibility score update in real-time as you write and refine your resume sections.
              </p>
            </Card>
          </div>

          {/* Role Hubs Links */}
          <div className="border border-border rounded-2xl bg-surface/50 p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-text-primary">Looking for Role-Specific Guidance?</h2>
                <p className="text-xs text-text-secondary">Explore our expert keyword and resume guides tailored for your exact specialty.</p>
              </div>
              <Button asChild variant="outline" className="border-border text-xs font-semibold">
                <Link href="/free-ats-resume-checker">
                  Explore All Guides <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { name: "Software Engineer", href: "/resume/software-engineer" },
                { name: "Data Analyst", href: "/resume/data-analyst" },
                { name: "Frontend Developer", href: "/resume/frontend-developer" },
                { name: "Backend Developer", href: "/resume/backend-developer" },
                { name: "Full-Stack Developer", href: "/resume/full-stack-developer" },
                { name: "AI Engineer", href: "/resume/ai-engineer" },
                { name: "DevOps Engineer", href: "/resume/devops-engineer" },
                { name: "College Fresher", href: "/resume/fresher" },
              ].map((role) => (
                <Link
                  key={role.href}
                  href={role.href}
                  className="p-2.5 rounded-lg border border-border bg-surface hover:border-accent/40 text-text-secondary hover:text-text-primary transition-all text-center"
                >
                  {role.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
