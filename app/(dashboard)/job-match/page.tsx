"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Target, Loader2, Sparkles, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Award } from "lucide-react";

interface JobMatchResult {
  overall_match_score: number;
  skills_match_score: number;
  experience_match_score: number;
  match_grade: string;
  matching_skills: string[];
  missing_critical_skills: string[];
  keyword_gap: string[];
  strengths: string[];
  red_flags: string[];
  actionable_recommendations: string[];
}

export default function JobMatchPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription || (!resumeText && !sampleResume)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeText || sampleResume,
          jobDescription,
          targetRole,
        }),
      });

      const json = await res.json();
      if (json.data) {
        setResult(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sampleResume = `SENIOR SOFTWARE ENGINEER
Experienced developer proficient in JavaScript, TypeScript, React, Next.js, Node.js, REST APIs, and PostgreSQL. 
Demonstrated success building scalable web applications, optimizing performance, and collaborating in Agile teams.`;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
            <Target className="w-8 h-8 text-accent animate-pulse" />
            AI Job Matcher & Audit
          </h1>
          <p className="text-text-secondary mt-1">
            Compare your resume against any target job description to get a recruiter-grade compatibility rating and gap analysis.
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1.5 border-accent/40 text-accent bg-accent/5">
          <Sparkles className="w-3.5 h-3.5 mr-1" /> Match Score AI Engine
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border bg-surface shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" /> Target Job Parameters
              </CardTitle>
              <CardDescription>
                Paste your target job posting to see how well your profile aligns.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="targetRole">Target Role / Company (Optional)</Label>
                  <Input
                    id="targetRole"
                    placeholder="e.g. Senior Frontend Engineer at Stripe"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="resumeText">Your Resume Content</Label>
                    {!resumeText && (
                      <button
                        type="button"
                        onClick={() => setResumeText(sampleResume)}
                        className="text-xs text-accent hover:underline cursor-pointer"
                      >
                        Auto-fill sample resume
                      </button>
                    )}
                  </div>
                  <Textarea
                    id="resumeText"
                    placeholder="Paste your resume text here..."
                    className="min-h-[140px] text-sm"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="jobDesc">Job Description *</Label>
                  <Textarea
                    id="jobDesc"
                    placeholder="Paste the target job description requirements here..."
                    className="min-h-[160px] text-sm"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !jobDescription}
                  className="w-full bg-accent hover:bg-accent-hover text-white gap-2 font-semibold py-3 shadow-lg card-glow"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Compatibility Match...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Run Compatibility Audit
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Results Column */}
        <div className="lg:col-span-6 space-y-6">
          {!result && !loading && (
            <Card className="border-dashed border-border bg-surface/50 h-full min-h-[400px] flex items-center justify-center text-center p-8">
              <div className="max-w-md space-y-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">Ready to Audit</h3>
                <p className="text-sm text-text-secondary">
                  Paste a job description on the left and run the audit to see your match score, missing keywords, and recruiter recommendations.
                </p>
              </div>
            </Card>
          )}

          {loading && (
            <Card className="border-border bg-surface/80 min-h-[400px] flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto" />
                <p className="text-sm text-text-secondary">Evaluating tech stack, experiences, and keyword density...</p>
              </div>
            </Card>
          )}

          {result && !loading && (
            <div className="space-y-6">
              {/* Score Header Card */}
              <Card className="border-accent/40 bg-surface card-glow relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Award className="w-32 h-32 text-accent" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">Compatibility Score</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-5xl font-extrabold text-text-primary">{result.overall_match_score}%</span>
                        <Badge className="bg-accent text-white font-bold px-2.5 py-1">
                          Grade {result.match_grade}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-xs text-text-secondary">Skills Match: <span className="font-semibold text-text-primary">{result.skills_match_score}%</span></div>
                      <div className="text-xs text-text-secondary">Experience Match: <span className="font-semibold text-text-primary">{result.experience_match_score}%</span></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Gap Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-border bg-surface">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold uppercase text-success flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Matching Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-1.5">
                    {result.matching_skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-success border-success/30 bg-success/5 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-border bg-surface">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold uppercase text-danger flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Missing Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-1.5">
                    {result.missing_critical_skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-danger border-danger/30 bg-danger/5 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Actionable Recommendations */}
              <Card className="border-border bg-surface">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" /> Recruiter Optimization Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.actionable_recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
                      <ArrowRight className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
