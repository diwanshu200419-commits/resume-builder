"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Github, RefreshCw, Star, GitFork, Sparkles, CheckCircle2, Code2, Layers, Cpu, ExternalLink, ShieldCheck, Zap } from "lucide-react";

interface Repository {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  aiSummary: string;
  resumeBullet: string;
  techStack: string[];
}

const SAMPLE_REPOS: Repository[] = [
  {
    name: "resume-builder",
    description: "Multi-million dollar AI Career Operating System with Next.js 14, Tailwind, and Gemini AI.",
    language: "TypeScript",
    stars: 142,
    forks: 38,
    aiSummary: "Enterprise AI career copilot featuring ATS optimization, voice STAR interview practice, and portfolio deployment.",
    resumeBullet: "Architected scalable Next.js 14 AI platform serving 100k+ users with sub-50ms API response times.",
    techStack: ["Next.js", "TypeScript", "Tailwind", "Gemini AI", "Supabase"],
  },
  {
    name: "ai-interview-sandbox",
    description: "Web Speech API real-time STAR method voice interview simulator.",
    language: "TypeScript",
    stars: 89,
    forks: 19,
    aiSummary: "Real-time speech-to-text interview prep sandbox evaluating candidate answers with 1-10 STAR scoring.",
    resumeBullet: "Engineered real-time Web Speech API voice evaluation pipeline with Gemini AI feedback.",
    techStack: ["React", "Web Speech API", "Node.js"],
  },
];

export default function GitHubSyncPage() {
  const [connected, setConnected] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [repos, setRepos] = useState<Repository[]>(SAMPLE_REPOS);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
    }, 1000);
  };

  const filteredRepos = repos.filter(
    (r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 space-y-8 text-text-primary">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-slate-800 border border-slate-700 text-slate-100 text-xs font-bold mb-3">
            <Github className="w-3.5 h-3.5" /> Automatic Developer Sync
          </div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2 tracking-tight">
            <Github className="w-8 h-8 text-text-primary" />
            GitHub Auto Sync & AI Repo Analyzer
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Connect your GitHub account to automatically import repositories, generate AI project summaries, and sync your live developer portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSync}
            disabled={syncing}
            variant="outline"
            className="gap-2 font-bold text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-indigo-500" : ""}`} />
            {syncing ? "Syncing GitHub..." : "Sync Repositories Now"}
          </Button>
        </div>
      </div>

      {/* GitHub Account Header Card */}
      <Card className="border-border bg-surface shadow-lg p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-md">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-text-primary text-base">@diwanshu200419-commits</h3>
                <Badge variant="outline" className="border-emerald-500 text-emerald-500 text-[10px]">
                  ✓ Connected via OAuth
                </Badge>
              </div>
              <p className="text-xs text-text-muted mt-0.5">Auto-Sync Enabled • 12 Repositories Imported</p>
            </div>
          </div>

          <div className="text-right text-xs text-text-muted space-y-1">
            <p className="font-semibold text-text-primary">Contribution Heatmap</p>
            <p className="text-emerald-500 font-bold">1,248 commits past 12 months</p>
          </div>
        </div>
      </Card>

      {/* Repository Explorer Header */}
      <div className="flex items-center justify-between gap-4">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search repositories or tech stack..."
          className="max-w-md bg-surface text-xs"
        />
        <span className="text-xs font-bold text-text-muted">Showing {filteredRepos.length} Repositories</span>
      </div>

      {/* Repository Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRepos.map((r, i) => (
          <Card key={i} className="border-border bg-surface shadow-sm hover:shadow-xl transition-all p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                  {r.name}
                  <Badge variant="outline" className="text-[10px] bg-surface-elevated font-mono">
                    {r.language}
                  </Badge>
                </h3>
                <p className="text-xs text-text-secondary mt-1">{r.description}</p>
              </div>
            </div>

            {/* AI Summary Box */}
            <div className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2 text-xs">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Gemini Executive Summary
              </span>
              <p className="text-text-primary font-medium">{r.aiSummary}</p>
              <div className="pt-2 border-t border-border/60">
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  📌 Resume Bullet: &ldquo;{r.resumeBullet}&rdquo;
                </p>
              </div>
            </div>

            {/* Tech Badges & Stars */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex flex-wrap gap-1">
                {r.techStack.map((tech, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs text-text-muted font-bold">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" /> {r.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5" /> {r.forks}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
