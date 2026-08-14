import { Metadata } from "next";
import Link from "next/link";
import { getPublicShareResult } from "@/lib/share-ats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, FileSearch } from "lucide-react";

interface SharePageProps {
  params: { publicId: string };
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.vayloai.online";

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const publicId = params.publicId;
  const shareData = await getPublicShareResult(publicId);

  const score = shareData?.score || 85;
  const title = `I scored ${score}/100 on VayloAI's ATS Resume Checker`;
  const description = "Check your resume's ATS readiness for free with VayloAI. Beat ATS filters and land more interview calls.";

  return {
    title,
    description,
    robots: {
      index: false, // noindex share cards so search engines don't index low-quality pages
      follow: true, // follow link juice to /free-ats-checker
    },
    openGraph: {
      title,
      description,
      url: `${APP_URL}/share/ats/${publicId}`,
      siteName: "VayloAI",
      images: [
        {
          url: `${APP_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `VayloAI ATS Resume Match Score: ${score}/100`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${APP_URL}/og-image.png`],
    },
  };
}

export default async function SharedATSResultPage({ params }: SharePageProps) {
  const publicId = params.publicId;
  const shareData = await getPublicShareResult(publicId);

  if (!shareData || !shareData.isPublic) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-center">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <FileSearch className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Share Result Not Available</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            This share link does not exist or the owner has stopped public sharing.
          </p>
          <Link href="/free-ats-checker">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
              Check Your Own Resume Free →
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { score, keywordScore, skillsScore, readabilityScore, formattingScore } = shareData;

  const categories = [
    { name: "Keyword Match", score: keywordScore, color: "bg-indigo-500" },
    { name: "Skills Alignment", score: skillsScore, color: "bg-purple-500" },
    { name: "Readability & Structure", score: readabilityScore, color: "bg-emerald-500" },
    { name: "Formatting & Impact", score: formattingScore, color: "bg-sky-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-500/15 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header Brand */}
      <div className="max-w-xl mx-auto w-full text-center mb-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-extrabold text-white tracking-tight">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          Vaylo<span className="text-indigo-400">AI</span>
        </Link>
        <p className="text-xs text-slate-400 mt-1 font-medium">AI Career Copilot — Official ATS Match Analysis</p>
      </div>

      {/* Main Score Card */}
      <div className="max-w-xl mx-auto w-full relative z-10">
        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Score Circle Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <div className="relative w-24 h-24 rounded-full border-4 border-emerald-500/30 flex items-center justify-center bg-emerald-500/10 shrink-0">
                <span className="text-4xl font-black text-emerald-400">{score}</span>
                <span className="text-[10px] font-bold text-slate-400 absolute bottom-1">/100</span>
              </div>
              <div className="text-center sm:text-left space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  Verified ATS Score
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {score >= 80 ? "Strong ATS Resume Match" : score >= 65 ? "Good ATS Match" : "Needs Optimization"}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluated using VayloAI&apos;s 100-Point ATS Matching System.
                </p>
              </div>
            </div>

            {/* Category Scores */}
            <div className="space-y-3 pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Score Breakdown By Category</p>
              <div className="space-y-2.5">
                {categories.map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>{cat.name}</span>
                      <span className="font-mono font-bold text-emerald-400">{cat.score}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className={`h-full ${cat.color} rounded-full transition-all duration-500`} style={{ width: `${cat.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Proof Banner */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Privacy Verified: No personal resume details or contact data are exposed on public share cards.</span>
            </div>

            {/* Call To Action */}
            <div className="pt-2">
              <Link href="/free-ats-checker" className="block w-full">
                <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg gap-2">
                  Check Your Resume For Free on VayloAI
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Branding */}
      <div className="max-w-xl mx-auto w-full text-center mt-8 text-xs text-slate-500 relative z-10">
        <p>© {new Date().getFullYear()} Vaylo AI. All rights reserved.</p>
      </div>
    </div>
  );
}
