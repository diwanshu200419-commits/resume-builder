"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Laptop,
  Smartphone,
  Tablet,
  Loader2,
  Sparkles,
  Copy,
  Check,
  Code,
  Download,
  FolderArchive,
  RefreshCw,
  Rocket,
  Eye,
  Upload,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Globe,
} from "lucide-react";
import {
  PORTFOLIO_THEMES,
  PortfolioTemplateId,
  PortfolioData,
  generatePortfolioHTML,
} from "@/lib/portfolio-templates";
import { createZipBlob } from "@/lib/zip-export";

const ROLE_PRESETS = [
  { id: "software", label: "Software Engineer", icon: "💻", theme: "technical" as PortfolioTemplateId },
  { id: "ai_data", label: "AI & Data Scientist", icon: "🤖", theme: "aurora" as PortfolioTemplateId },
  { id: "design", label: "UI/UX Designer", icon: "🎨", theme: "minimal" as PortfolioTemplateId },
  { id: "product", label: "Product Manager", icon: "💼", theme: "minimal" as PortfolioTemplateId },
  { id: "marketing", label: "Marketing & Growth", icon: "📈", theme: "vibrant" as PortfolioTemplateId },
  { id: "finance", label: "Finance & Operations", icon: "💰", theme: "executive" as PortfolioTemplateId },
  { id: "academic", label: "Writer & Researcher", icon: "📄", theme: "editorial" as PortfolioTemplateId },
  { id: "student", label: "Student / Graduate", icon: "🎓", theme: "technical" as PortfolioTemplateId },
];

