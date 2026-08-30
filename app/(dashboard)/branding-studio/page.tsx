"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Copy,
  Check,
  Palette,
  Linkedin,
  Loader2,
  AlertCircle,
  FileText,
  Briefcase,
  Layers,
  BarChart3,
  Flame,
  Wand2,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Award,
  Zap,
} from "lucide-react";
import { CAREER_TAXONOMY } from "@/lib/ai/linkedin/role-taxonomy";

export default function BrandingStudioPage() {
  // Input State
  const [targetCategory, setTargetCategory] = useState("Technology");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [customRole, setCustomRole] = useState("");
  const [industry, setIndustry] = useState("Technology & SaaS");
  const [experienceLevel, setExperienceLevel] = useState("1–3 years");
  const [currentRole, setCurrentRole] = useState("Full Stack Developer");
  const [targetLocation, setTargetLocation] = useState("Bangalore, India / Remote");
  const [targetCompanies, setTargetCompanies] = useState("Google, Microsoft, Amazon");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [skills, setSkills] = useState("React, Next.js, Node.js, TypeScript, PostgreSQL");
  const [achievements, setAchievements] = useState("Optimized query performance by 40%, built automated CI/CD pipeline");
  const [education, setEducation] = useState("B.Tech in Computer Science");
  const [certifications, setCertifications] = useState("AWS Certified Solutions Architect");
  const [projects, setProjects] = useState("Vaylo AI SaaS Application, E-commerce Payment Gateway");
  const [currentHeadline, setCurrentHeadline] = useState("Software Engineer at Tech Corp");
  const [currentAbout, setCurrentAbout] = useState("I am a passionate software engineer working on web applications.");
  const [targetJobDescription, setTargetJobDescription] = useState("");
  const [tone, setTone] = useState("Professional");

  // UX & Async State
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [autoFillLoading, setAutoFillLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [optimization, setOptimization] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "headlines" | "about" | "experience" | "skills" | "featured" | "action"
  >("overview");

  // Auto-fill from user profile/resume
  const handleAutoFillResume = async () => {
    setAutoFillLoading(true);
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const json = await res.json();
        const p = json.profile || json;
        if (p.full_name) setCurrentRole(p.full_name);
        if (p.email) setIndustry("Technology");
      }

      // Also try fetching latest analysis for skills/resume text
      const resAnalyses = await fetch("/api/analyze?id=latest").catch(() => null);
      if (resAnalyses && resAnalyses.ok) {
        const analysisData = await resAnalyses.json();
        const a = analysisData.analysis;
        if (a) {
          if (a.job_title) {
            setTargetRole(a.job_title);
          }
          if (a.found_keywords && Array.isArray(a.found_keywords) && a.found_keywords.length > 0) {
            setSkills(a.found_keywords.slice(0, 10).join(", "));
          } else if (a.missing_keywords && Array.isArray(a.missing_keywords)) {
            setSkills((prev) => `${prev}, ${a.missing_keywords.join(", ")}`);
          }
          if (a.summary) {
            setCurrentAbout(a.summary);
          }
        }
      }
    } catch (e) {
      console.warn("Auto-fill warning:", e);
    } finally {
      setAutoFillLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingStage("Mapping recruiter keywords...");

    const effectiveRole = targetCategory === "Custom" ? customRole || "Specialist" : targetRole;

    try {
      setTimeout(() => setLoadingStage("Analyzing your positioning..."), 800);
      setTimeout(() => setLoadingStage("Optimizing headline & About section..."), 1600);
      setTimeout(() => setLoadingStage("Building your action plan..."), 2400);

      const res = await fetch("/api/branding-studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: effectiveRole,
          industry,
          experienceLevel,
          currentRole,
          targetLocation,
          targetCompanies,
          employmentType,
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
          achievements,
          education,
          certifications,
          projects,
          currentHeadline,
          currentAbout,
          targetJobDescription,
          tone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOptimization(data.optimization);
        setActiveTab("overview");
      }
    } catch (err) {
      console.error("LinkedIn Optimization Error:", err);
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedCategoryObj = CAREER_TAXONOMY.find((c) => c.category === targetCategory);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 space-y-8 px-4 sm:px-6 text-text-primary min-w-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold mb-2">
            <Palette className="w-3.5 h-3.5" /> Universal Role-Aware Engine V2
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2 tracking-tight">
            <Linkedin className="w-8 h-8 text-[#0A66C2]" />
            LinkedIn Branding Studio V2
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm mt-1">
            Zero-hallucination, role-specific LinkedIn optimization for 15+ career fields &amp; custom roles.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAutoFillResume}
          disabled={autoFillLoading}
          className="gap-2 text-xs font-bold border-accent/30 text-accent"
        >
          {autoFillLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
          Use My Vaylo Resume Data
        </Button>
      </div>

      {/* Main Dual-Pane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANE: INPUT FORM */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border bg-surface shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-accent" /> Candidate Profile &amp; Role Inputs
              </CardTitle>
              <CardDescription className="text-xs">
                Fill in your target role and verified skills. No fake experience will be generated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {/* Category & Role Selector */}
              <div>
                <Label className="text-xs font-bold block mb-1">Career Category</Label>
                <select
                  value={targetCategory}
                  onChange={(e) => {
                    setTargetCategory(e.target.value);
                    const catObj = CAREER_TAXONOMY.find((c) => c.category === e.target.value);
                    if (catObj && catObj.roles.length > 0) setTargetRole(catObj.roles[0]);
                  }}
                  className="w-full bg-surface-elevated border border-border rounded-lg p-2.5 text-xs text-text-primary"
                >
                  {CAREER_TAXONOMY.map((cat) => (
                    <option key={cat.category} value={cat.category}>
                      {cat.category}
                    </option>
                  ))}
                  <option value="Custom">✨ Other / Custom Role</option>
                </select>
              </div>

              {targetCategory === "Custom" ? (
                <div>
                  <Label className="text-xs font-bold block mb-1">Custom Target Role Name *</Label>
                  <Input
                    placeholder="e.g. Quantum Computing Researcher, Drone Pilot"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="text-xs bg-surface-elevated"
                  />
                </div>
              ) : (
                <div>
                  <Label className="text-xs font-bold block mb-1">Target Role *</Label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-surface-elevated border border-border rounded-lg p-2.5 text-xs text-text-primary"
                  >
                    {selectedCategoryObj?.roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold block mb-1">Experience Level *</Label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full bg-surface-elevated border border-border rounded-lg p-2.5 text-xs text-text-primary"
                  >
                    <option value="Student">Student</option>
                    <option value="Fresher">Fresher (New Grad)</option>
                    <option value="0–1 year">0–1 year (Entry Level)</option>
                    <option value="1–3 years">1–3 years (Junior / Associate)</option>
                    <option value="3–5 years">3–5 years (Mid-Level)</option>
                    <option value="5–8 years">5–8 years (Senior Lead)</option>
                    <option value="8–12 years">8–12 years (Staff / Principal)</option>
                    <option value="12+ years">12+ years (Industry Veteran)</option>
                    <option value="Manager">Manager</option>
                    <option value="Director">Director</option>
                    <option value="VP">Vice President (VP)</option>
                    <option value="C-Level / Founder">C-Level / Founder</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-bold block mb-1">Tone Strategy</Label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-surface-elevated border border-border rounded-lg p-2.5 text-xs text-text-primary"
                  >
                    <option value="Professional">Professional &amp; Recruiter</option>
                    <option value="Technical">Technical &amp; Deep Domain</option>
                    <option value="Executive">Executive &amp; Strategic</option>
                    <option value="Human">Human &amp; Conversational</option>
                    <option value="Concise">Concise &amp; Direct</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold block mb-1">Verified Skills (Comma Separated)</Label>
                <Input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, SQL, Python, Project Management"
                  className="text-xs bg-surface-elevated"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold block mb-1">Target Location</Label>
                  <Input
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    placeholder="e.g. Remote, USA, Bangalore"
                    className="text-xs bg-surface-elevated"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold block mb-1">Target Companies</Label>
                  <Input
                    value={targetCompanies}
                    onChange={(e) => setTargetCompanies(e.target.value)}
                    placeholder="e.g. Google, Amazon"
                    className="text-xs bg-surface-elevated"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold block mb-1">Current LinkedIn Headline</Label>
                <Input
                  value={currentHeadline}
                  onChange={(e) => setCurrentHeadline(e.target.value)}
                  placeholder="e.g. Software Engineer at Company X"
                  className="text-xs bg-surface-elevated"
                />
              </div>

              <div>
                <Label className="text-xs font-bold block mb-1">Current LinkedIn About Section</Label>
                <textarea
                  rows={3}
                  value={currentAbout}
                  onChange={(e) => setCurrentAbout(e.target.value)}
                  placeholder="Paste your current About section text here..."
                  className="w-full bg-surface-elevated border border-border rounded-lg p-2.5 text-xs text-text-primary"
                />
              </div>

              <div>
                <Label className="text-xs font-bold block mb-1">Optional: Target Job Description</Label>
                <textarea
                  rows={3}
                  value={targetJobDescription}
                  onChange={(e) => setTargetJobDescription(e.target.value)}
                  placeholder="Paste target job post text to align LinkedIn keywords..."
                  className="w-full bg-surface-elevated border border-border rounded-lg p-2.5 text-xs text-text-primary"
                />
              </div>

              <Button
                className="w-full bg-accent hover:bg-accent-hover text-white font-bold h-11 text-xs gap-2 shadow-lg"
                disabled={loading}
                onClick={handleGenerate}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> {loadingStage || "Optimizing Profile..."}
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" /> Optimize LinkedIn Profile V2
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANE: RESULTS PANEL */}
        <div className="lg:col-span-7 space-y-6">
          {!optimization ? (
            <Card className="border-border bg-surface shadow-md p-10 text-center space-y-4">
              <Linkedin className="w-12 h-12 text-[#0A66C2] mx-auto opacity-80" />
              <h3 className="text-lg font-bold text-text-primary">Universal LinkedIn Optimization Ready</h3>
              <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
                Configure your target role and verified skills on the left. Vaylo AI will compute your
                deterministic 0–100 LinkedIn score and generate 5 role-aware headline strategies.
              </p>
            </Card>
          ) : (
            <div className="space-y-6 animate-in fade-in">
              {/* TOP SCORE OVERVIEW BANNER */}
              <Card className="border-border bg-surface shadow-xl p-5 border-l-4 border-l-accent">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-text-muted">Vaylo LinkedIn Profile Score</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-accent">
                        {optimization.profileScore?.total || 75}
                      </span>
                      <span className="text-sm text-text-muted font-bold">/ 100</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      Target Role: <strong className="text-text-primary">{optimization.roleAnalysis?.targetRole}</strong> · {optimization.roleAnalysis?.experienceLevel}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs py-1">
                      Discoverability: {optimization.profileScore?.discoverability}/5
                    </Badge>
                    <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs py-1">
                      Keyword Match: {optimization.profileScore?.keywords}/20
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 border-b border-border overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 py-2 rounded-lg transition-all shrink-0 ${
                    activeTab === "overview" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Overview &amp; Score
                </button>
                <button
                  onClick={() => setActiveTab("headlines")}
                  className={`px-3 py-2 rounded-lg transition-all shrink-0 ${
                    activeTab === "headlines" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  5 Headlines
                </button>
                <button
                  onClick={() => setActiveTab("about")}
                  className={`px-3 py-2 rounded-lg transition-all shrink-0 ${
                    activeTab === "about" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  About Section (3 Versions)
                </button>
                <button
                  onClick={() => setActiveTab("experience")}
                  className={`px-3 py-2 rounded-lg transition-all shrink-0 ${
                    activeTab === "experience" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Experience Bullets
                </button>
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`px-3 py-2 rounded-lg transition-all shrink-0 ${
                    activeTab === "skills" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Skills &amp; Keywords
                </button>
                <button
                  onClick={() => setActiveTab("featured")}
                  className={`px-3 py-2 rounded-lg transition-all shrink-0 ${
                    activeTab === "featured" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Banner &amp; Featured
                </button>
                <button
                  onClick={() => setActiveTab("action")}
                  className={`px-3 py-2 rounded-lg transition-all shrink-0 ${
                    activeTab === "action" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Action Plan
                </button>
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-surface border border-border rounded-xl">
                      <span className="text-text-muted text-[10px] block">Headline Score</span>
                      <span className="font-bold text-base text-text-primary">{optimization.profileScore?.headline}/20</span>
                    </div>
                    <div className="p-3 bg-surface border border-border rounded-xl">
                      <span className="text-text-muted text-[10px] block">About Score</span>
                      <span className="font-bold text-base text-text-primary">{optimization.profileScore?.about}/20</span>
                    </div>
                    <div className="p-3 bg-surface border border-border rounded-xl">
                      <span className="text-text-muted text-[10px] block">Experience Score</span>
                      <span className="font-bold text-base text-text-primary">{optimization.profileScore?.experience}/15</span>
                    </div>
                    <div className="p-3 bg-surface border border-border rounded-xl">
                      <span className="text-text-muted text-[10px] block">Skills Score</span>
                      <span className="font-bold text-base text-text-primary">{optimization.profileScore?.skills}/10</span>
                    </div>
                  </div>

                  <Card className="border-border bg-surface">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-bold flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-500" /> Recruiter Reality Check (Constructive Roast)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs leading-relaxed text-text-secondary">
                      {optimization.profileAssets?.recruiterRealityCheckRoast ||
                        "Recruiters scan headlines in 6 seconds. Make sure your target role title is upfront!"}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB 2: HEADLINES */}
              {activeTab === "headlines" && (
                <div className="space-y-4">
                  {optimization.headlines?.map((h: any, index: number) => (
                    <Card key={index} className="border-border bg-surface p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-accent/20 text-accent border-accent/30 text-[10px] font-bold">
                          {h.type}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(h.text, `h-${index}`)}
                          className="h-7 text-[11px] gap-1"
                        >
                          {copiedKey === `h-${index}` ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                          {copiedKey === `h-${index}` ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <p className="font-mono text-xs font-bold text-text-primary bg-surface-elevated p-3 rounded-lg border border-border">
                        {h.text}
                      </p>
                      <p className="text-[11px] text-text-muted">{h.reason}</p>
                    </Card>
                  ))}
                </div>
              )}

              {/* TAB 3: ABOUT SECTION */}
              {activeTab === "about" && (
                <div className="space-y-4">
                  {["recruiterOptimized", "humanPersonal", "conciseProfessional"].map((verKey) => {
                    const titles: Record<string, string> = {
                      recruiterOptimized: "Version 1: Recruiter-Optimized (Keywords & Search)",
                      humanPersonal: "Version 2: Human & Conversational",
                      conciseProfessional: "Version 3: Concise Professional",
                    };
                    const content = optimization.aboutVersions?.[verKey] || "";
                    return (
                      <Card key={verKey} className="border-border bg-surface p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-text-primary">{titles[verKey]}</h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopy(content, `about-${verKey}`)}
                            className="h-7 text-[11px] gap-1"
                          >
                            {copiedKey === `about-${verKey}` ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                            Copy Text
                          </Button>
                        </div>
                        <pre className="font-sans text-xs text-text-secondary leading-relaxed whitespace-pre-wrap bg-surface-elevated p-3 rounded-xl border border-border">
                          {content}
                        </pre>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* TAB 4: EXPERIENCE BULLETS */}
              {activeTab === "experience" && (
                <div className="space-y-4">
                  {optimization.experienceBullets?.map((bullet: any, idx: number) => (
                    <Card key={idx} className="border-border bg-surface p-4 space-y-3">
                      <div>
                        <span className="text-[10px] text-text-muted uppercase font-bold">Original Draft</span>
                        <p className="text-xs text-text-muted line-through mt-0.5">{bullet.originalText}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Truthful Action Wording
                        </span>
                        <p className="text-xs font-semibold text-text-primary mt-0.5 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                          {bullet.optimizedBullet}
                        </p>
                      </div>

                      <p className="text-[11px] text-text-muted leading-relaxed">{bullet.improvementReason}</p>
                    </Card>
                  ))}
                </div>
              )}

              {/* TAB 5: SKILLS & KEYWORDS */}
              {activeTab === "skills" && (
                <div className="space-y-4 text-xs">
                  <Card className="border-border bg-surface p-4 space-y-3">
                    <h4 className="font-bold text-xs text-accent">Top 5 Must-Pin LinkedIn Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {optimization.skillsStrategy?.top5MustPin?.map((sk: string) => (
                        <Badge key={sk} className="bg-accent/20 text-accent border-accent/30 py-1 font-bold">
                          📌 {sk}
                        </Badge>
                      ))}
                    </div>
                  </Card>

                  <Card className="border-border bg-surface p-4 space-y-3">
                    <h4 className="font-bold text-xs text-emerald-400">Recommended Skills to Develop (Not Claimed as Possessed)</h4>
                    <div className="flex flex-wrap gap-2">
                      {optimization.keywords?.recommendedToDevelop?.map((sk: string) => (
                        <Badge key={sk} className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 py-1">
                          🌱 {sk}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB 6: BANNER & FEATURED */}
              {activeTab === "featured" && (
                <div className="space-y-4 text-xs">
                  <Card className="border-border bg-surface p-4 space-y-2">
                    <h4 className="font-bold text-xs text-text-primary">LinkedIn Cover Banner Text Idea</h4>
                    <p className="font-mono text-xs text-accent bg-surface-elevated p-3 rounded-lg border border-border">
                      {optimization.profileAssets?.bannerTextIdea}
                    </p>
                  </Card>

                  <Card className="border-border bg-surface p-4 space-y-2">
                    <h4 className="font-bold text-xs text-text-primary">Featured Section Strategy</h4>
                    <ul className="list-disc list-inside space-y-1.5 text-text-secondary">
                      {optimization.profileAssets?.featuredSectionRecommendations?.map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </Card>
                </div>
              )}

              {/* TAB 7: ACTION PLAN */}
              {activeTab === "action" && (
                <div className="space-y-3 text-xs">
                  {optimization.actionPlan?.map((item: any) => (
                    <Card key={item.stepNumber} className="border-border bg-surface p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-text-primary">Step #{item.stepNumber}: {item.title}</span>
                        <Badge
                          className={`text-[10px] ${
                            item.impact === "HIGH"
                              ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                              : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          Impact: {item.impact}
                        </Badge>
                      </div>
                      <p className="text-text-secondary leading-relaxed">{item.instruction}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
