import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { AnalysisCard } from "@/components/dashboard/AnalysisCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSearch, ArrowRight, Target, Flame, Compass, Laptop, Layout, Sparkles } from "lucide-react";
import type { Analysis } from "@/types";
import { UpgradeHandler } from "@/components/dashboard/UpgradeHandler";
import { CareerScoreCard } from "@/components/dashboard/CareerScoreCard";
import { NotificationBar } from "@/components/dashboard/NotificationBar";
import { AIFeed } from "@/components/dashboard/AIFeed";

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
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      <UpgradeHandler />
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-2">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="text-text-secondary mt-1">Track your resume optimizations, job matches, and career roadmaps</p>
      </div>

      <NotificationBar />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CareerScoreCard />
          <StatsBar profile={profile!} analyses={analysisList} />

          {/* Quick Launch Analysis Banner */}
          <Card className="border-accent/40 bg-surface card-glow">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-xl bg-accent/20 text-accent shrink-0">
                  <FileSearch className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-base">Analyze a New Resume</h3>
                  <p className="text-xs text-text-secondary mt-0.5">Upload your resume and paste a job description for instant ATS scoring.</p>
                </div>
              </div>
              <Link href="/analyze" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white gap-2 font-semibold shadow-md">
                  Start Analysis <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <AIFeed />
        </div>
      </div>

      {/* AI Tools Launchpad Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" /> AI Career Tools Launchpad
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((t) => (
            <Link key={t.title} href={t.href}>
              <Card className="border-border bg-surface hover:border-border-active transition-all hover:scale-[1.01] h-full cursor-pointer shadow-md group">
                <CardContent className="p-5 flex items-start gap-3.5">
                  <div className={`p-3 rounded-xl border shrink-0 ${t.color}`}>
                    <t.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-text-primary text-sm group-hover:text-accent transition-colors flex items-center gap-1">
                      {t.title}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{t.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Analysis History Table */}
      <div id="history" className="pt-2">
        <h2 className="text-lg font-bold text-text-primary mb-4">Recent Analyses History</h2>
        {analysisList.length === 0 ? (
          <Card className="border-border bg-surface">
            <CardContent className="p-12 text-center space-y-3">
              <p className="text-text-muted text-sm">No analyses yet — start your first resume audit</p>
              <Link href="/analyze" className="inline-block">
                <Button variant="outline" size="sm" className="gap-1 border-accent/40 text-accent">
                  <FileSearch className="w-3.5 h-3.5" /> Start New Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden bg-surface shadow-md">
            <table className="w-full">
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
        )}
      </div>
    </div>
  );
}
