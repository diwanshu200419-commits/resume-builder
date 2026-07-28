"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, RefreshCw, Copy, Check, Linkedin, Sparkles, UserCheck } from "lucide-react";
import type { LinkedInSuggestions } from "@/types";

export default function LinkedInPage() {
  const params = useParams();
  const id = params.id as string;

  const [suggestions, setSuggestions] = useState<LinkedInSuggestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/analyze?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.analysis?.linkedin_suggestions) {
          setSuggestions(data.analysis.linkedin_suggestions);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: id, type: "linkedin" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuggestions(data.linkedinSuggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong, try again");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-4">
          <Link href={`/results/${id}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Analysis
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <Linkedin className="w-6 h-6 text-[#0A66C2]" /> LinkedIn Profile Optimizer
            </h1>
            <p className="text-xs text-text-muted mt-0.5">High-converting headlines and recruiter-optimized bio sections.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating} className="gap-1">
          {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          {suggestions ? "Regenerate Profile" : "Generate Suggestions"}
        </Button>
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}
      {!suggestions ? (
        <Card className="border-border bg-surface">
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center mx-auto text-[#0A66C2]">
              <Linkedin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Optimize Your LinkedIn Profile</h3>
            <p className="text-sm text-text-muted max-w-md mx-auto">
              Get recruiter-targeted headlines, an engaging first-person About section, and skill tag suggestions.
            </p>
            <Button onClick={handleGenerate} disabled={generating} className="bg-[#0A66C2] hover:bg-[#084e96] text-white">
              {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Generate LinkedIn Optimization
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* LinkedIn Realistic Mock Card */}
          <Card className="border-border bg-surface overflow-hidden shadow-xl">
            {/* Cover Banner */}
            <div className="h-28 bg-gradient-to-r from-[#0A66C2]/30 via-accent/20 to-[#0A66C2]/40 relative">
              <div className="absolute top-3 right-3">
                <Badge className="bg-surface/80 text-text-secondary border-border text-xs">
                  <UserCheck className="w-3 h-3 mr-1 text-success" /> Live Mockup
                </Badge>
              </div>
            </div>

            <CardContent className="p-6 relative pt-0">
              {/* Profile Avatar */}
              <div className="w-20 h-20 rounded-full bg-surface-elevated border-4 border-surface -mt-10 flex items-center justify-center font-extrabold text-2xl text-accent shadow-md mb-4">
                PRO
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">Target Professional Profile</h2>
                  <p className="text-xs text-text-muted">Optimized for LinkedIn Recruiter & Search Indexing</p>
                </div>

                {/* Primary Suggested Headline */}
                {suggestions.headline_options && suggestions.headline_options.length > 0 && (
                  <div className="p-3.5 rounded-lg bg-surface-elevated border border-border flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-text-primary leading-snug">{suggestions.headline_options[0]}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(suggestions.headline_options[0], "headline-top")}
                      className="text-xs text-accent hover:text-accent-hover shrink-0 gap-1"
                    >
                      {copiedIndex === "headline-top" ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Headline Options Grid */}
          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" /> High-Impact Headline Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.headline_options?.map((headline, i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-3.5 rounded-lg bg-surface-elevated/60 border border-border/60 hover:border-border-active transition-all">
                  <p className="text-sm text-text-secondary leading-snug">{headline}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(headline, `headline-${i}`)}
                    className="text-xs text-text-muted hover:text-text-primary shrink-0 gap-1"
                  >
                    {copiedIndex === `headline-${i}` ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* About Section Rewrite */}
          <Card className="border-border bg-surface">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">About / Bio Section Rewrite</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(suggestions.about_section, "about")}
                className="text-xs gap-1"
              >
                {copiedIndex === "about" ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Bio
              </Button>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-surface-elevated/60 border border-border/40 text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                {suggestions.about_section}
              </div>
            </CardContent>
          </Card>

          {/* Skills & Profile Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border bg-surface">
              <CardHeader>
                <CardTitle className="text-base">Target Skills to Add</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {suggestions.skills_to_add?.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-accent border-accent/30 bg-accent/5 px-2.5 py-1 text-xs">
                      + {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-surface">
              <CardHeader>
                <CardTitle className="text-base">Recruiter Search Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {suggestions.profile_tips?.map((tip, i) => (
                    <li key={i} className="text-xs text-text-secondary flex items-start gap-2 leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