function getSampleDataForRole(roleName: string, avatarUrl?: string): PortfolioData {
  const role = roleName.toLowerCase();
  
  if (role.includes("design") || role.includes("ui") || role.includes("ux")) {
    return {
      name: "Diwanshu",
      title: "Senior Product Designer",
      bio: "Crafting human-centered design systems, responsive interfaces, and accessible digital products for global tech platforms.",
      avatarUrl,
      email: "diwanshu@example.com",
      skills: ["Figma", "Design Systems", "Prototyping", "User Research", "Wireframing", "Interaction Design", "Accessibility (WCAG)", "Mobile App Design"],
      stats: [
        { label: "Design Systems", value: "3+ Built" },
        { label: "User Adoption", value: "2M+ Users" },
        { label: "Design Components", value: "150+ Tokens" },
      ],
      projects: [
        {
          title: "Fintech Mobile Design System",
          description: "Architected tokenized design library across iOS and Android apps, reducing design-to-code cycle times by 45%.",
          tech: "Figma • Tokens • Mobile",
          metrics: "Adopted by 30+ engineers",
        },
        {
          title: "SaaS Workflow Dashboard",
          description: "Redesigned enterprise analytics console resulting in a 28% increase in daily active user engagement.",
          tech: "User Research • Design Systems",
          metrics: "28% DAU increase",
        },
      ],
      experience: [
        {
          role: "Lead Product Designer",
          company: "Studio Craft",
          period: "2023 — Present",
          summary: "Leading product design strategy, mentoring junior designers, and standardizing component libraries.",
        },
      ],
    };
  }

  if (role.includes("ai") || role.includes("data") || role.includes("ml")) {
    return {
      name: "Diwanshu",
      title: "AI & Data Scientist",
      bio: "Building production machine learning systems, high-throughput LLM pipelines, and predictive deep learning architectures.",
      avatarUrl,
      email: "diwanshu@example.com",
      skills: ["Python", "PyTorch", "TensorFlow", "FastAPI", "PostgreSQL", "MLOps", "Transformers", "Docker"],
      stats: [
        { label: "Model Deployments", value: "12+ Live" },
        { label: "Inference Latency", value: "<45ms P99" },
        { label: "Pipeline Accuracy", value: "94.8% F1" },
      ],
      projects: [
        {
          title: "Real-Time NLP Inference Engine",
          description: "Built scalable embedding search and transformer inference microservice serving 5,000 requests/sec with low latency.",
          tech: "PyTorch • FastAPI • Docker",
          metrics: "5k QPS with <50ms latency",
        },
      ],
      experience: [
        {
          role: "Machine Learning Engineer",
          company: "Neural Labs",
          period: "2023 — Present",
          summary: "Architected real-time recommendation and ranking algorithms for high-throughput enterprise pipelines.",
        },
      ],
    };
  }

  if (role.includes("marketing") || role.includes("growth")) {
    return {
      name: "Diwanshu",
      title: "Growth Marketer & Builder",
      bio: "Scaling customer acquisition, performance marketing funnels, and organic growth engines for high-velocity SaaS products.",
      avatarUrl,
      email: "diwanshu@example.com",
      skills: ["SEO Strategy", "Paid Acquisition", "Lifecycle Marketing", "CRO", "Google Analytics 4", "Content Systems", "A/B Testing"],
      stats: [
        { label: "Organic Growth", value: "3.5x YoY" },
        { label: "Campaigns Led", value: "40+" },
        { label: "ROAS Benchmark", value: "4.2x Avg" },
      ],
      projects: [
        {
          title: "Global SaaS Launch Engine",
          description: "Engineered multi-channel organic search and product hunt launch strategy resulting in 15,000 signups in week 1.",
          tech: "SEO • CRO • Funnels",
          metrics: "15,000 signups in Week 1",
        },
      ],
      experience: [
        {
          role: "Growth Marketing Lead",
          company: "HyperScale",
          period: "2023 — Present",
          summary: "Directing omnichannel growth campaigns and data-driven customer conversion pipelines.",
        },
      ],
    };
  }

  if (role.includes("executive") || role.includes("finance") || role.includes("lead")) {
    return {
      name: "Diwanshu",
      title: "Executive Director & Strategist",
      bio: "Driving cross-functional execution, enterprise product strategy, and operational excellence for scalable organizations.",
      avatarUrl,
      email: "diwanshu@example.com",
      skills: ["Executive Strategy", "P&L Management", "Team Leadership", "Cross-Functional Governance", "Stakeholder Relations"],
      stats: [
        { label: "Teams Scaled", value: "50+ Members" },
        { label: "P&L Oversight", value: "$10M+ ARR" },
        { label: "Initiatives Delivered", value: "25+ Key Projects" },
      ],
      projects: [
        {
          title: "Enterprise Digital Transformation",
          description: "Spearheaded operational consolidation across 4 divisions, improving team velocity by 35% and reducing overhead.",
          tech: "Enterprise Strategy • Operations",
          metrics: "35% velocity improvement",
        },
      ],
      experience: [
        {
          role: "Director of Technology & Operations",
          company: "Summit Enterprise",
          period: "2022 — Present",
          summary: "Overseeing multidisciplinary engineering and operational teams to achieve strategic corporate milestones.",
        },
      ],
    };
  }

  // Default: Software Engineer
  return {
    name: "Diwanshu",
    title: "Software Engineer",
    bio: "Building robust, scalable distributed systems, high-performance web applications, and developer-first cloud architectures.",
    avatarUrl,
    email: "diwanshu@example.com",
    github: "diwanshu200419-commits",
    skills: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Docker", "AWS", "REST APIs", "Tailwind CSS", "Git"],
    stats: [
      { label: "Production Deployments", value: "20+" },
      { label: "API Latency", value: "<60ms" },
      { label: "Core Competencies", value: "10+ Stack" },
    ],
    projects: [
      {
        title: "Distributed Microservices Architecture",
        description: "Architected fault-tolerant event-driven backend services handling 10M+ monthly database queries with 99.99% uptime.",
        tech: "Node.js • PostgreSQL • Docker",
        metrics: "99.99% system availability",
      },
      {
        title: "High-Throughput Fullstack Application",
        description: "Designed responsive React and Next.js interfaces with sub-second page loads and strict type safety.",
        tech: "Next.js • React • TypeScript",
        metrics: "Sub-second LCP performance",
      },
    ],
    experience: [
      {
        role: "Full Stack Software Engineer",
        company: "Vaylo Systems",
        period: "2023 — Present",
        summary: "Developing core product features, improving system architecture, and optimizing continuous integration pipelines.",
      },
    ],
  };
}

