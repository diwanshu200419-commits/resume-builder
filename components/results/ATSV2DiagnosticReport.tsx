"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, ArrowUpRight, ShieldCheck, Target, Award, Zap, BookOpen, Layers, Sparkles } from "lucide-react";
import type { ATSV2ScoreBreakdown, ATSV2RequirementMatch, ATSV2PriorityFix } from "@/types";

interface ATSV2DiagnosticReportProps {
  scoreBreakdown?: ATSV2ScoreBreakdown;
  matchedMustHaves?: string[];
  missingMustHaves?: string[];
  matchedPreferred?: string[];
  missingPreferred?: string[];
  detailedRequirements?: ATSV2RequirementMatch[];
  priorityFixes?: ATSV2PriorityFix[];
  confidence?: "HIGH" | "MEDIUM" | "LOW";
  confidenceReason?: string;
  candidateContext?: string;
  industryProfile?: string;
}

export function ATSV2DiagnosticReport({
  scoreBreakdown,
  matchedMustHaves = [],
  missingMustHaves = [],
  matchedPreferred = [],
  missingPreferred = [],
  priorityFixes = [],
  confidence = "HIGH",
  confidenceReason,
  candidateContext = "Experienced",
  industryProfile = "general",
}: ATSV2DiagnosticReportProps) {
  if (!scoreBreakdown) return null;

  const categories = [
    { key: "skills", data: scoreBreakdown.skills, icon: Target, color: "text-indigo-400" },
    { key: "experience", data: scoreBreakdown.experience, icon: ShieldCheck, color: "text-blue-400" },
    { key: "semantic", data: scoreBreakdown.semantic, icon: Sparkles, color: "text-purple-400" },
    { key: "projects", data: scoreBreakdown.projects, icon: Layers, color: "text-emerald-400" },
    { key: "education", data: scoreBreakdown.education, icon: BookOpen, color: "text-amber-400" },
    { key: "structure", data: scoreBreakdown.structure, icon: Zap, color: "text-cyan-400" },
    { key: "impact", data: scoreBreakdown.impact, icon: Award, color: "text-rose-400" },
  ];

  const industryLabels: Record<string, string> = {
    tech: "Tech & Engineering",
    finance: "Finance & Banking",
    marketing: "Marketing & Growth",
    healthcare: "Healthcare & Medical",
    executive: "Executive & Leadership",
    general: "General Model",
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Candidate Context, Industry Profile & Evaluation Confidence */}
      <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-indigo-500/40 text-indigo-400 bg-indigo-500/10">
            Context: {candidateContext}
          </Badge>
          <Badge variant="outline" className="border-purple-500/40 text-purple-400 bg-purple-500/10 uppercase font-mono">
            Profile: {industryLabels[industryProfile] || industryProfile.toUpperCase()}
          </Badge>
          <span className="text-text-muted">|</span>
          <span className="text-text-secondary font-medium">ATS V2 Dynamic Scoring Engine</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-muted">Score Confidence:</span>
          <Badge
            variant="outline"
            className={
              confidence === "HIGH"
                ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 font-bold"
                : confidence === "MEDIUM"
                ? "border-amber-500/40 text-amber-400 bg-amber-500/10 font-bold"
                : "border-rose-500/40 text-rose-400 bg-rose-500/10 font-bold"
            }
          >
            {confidence} CONFIDENCE
          </Badge>
        </div>
      </div>

      {/* 100-Point Category Mathematics Breakdown */}
      <Card className="border-border bg-surface shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Authoritative Score Breakdown (100 Points Total)</span>
            <span className="text-xs text-text-muted font-normal">7 Category Math Pipeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const pct = Math.round((cat.data.score / cat.data.max) * 100);
              return (
                <div key={cat.key} className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-secondary flex items-center gap-1.5">
                      <Icon className={`w-4 h-4 ${cat.color}`} />
                      {cat.data.label}
                    </span>
                    <span className="font-bold text-text-primary">
                      {cat.data.score}/{cat.data.max} pts
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Matched vs Missing Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Must-Haves */}
        <Card className="border-border bg-surface">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-text-primary flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Required Must-Have Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-[11px] font-semibold text-emerald-400 mb-1.5">MATCHED MUST-HAVES ({matchedMustHaves.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {matchedMustHaves.length > 0 ? (
                  matchedMustHaves.map((sk) => (
                    <Badge key={sk} variant="outline" className="border-emerald-500/30 text-emerald-300 bg-emerald-500/10 text-xs">
                      ✓ {sk}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-text-muted">None detected</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-rose-400 mb-1.5">MISSING MUST-HAVES ({missingMustHaves.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {missingMustHaves.length > 0 ? (
                  missingMustHaves.map((sk) => (
                    <Badge key={sk} variant="outline" className="border-rose-500/30 text-rose-300 bg-rose-500/10 text-xs">
                      ✕ {sk}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400">All required must-haves present!</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferred */}
        <Card className="border-border bg-surface">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Preferred &amp; Bonus Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-[11px] font-semibold text-indigo-400 mb-1.5">MATCHED PREFERRED ({matchedPreferred.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {matchedPreferred.length > 0 ? (
                  matchedPreferred.map((sk) => (
                    <Badge key={sk} variant="outline" className="border-indigo-500/30 text-indigo-300 bg-indigo-500/10 text-xs">
                      ✓ {sk}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-text-muted">None detected</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-amber-400 mb-1.5">MISSING PREFERRED ({missingPreferred.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {missingPreferred.length > 0 ? (
                  missingPreferred.map((sk) => (
                    <Badge key={sk} variant="outline" className="border-amber-500/30 text-amber-300 bg-amber-500/10 text-xs">
                      ○ {sk}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-text-muted">No missing preferred skills</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Priority Actionable Fixes */}
      {priorityFixes.length > 0 && (
        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-surface to-surface">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" /> Top Priority ATS Optimization Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {priorityFixes.map((fix) => (
              <div key={fix.rank} className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs shrink-0">
                      #{fix.rank}
                    </span>
                    {fix.title}
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      fix.estimatedImpact === "HIGH"
                        ? "border-rose-500/40 text-rose-400 bg-rose-500/10 font-bold"
                        : "border-amber-500/40 text-amber-400 bg-amber-500/10 font-bold"
                    }
                  >
                    EST. IMPACT: {fix.estimatedImpact}
                  </Badge>
                </div>
                <p className="text-text-secondary leading-relaxed pl-7">{fix.recommendation}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
