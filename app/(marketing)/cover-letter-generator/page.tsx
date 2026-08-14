import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, CheckCircle2, FileText, ShieldCheck } from "lucide-react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "Free AI Cover Letter Generator | VayloAI",
  description: "Generate tailored, professional cover letters in seconds with AI. Match job descriptions, highlight key achievements, and land more interview calls.",
  keywords: ["free AI cover letter generator", "cover letter builder", "tailored cover letter", "AI cover letter maker", "cover letter template"],
  alternates: {
    canonical: `${APP_URL}/cover-letter-generator`,
  },
  openGraph: {
    title: "Free AI Cover Letter Generator | VayloAI",
    description: "Generate tailored, professional cover letters in seconds with AI. Match job descriptions and impress hiring managers.",
    url: `${APP_URL}/cover-letter-generator`,
    siteName: "VayloAI",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "VayloAI Cover Letter Generator" }],
  },
};

export default function PublicCoverLetterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "VayloAI Cover Letter Generator",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "url": `${APP_URL}/cover-letter-generator`,
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-full">
              Free AI Career Tool
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white">
              Free AI Cover Letter Generator
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Create a personalized, job-specific cover letter tailored to your target company and role in under 15 seconds.
            </p>
          </div>

          <Card className="border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> How It Works
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">1</div>
                  <h4 className="text-xs font-bold text-white">Paste Job Description</h4>
                  <p className="text-[11px] text-slate-400">Add the target company and role requirements.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">2</div>
                  <h4 className="text-xs font-bold text-white">Extract Key Facts</h4>
                  <p className="text-[11px] text-slate-400">AI pulls your key skills &amp; achievements.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">3</div>
                  <h4 className="text-xs font-bold text-white">Generate Letter</h4>
                  <p className="text-[11px] text-slate-400">Get a 100% truthful, tailored cover letter.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-center space-y-4">
              <p className="text-xs text-slate-400">Ready to create your tailored cover letter and check your ATS resume score?</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/free-ats-checker">
                  <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs h-11 px-8 rounded-xl gap-2">
                    Check Resume &amp; Cover Letter Free <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" className="w-full sm:w-auto border-slate-800 bg-slate-900 text-slate-200 text-xs h-11 px-6 rounded-xl">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
