"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Copy, Check, Palette, Github, Linkedin, FileText, Download } from "lucide-react";

export default function BrandingStudioPage() {
  const [name, setName] = useState("Shiv Jatt");
  const [role, setRole] = useState("Senior Full Stack Engineer");
  const [techStack, setTechStack] = useState("React, Next.js, Node.js, TypeScript, PostgreSQL, AI Integration");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const githubReadme = `# 👋 Hi, I'm ${name}

### 🚀 ${role}
Specializing in high-throughput web applications, cloud architecture, and AI-driven user experiences.

---

### 💻 Tech Stack & Expertise
\`${techStack}\`

---

### 📈 GitHub Stats
![${name}'s GitHub Stats](https://github-readme-stats.vercel.app/api?username=diwanshu200419-commits&show_icons=true&theme=radial)

---

### 📬 Connect With Me
- 💼 **LinkedIn**: [linkedin.com/in/${name.toLowerCase().replace(/\s+/g, "")}](#)
- 🌐 **Portfolio**: [https://${name.toLowerCase().replace(/\s+/g, "")}.vaylo.ai](https://vaylo.ai)
- ✉️ **Email**: contact@vaylo.ai
`;

  const linkedinBio = `⚡ ${role} | Building Scalable Web Apps & AI Systems

I help tech companies architect high-throughput frontend and backend systems with ${techStack}.

📊 Key Highlights:
• Scaled web applications to 100k+ active users.
• Reduced database query latency by 45%.
• Architected enterprise React & Next.js web applications.

💬 Open to tech consulting, senior engineering roles, and AI project collaborations!`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 space-y-8 text-text-primary">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold mb-3">
          <Palette className="w-3.5 h-3.5" /> Personal Branding Engine
        </div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2 tracking-tight">
          <Sparkles className="w-8 h-8 text-pink-600 dark:text-pink-400" />
          AI Personal Branding Studio
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Auto-generate recruiter-attracting LinkedIn banners, developer GitHub README profiles, and bio assets in 1 click.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border bg-surface shadow-lg">
            <CardHeader>
              <CardTitle className="text-base">Branding Inputs</CardTitle>
              <CardDescription className="text-xs">Customize your developer bio and profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-semibold">Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 text-xs bg-surface-elevated" />
              </div>
              <div>
                <Label className="text-xs font-semibold">Primary Engineering Role</Label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 text-xs bg-surface-elevated" />
              </div>
              <div>
                <Label className="text-xs font-semibold">Core Tech Stack</Label>
                <Input value={techStack} onChange={(e) => setTechStack(e.target.value)} className="mt-1 text-xs bg-surface-elevated" />
              </div>
            </CardContent>
          </Card>

          {/* LinkedIn Banner SVG Preview */}
          <Card className="border-border bg-surface shadow-lg p-5 space-y-3">
            <h4 className="font-bold text-xs flex items-center gap-2 text-text-primary">
              <Linkedin className="w-4 h-4 text-[#0A66C2]" /> LinkedIn Cover Banner SVG
            </h4>
            <div className="w-full h-32 rounded-xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-4 text-white flex flex-col justify-between border border-slate-800 shadow-inner relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">VAYLO AI BRANDING</span>
                <h3 className="text-lg font-extrabold tracking-tight">{name}</h3>
                <p className="text-xs text-indigo-200">{role}</p>
              </div>
              <p className="text-[10px] font-mono text-slate-400">{techStack}</p>
            </div>
          </Card>
        </div>

        {/* Generated Assets */}
        <div className="lg:col-span-7 space-y-6">
          {/* GitHub README */}
          <Card className="border-border bg-surface shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Github className="w-4 h-4 text-text-primary" /> Developer GitHub Profile README.md
                </CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleCopy(githubReadme, "readme")} className="gap-1 text-xs">
                {copiedKey === "readme" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === "readme" ? "Copied!" : "Copy Markdown"}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-xl bg-surface-elevated border border-border text-xs font-mono text-text-primary whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                {githubReadme}
              </pre>
            </CardContent>
          </Card>

          {/* LinkedIn Bio */}
          <Card className="border-border bg-surface shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" /> Optimized LinkedIn About Bio Summary
                </CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleCopy(linkedinBio, "bio")} className="gap-1 text-xs">
                {copiedKey === "bio" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === "bio" ? "Copied!" : "Copy Bio"}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-xl bg-surface-elevated border border-border text-xs font-sans text-text-primary whitespace-pre-wrap leading-relaxed">
                {linkedinBio}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
