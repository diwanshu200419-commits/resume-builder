import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { AnalysisCard } from "@/components/dashboard/AnalysisCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileSearch, ArrowRight, Target, Flame, Compass, Laptop, Layout, Sparkles } from "lucide-react";
import type { Analysis } from "@/types";
import { UpgradeHandler } from "@/components/dashboard/UpgradeHandler";
import { CareerScoreCard } from "@/components/dashboard/CareerScoreCard";
import { NotificationBar } from "@/components/dashboard/NotificationBar";
import { AIFeed } from "@/components/dashboard/AIFeed";
import { formatDate, getScoreColor } from "@/lib/utils";

export default async function DashboardPage() {
  const profile = await getProfile();
  if (!profile) {
    redirect("/login");
  }

  const supabase = await createClient();

  const { data: analyses } = await supabase
    .from("analyses")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const analysisList = (analyses || []) as Analysis[];

  const tools = [
    {
      title: "AI Job Matcher",
      desc: "Audit your compatibility against target JDs",
      href: "/job-match",
      icon: Target,
      color: "text-accent border-accent/30 bg-accent/5",
    },
    {
      title: "AI Resume Roast",
      desc: "Brutally honest feedback & recruiters advice",
      href: "/roast",
      icon: Flame,
      color: "text-danger border-danger/30 bg-danger/5",
    },
    {
      title: "AI Career Roadmap",
      desc: "Step-by-step target skill development plan",
      href: "/roadmap",
      icon: Compass,
      color: "text-warning border-warning/30 bg-warning/5",
    },
    {
      title: "AI Portfolio Builder",
      desc: "Generate modern HTML/CSS portfolio site",
      href: "/portfolio",
      icon: Laptop,
      color: "text-success border-success/30 bg-success/5",
    },
    {
      title: "Resume Builder",
      desc: "Rich editor with inline AI Bullet optimizer",
      href: "/builder",
      icon: Layout,
      color: "text-info border-info/30 bg-info/5",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-7xl mx-auto w-full min-w-0">
      <UpgradeHandler />
      
      {/* Responsive Dashboard Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-primary tracking-tight leading-tight break-word-safe">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">
          Track your resume optimizations, job matches, and career roadmaps
        </p>
      </div>

      <NotificationBar />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <CareerScoreCard />
          <StatsBar profile={profile!} analyses={analysisList} />

          {/* Quick Launch Analysis Banner */}
          <Card className="border-accent/40 bg-surface card-glow">
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-3 rounded-xl bg-accent/20 text-accent shrink-0">
                  <FileSearch className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-text-primary text-sm sm:text-base leading-snug">Analyze a New Resume</h3>
                  <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">Upload your resume and paste a job description for instant ATS scoring.</p>
                </div>
              </div>
              <Link href="/analyze" className="w-full sm:w-auto shrink-0">
                <Button className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white gap-2 font-semibold shadow-md text-xs sm:text-sm h-9 sm:h-10">
                  Start Analysis <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 min-w-0">
          <AIFeed />
        </div>
      </div>

      {/* AI Tools Launchpad Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent shrink-0" /> AI Career Tools Launchpad
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((t) => (
            <Link key={t.title} href={t.href} className="min-w-0">
              <Card className="border-border bg-surface hover:border-border-active transition-all hover:scale-[1.01] h-full cursor-pointer shadow-md group">
                <CardContent className="p-4 sm:p-5 flex items-start gap-3.5">
                  <div className={`p-2.5 sm:p-3 rounded-xl border shrink-0 ${t.color}`}>
                    <t.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bold text-text-primary text-sm group-hover:text-accent transition-colors flex items-center gap-1">
                      <span className="truncate">{t.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent shrink-0" />
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{t.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Analysis History Section */}
      <div id="history" className="pt-2">
        <h2 className="text-lg font-bold text-text-primary mb-4">Recent Analyses History</h2>
        {analysisList.length === 0 ? (
          <Card className="border-border bg-surface">
            <CardContent className="p-8 sm:p-12 text-center space-y-3">
              <p className="text-text-muted text-sm">No analyses yet — start your first resume audit</p>
              <Link href="/analyze" className="inline-block">
                <Button variant="outline" size="sm" className="gap-1 border-accent/40 text-accent font-bold">
                  <FileSearch className="w-3.5 h-3.5" /> Start New Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Mobile Responsive Cards View (< 640px) */}
            <div className="block sm:hidden space-y-3">
              {analysisList.map((analysis) => {
                const improvement = (analysis.optimized_ats_score || 0) - (analysis.original_ats_score || 0);
                return (
                  <Card key={analysis.id} className="p-4 border-border bg-surface space-y-3 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-text-primary text-sm leading-snug break-word-safe">
                          {analysis.job_title || "Untitled role"}
                        </h4>
                        <p className="text-[11px] text-text-muted mt-0.5">{formatDate(analysis.created_at)}</p>
                      </div>
                      {improvement > 0 ? (
                        <Badge variant="success" className="shrink-0 text-[10px] font-bold">+{improvement} pts</Badge>
                      ) : (
                        <Badge variant="secondary" className="shrink-0 text-[10px]">—</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-border/60 text-xs">
                      <div>
                        <span className="text-text-muted text-[10px] uppercase tracking-wider font-semibold">Original Score</span>
                        <p className="font-bold text-sm" style={{ color: getScoreColor(analysis.original_ats_score || 0) }}>
                          {analysis.original_ats_score || "—"}%
                        </p>
                      </div>
                      <div>
                        <span className="text-text-muted text-[10px] uppercase tracking-wider font-semibold">Optimized Score</span>
                        <p className="font-bold text-sm" style={{ color: getScoreColor(analysis.optimized_ats_score || 0) }}>
                          {analysis.optimized_ats_score || "—"}%
                        </p>
                      </div>
                    </div>
                    <Link href={`/results/${analysis.id}`} className="block pt-1">
                      <Button variant="outline" size="sm" className="w-full text-xs font-bold gap-1 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
                        View Analysis Report <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </Card>
                );
              })}
            </div>

            {/* Tablet/Desktop Table View (>= 640px) */}
            <div className="hidden sm:block rounded-xl border border-border overflow-hidden bg-surface shadow-md table-scroll-wrapper">
              <table className="w-full min-w-[540px]">
                <thead className="bg-surface-elevated">
                  <tr className="text-left text-xs text-text-muted uppercase tracking-wider">
                    <th className="py-3 px-4">Job title</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Date</th>
                    <th className="py-3 px-4">Before</th>
                    <th className="py-3 px-4">After</th>
                    <th className="py-3 px-4">Improvement</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisList.map((analysis) => (
                    <AnalysisCard key={analysis.id} analysis={analysis} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
