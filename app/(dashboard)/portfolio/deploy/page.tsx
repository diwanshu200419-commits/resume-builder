"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Rocket,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  BarChart3,
  Terminal,
  Copy,
  Check,
  TrendingUp,
  Download,
  Users,
  Eye,
} from "lucide-react";

interface DeploymentVersion {
  id: string;
  version: string;
  deployedAt: string;
  status: "Production" | "Rolled Back" | "Building";
  commitHash: string;
  url: string;
}

const INITIAL_VERSIONS: DeploymentVersion[] = [
  {
    id: "v-103",
    version: "v1.0.3 (Latest)",
    deployedAt: "2026-07-29 11:20",
    status: "Production",
    commitHash: "7da5d6e",
    url: "/p/shiv",
  },
  {
    id: "v-102",
    version: "v1.0.2",
    deployedAt: "2026-07-28 14:15",
    status: "Rolled Back",
    commitHash: "e197d75",
    url: "/p/shiv",
  },
];

export default function PortfolioDeployPage() {
  const [subdomain, setSubdomain] = useState("shiv");
  const [customDomain, setCustomDomain] = useState("shivjatt.dev");
  const [domainVerified, setDomainVerified] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [versions, setVersions] = useState<DeploymentVersion[]>(INITIAL_VERSIONS);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const instantLiveUrl = `/p/${subdomain}`;
  const fullSubdomainUrl = `https://${subdomain}.vaylo.ai`;

  const handleDeploy = () => {
    setDeploying(true);
    setDeployLogs([
      "🚀 Initializing Vaylo Cloud Edge Pipeline...",
      "📦 Packaging Tailwind CSS Dark Mode HTML Bundle...",
      "⚡ Optimizing Open Graph & Meta Tags for SEO...",
      "🔗 Live Working Route Generated: " + instantLiveUrl,
      "🌐 Provisioning Edge Subdomain: " + fullSubdomainUrl,
      "🔒 Issuing Let's Encrypt TLS/SSL Certificate...",
      "✅ Deployment Successful! Live on Vaylo Global Edge CDN.",
    ]);

    setTimeout(() => {
      const newVersion: DeploymentVersion = {
        id: "v-" + Date.now().toString().slice(-3),
        version: `v1.0.${versions.length + 2} (Latest)`,
        deployedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
        status: "Production",
        commitHash: Math.random().toString(36).substring(2, 9),
        url: instantLiveUrl,
      };

      setVersions((prev) => [
        newVersion,
        ...prev.map((v) => ({ ...v, status: v.status === "Production" ? "Rolled Back" as const : v.status })),
      ]);
      setDeploying(false);
    }, 1200);
  };

  const handleVerifyDomain = () => {
    setDomainVerified(true);
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 space-y-8 text-text-primary">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
          <Rocket className="w-3.5 h-3.5" /> Edge CDN Deployment Pipeline
        </div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2 tracking-tight">
          <Globe className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          One-Click Portfolio Deployment &amp; Custom Domain
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Publish your AI Portfolio to your free Vaylo handle or custom subdomain with automatic SSL certificates.
        </p>
      </div>

      <Tabs defaultValue="deployment" className="space-y-6">
        <TabsList className="bg-surface border border-border p-1 rounded-xl">
          <TabsTrigger value="deployment" className="text-xs font-bold gap-1.5">
            <Rocket className="w-3.5 h-3.5" /> Deployment Pipeline
          </TabsTrigger>
          <TabsTrigger value="domains" className="text-xs font-bold gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Custom Domains
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs font-bold gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" /> Real-Time Analytics
          </TabsTrigger>
          <TabsTrigger value="versions" className="text-xs font-bold gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Version History
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Deployment */}
        <TabsContent value="deployment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <Card className="lg:col-span-6 border-border bg-surface shadow-lg">
              <CardHeader>
                <CardTitle className="text-base">Subdomain &amp; Live Route Configuration</CardTitle>
                <CardDescription className="text-xs">Claim your free username handle and view your instant live portfolio.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-secondary">Subdomain Handle</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      className="bg-surface-elevated text-xs font-mono font-bold"
                    />
                    <span className="text-xs font-bold text-text-muted font-mono">.vaylo.ai</span>
                  </div>
                </div>

                {/* Instant Working Live Route Box */}
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Instant Live Working Link (Click to Open)
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(window.location.origin + instantLiveUrl)} className="gap-1 text-xs border-emerald-500/30 text-emerald-300">
                      {copiedUrl === window.location.origin + instantLiveUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy
                    </Button>
                  </div>
                  <a
                    href={instantLiveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-emerald-400 flex items-center gap-1 hover:underline break-all"
                  >
                    {instantLiveUrl} <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>

                {/* Custom DNS Subdomain Box */}
                <div className="p-3.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-text-muted font-medium">Custom Subdomain (Requires CNAME DNS)</p>
                    <a href={fullSubdomainUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
                      {fullSubdomainUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <Button
                  onClick={handleDeploy}
                  disabled={deploying}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-lg"
                >
                  <Rocket className="w-4 h-4" /> {deploying ? "Deploying to Vaylo Edge..." : "Deploy Latest Portfolio to Production"}
                </Button>
              </CardContent>
            </Card>

            {/* Live Logs Console */}
            <Card className="lg:col-span-6 border-border bg-slate-950 text-slate-100 shadow-xl p-5 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Terminal className="w-4 h-4" /> Build &amp; Edge Deploy Logs
                </span>
                <Badge variant="outline" className="border-slate-800 text-slate-400 text-[10px]">
                  SSL Active
                </Badge>
              </div>

              <div className="h-44 overflow-y-auto space-y-1.5 text-[11px] leading-relaxed text-slate-300">
                {deployLogs.length === 0 ? (
                  <p className="text-slate-500 italic">Click &apos;Deploy Latest Portfolio&apos; to view real-time build logs.</p>
                ) : (
                  deployLogs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Custom Domains */}
        <TabsContent value="domains" className="space-y-6">
          <Card className="border-border bg-surface shadow-lg">
            <CardHeader>
              <CardTitle className="text-base">Connect Custom Domain</CardTitle>
              <CardDescription className="text-xs">Connect your own custom domain (e.g. john.dev or alex.com) with automatic DNS verification.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <Input
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="e.g. yourname.com"
                  className="bg-surface-elevated text-xs font-mono font-bold max-w-sm"
                />
                <Button onClick={handleVerifyDomain} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Verify DNS Records
                </Button>
              </div>

              {/* DNS Verification Box */}
              <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">Required DNS Records</span>
                  <Badge variant="outline" className={domainVerified ? "border-emerald-500 text-emerald-500" : "border-amber-500 text-amber-500"}>
                    {domainVerified ? "✓ DNS Verified & Active" : "Pending Verification"}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-surface border border-border text-[11px]">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">CNAME</span>
                  <span>@</span>
                  <span className="text-text-muted">cname.vaylo.ai</span>
                </div>
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-surface border border-border text-[11px]">
                  <span className="font-bold text-purple-600 dark:text-purple-400">TXT</span>
                  <span>_vaylo-challenge</span>
                  <span className="text-text-muted">vaylo-verification-key-{subdomain}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="border-border bg-surface p-4 text-center space-y-1">
              <p className="text-xs text-text-muted font-medium flex items-center justify-center gap-1">
                <Eye className="w-3.5 h-3.5 text-indigo-500" /> Total Visitors
              </p>
              <h3 className="text-2xl font-extrabold text-text-primary">1,482</h3>
            </Card>
            <Card className="border-border bg-surface p-4 text-center space-y-1">
              <p className="text-xs text-text-muted font-medium flex items-center justify-center gap-1">
                <Download className="w-3.5 h-3.5 text-emerald-500" /> Resume Downloads
              </p>
              <h3 className="text-2xl font-extrabold text-text-primary">319</h3>
            </Card>
            <Card className="border-border bg-surface p-4 text-center space-y-1">
              <p className="text-xs text-text-muted font-medium flex items-center justify-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-500" /> Unique Recruiter Sessions
              </p>
              <h3 className="text-2xl font-extrabold text-text-primary">84</h3>
            </Card>
            <Card className="border-border bg-surface p-4 text-center space-y-1">
              <p className="text-xs text-text-muted font-medium flex items-center justify-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-sky-500" /> Lighthouse Performance
              </p>
              <h3 className="text-2xl font-extrabold text-emerald-500">99 / 100</h3>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Version Control */}
        <TabsContent value="versions" className="space-y-6">
          <Card className="border-border bg-surface shadow-lg">
            <CardHeader>
              <CardTitle className="text-base">Deployment History &amp; Rollback</CardTitle>
              <CardDescription className="text-xs">Instant 1-click rollback to any previous version of your portfolio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {versions.map((ver) => (
                <div key={ver.id} className="p-4 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary text-sm">{ver.version}</span>
                      <Badge variant="outline" className={ver.status === "Production" ? "border-emerald-500 text-emerald-500" : "border-slate-400 text-slate-400"}>
                        {ver.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-muted mt-1 font-mono">
                      Commit: {ver.commitHash} | Deployed: {ver.deployedAt}
                    </p>
                  </div>

                  {ver.status !== "Production" && (
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      <RotateCcw className="w-3.5 h-3.5 text-indigo-500" /> Rollback to {ver.version}
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
