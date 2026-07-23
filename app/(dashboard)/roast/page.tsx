"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flame, Loader2, RefreshCw, Copy, Check, Skull } from "lucide-react";

export default function ResumeRoastPage() {
  const [resumeText, setResumeText] = useState("");
  const [roast, setRoast] = useState<{
    general_roast: string;
    format_roast: string;
    skills_roast: string;
    honest_advice: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoast = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not roast resume");
      setRoast(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate roast");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRoast = () => {
    if (!roast) return;
    const textToCopy = `🔥 VAYLO AI RESUME ROAST 🔥\n\nGeneral Roast:\n${roast.general_roast}\n\nFormat Roast:\n${roast.format_roast}\n\nSkills Roast:\n${roast.skills_roast}\n\nGet roasted at: Vaylo AI Career Platform!`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
          <Flame className="w-8 h-8 text-danger animate-pulse" />
          AI Resume Roast
        </h1>
        <p className="text-text-secondary mt-1">Get brutally honest, funny, and recruiter-savage feedback on your resume.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.3fr] gap-6">
        {/* Input */}
        <Card className="border-danger/20">
          <CardHeader>
            <CardTitle className="text-lg">Feed the AI beast</CardTitle>
            <CardDescription>Paste your current resume content here to trigger the roast.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste resume content here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[250px] font-mono text-xs border-danger/10 focus-visible:ring-danger"
            />
            <Button
              className="w-full bg-danger hover:bg-danger/80 text-white font-bold gap-2"
              disabled={loading || !resumeText.trim()}
              onClick={handleRoast}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Roasting...
                </>
              ) : (
                <>
                  <Skull className="w-4 h-4" /> Roast My Resume
                </>
              )}
            </Button>
            {error && <p className="text-xs text-danger">{error}</p>}
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-background to-surface border-border">
          {loading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <Flame className="w-12 h-12 text-danger animate-bounce" />
              <p className="text-sm font-semibold animate-pulse text-text-primary">Stoking the flames...</p>
            </div>
          )}

          {!roast && !loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 min-h-[350px]">
              <Flame className="w-16 h-16 text-text-muted mb-4 opacity-30" />
              <h3 className="font-semibold text-text-secondary text-lg mb-2">No roast yet</h3>
              <p className="text-text-muted text-sm max-w-xs">Paste your resume and hit roast to start the burn.</p>
            </div>
          ) : (
            roast && (
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2 text-danger font-bold">
                    <Skull className="w-5 h-5" />
                    Recruiter Verdict
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCopyRoast} className="gap-1">
                    {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                    Share Roast
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1 bg-danger/5 border border-danger/10 rounded-xl p-4">
                    <h4 className="text-xs uppercase font-bold text-danger">The Savage Roast</h4>
                    <p className="text-sm text-text-primary leading-relaxed">"{roast.general_roast}"</p>
                  </div>

                  <div className="space-y-1 bg-surface-elevated p-4 rounded-xl border border-border">
                    <h4 className="text-xs uppercase font-bold text-accent">Format &amp; Style Check</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">{roast.format_roast}</p>
                  </div>

                  <div className="space-y-1 bg-surface-elevated p-4 rounded-xl border border-border">
                    <h4 className="text-xs uppercase font-bold text-warning">Skills Verification</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">{roast.skills_roast}</p>
                  </div>

                  <div className="space-y-1 bg-success/5 border border-success/15 p-4 rounded-xl">
                    <h4 className="text-xs uppercase font-bold text-success">Actually Helpful Advice</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">{roast.honest_advice}</p>
                  </div>
                </div>
              </CardContent>
            )
          )}
        </Card>
      </div>
    </div>
  );
}
