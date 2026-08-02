"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Laptop, Loader2, Sparkles, Copy, Check, ExternalLink, Code, Globe, ShieldCheck, Crown } from "lucide-react";
import type { PortfolioTemplateId } from "@/lib/portfolio-templates";

export default function PortfolioGeneratorPage() {
  const [resumeText, setResumeText] = useState("");
  const [template, setTemplate] = useState<PortfolioTemplateId>("technical");
  const [customDomainInput, setCustomDomainInput] = useState("");
  const [htmlCode, setHtmlCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deployResult, setDeployResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, template }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not generate portfolio");
      setHtmlCode(data.html);
      if (data.suggestedTemplate && !htmlCode) {
        setTemplate(data.suggestedTemplate);
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate portfolio");
    } finally {
      setLoading(false);
    }
  };

  const handleDeploySubdomain = async () => {
    if (!htmlCode) return;
    setDeploying(true);
    setError(null);
    try {
      const res = await fetch("/api/portfolio/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          htmlCode,
          customDomain: customDomainInput.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "upgrade_required") {
          throw new Error("Live subdomain deployment requires Premium or Career Pack tier. Preview-only mode is active.");
        }
        throw new Error(data.message || data.error || "Deploy failed");
      }
      setDeployResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to deploy portfolio");
    } finally {
      setDeploying(false);
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
          Multi-Design AI Portfolio Builder
        </h1>
        <p className="text-text-secondary mt-1">
          Convert your resume into a multi-theme responsive portfolio website with custom subdomain &amp; CNAME deployment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.8fr] gap-6 items-start">
        {/* Input & Design Selector Card */}
        <Card className="border-border space-y-4 p-5">
          <div>
            <h2 className="text-base font-bold text-text-primary mb-1">1. Select Portfolio Design Theme</h2>
            <p className="text-xs text-text-secondary mb-3">Choose a design or let Vaylo AI auto-suggest based on your resume domain.</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemplate("minimal")}
                className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                  template === "minimal" ? "border-accent bg-accent/10 text-accent font-bold" : "border-border bg-surface text-text-primary"
                }`}
              >
                <div className="text-xs">Minimal</div>
                <div className="text-[10px] opacity-75">Editorial Serif</div>
              </button>
              <button
                type="button"
                onClick={() => setTemplate("technical")}
                className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                  template === "technical" ? "border-accent bg-accent/10 text-accent font-bold" : "border-border bg-surface text-text-primary"
                }`}
              >
                <div className="text-xs">Technical</div>
                <div className="text-[10px] opacity-75">Terminal Dark</div>
              </button>
              <button
                type="button"
                onClick={() => setTemplate("executive")}
                className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                  template === "executive" ? "border-accent bg-accent/10 text-accent font-bold" : "border-border bg-surface text-text-primary"
                }`}
              >
                <div className="text-xs">Executive</div>
                <div className="text-[10px] opacity-75">Corporate Bio</div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-primary">2. Resume Details &amp; Experience</label>
            <Textarea
              placeholder="Paste your resume content, experience, projects, or about summary here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[220px] font-mono text-xs"
            />
          </div>

          <Button
            className="w-full bg-accent hover:bg-accent-hover text-white gap-2 font-semibold"
            disabled={loading || !resumeText.trim()}
            onClick={handleGenerate}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Building Portfolio Code..." : "Generate Portfolio Website"}
          </Button>

          {/* Custom Domain Input for Career Pack */}
          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-warning" /> Custom CNAME Domain (Career Pack)
              </label>
            </div>
            <Input
              placeholder="e.g. priya-sharma.com"
              value={customDomainInput}
              onChange={(e) => setCustomDomainInput(e.target.value)}
              className="text-xs"
            />
          </div>

          {error && <p className="text-xs text-danger font-medium p-2 rounded bg-danger/10">{error}</p>}
        </Card>

        {/* Display and Preview Card */}
        <Card className="relative overflow-hidden min-h-[500px]">
          {loading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
              <p className="text-sm font-semibold animate-pulse text-text-primary">Generating Tailwind styling and assets...</p>
            </div>
          )}

          {!htmlCode && !loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 min-h-[500px]">
              <Laptop className="w-16 h-16 text-text-muted mb-4 opacity-30" />
              <h3 className="font-semibold text-text-secondary text-lg mb-2">No Website Built Yet</h3>
              <p className="text-text-muted text-sm max-w-sm">Provide your resume details, select a template design, and click Generate to see live interactive preview.</p>
            </div>
          ) : (
            htmlCode && (
              <CardContent className="p-4 space-y-4 h-full flex flex-col justify-between">
                {/* Options Header */}
                <div className="flex flex-wrap items-center justify-between border-b border-border pb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs uppercase font-bold text-accent border-accent/30">
                      Theme: {template}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyCode} className="gap-1 text-xs">
                      {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy Code
                    </Button>
                    <Button variant="outline" size="sm" onClick={handlePreviewOpen} className="gap-1 text-xs">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Fullscreen
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleDeploySubdomain}
                      disabled={deploying}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 text-xs font-bold"
                    >
                      {deploying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                      Deploy Live Subdomain
                    </Button>
                  </div>
                </div>

                {/* Live Deployment Status Notification */}
                {deployResult && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-emerald-400" /> Live Subdomain Active
                      </span>
                      <a href={deployResult.liveUrl} target="_blank" rel="noreferrer" className="underline hover:text-white">
                        {deployResult.liveUrl}
                      </a>
                    </div>
                    {deployResult.customDomainUrl && (
                      <div className="pt-1.5 border-t border-emerald-500/20 text-text-secondary flex justify-between items-center">
                        <span>Custom Domain: <strong>{deployResult.customDomainUrl}</strong></span>
                        <span className="text-warning">Point CNAME to {deployResult.cnameRecordNeeded}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* iframe Preview */}
                <div className="border border-border rounded-xl overflow-hidden bg-white h-[420px]">
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
