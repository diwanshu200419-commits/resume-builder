"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Lock, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateResumeFile } from "@/lib/validate-resume";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type PublicATSResult = {
  atsScore: number;
  keywordMatchScore: number;
  skillsMatchScore: number;
  readabilityScore: number;
  formatScore: number;
  missingKeywords: string[];
  missingSkills: string[];
  weakSections: string[];
  summaryAnalysis: string;
};

function ScoreRing({ score, label, size = 160 }: { score: number; label: string; size?: number }) {
  const responsiveSize = typeof window !== 'undefined' && window.innerWidth < 640 ? 140 : size;
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(current);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [score]);

  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: responsiveSize, height: responsiveSize }}>
        <svg width={responsiveSize} height={responsiveSize} className="-rotate-90">
          <circle
            cx={responsiveSize / 2}
            cy={responsiveSize / 2}
            r={(responsiveSize - 16) / 2}
            fill="none"
            stroke="#2A2A3A"
            strokeWidth="10"
          />
          <circle
            cx={responsiveSize / 2}
            cy={responsiveSize / 2}
            r={(responsiveSize - 16) / 2}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * ((responsiveSize - 16) / 2)}
            strokeDashoffset={2 * Math.PI * ((responsiveSize - 16) / 2) - (displayScore / 100) * 2 * Math.PI * ((responsiveSize - 16) / 2)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color }}>
            {displayScore}
          </span>
          <span className="text-sm text-text-muted">/100</span>
        </div>
      </div>
      <span className="text-sm text-text-muted mt-2 font-medium">{label}</span>
    </div>
  );
}

import { useEffect } from "react";

export function FreeATSCalculatorClient() {
  const [step, setStep] = useState<"upload" | "analyzing" | "results">("upload");
  const [parsedText, setParsedText] = useState("");
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [atsResult, setAtsResult] = useState<PublicATSResult | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const validationError = validateResumeFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/public/parse", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to parse file");

        setParsedText(data.text);
        setFilename(file.name);
        setStep("analyzing");
        await analyzeResume(data.text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong, try again");
        setStep("upload");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const analyzeResume = async (text: string) => {
    try {
      const res = await fetch("/api/public/analyze-ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to analyze resume");

      setAtsResult(data);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong, try again");
      setStep("upload");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    disabled: loading || step !== "upload",
  });

  const reset = () => {
    setStep("upload");
    setParsedText("");
    setFilename("");
    setAtsResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {step === "upload" && (
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary mb-4">
                Free ATS Resume Checker
              </h1>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                See how your resume performs against Applicant Tracking Systems.
                Get instant score and feedback — no signup required.
              </p>
            </div>
          )}

          {step === "upload" && (
            <div className="max-w-3xl mx-auto">
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 mb-4",
                  isDragActive
                    ? "border-accent bg-accent/10 shadow-glow"
                    : "border-border hover:border-accent/50 hover:bg-accent/5"
                )}
              >
                <input {...getInputProps()} />
                <div className="mx-auto w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
                  <Upload className={cn("w-8 h-8 text-accent", loading && "animate-pulse")} />
                </div>
                <p className="text-xl font-semibold text-text-primary mb-2">
                  {loading ? "Reading your resume..." : isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                </p>
                <p className="text-text-muted">PDF, DOCX, or TXT — max 5MB</p>
              </div>

              {error && (
                <div className="bg-danger/10 border border-danger/30 text-danger rounded-xl p-4 text-center">
                  {error}
                </div>
              )}

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: CheckCircle2, title: "Instant Results", desc: "Get your ATS score in seconds" },
                  { icon: Sparkles, title: "AI-Powered", desc: "Advanced analysis of your resume" },
                  { icon: Lock, title: "100% Private", desc: "Your data stays secure and temporary" },
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-xl border border-border bg-surface-elevated">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
                    <p className="text-sm text-text-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "analyzing" && (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full border-4 border-border border-t-accent mx-auto mb-6 animate-spin"></div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Analyzing your resume...
              </h2>
              <p className="text-text-muted">
                Our AI is scanning for keywords, formatting, and recruiter appeal
              </p>
            </div>
          )}

          {step === "results" && atsResult && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-text-primary mb-2">
                  Your ATS Score
                </h2>
                <p className="text-text-muted">
                  Here's how your resume performs
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <div className="flex flex-col items-center">
                  <ScoreRing score={atsResult.atsScore} label="ATS Compatibility" size={200} />
                  <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-sm">
                    {[
                      { label: "Keywords", score: atsResult.keywordMatchScore },
                      { label: "Skills", score: atsResult.skillsMatchScore },
                      { label: "Readability", score: atsResult.readabilityScore },
                      { label: "Format", score: atsResult.formatScore },
                    ].map((s) => (
                      <div key={s.label} className="p-4 rounded-xl border border-border bg-surface">
                        <div className="text-xs text-text-muted uppercase tracking-wider mb-1">{s.label}</div>
                        <div className="text-2xl font-bold text-text-primary">{s.score}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-border bg-surface-elevated">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success" /> Quick Wins
                    </h3>
                    {atsResult.keywordMatchScore > 70 && atsResult.formatScore > 60 ? (
                      <div className="space-y-2 text-sm">
                        <p className="text-text-secondary">Your resume has strong basics!</p>
                      </div>
                    ) : (
                      <ul className="space-y-3 text-sm">
                        {atsResult.keywordMatchScore < 70 && (
                          <li className="flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                            <span className="text-text-secondary">Add more industry keywords</span>
                          </li>
                        )}
                        {atsResult.formatScore < 60 && (
                          <li className="flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                            <span className="text-text-secondary">Improve your formatting</span>
                          </li>
                        )}
                        {atsResult.readabilityScore < 70 && (
                          <li className="flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                            <span className="text-text-secondary">Simplify complex sentences</span>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

                  <div className="p-6 rounded-2xl border border-border bg-surface-elevated">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-warning" /> Areas to Improve
                    </h3>
                    <div className="space-y-3">
                      {atsResult.weakSections.slice(0, 3).map((section, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                          <X className="w-4 h-4 text-danger mt-0.5 shrink-0" />
                          <span className="text-text-secondary">{section}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 border border-accent/30 text-center">
                <h3 className="text-2xl font-bold text-text-primary mb-3">
                  Unlock the Full AI Report
                </h3>
                <p className="text-text-secondary mb-8 max-w-xl mx-auto">
                  Get AI-improved resume, missing keywords, recruiter feedback, and download your optimized resume.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
                  {[
                    { title: "AI Improved Resume", icon: Sparkles },
                    { title: "Job Match Score", icon: CheckCircle2 },
                    { title: "Download PDF", icon: FileText },
                  ].map((f) => (
                    <div key={f.title} className="p-4 rounded-xl border border-border bg-surface flex items-center gap-3 justify-center">
                      <Lock className="w-5 h-5 text-accent" />
                      <span className="font-medium text-text-primary">{f.title}</span>
                    </div>
                  ))}
                </div>

                <Link href="/signup">
                  <Button className="h-14 px-10 text-lg font-semibold">
                    Create Free Account <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="text-center">
                <button
                  onClick={reset}
                  className="text-sm text-text-muted hover:text-text-secondary underline"
                >
                  Check another resume
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
