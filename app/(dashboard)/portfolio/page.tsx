"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Laptop, Loader2, Sparkles, Copy, Check, ExternalLink, Code } from "lucide-react";

export default function PortfolioGeneratorPage() {
  const [resumeText, setResumeText] = useState("");
  const [htmlCode, setHtmlCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not generate portfolio");
      setHtmlCode(data.html);
    } catch (err: any) {
      setError(err.message || "Failed to generate portfolio");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!htmlCode) return;
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePreviewOpen = () => {
    if (!htmlCode) return;
    const blob = new Blob([htmlCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
          <Laptop className="w-8 h-8 text-accent animate-pulse" />
          AI Portfolio Website
        </h1>
        <p className="text-text-secondary mt-1">Convert your resume content into a beautiful, single-page, deployment-ready portfolio website in one click.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-6 items-start">
        {/* Input Card */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Paste Resume Details</CardTitle>
            <CardDescription>We will use these details to populate your dynamic portfolio sections.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your resume content, experience, projects, or about summary here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[250px] font-mono text-xs"
            />
            <Button
              className="w-full bg-accent hover:bg-accent-hover text-white gap-2 font-semibold"
              disabled={loading || !resumeText.trim()}
              onClick={handleGenerate}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Coding...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Portfolio
                </>
              )}
            </Button>
            {error && <p className="text-xs text-danger">{error}</p>}
          </CardContent>
        </Card>

        {/* Display and Preview Card */}
        <Card className="relative overflow-hidden min-h-[450px]">
          {loading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
              <p className="text-sm font-semibold animate-pulse text-text-primary">Generating Tailwind styling and assets...</p>
            </div>
          )}

          {!htmlCode && !loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 min-h-[450px]">
              <Laptop className="w-16 h-16 text-text-muted mb-4 opacity-30" />
              <h3 className="font-semibold text-text-secondary text-lg mb-2">No Website Built</h3>
              <p className="text-text-muted text-sm max-w-sm">Provide your resume details, and Vaylo AI will generate code for a premium responsive profile.</p>
            </div>
          ) : (
            htmlCode && (
              <CardContent className="p-4 space-y-4 h-full flex flex-col justify-between">
                {/* Options Header */}
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-accent" /> Live preview &amp; export
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyCode} className="gap-1">
                      {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy HTML
                    </Button>
                    <Button variant="default" size="sm" onClick={handlePreviewOpen} className="gap-1">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Fullscreen
                    </Button>
                  </div>
                </div>

                {/* iframe Preview */}
                <div className="border border-border rounded-xl overflow-hidden bg-white h-[350px]">
                  <iframe
                    title="Portfolio Preview"
                    srcDoc={htmlCode}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts"
                  />
                </div>
              </CardContent>
            )
          )}
        </Card>
      </div>
    </div>
  );
}
