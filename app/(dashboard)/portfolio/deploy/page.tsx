"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  ArrowRight,
  ExternalLink,
  Code,
  FolderArchive,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function PortfolioDeployRedirectPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10 space-y-8">
      <div className="space-y-2">
        <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-950/20">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Free &amp; Open Deployment Center
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Portfolio Deployment &amp; Export Studio
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Vaylo AI gives you complete ownership of your portfolio source code. Deploy for free in 10 seconds via Netlify Drop, Vercel, or GitHub Pages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Netlify Drop (1-Click Free)</h3>
              <p className="text-xs text-slate-400">No account or credit card required</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Generate your portfolio, download the standalone <code className="text-emerald-300 font-mono text-xs">index.html</code> or ZIP package, and drag &amp; drop it straight onto Netlify Drop for instant worldwide hosting.
          </p>
          <div className="pt-2">
            <Link href="/portfolio">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-2">
                Go to Portfolio Builder <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Self-Host / Vercel / GitHub</h3>
              <p className="text-xs text-slate-400">Full source code export</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Download your clean HTML &amp; CSS bundle. Connect your own custom domain (e.g. <code className="text-blue-300 font-mono text-xs">yourname.com</code>) on any platform of your choice with zero vendor lock-in.
          </p>
          <div className="pt-2">
            <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer">
              <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 gap-2">
                Open Netlify Drop <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </Card>
      </div>

      <Card className="bg-slate-950/60 border-slate-800 p-6">
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Deployment Principles &amp; Safety
        </h3>
        <ul className="space-y-2 text-xs text-slate-400">
          <li>• <strong className="text-slate-200">100% Truthful:</strong> We never generate fake subdomains or simulated live badges. You own the real code.</li>
          <li>• <strong className="text-slate-200">Zero Dependencies:</strong> Your exported HTML file works offline and on any modern browser or CDN.</li>
          <li>• <strong className="text-slate-200">Custom Photos &amp; Domains:</strong> Real base64 profile pictures and personal custom domain support.</li>
        </ul>
      </Card>
    </div>
  );
}
