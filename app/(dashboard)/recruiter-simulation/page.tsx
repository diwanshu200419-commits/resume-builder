"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Eye, Sparkles, Clock, CheckCircle, AlertCircle, ArrowRight, Zap, Target, Award } from "lucide-react";

interface SimulationResult {
  firstImpressionScore: number;
  readabilityRating: "Instant Pass" | "Needs Polish" | "High Dropoff Risk";
  tenSecEyeTracking: {
    heroSection: string;
    skillsVisibility: string;
    impactQuantification: string;
  };
  recruiterVerdict: string;
  immediateFixes: string[];
}

export default function RecruiterSimulationPage() {
  const [resumeText, setResumeText] = useState(
    "Senior Full Stack Engineer with 4+ years of experience architecting React, Next.js, and PostgreSQL web applications. Reduced API latency by 45% and spearheaded microservice development for 100k+ daily active users."
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = () => {
    setLoading(true);
    setTimeout(() => {
      setResult({
        firstImpressionScore: 94,
        readabilityRating: "Instant Pass",
        tenSecEyeTracking: {
          heroSection: "Eyes scanned title & 4+ yrs experience immediately (0.8s).",
          skillsVisibility: "React, Next.js, and PostgreSQL jumped out in top 1/3 (2.1s).",
          impactQuantification: "45% latency reduction & 100k+ DAU metrics stood out (4.5s).",
        },
        recruiterVerdict: "Passes initial 10-second scan with distinction. Recruiter will shortlist for candidate interview queue.",
        immediateFixes: [
          "Bold tech stack keywords in the experience section to increase 6-second scan speed.",
          "Add cloud infrastructure credentials (AWS/GCP) to the top header.",
        ],
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 space-y-8 text-text-primary">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
          <Clock className="w-3.5 h-3.5" /> 10-Second Eye-Tracking Simulation
        </div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2 tracking-tight">
          <Eye className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          AI Recruiter 10-Second Screen Simulator
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Simulate how a Fortune 500 tech recruiter reads your resume during the initial 10-second scan before deciding to shortlist or reject.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8 items-start">
        <Card className="border-border bg-surface shadow-lg">
          <CardHeader>
            <CardTitle className="text-base">Resume Content Scan Input</CardTitle>
            <CardDescription className="text-xs">Paste your resume summary or bullets to run the 10-second eye-tracking test.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content..."
              className="bg-surface-elevated text-xs"
            />
            <Button
              onClick={handleSimulate}
              disabled={loading || !resumeText.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" /> Run 10-Second Recruiter Screen Test
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {!result ? (
            <Card className="border-border bg-surface min-h-[360px] flex items-center justify-center text-center p-8">
              <div className="space-y-3 max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center mx-auto">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-text-primary text-base">No Simulation Run</h3>
                <p className="text-xs text-text-muted">Click 'Run 10-Second Recruiter Screen Test' to view recruiter eye-tracking heatmaps.</p>
              </div>
            </Card>
          ) : (
            <>
              <Card className="border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Initial Scan Rating
                    </span>
                    <h2 className="text-3xl font-extrabold text-text-primary mt-1">{result.readabilityRating}</h2>
                    <p className="text-xs text-text-secondary mt-1 font-medium">{result.recruiterVerdict}</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
                    {result.firstImpressionScore}%
                  </div>
                </div>
              </Card>

              {/* Eye Tracking Map */}
              <Card className="border-border bg-surface p-5 space-y-3">
                <h4 className="font-bold text-xs text-text-primary flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" /> 10-Second Eye Scan Breakdown
                </h4>
                <div className="space-y-2 text-xs text-text-secondary">
                  <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">0.0s – 2.0s:</span> {result.tenSecEyeTracking.heroSection}
                  </div>
                  <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                    <span className="font-bold text-purple-600 dark:text-purple-400">2.0s – 5.0s:</span> {result.tenSecEyeTracking.skillsVisibility}
                  </div>
                  <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">5.0s – 10.0s:</span> {result.tenSecEyeTracking.impactQuantification}
                  </div>
                </div>
              </Card>

              {/* Fixes */}
              <Card className="border-border bg-surface p-5 space-y-3">
                <h4 className="font-bold text-xs text-text-primary flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" /> Recommendations to Maximize Recruiter Attention
                </h4>
                <div className="space-y-2">
                  {result.immediateFixes.map((fix, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-surface-elevated border border-border text-xs text-text-secondary flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> {fix}
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
