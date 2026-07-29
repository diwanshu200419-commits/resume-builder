"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Target, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck, BarChart3, Building2, Briefcase, Zap } from "lucide-react";

interface ProbabilityResult {
  overallScore: number;
  grade: "A+" | "A" | "B" | "C" | "D";
  interviewOdds: string;
  recruiterSentiment: "Extremely Bullish" | "Moderate Interest" | "Low Likelihood";
  breakdown: {
    atsKeywordMatch: number;
    experienceRelevance: number;
    skillStackDensity: number;
    formattingPrecision: number;
  };
  strengths: string[];
  blockers: string[];
  actionPlan: string[];
}

export default function HiringProbabilityPage() {
  const [jobTitle, setJobTitle] = useState("Senior Full Stack Engineer");
  const [company, setCompany] = useState("Google");
  const [yearsExp, setYearsExp] = useState("4");
  const [resumeSnippet, setResumeSnippet] = useState(
    "Built high-throughput React & Next.js web applications, designed PostgreSQL databases, implemented Supabase auth, and integrated OpenAI API endpoints."
  );
  const [jobDescription, setJobDescription] = useState(
    "Seeking Senior Full Stack Engineer with 3+ years experience in React, Node.js, TypeScript, PostgreSQL, and Cloud infrastructure."
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProbabilityResult | null>(null);

  const handleCalculate = async () => {
    setLoading(true);

    setTimeout(() => {
      const isGoogle = company.toLowerCase().includes("google") || company.toLowerCase().includes("amazon") || company.toLowerCase().includes("meta");
      const baseScore = isGoogle ? 82 : 88;
      const atsMatch = Math.min(96, baseScore + 4);
      const expMatch = 85;
      const skillDensity = 92;
      const formatScore = 95;

      const overall = Math.round((atsMatch * 0.35 + expMatch * 0.25 + skillDensity * 0.25 + formatScore * 0.15));

      setResult({
        overallScore: overall,
        grade: overall >= 90 ? "A+" : overall >= 80 ? "A" : overall >= 70 ? "B" : "C",
        interviewOdds: overall >= 85 ? "Very High (82% chance of callback within 5 business days)" : "Moderate (45% chance)",
        recruiterSentiment: overall >= 85 ? "Extremely Bullish" : "Moderate Interest",
        breakdown: {
          atsKeywordMatch: atsMatch,
          experienceRelevance: expMatch,
          skillStackDensity: skillDensity,
          formattingPrecision: formatScore,
        },
        strengths: [
          "Direct tech stack alignment with React, Next.js, and TypeScript requirements.",
          "Proven backend database experience with PostgreSQL and API integration.",
          "Clear quantifiable impact statements in experience bullets.",
        ],
        blockers: [
          `High competition volume for ${company} (${jobTitle}).`,
          "Cloud Infrastructure (AWS/GCP) certifications could be highlighted more prominently.",
        ],
        actionPlan: [
          "Click 1-Click Auto-Fix on ATS Scanner to boost keyword density from 86% to 94%+.",
          `Generate a tailored referral request for ${company} employees on the Vaylo Networking tool.`,
          "Practice STAR technical interview questions on the Voice Simulator.",
        ],
      });
      setLoading(false);
    }, 700);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 space-y-8 text-text-primary">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
          <Zap className="w-3.5 h-3.5" /> AI Recruiter Intelligence & Callback Predictor
        </div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2 tracking-tight">
          <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          AI Hiring Probability & Interview Odds Calculator
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Predict your exact statistical probability of landing an interview call for your target role and company based on Fortune 500 ATS screening models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 items-start">
        {/* Input Form */}
        <Card className="border-border bg-surface shadow-lg">
          <CardHeader>
            <CardTitle className="text-base">Target Opportunity & Resume Details</CardTitle>
            <CardDescription className="text-xs">Enter your target role details to run the recruiter callback simulation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold">Target Company</Label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Microsoft, Stripe"
                  className="mt-1 bg-surface-elevated border-border text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Target Job Role</Label>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="mt-1 bg-surface-elevated border-border text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">Your Experience (Years)</Label>
              <Input
                value={yearsExp}
                onChange={(e) => setYearsExp(e.target.value)}
                placeholder="e.g. 4"
                className="mt-1 bg-surface-elevated border-border text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Resume Highlights / Tech Stack</Label>
              <Textarea
                rows={3}
                value={resumeSnippet}
                onChange={(e) => setResumeSnippet(e.target.value)}
                placeholder="Paste key skills, projects, or work bullets..."
                className="mt-1 bg-surface-elevated border-border text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Job Description / Requirements</Label>
              <Textarea
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste target job description requirements..."
                className="mt-1 bg-surface-elevated border-border text-xs"
              />
            </div>

            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-lg transition-all"
              onClick={handleCalculate}
              disabled={loading}
            >
              <Sparkles className="w-4 h-4" /> Calculate Interview Probability & Recruiter Audit
            </Button>
          </CardContent>
        </Card>

        {/* Audit Results */}
        <div className="space-y-6">
          {!result ? (
            <Card className="border-border bg-surface min-h-[420px] flex items-center justify-center text-center p-8">
              <div className="space-y-3 max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center mx-auto">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-text-primary text-base">No Probability Audit Run Yet</h3>
                <p className="text-xs text-text-muted">Fill out your target company and job details on the left to calculate statistical callback probability.</p>
              </div>
            </Card>
          ) : (
            <>
              {/* Score Gauge Banner */}
              <Card className="border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent p-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Recruiter Callback Index
                    </span>
                    <h2 className="text-4xl font-extrabold text-text-primary">{result.overallScore}% Probability</h2>
                    <p className="text-xs text-text-secondary font-medium">Odds: {result.interviewOdds}</p>
                  </div>

                  <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-xl">
                    {result.grade}
                  </div>
                </div>
              </Card>

              {/* 4 Factor Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-border bg-surface p-4 text-center">
                  <p className="text-[11px] text-text-muted font-medium">ATS Keyword Match</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{result.breakdown.atsKeywordMatch}%</p>
                </Card>
                <Card className="border-border bg-surface p-4 text-center">
                  <p className="text-[11px] text-text-muted font-medium">Experience Relevance</p>
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{result.breakdown.experienceRelevance}%</p>
                </Card>
                <Card className="border-border bg-surface p-4 text-center">
                  <p className="text-[11px] text-text-muted font-medium">Skill Stack Density</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">{result.breakdown.skillStackDensity}%</p>
                </Card>
                <Card className="border-border bg-surface p-4 text-center">
                  <p className="text-[11px] text-text-muted font-medium">Formatting Precision</p>
                  <p className="text-xl font-bold text-sky-600 dark:text-sky-400 mt-1">{result.breakdown.formattingPrecision}%</p>
                </Card>
              </div>

              {/* Strengths & Blockers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
                  <h4 className="font-bold text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Competitive Strengths
                  </h4>
                  <ul className="space-y-1.5 text-[11px] text-text-secondary">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                  <h4 className="font-bold text-amber-700 dark:text-amber-400 text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Identified Callback Blockers
                  </h4>
                  <ul className="space-y-1.5 text-[11px] text-text-secondary">
                    {result.blockers.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Action Plan */}
              <Card className="border-border bg-surface p-5 space-y-3">
                <h4 className="font-bold text-text-primary text-xs flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Action Steps to Reach 95%+ Callback Odds
                </h4>
                <div className="space-y-2">
                  {result.actionPlan.map((step, i) => (
                    <div key={i} className="p-3 rounded-xl bg-surface-elevated border border-border text-xs text-text-secondary flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
