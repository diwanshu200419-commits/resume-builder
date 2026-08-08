"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Eye, Sparkles, Clock, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Zap, Target, Layers, FileText } from "lucide-react";
import { parseResumeForSimulation, computeFixationPath, generateVerdict, FixationZone, ScreenVerdict } from "@/lib/recruiter-sim/fixationModel";

export default function RecruiterSimulationPage() {
  const [resumeText, setResumeText] = useState(
    "Senior Full Stack Engineer | Ex-Stripe & Meta\nSan Francisco, CA • alex.dev@example.com • github.com/alexdev\n\n• Architected React, Next.js & PostgreSQL microservice pipeline handling 100k+ daily active users.\n• Spearheaded Redis cache optimization, reducing P99 API response latency by 45% ($120k ARR infra savings).\n• Led a cross-functional squad of 6 engineers to launch real-time analytics dashboard on AWS Kubernetes.\n• Maintained 99.99% service uptime across global API gateway handling 15,000 requests/sec.\n• Conducted technical interviews and onboarded 12 junior software engineers."
  );

  const [hasRun, setHasRun] = useState(true);

  // Compute simulation deterministically on text edit
  const { parsed, zones, verdict } = useMemo(() => {
    if (!resumeText.trim()) {
      return { parsed: null, zones: [], verdict: null };
    }
    const parsedData = parseResumeForSimulation(resumeText);
    const zoneData = computeFixationPath(parsedData);
    const verdictData = generateVerdict(zoneData, parsedData);
    return { parsed: parsedData, zones: zoneData, verdict: verdictData };
  }, [resumeText]);

  const handleSimulate = () => {
    setHasRun(true);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 space-y-8 text-text-primary">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
          <Clock className="w-3.5 h-3.5" /> Published Recruiter Research Model
        </div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2 tracking-tight">
          <Eye className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          AI Recruiter 10-Second Screen Simulator
        </h1>
        <p className="text-text-secondary text-sm mt-1 max-w-3xl">
          Simulate how a tech recruiter's eyes scan your resume in the initial 10 seconds. Grounded in F-pattern eye-tracking research: top-left priority, metric attraction, and dense paragraph dropoff penalties.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="space-y-6">
          <Card className="border-border bg-surface shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Resume Text Input</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {parsed?.totalWordCount || 0} Words
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Edit or paste your resume content below. Heatmaps and screening verdicts update deterministically in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                rows={12}
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  setHasRun(true);
                }}
                placeholder="Paste your resume summary and bullet points here..."
                className="bg-surface-elevated text-xs font-mono leading-relaxed"
              />
              <Button
                onClick={handleSimulate}
                disabled={!resumeText.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" /> Recalculate 10-Second Eye Scan
              </Button>
            </CardContent>
          </Card>

          {/* Quick Preset Buttons for Testing */}
          <Card className="border-border bg-surface p-4 space-y-3">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Test Preset Scenarios</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => {
                  setResumeText(
                    "Full Stack Developer\nSan Francisco, CA\n\n• Architected React, Next.js & PostgreSQL pipeline handling 100k+ daily active users.\n• Reduced P99 latency by 45% saving $120k ARR."
                  );
                  setHasRun(true);
                }}
                className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-left font-medium transition-colors"
              >
                🟢 Front-Loaded Hooks
              </button>
              <button
                onClick={() => {
                  setResumeText(
                    "Software Engineer\nSF Bay Area\n\n• Worked on frontend features and bug fixes.\n• Maintained code repos.\n• Collaborated with squad.\n• Implemented unit tests.\n• Spearheaded database refactor, reducing load times by 65% and saving $250k."
                  );
                  setHasRun(true);
                }}
                className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-left font-medium transition-colors"
              >
                🟡 Buried Metric (Bullet #5)
              </button>
              <button
                onClick={() => {
                  setResumeText(
                    "Experienced Software Engineer\nResponsible for designing and maintaining high-scale microservices across cloud environments using React, Node.js and AWS. Worked on performance fixes, customer bugs, database migrations, and CI/CD automation pipelines without bullet points."
                  );
                  setHasRun(true);
                }}
                className="p-2.5 rounded-lg border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-left font-medium transition-colors"
              >
                🔴 Dense Paragraph Text
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column: Grounded Heatmap & Verdict */}
        <div className="space-y-6">
          {!verdict || !hasRun ? (
            <Card className="border-border bg-surface min-h-[400px] flex items-center justify-center text-center p-8">
              <div className="space-y-3 max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center mx-auto">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-text-primary text-base">Paste Resume to Run Scan</h3>
                <p className="text-xs text-text-muted">Enter resume text on the left to view Content-Aware Eye Tracking Heatmaps.</p>
              </div>
            </Card>
          ) : (
            <>
              {/* Verdict Header Badge Card */}
              <Card className={`border p-6 shadow-xl ${
                verdict.outcome === "shortlist_likely"
                  ? "border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent"
                  : verdict.outcome === "pass_likely"
                  ? "border-rose-500/30 bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent"
                  : "border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent"
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                        verdict.outcome === "shortlist_likely"
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : verdict.outcome === "pass_likely"
                          ? "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30"
                          : "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      }`}>
                        {verdict.outcome === "shortlist_likely" && <CheckCircle2 className="w-4 h-4" />}
                        {verdict.outcome === "pass_likely" && <XCircle className="w-4 h-4" />}
                        {verdict.outcome === "borderline" && <AlertTriangle className="w-4 h-4" />}
                        {verdict.outcome.replace("_", " ")}
                      </span>
                      <span className="text-xs text-text-muted font-medium">
                        {verdict.zonesScannedCount} / {verdict.totalZonesCount} Zones Reached
                      </span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
                      {verdict.outcome === "shortlist_likely" && "High Recruiter Conversion Signal"}
                      {verdict.outcome === "pass_likely" && "High Dropoff Risk — Recruiter Skim Failure"}
                      {verdict.outcome === "borderline" && "Borderline Recruiter Attention Signal"}
                    </h2>
                    <p className="text-xs text-text-secondary mt-1 font-medium leading-relaxed">
                      {verdict.reasoning}
                    </p>
                  </div>
                  <div className={`w-16 h-16 rounded-2xl font-black text-2xl flex flex-col items-center justify-center shrink-0 shadow-lg text-white ${
                    verdict.outcome === "shortlist_likely"
                      ? "bg-emerald-600"
                      : verdict.outcome === "pass_likely"
                      ? "bg-rose-600"
                      : "bg-amber-600"
                  }`}>
                    <span>{verdict.score}</span>
                    <span className="text-[9px] uppercase font-bold opacity-80">Score</span>
                  </div>
                </div>
              </Card>

              {/* Actionable Findings (Primary Output Value) */}
              <Card className="border-border bg-surface p-5 space-y-4 shadow-md">
                <h4 className="font-bold text-xs text-text-primary flex items-center gap-2 uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-amber-500" /> Primary Diagnostic Findings
                </h4>
                <div className="space-y-3">
                  {verdict.keyFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 ${
                        finding.type === "strong_early_signal"
                          ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                          : finding.type === "buried_metric"
                          ? "bg-amber-500/5 border-amber-500/20 text-amber-900 dark:text-amber-300"
                          : "bg-rose-500/5 border-rose-500/20 text-rose-900 dark:text-rose-300"
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span className="capitalize">{finding.type.replace(/_/g, " ")}</span>
                        <Badge variant="outline" className="text-[10px]">
                          Zone: {finding.zoneId}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-secondary font-medium">{finding.message}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Grounded Content-Aware SVG Eye-Tracking Heatmap Overlay */}
              <Card className="border-border bg-surface p-5 space-y-4 shadow-md">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-text-primary flex items-center gap-2 uppercase tracking-wider">
                    <Eye className="w-4 h-4 text-indigo-500" /> Simulated Eye-Tracking Heatmap Breakdown
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-text-muted">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> High Fixation</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Medium Fixation</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-400/30 inline-block"></span> Unreached (0ms)</span>
                  </div>
                </div>

                <div className="space-y-2.5 font-mono text-xs bg-slate-950/90 text-slate-100 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
                  {zones.map((z, idx) => {
                    const heatPct = Math.round((z.fixationDurationMs / 1800) * 100);
                    return (
                      <div
                        key={z.zoneId}
                        className={`p-3 rounded-lg border transition-all relative ${
                          z.reached
                            ? z.fixationDurationMs > 1200
                              ? "bg-rose-500/10 border-rose-500/30"
                              : "bg-amber-500/10 border-amber-500/30"
                            : "bg-slate-900/40 border-slate-800 opacity-40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 text-[11px]">
                          <span className="font-bold text-slate-300 flex items-center gap-2">
                            <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                            {z.label}
                          </span>
                          <span className={`text-[10px] font-bold ${
                            z.reached ? "text-emerald-400" : "text-rose-400"
                          }`}>
                            {z.reached ? `REACHED (${z.fixationDurationMs}ms)` : "UNREACHED (0ms)"}
                          </span>
                        </div>

                        {/* Text Snippet */}
                        <div className="text-[11px] text-slate-400 font-sans truncate mb-2">
                          "{z.textSnippet}"
                        </div>

                        {/* Eye-Tracking Heat Intensity Bar */}
                        {z.reached ? (
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                heatPct > 65
                                  ? "bg-gradient-to-r from-amber-500 to-rose-500"
                                  : "bg-gradient-to-r from-emerald-500 to-amber-500"
                              }`}
                              style={{ width: `${Math.min(100, heatPct)}%` }}
                            />
                          </div>
                        ) : (
                          <div className="text-[10px] text-rose-400/90 font-sans italic">
                            ⚠️ Simulated 10-second recruiter scan stopped before reaching this zone.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