export default function PortfolioGeneratorPage() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [template, setTemplate] = useState<PortfolioTemplateId>("technical");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => getSampleDataForRole("Software Engineer"));
  const [htmlCode, setHtmlCode] = useState<string>(() => generatePortfolioHTML(getSampleDataForRole("Software Engineer"), "technical"));
  const [loading, setLoading] = useState(false);
  const [loadingLatest, setLoadingLatest] = useState(false);
  const [savingUrl, setSavingUrl] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"visual" | "code">("visual");
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [deployPlatform, setDeployPlatform] = useState<"netlify" | "vercel" | "github">("netlify");
  const [savedLiveUrl, setSavedLiveUrl] = useState<string | null>(null);
  const [userLiveUrl, setUserLiveUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load initial portfolio data and any previously saved live URL
  useEffect(() => {
    const initial = getSampleDataForRole(targetRole, avatarUrl || undefined);
    setPortfolioData(initial);
    setHtmlCode(generatePortfolioHTML(initial, template));

    // Fetch saved deployment state from API
    fetch("/api/portfolio/deploy")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.savedLiveUrl) {
          setSavedLiveUrl(data.savedLiveUrl);
          setUserLiveUrl(data.savedLiveUrl);
        }
      })
      .catch((err) => console.warn("Fetch deploy state notice:", err));
  }, []);

  const handleSelectRole = (role: typeof ROLE_PRESETS[0]) => {
    setTargetRole(role.label);
    setTemplate(role.theme);
    
    const baseData = portfolioData || getSampleDataForRole(role.label, avatarUrl || undefined);
    const updatedData: PortfolioData = {
      ...baseData,
      title: role.label,
      avatarUrl: avatarUrl || baseData.avatarUrl,
    };
    setPortfolioData(updatedData);
    setHtmlCode(generatePortfolioHTML(updatedData, role.theme));
  };

  const handleTemplateChange = (newTheme: PortfolioTemplateId) => {
    setTemplate(newTheme);
    const currentData = portfolioData || getSampleDataForRole(targetRole, avatarUrl || undefined);
    setHtmlCode(generatePortfolioHTML(currentData, newTheme));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp|gif)$/i)) {
      setError("Please select a valid image file (JPG, PNG, or WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB limit. Please choose a smaller photo.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAvatarUrl(base64);
      const currentData = portfolioData || getSampleDataForRole(targetRole);
      const updatedData: PortfolioData = { ...currentData, avatarUrl: base64 };
      setPortfolioData(updatedData);
      setHtmlCode(generatePortfolioHTML(updatedData, template));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    const currentData = portfolioData || getSampleDataForRole(targetRole);
    const updatedData: PortfolioData = { ...currentData, avatarUrl: undefined };
    setPortfolioData(updatedData);
    setHtmlCode(generatePortfolioHTML(updatedData, template));
  };

  const handleLoadLatestResume = async () => {
    setLoadingLatest(true);
    setError(null);
    try {
      const res = await fetch("/api/analyses/latest");
      if (!res.ok) {
        const listRes = await fetch("/api/analyses");
        if (listRes.ok) {
          const listData = await listRes.json();
          if (Array.isArray(listData) && listData.length > 0) {
            const first = listData[0];
            const text = first.optimized_resume_text || first.original_resume_text || "";
            if (text) {
              setResumeText(text);
              return;
            }
          }
        }
        throw new Error("No previous resume scan found. Please paste your resume text below.");
      }
      const data = await res.json();
      const text = data.optimized_resume_text || data.original_resume_text || "";
      if (text) {
        setResumeText(text);
      } else {
        throw new Error("No resume text found in your recent analysis.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load recent resume. Please paste directly.");
    } finally {
      setLoadingLatest(false);
    }
  };

  const handleGenerate = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume or work history details first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          targetRole,
          template,
          avatarUrl: avatarUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not generate portfolio");
      setHtmlCode(data.html);
      if (data.data) {
        setPortfolioData(data.data);
      }
      if (data.suggestedTemplate) {
        setTemplate(data.suggestedTemplate);
      }
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

  const handleDownloadHtml = () => {
    if (!htmlCode) return;
    const blob = new Blob([htmlCode], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = "index.html";
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = () => {
    if (!htmlCode) return;
    const candidateName = portfolioData?.name || "Portfolio";
    const zipBlob = createZipBlob([
      { name: "index.html", content: htmlCode },
      {
        name: "README.md",
        content: `# ${candidateName}'s Portfolio Website\n\nGenerated with Vaylo AI Multi-Design Portfolio Engine.\n\n## Quick 1-Click Hosting\n1. Netlify Drop: Drag and drop this folder or index.html to https://app.netlify.com/drop\n2. Vercel: Run 'npx vercel' in this folder\n3. GitHub Pages: Upload index.html to your <username>.github.io repository`,
      },
    ]);
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${candidateName.toLowerCase().replace(/\s+/g, "-")}-portfolio.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLaunchNetlifyDrop = () => {
    handleDownloadHtml();
    window.open("https://app.netlify.com/drop", "_blank");
  };

  const handleLaunchNetlifyDropZip = () => {
    handleDownloadZip();
    window.open("https://app.netlify.com/drop", "_blank");
  };

  const handleSaveLiveUrl = async () => {
    if (!userLiveUrl.trim()) return;
    setSavingUrl(true);
    setError(null);
    setSaveSuccessMessage(null);

    try {
      const res = await fetch("/api/portfolio/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          liveUrl: userLiveUrl.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save portfolio URL");
      
      setSavedLiveUrl(data.savedLiveUrl || userLiveUrl.trim());
      setSaveSuccessMessage("🎉 Live portfolio saved to your profile!");
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to save portfolio link");
    } finally {
      setSavingUrl(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 font-semibold text-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" /> Multi-Design Portfolio Studio
            </Badge>
            <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-50 dark:bg-blue-950/20 px-2.5 py-0.5 font-semibold text-xs">
              6 Responsive Themes
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
            AI Developer &amp; Executive Portfolio Studio
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
            Transform your resume into a stunning, responsive portfolio website. Fully self-contained with photo support, zero dependencies, and instant free 1-click Netlify/Vercel export.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={handleDownloadHtml}
            variant="outline"
            size="sm"
            className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1.5 font-medium shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-500" /> Download HTML
          </Button>
          <Button
            onClick={() => setDeployModalOpen(true)}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1.5 shadow-lg shadow-emerald-600/20"
          >
            <Rocket className="w-4 h-4" /> Deploy Free
          </Button>
        </div>
      </div>

      {/* Persistent Live Portfolio Banner */}
      {savedLiveUrl && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-900/5 to-blue-500/10 dark:from-emerald-950/80 dark:via-slate-900 dark:to-blue-950/80 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Your Live Portfolio is Connected</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <a
                href={savedLiveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-300 underline flex items-center gap-1 mt-0.5"
              >
                {savedLiveUrl} <ExternalLink className="w-3.5 h-3.5 inline text-emerald-600 dark:text-emerald-400" />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={savedLiveUrl} target="_blank" rel="noreferrer">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1.5 text-xs">
                Visit Live Site ↗
              </Button>
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeployModalOpen(true)}
              className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
            >
              Change URL
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{error}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setError(null)} className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-white">
            Dismiss
          </Button>
        </div>
      )}

      {saveSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/60 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Config Panel */}
        <div className="xl:col-span-5 space-y-6 w-full">
          {/* Role Presets */}
          <Card className="bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">1. Select Target Role Preset</label>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Domain Adaptive</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ROLE_PRESETS.map((role) => {
                const isSelected = targetRole === role.label;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleSelectRole(role)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-white shadow-sm font-bold"
                        : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <span className="text-base shrink-0">{role.icon}</span>
                    <span className="truncate">{role.label}</span>
                  </button>
                );
              })}
            </div>
            <Input
              value={targetRole}
              onChange={(e) => {
                setTargetRole(e.target.value);
                if (portfolioData) {
                  const updated: PortfolioData = { ...portfolioData, title: e.target.value };
                  setPortfolioData(updated);
                  setHtmlCode(generatePortfolioHTML(updated, template));
                }
              }}
              placeholder="Or type custom role (e.g. Lead DevOps Engineer)"
              className="bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </Card>

          {/* Profile Photo Upload */}
          <Card className="bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">2. Profile Photo (Optional)</label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Max 5MB • JPG/PNG/WebP</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/webp"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md shrink-0 bg-slate-100 dark:bg-slate-950">
                  <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 shrink-0">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-[9px] mt-0.5">Initials</span>
                </div>
              )}

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-500" />
                    {avatarUrl ? "Change Photo" : "Upload Picture"}
                  </Button>

                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemovePhoto}
                      className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {avatarUrl
                    ? "Photo stored directly in standalone HTML bundle (no broken images on export)."
                    : "If no photo uploaded, an elegant monogram initials badge is used automatically."}
                </p>
              </div>
            </div>
          </Card>

          {/* Theme Switcher */}
          <Card className="bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">3. Select Visual Theme</label>
            <div className="grid grid-cols-2 gap-2.5">
              {PORTFOLIO_THEMES.map((th) => {
                const isSelected = template === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => handleTemplateChange(th.id)}
                    className={`p-3 rounded-2xl border text-left transition-all space-y-1.5 ${
                      isSelected
                        ? "bg-slate-100 dark:bg-slate-800/90 border-blue-500 shadow-md font-bold"
                        : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{th.name}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: th.accentColor }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{th.tagline}</p>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      {th.badge}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Resume Input Area */}
          <Card className="bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">4. Source Resume / Experience Text</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoadLatestResume}
                disabled={loadingLatest}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 gap-1.5 h-7 px-2"
              >
                {loadingLatest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Load Latest Scan
              </Button>
            </div>

            <Textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text, LinkedIn profile summary, or key projects (min 200 characters)..."
              rows={8}
              className="bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed"
            />

            <Button
              onClick={handleGenerate}
              disabled={loading || !resumeText.trim()}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-5 rounded-xl shadow-lg shadow-emerald-600/20 gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Structuring Portfolio with Gemini AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Portfolio Website
                </>
              )}
            </Button>
          </Card>
        </div>

        {/* Right Preview Studio */}
        <div className="xl:col-span-7 space-y-4 flex flex-col w-full min-w-0">
          {/* Preview Controls Bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800 text-white flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab("visual")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "visual" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" /> Visual Preview
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "code" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Code className="w-3.5 h-3.5 text-blue-400" /> HTML Source
              </button>
            </div>

            {activeTab === "visual" && (
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setDeviceView("desktop")}
                  title="Desktop View"
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    deviceView === "desktop" ? "bg-slate-800 text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Laptop className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceView("tablet")}
                  title="Tablet View"
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    deviceView === "tablet" ? "bg-slate-800 text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceView("mobile")}
                  title="Mobile View"
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    deviceView === "mobile" ? "bg-slate-800 text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            )}

            {htmlCode && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCode}
                  className="h-8 text-xs text-slate-300 hover:text-white gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownloadZip}
                  variant="outline"
                  className="h-8 text-xs border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 gap-1.5"
                >
                  <FolderArchive className="w-3.5 h-3.5 text-blue-400" /> ZIP Bundle
                </Button>
              </div>
            )}
          </div>

          {/* Viewport Frame */}
          <div className="w-full flex items-center justify-center bg-slate-950 rounded-3xl border border-slate-800 p-2 sm:p-4 relative overflow-hidden shadow-2xl">
            {activeTab === "visual" ? (
              <div
                className={`h-[680px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl transition-all duration-300 relative w-full ${
                  deviceView === "desktop"
                    ? "max-w-full"
                    : deviceView === "tablet"
                    ? "max-w-[768px]"
                    : "max-w-[375px]"
                }`}
              >
                <iframe
                  srcDoc={htmlCode}
                  title="Portfolio Live Preview"
                  sandbox="allow-scripts allow-same-origin"
                  className="w-full h-full border-none bg-black"
                />
              </div>
            ) : (
              <div className="w-full h-[680px] rounded-2xl bg-slate-950 border border-slate-800 p-4 overflow-auto">
                <pre className="text-xs font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap select-all">
                  {htmlCode}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deployment Center Modal */}
      {deployModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="bg-slate-900 border-slate-700 max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Free Deployment &amp; Hosting Center</h2>
                  <p className="text-xs text-slate-400">Choose your preferred free hosting platform</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeployModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            {/* Platform Selector */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setDeployPlatform("netlify")}
                className={`p-3.5 rounded-2xl border text-center space-y-1 transition-all ${
                  deployPlatform === "netlify"
                    ? "bg-emerald-950/40 border-emerald-500 text-white font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs">Netlify Drop</div>
                <div className="text-[10px] text-emerald-400">1-Click (10 Seconds)</div>
              </button>
              <button
                onClick={() => setDeployPlatform("vercel")}
                className={`p-3.5 rounded-2xl border text-center space-y-1 transition-all ${
                  deployPlatform === "vercel"
                    ? "bg-blue-950/40 border-blue-500 text-white font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs">Vercel CLI / Git</div>
                <div className="text-[10px] text-blue-400">Custom Domains</div>
              </button>
              <button
                onClick={() => setDeployPlatform("github")}
                className={`p-3.5 rounded-2xl border text-center space-y-1 transition-all ${
                  deployPlatform === "github"
                    ? "bg-purple-950/40 border-purple-500 text-white font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs">GitHub Pages</div>
                <div className="text-[10px] text-purple-400">Free Open Source</div>
              </button>
            </div>

            {/* Platform Instructions */}
            {deployPlatform === "netlify" && (
              <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Fastest: Netlify Drop</span>
                  <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-300">
                    No Account Needed
                  </Badge>
                </div>
                <ol className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold flex items-center justify-center shrink-0">1</span>
                    <span>Click below to download your ready-to-host file and launch Netlify Drop.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold flex items-center justify-center shrink-0">2</span>
                    <span>Drag and drop the downloaded file (or unzipped folder) directly into Netlify.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold flex items-center justify-center shrink-0">3</span>
                    <span>Your portfolio goes live instantly with a free SSL URL (e.g. <code className="text-emerald-300">https://yourname.netlify.app</code>).</span>
                  </li>
                </ol>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <Button
                    onClick={handleLaunchNetlifyDrop}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 text-xs gap-2"
                  >
                    <Rocket className="w-4 h-4" /> Download HTML &amp; Open Netlify ↗
                  </Button>
                  <Button
                    onClick={handleLaunchNetlifyDropZip}
                    variant="outline"
                    className="w-full border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs gap-2"
                  >
                    <FolderArchive className="w-4 h-4 text-blue-400" /> Download ZIP &amp; Open Netlify ↗
                  </Button>
                </div>
              </div>
            )}

            {deployPlatform === "vercel" && (
              <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Vercel CLI / Static Deploy</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Deploy via the official Vercel CLI in 2 commands:
                </p>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs text-blue-300 space-y-1">
                  <div># 1. Download your ZIP bundle and unzip into a folder</div>
                  <div>cd my-portfolio</div>
                  <div># 2. Run Vercel CLI to deploy</div>
                  <div>npx vercel</div>
                </div>
                <Button
                  onClick={handleDownloadZip}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 gap-2"
                >
                  <FolderArchive className="w-4 h-4" /> Download ZIP Bundle for Vercel
                </Button>
              </div>
            )}

            {deployPlatform === "github" && (
              <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">GitHub Pages (Free Hosting)</span>
                <ol className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <li>1. Create a repository named <code className="text-purple-300 font-mono">&lt;username&gt;.github.io</code></li>
                  <li>2. Upload your downloaded <code className="text-purple-300 font-mono">index.html</code> to the root branch.</li>
                  <li>3. Go to Repo Settings → Pages → Deploy from branch <code className="text-purple-300 font-mono">main</code>.</li>
                  <li>4. Your site will be live at <code className="text-purple-300 font-mono">https://&lt;username&gt;.github.io</code>.</li>
                </ol>
                <Button
                  onClick={handleDownloadHtml}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 gap-2"
                >
                  <Download className="w-4 h-4" /> Download index.html for GitHub Pages
                </Button>
              </div>
            )}

            {/* Truthful Deployment Status & Persistence */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Save Your Deployed Portfolio URL</span>
                {savedLiveUrl ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved to Profile
                  </span>
                ) : (
                  <span className="text-slate-500 font-normal">Connects to your dashboard</span>
                )}
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={userLiveUrl}
                  onChange={(e) => setUserLiveUrl(e.target.value)}
                  placeholder="e.g. https://my-portfolio.netlify.app or https://diwanshu.dev"
                  className="bg-slate-950 border-slate-800 text-xs text-white"
                />
                <Button
                  onClick={handleSaveLiveUrl}
                  disabled={savingUrl || !userLiveUrl.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 gap-1.5"
                >
                  {savingUrl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Save URL
                </Button>
              </div>
              <p className="text-[11px] text-slate-400">
                Once saved, your portfolio link will be displayed across your Vaylo dashboard and profile for easy sharing with recruiters.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
