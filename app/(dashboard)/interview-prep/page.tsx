"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Volume2, Sparkles, Award, ArrowRight, ShieldCheck, CheckCircle2, Zap, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ROLES = [
  { id: "software_engineering", title: "Software Engineering", desc: "Frontend, Backend, System Design, Algorithms & Microservices", icon: Zap, tags: ["Google", "Amazon", "Meta"] },
  { id: "product_management", title: "Product Management", desc: "Product Strategy, Metrics, Customer Obsession & Roadmaps", icon: Sparkles, tags: ["Google", "Amazon"] },
  { id: "data_science", title: "Data Science & Analytics", desc: "A/B Testing, Machine Learning, SQL & Statistical Modeling", icon: Award, tags: ["Meta", "Apple"] },
  { id: "leadership", title: "Executive & Engineering Leadership", desc: "Stakeholder Management, P&L, Technical Debt & Team Building", icon: ShieldCheck, tags: ["Netflix", "Amazon"] },
];

export default function InterviewPrepLobbyPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("software_engineering");
  const [selectedSubRole, setSelectedSubRole] = useState("all");

  const handleStartSession = () => {
    router.push(`/interview-prep/session-${Date.now()}?role=${selectedRole}&subRole=${selectedSubRole}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-border p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-bold font-mono">
            <Mic className="w-3.5 h-3.5 animate-pulse text-accent" /> Live Voice Analysis Engine
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            FAANG Voice Interview Practice &amp; Real Question Bank
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Practice real candidate-reported interview questions out loud. Get instant AI coaching on your <strong className="text-white font-semibold">STAR framework</strong> components, filler-word density, and speech pacing.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button onClick={handleStartSession} className="bg-accent hover:bg-accent-hover text-white font-bold px-6 py-5 text-sm gap-2 shadow-lg shadow-accent/25">
              <Play className="w-4 h-4 fill-white" /> Start Practice Session
            </Button>
          </div>
        </div>
      </div>

      {/* Role Selection Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Select Target Role &amp; Domain</h2>
          <p className="text-xs text-text-muted">Choose your field to load curated FAANG-style behavioral and technical questions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <Card
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`cursor-pointer transition-all border ${
                  isSelected
                    ? "border-accent bg-accent/5 ring-1 ring-accent/50 shadow-md"
                    : "border-border bg-surface hover:bg-surface-elevated"
                }`}
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${
                      isSelected ? "bg-accent text-white border-accent" : "bg-surface-elevated text-text-muted border-border"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-base font-bold text-text-primary">{r.title}</CardTitle>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />}
                </CardHeader>

                <CardContent className="space-y-3">
                  <CardDescription className="text-xs text-text-secondary leading-relaxed">
                    {r.desc}
                  </CardDescription>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {r.tags.map((t, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] border-border text-text-muted font-mono">
                        {t} Style
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" /> STAR Structure Evaluation
          </div>
          <p className="text-[11px] text-text-muted">
            Automatically validates Situation, Task, Action, and Result in your spoken responses.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border space-y-1.5">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
            <Mic className="w-4 h-4" /> Filler Word Detection
          </div>
          <p className="text-[11px] text-text-muted">
            Detects 'um', 'uh', 'like', and 'basically' with precise percentage density metrics.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <Volume2 className="w-4 h-4" /> Variety Protection
          </div>
          <p className="text-[11px] text-text-muted">
            Smart algorithm excludes recently served questions so every session stays fresh.
          </p>
        </div>
      </div>
    </div>
  );
}
