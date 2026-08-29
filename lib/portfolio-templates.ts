// lib/portfolio-templates.ts
//
// Vaylo AI — Multi-Design Portfolio Template Engine
// 6 Distinct, Modern, Production-Ready Responsive Portfolio Themes:
// 1. Technical / Neo-Terminal (Cyberpunk Dark glow for Developers/DevOps/Cloud)
// 2. Minimal / Bento Studio (Ultra-clean Bento grid for Designers & Product)
// 3. Executive / Modern Glass (Deep navy glassmorphism & metrics for Leaders & Consultants)
// 4. Vibrant / Gradient SaaS (Bold Indigo/Purple gradients for Growth, Creators & Marketers)
// 5. Editorial / Warm Serif (Timeless ivory/paper serif typography for Academics & Writers)
// 6. Aurora / Deep Space (Obsidian mesh gradient glow for AI/ML & Web3)

export type PortfolioTemplateId =
  | "technical"
  | "minimal"
  | "executive"
  | "vibrant"
  | "editorial"
  | "aurora";

export interface PortfolioStat {
  label: string;
  value: string;
}

export interface PortfolioProject {
  title: string;
  description: string;
  tech: string;
  link?: string;
  github?: string;
  metrics?: string;
  designTags?: string[];
}

export interface PortfolioExperience {
  role: string;
  company: string;
  period: string;
  location?: string;
  summary: string;
  achievements?: string[];
}

export interface PortfolioEducation {
  degree: string;
  institution: string;
  year: string;
  score?: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  domain?: string;
  location?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  stats?: PortfolioStat[];
  skills: string[];
  projects: PortfolioProject[];
  experience: PortfolioExperience[];
  education?: PortfolioEducation[];
}

export interface ThemeMeta {
  id: PortfolioTemplateId;
  name: string;
  tagline: string;
  recommendation: string;
  accentColor: string;
  badge: string;
}

export const PORTFOLIO_THEMES: ThemeMeta[] = [
  {
    id: "technical",
    name: "Neo-Terminal",
    tagline: "Terminal Dark & Cyber Glow",
    recommendation: "Best for: Software Engineers, DevOps, Cybersecurity & Cloud Architects",
    accentColor: "#3b82f6",
    badge: "Developer Favorite",
  },
  {
    id: "minimal",
    name: "Bento Studio",
    tagline: "Apple / Linear Inspired Bento Grid",
    recommendation: "Best for: UI/UX Designers, Product Managers & Frontend Architects",
    accentColor: "#10b981",
    badge: "Design Aesthetic",
  },
  {
    id: "executive",
    name: "Executive Glass",
    tagline: "Deep Slate Glassmorphism & High-Impact Metrics",
    recommendation: "Best for: Executives, Engineering Leaders, Consultants & Finance",
    accentColor: "#0ea5e9",
    badge: "Leadership Ready",
  },
  {
    id: "vibrant",
    name: "Gradient SaaS",
    tagline: "Bold Purple & Indigo Dynamic Elevation",
    recommendation: "Best for: Growth Marketers, Startup Founders & Full Stack Creators",
    accentColor: "#8b5cf6",
    badge: "Modern SaaS",
  },
  {
    id: "editorial",
    name: "Warm Editorial",
    tagline: "Sophisticated Serif & High-Readability Layout",
    recommendation: "Best for: Writers, Researchers, Healthcare, Legal & Academics",
    accentColor: "#d97706",
    badge: "Classic Serif",
  },
  {
    id: "aurora",
    name: "Deep Space Aurora",
    tagline: "Obsidian Dark with Ambient Mesh Glow",
    recommendation: "Best for: AI/ML Engineers, Data Scientists & Web3 Innovators",
    accentColor: "#06b6d4",
    badge: "AI / Futuristic",
  },
];

export function autoSuggestTemplate(roleOrResumeText: string): PortfolioTemplateId {
  const text = (roleOrResumeText || "").toLowerCase();
  if (text.includes("terminal") || text.includes("backend") || text.includes("devops") || text.includes("cloud") || text.includes("software") || text.includes("developer") || text.includes("sre") || text.includes("linux")) {
    return "technical";
  }
  if (text.includes("ai") || text.includes("ml") || text.includes("machine learning") || text.includes("deep learning") || text.includes("data scientist") || text.includes("crypto") || text.includes("web3")) {
    return "aurora";
  }
  if (text.includes("design") || text.includes("ui") || text.includes("ux") || text.includes("product") || text.includes("figma") || text.includes("frontend")) {
    return "minimal";
  }
  if (text.includes("marketing") || text.includes("growth") || text.includes("sales") || text.includes("content") || text.includes("creator") || text.includes("brand")) {
    return "vibrant";
  }
  if (text.includes("writer") || text.includes("research") || text.includes("doctor") || text.includes("healthcare") || text.includes("academic") || text.includes("law") || text.includes("editorial")) {
    return "editorial";
  }
  if (text.includes("executive") || text.includes("finance") || text.includes("manager") || text.includes("director") || text.includes("lead") || text.includes("consultant")) {
    return "executive";
  }

  return "technical";
}

export function escapeHtml(str: any): string {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function validatePortfolioInput(input: {
  rawResumeText?: string;
  projects?: any[];
  experience?: any[];
  skills?: any[];
}): { valid: boolean; reason?: string } {
  const hasResumeText = Boolean(input.rawResumeText && input.rawResumeText.trim().length >= 200);
  const hasStructuredFields =
    (input.projects && input.projects.length >= 1) ||
    (input.experience && input.experience.length >= 1 && input.skills && input.skills.length >= 3);

  if (!hasResumeText && !hasStructuredFields) {
    return {
      valid: false,
      reason:
        "Add at least one project or work experience with a few skills (or paste a resume/profile of at least 200 characters) so your portfolio reflects real work — a role selection alone isn't enough to build from.",
    };
  }
  return { valid: true };
}

function getInitials(name: string = "User"): string {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "VA";
}

export function renderAvatar(
  avatarUrl?: string,
  name: string = "User",
  style: "terminal" | "bento" | "glass" | "gradient" | "serif" | "neon" = "terminal"
): string {
  const safeName = escapeHtml(name);
  const initials = getInitials(name);

  if (avatarUrl && avatarUrl.trim()) {
    const safeUrl = escapeHtml(avatarUrl.trim());
    if (style === "terminal") {
      return `<div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-slate-900 shrink-0">
        <img src="${safeUrl}" alt="${safeName}" class="w-full h-full object-cover" />
      </div>`;
    }
    if (style === "bento") {
      return `<div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden ring-4 ring-indigo-500/20 shadow-xl bg-slate-100 shrink-0">
        <img src="${safeUrl}" alt="${safeName}" class="w-full h-full object-cover" />
      </div>`;
    }
    if (style === "glass") {
      return `<div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-slate-900 shrink-0">
        <img src="${safeUrl}" alt="${safeName}" class="w-full h-full object-cover" />
      </div>`;
    }
    if (style === "gradient") {
      return `<div class="relative p-1 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 shadow-xl shrink-0">
        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-950">
          <img src="${safeUrl}" alt="${safeName}" class="w-full h-full object-cover" />
        </div>
      </div>`;
    }
    if (style === "serif") {
      return `<div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-900/30 shadow-md bg-stone-100 shrink-0">
        <img src="${safeUrl}" alt="${safeName}" class="w-full h-full object-cover" />
      </div>`;
    }
    return `<div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] bg-slate-950 shrink-0">
      <img src="${safeUrl}" alt="${safeName}" class="w-full h-full object-cover" />
    </div>`;
  }

  // Fallback Initials Component
  if (style === "terminal") {
    return `<div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-emerald-500/50 bg-slate-900 text-emerald-400 font-mono font-bold text-xl sm:text-2xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.25)] shrink-0">
      ${initials}
    </div>`;
  }
  if (style === "bento") {
    return `<div class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl ring-4 ring-indigo-500/20 bg-indigo-600 text-white font-sans font-bold text-xl sm:text-2xl flex items-center justify-center shadow-xl shrink-0">
      ${initials}
    </div>`;
  }
  if (style === "glass") {
    return `<div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-slate-700 bg-slate-800/90 text-blue-400 font-sans font-bold text-xl sm:text-2xl flex items-center justify-center shadow-xl shrink-0">
      ${initials}
    </div>`;
  }
  if (style === "gradient") {
    return `<div class="p-1 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 shadow-xl shrink-0">
      <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-950 text-pink-400 font-bold text-xl sm:text-2xl flex items-center justify-center">
        ${initials}
      </div>
    </div>`;
  }
  if (style === "serif") {
    return `<div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-amber-900/30 bg-amber-100 text-amber-900 font-serif font-bold text-xl sm:text-2xl flex items-center justify-center shadow-md shrink-0">
      ${initials}
    </div>`;
  }
  return `<div class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl ring-2 ring-cyan-400 bg-slate-900 text-cyan-300 font-mono font-bold text-xl sm:text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.35)] shrink-0">
    ${initials}
  </div>`;
}

// ---------------------------------------------------------------------------
// TEMPLATE 1: TECHNICAL / NEO-TERMINAL (Developers, DevOps, Cloud)
// ---------------------------------------------------------------------------
function renderTechnicalTemplate(data: PortfolioData): string {
  const safeName = escapeHtml(data.name || "Developer");
  const safeTitle = escapeHtml(data.title || "Software Engineer");
  const safeBio = escapeHtml(data.bio || "");
  const safeEmail = escapeHtml(data.email || "contact@vayloai.online");
  const safeGithub = data.github ? escapeHtml(data.github) : null;
  const avatarElement = renderAvatar(data.avatarUrl, data.name, "terminal");

  const statsHtml = (data.stats || [
    { label: "Code Architecture", value: "Production" },
    { label: "Core Competencies", value: `${(data.skills || []).length}+` },
    { label: "Featured Projects", value: `${(data.projects || []).length}` },
  ])
    .map(
      (s) => `
      <div class="bg-slate-900/90 border border-emerald-900/40 p-4 rounded-xl text-center">
        <div class="text-2xl font-mono font-bold text-emerald-400">${escapeHtml(s.value)}</div>
        <div class="text-xs text-slate-400 font-mono mt-1">${escapeHtml(s.label)}</div>
      </div>`
    )
    .join("");

  const skillsHtml = (data.skills || [])
    .map(
      (s) => `
      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 font-mono text-xs hover:border-emerald-400 transition-colors">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        ${escapeHtml(s)}
      </span>`
    )
    .join("");

  const projectsHtml = (data.projects || [])
    .map(
      (p) => `
      <div class="group bg-slate-900/80 border border-slate-800 hover:border-emerald-500/60 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5">
        <div class="flex items-center justify-between gap-2 mb-3">
          <h3 class="text-lg font-mono font-bold text-white group-hover:text-emerald-400 transition-colors">${escapeHtml(p.title)}</h3>
          <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">Active</span>
        </div>
        <p class="text-sm text-slate-300 leading-relaxed mb-4">${escapeHtml(p.description)}</p>
        ${p.metrics ? `<div class="text-xs font-mono text-emerald-400 mb-3">⚡ ${escapeHtml(p.metrics)}</div>` : ""}
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span class="text-emerald-300/80">${escapeHtml(p.tech)}</span>
          ${p.link ? `<a href="${escapeHtml(p.link)}" target="_blank" class="text-emerald-400 hover:underline">Launch →</a>` : ""}
        </div>
      </div>`
    )
    .join("");

  const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;
  const expHtml = hasExperience
    ? (data.experience || [])
        .map(
          (e) => `
        <div class="relative pl-6 pb-8 border-l border-emerald-900/50 last:pb-0">
          <div class="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950"></div>
          <div class="flex flex-wrap items-baseline justify-between gap-2 mb-1">
            <h4 class="text-base font-mono font-bold text-white">${escapeHtml(e.role)} <span class="text-emerald-400">@ ${escapeHtml(e.company)}</span></h4>
            <span class="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">${escapeHtml(e.period)}</span>
          </div>
          <p class="text-sm text-slate-300 leading-relaxed mt-2">${escapeHtml(e.summary)}</p>
        </div>`
        )
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeName} — ${safeTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #030712; color: #e2e8f0; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="min-h-screen selection:bg-emerald-500 selection:text-white">
  <header class="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
    <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2 font-mono text-sm font-bold text-white">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        <span class="text-emerald-400">~/</span>${safeName.toLowerCase().replace(/\s+/g, "-")}
      </div>
      <nav class="hidden sm:flex items-center gap-6 text-xs font-mono text-slate-400">
        <a href="#about" class="hover:text-emerald-400 transition-colors">01. About</a>
        <a href="#skills" class="hover:text-emerald-400 transition-colors">02. Stack</a>
        <a href="#projects" class="hover:text-emerald-400 transition-colors">03. Projects</a>
        ${hasExperience ? '<a href="#experience" class="hover:text-emerald-400 transition-colors">04. Experience</a>' : ''}
        <a href="#contact" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all">Get in Touch</a>
      </nav>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-6 py-12 space-y-20">
    <section id="about" class="pt-6">
      <div class="rounded-3xl border border-emerald-900/50 bg-gradient-to-b from-slate-900/90 to-slate-950 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
          ${avatarElement}
          <div>
            <div class="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-400"></span> STATUS: ACTIVE_DEV
            </div>
            <h1 class="text-3xl sm:text-5xl font-extrabold font-mono text-white tracking-tight leading-tight">
              &gt; ${safeName}
            </h1>
            <p class="text-lg sm:text-xl font-mono text-emerald-400 mt-1 font-semibold">[ ${safeTitle} ]</p>
          </div>
        </div>
        <p class="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mt-4">${safeBio}</p>
        
        ${safeGithub ? `
        <div class="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-3">
          <span class="text-xs font-mono text-slate-400">GitHub:</span>
          <a href="${safeGithub.startsWith('http') ? safeGithub : `https://github.com/${safeGithub}`}" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono">
            🐙 github.com/${safeGithub.replace(/^https?:\/\/github\.com\//, '')} →
          </a>
        </div>` : ""}

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-800">
          ${statsHtml}
        </div>
      </div>
    </section>

    <section id="skills" class="space-y-6">
      <h2 class="text-xl sm:text-2xl font-mono font-bold text-white flex items-center gap-3">
        <span class="text-emerald-400">//</span> Technical Skills &amp; Stack
      </h2>
      <div class="flex flex-wrap gap-2.5">
        ${skillsHtml}
      </div>
    </section>

    <section id="projects" class="space-y-6">
      <h2 class="text-xl sm:text-2xl font-mono font-bold text-white flex items-center gap-3">
        <span class="text-emerald-400">//</span> Featured Code Repositories &amp; Systems
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${projectsHtml}
      </div>
    </section>

    ${hasExperience ? `
    <section id="experience" class="space-y-6">
      <h2 class="text-xl sm:text-2xl font-mono font-bold text-white flex items-center gap-3">
        <span class="text-emerald-400">//</span> Production Career Timeline
      </h2>
      <div class="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl">
        ${expHtml}
      </div>
    </section>` : ''}

    <section id="contact" class="rounded-3xl border border-emerald-900/40 bg-slate-950 p-8 sm:p-12 text-center space-y-6">
      <h2 class="text-3xl font-mono font-bold text-white">Let&#39;s Build Something Scalable</h2>
      <p class="text-slate-400 text-sm max-w-xl mx-auto font-mono">Open for architecture consultations, software engineering roles, and innovative projects.</p>
      <a href="mailto:${safeEmail}" class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold transition-all shadow-lg shadow-emerald-600/20">
        Initiate Contact &gt;
      </a>
    </section>
  </main>

  <footer class="border-t border-slate-900 py-8 text-center text-xs font-mono text-slate-600">
    © ${new Date().getFullYear()} ${safeName}. Built with Vaylo AI.
  </footer>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// TEMPLATE 2: MINIMAL / BENTO STUDIO (Designers, PMs, Creators)
// ---------------------------------------------------------------------------
function renderMinimalTemplate(data: PortfolioData): string {
  const safeName = escapeHtml(data.name || "Designer");
  const safeTitle = escapeHtml(data.title || "Product Designer & Strategist");
  const safeBio = escapeHtml(data.bio || "");
  const safeEmail = escapeHtml(data.email || "contact@vayloai.online");
  const avatarElement = renderAvatar(data.avatarUrl, data.name, "bento");

  const skillsHtml = (data.skills || [])
    .map((s) => `<span class="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 font-medium text-xs border border-slate-200">${escapeHtml(s)}</span>`)
    .join("");

  const projectsHtml = (data.projects || [])
    .map(
      (p) => `
      <div class="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Case Study</span>
            ${p.link ? `<a href="${escapeHtml(p.link)}" target="_blank" class="text-xs font-bold text-slate-400 group-hover:text-indigo-600">View ↗</a>` : ""}
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">${escapeHtml(p.title)}</h3>
          <p class="text-sm text-slate-600 leading-relaxed mb-4">${escapeHtml(p.description)}</p>
          ${p.metrics ? `<div class="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl inline-block mb-3">✦ ${escapeHtml(p.metrics)}</div>` : ""}
        </div>
        <div class="pt-4 border-t border-slate-100 text-xs font-medium text-slate-400">
          ${escapeHtml(p.tech)}
        </div>
      </div>`
    )
    .join("");

  const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;
  const expHtml = hasExperience
    ? (data.experience || [])
        .map(
          (e) => `
        <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 py-4 border-b border-slate-100 last:border-none">
          <div>
            <h4 class="text-base font-bold text-slate-900">${escapeHtml(e.role)}</h4>
            <div class="text-xs font-semibold text-indigo-600 mt-0.5">${escapeHtml(e.company)}</div>
            <p class="text-sm text-slate-600 mt-1">${escapeHtml(e.summary)}</p>
          </div>
          <span class="text-xs text-slate-400 font-medium whitespace-nowrap">${escapeHtml(e.period)}</span>
        </div>`
        )
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeName} — Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; color: #0f172a; }
  </style>
</head>
<body class="min-h-screen">
  <div class="max-w-5xl mx-auto px-6 py-12 sm:py-20 space-y-12">
    <!-- Bento Hero Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2 bg-white border border-slate-200/80 p-8 sm:p-12 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
        <div class="space-y-4">
          <div class="flex items-center gap-5">
            ${avatarElement}
            <div>
              <span class="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">Portfolio</span>
              <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">${safeName}</h1>
              <p class="text-base sm:text-lg font-semibold text-indigo-600 mt-0.5">${safeTitle}</p>
            </div>
          </div>
          <p class="text-slate-600 text-sm sm:text-base leading-relaxed pt-2">${safeBio}</p>
        </div>
        <div class="pt-6 border-t border-slate-100 flex items-center justify-between">
          <a href="mailto:${safeEmail}" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md">
            Say Hello ↗
          </a>
        </div>
      </div>

      <div class="bg-indigo-600 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-indigo-200">Design Focus</span>
          <h3 class="text-2xl font-bold mt-2 leading-snug">Crafting intuitive digital experiences.</h3>
        </div>
        <div class="space-y-2">
          <div class="text-3xl font-extrabold">${(data.skills || []).length}+</div>
          <div class="text-xs text-indigo-200 font-medium">Core design &amp; product capabilities</div>
        </div>
      </div>
    </div>

    <!-- Skills Bento Box -->
    <div class="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm space-y-4">
      <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400">Toolkit &amp; Methodologies</h3>
      <div class="flex flex-wrap gap-2">
        ${skillsHtml}
      </div>
    </div>

    <!-- Projects Grid -->
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-slate-900">Featured Work &amp; Case Studies</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${projectsHtml}
      </div>
    </div>

    ${hasExperience ? `
    <!-- Experience Bento -->
    <div class="bg-white border border-slate-200/80 p-8 sm:p-10 rounded-3xl shadow-sm space-y-4">
      <h2 class="text-2xl font-bold text-slate-900 mb-2">Professional Journey</h2>
      <div class="divide-y divide-slate-100">
        ${expHtml}
      </div>
    </div>` : ''}

    <footer class="text-center text-xs text-slate-400 py-6">
      © ${new Date().getFullYear()} ${safeName}. Built with Vaylo AI.
    </footer>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// TEMPLATE 3: EXECUTIVE GLASS (Leaders, Directors, Consultants, Finance)
// ---------------------------------------------------------------------------
function renderExecutiveTemplate(data: PortfolioData): string {
  const safeName = escapeHtml(data.name || "Executive");
  const safeTitle = escapeHtml(data.title || "Senior Leadership & Strategy");
  const safeBio = escapeHtml(data.bio || "");
  const safeEmail = escapeHtml(data.email || "contact@vayloai.online");
  const avatarElement = renderAvatar(data.avatarUrl, data.name, "glass");

  const statsHtml = (data.stats || [
    { label: "Strategic Leadership", value: "Executive" },
    { label: "Core Competencies", value: `${(data.skills || []).length}+` },
    { label: "Key Initiatives", value: `${(data.projects || []).length}` },
  ])
    .map(
      (s) => `
      <div class="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl backdrop-blur-md text-center">
        <div class="text-3xl font-bold text-blue-400">${escapeHtml(s.value)}</div>
        <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">${escapeHtml(s.label)}</div>
      </div>`
    )
    .join("");

  const skillsHtml = (data.skills || [])
    .map((s) => `<span class="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold">${escapeHtml(s)}</span>`)
    .join("");

  const projectsHtml = (data.projects || [])
    .map(
      (p) => `
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl backdrop-blur-md space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-white">${escapeHtml(p.title)}</h3>
          <span class="text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-3 py-1 rounded-full">Initiative</span>
        </div>
        <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(p.description)}</p>
        ${p.metrics ? `<div class="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg inline-block">⚡ ${escapeHtml(p.metrics)}</div>` : ""}
        <div class="pt-3 border-t border-slate-800 text-xs text-slate-400 font-medium">
          Strategic Focus: <span class="text-slate-300">${escapeHtml(p.tech)}</span>
        </div>
      </div>`
    )
    .join("");

  const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;
  const expHtml = hasExperience
    ? (data.experience || [])
        .map(
          (e) => `
        <div class="border-l-2 border-blue-500/40 pl-6 py-2 space-y-1">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h4 class="text-lg font-bold text-white">${escapeHtml(e.role)}</h4>
            <span class="text-xs font-semibold text-blue-400">${escapeHtml(e.period)}</span>
          </div>
          <div class="text-xs font-semibold text-slate-400">${escapeHtml(e.company)}</div>
          <p class="text-sm text-slate-300 leading-relaxed pt-1">${escapeHtml(e.summary)}</p>
        </div>`
        )
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeName} — Executive Brief</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #0b1120; color: #f1f5f9; }
  </style>
</head>
<body class="min-h-screen">
  <div class="max-w-5xl mx-auto px-6 py-16 space-y-16">
    <header class="bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/80 p-8 sm:p-14 rounded-3xl shadow-2xl backdrop-blur-lg">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
        ${avatarElement}
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-blue-400">Executive Profile</span>
          <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-1">${safeName}</h1>
          <p class="text-lg sm:text-xl font-semibold text-slate-300 mt-1">${safeTitle}</p>
        </div>
      </div>
      <p class="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl pt-2">${safeBio}</p>
      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-slate-700/80">
        ${statsHtml}
      </div>
    </header>

    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-white tracking-tight">Core Competencies &amp; Governance</h2>
      <div class="flex flex-wrap gap-2.5">
        ${skillsHtml}
      </div>
    </section>

    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-white tracking-tight">Strategic Initiatives &amp; Results</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${projectsHtml}
      </div>
    </section>

    ${hasExperience ? `
    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-white tracking-tight">Leadership History</h2>
      <div class="bg-slate-900/70 border border-slate-800 p-8 rounded-3xl space-y-6">
        ${expHtml}
      </div>
    </section>` : ''}

    <section class="text-center py-10 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8">
      <h3 class="text-2xl font-bold text-white">Direct Advisory &amp; Engagement</h3>
      <p class="text-slate-400 text-sm mt-2 mb-6">Reach out to discuss strategic advisory, board roles, or leadership opportunities.</p>
      <a href="mailto:${safeEmail}" class="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/20">
        Contact Executive
      </a>
    </section>

    <footer class="text-center text-xs text-slate-500 py-4">
      © ${new Date().getFullYear()} ${safeName}. Built with Vaylo AI.
    </footer>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// TEMPLATE 4: VIBRANT / GRADIENT SAAS (Marketing, Growth, Creators, Founders)
// ---------------------------------------------------------------------------
function renderVibrantTemplate(data: PortfolioData): string {
  const safeName = escapeHtml(data.name || "Growth Lead");
  const safeTitle = escapeHtml(data.title || "Growth Marketer & Builder");
  const safeBio = escapeHtml(data.bio || "");
  const safeEmail = escapeHtml(data.email || "contact@vayloai.online");
  const avatarElement = renderAvatar(data.avatarUrl, data.name, "gradient");

  const statsHtml = (data.stats || [
    { label: "Growth Focus", value: "Metrics" },
    { label: "Campaign Strategies", value: `${(data.projects || []).length}` },
    { label: "Growth Capabilities", value: `${(data.skills || []).length}+` },
  ])
    .map(
      (s) => `
      <div class="bg-purple-950/40 border border-purple-800/40 p-6 rounded-2xl text-center backdrop-blur-md">
        <div class="text-3xl font-extrabold text-pink-400">${escapeHtml(s.value)}</div>
        <div class="text-xs font-bold uppercase tracking-wider text-purple-300 mt-1">${escapeHtml(s.label)}</div>
      </div>`
    )
    .join("");

  const skillsHtml = (data.skills || [])
    .map((s) => `<span class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-800/60 text-purple-200 text-xs font-bold">${escapeHtml(s)}</span>`)
    .join("");

  const projectsHtml = (data.projects || [])
    .map(
      (p) => `
      <div class="bg-slate-900/90 border border-purple-900/40 hover:border-pink-500/60 p-8 rounded-3xl transition-all duration-300 space-y-4 group">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-white group-hover:text-pink-400 transition-colors">${escapeHtml(p.title)}</h3>
          <span class="text-xs font-bold text-pink-400 bg-pink-950/60 px-3 py-1 rounded-full border border-pink-800/60">Campaign</span>
        </div>
        <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(p.description)}</p>
        ${p.metrics ? `<div class="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl inline-block">🚀 Impact: ${escapeHtml(p.metrics)}</div>` : ""}
        <div class="pt-3 border-t border-slate-800 text-xs text-purple-300">
          Channels / Stack: <span class="text-slate-300">${escapeHtml(p.tech)}</span>
        </div>
      </div>`
    )
    .join("");

  const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;
  const expHtml = hasExperience
    ? (data.experience || [])
        .map(
          (e) => `
        <div class="p-6 rounded-2xl bg-purple-950/20 border border-purple-900/30 space-y-1">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h4 class="text-lg font-bold text-white">${escapeHtml(e.role)}</h4>
            <span class="text-xs font-bold text-pink-400">${escapeHtml(e.period)}</span>
          </div>
          <div class="text-xs font-bold text-purple-300">${escapeHtml(e.company)}</div>
          <p class="text-sm text-slate-300 pt-2">${escapeHtml(e.summary)}</p>
        </div>`
        )
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeName} — Growth &amp; Strategy</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #090d16; color: #f8fafc; }
  </style>
</head>
<body class="min-h-screen">
  <div class="max-w-5xl mx-auto px-6 py-16 space-y-16">
    <header class="relative p-8 sm:p-14 rounded-3xl bg-gradient-to-tr from-purple-950/80 via-slate-900 to-slate-950 border border-purple-800/40 shadow-2xl overflow-hidden">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
        ${avatarElement}
        <div>
          <span class="inline-block px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-extrabold uppercase tracking-wider">Growth Architect</span>
          <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-pink-300">
            ${safeName}
          </h1>
          <p class="text-lg sm:text-xl font-bold text-purple-300 mt-1">${safeTitle}</p>
        </div>
      </div>
      <p class="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl pt-2">${safeBio}</p>
      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-purple-900/40">
        ${statsHtml}
      </div>
    </header>

    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-white">Growth Stack &amp; Channels</h2>
      <div class="flex flex-wrap gap-2.5">
        ${skillsHtml}
      </div>
    </section>

    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-white">Campaign Case Studies</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${projectsHtml}
      </div>
    </section>

    ${hasExperience ? `
    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-white">Growth Track Record</h2>
      <div class="space-y-4">
        ${expHtml}
      </div>
    </section>` : ''}

    <section class="text-center py-12 rounded-3xl bg-gradient-to-r from-purple-950/60 to-pink-950/60 border border-purple-800/40 p-8">
      <h3 class="text-2xl sm:text-3xl font-extrabold text-white">Ready to accelerate your next milestone?</h3>
      <p class="text-purple-200 text-sm mt-2 mb-6">Open for growth marketing leadership, consulting, and ambitious collaborations.</p>
      <a href="mailto:${safeEmail}" class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold transition-all shadow-xl shadow-pink-600/25">
        Let&#39;s Talk Growth 🚀
      </a>
    </section>

    <footer class="text-center text-xs text-slate-500 py-4">
      © ${new Date().getFullYear()} ${safeName}. Built with Vaylo AI.
    </footer>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// TEMPLATE 5: EDITORIAL / WARM SERIF (Writers, Academics, Healthcare, Legal)
// ---------------------------------------------------------------------------
function renderEditorialTemplate(data: PortfolioData): string {
  const safeName = escapeHtml(data.name || "Scholar");
  const safeTitle = escapeHtml(data.title || "Writer, Researcher & Academic");
  const safeBio = escapeHtml(data.bio || "");
  const safeEmail = escapeHtml(data.email || "contact@vayloai.online");
  const avatarElement = renderAvatar(data.avatarUrl, data.name, "serif");

  const skillsHtml = (data.skills || [])
    .map((s) => `<span class="px-3.5 py-1.5 rounded-md bg-stone-200/80 text-stone-800 text-xs font-serif m-1 border border-stone-300">${escapeHtml(s)}</span>`)
    .join("");

  const projectsHtml = (data.projects || [])
    .map(
      (p) => `
      <article class="p-6 border border-stone-300/80 rounded-2xl bg-white space-y-2 shadow-xs">
        <div class="text-xs uppercase tracking-wider text-amber-900 font-bold">${escapeHtml(p.tech)}</div>
        <h3 class="text-2xl font-serif font-bold text-stone-900">${escapeHtml(p.title)}</h3>
        <p class="text-stone-700 text-sm leading-relaxed font-serif">${escapeHtml(p.description)}</p>
        ${p.link ? `<div class="pt-2"><a href="${escapeHtml(p.link)}" target="_blank" class="text-xs font-serif font-bold text-amber-900 underline">Read Publication ↗</a></div>` : ""}
      </article>`
    )
    .join("");

  const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;
  const expHtml = hasExperience
    ? (data.experience || [])
        .map(
          (e) => `
        <div class="pb-6 border-b border-stone-200 last:border-b-0 space-y-1">
          <div class="flex justify-between items-baseline flex-wrap gap-2">
            <h4 class="text-lg font-serif font-bold text-stone-900">${escapeHtml(e.role)} — <span class="italic font-normal text-stone-700">${escapeHtml(e.company)}</span></h4>
            <span class="text-xs font-mono text-stone-500">${escapeHtml(e.period)}</span>
          </div>
          <p class="text-stone-700 text-sm leading-relaxed font-serif">${escapeHtml(e.summary)}</p>
        </div>`
        )
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeName} — Selected Works</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,400&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Newsreader', serif; background-color: #faf9f6; color: #292524; }
    h1, h2, h3, .serif { font-family: 'Playfair Display', serif; }
  </style>
</head>
<body class="min-h-screen p-6 sm:p-12 md:p-20 max-w-4xl mx-auto space-y-16">
  <header class="space-y-6 border-b border-stone-300 pb-12">
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
      ${avatarElement}
      <div class="space-y-1">
        <div class="text-xs uppercase tracking-widest text-stone-500 font-sans font-bold">Curriculum Vitae &amp; Selected Works</div>
        <h1 class="text-3xl sm:text-5xl font-normal text-stone-950">${safeName}</h1>
        <p class="text-xl italic text-stone-800">${safeTitle}</p>
      </div>
    </div>
    <p class="text-stone-700 text-lg leading-relaxed max-w-3xl pt-2 font-serif">${safeBio}</p>
  </header>

  <section class="space-y-4">
    <h2 class="text-2xl font-bold text-stone-900 border-b border-stone-200 pb-2">Areas of Inquiry &amp; Competence</h2>
    <div>${skillsHtml}</div>
  </section>

  <section class="space-y-6">
    <h2 class="text-2xl font-bold text-stone-900 border-b border-stone-200 pb-2">Selected Publications &amp; Projects</h2>
    <div class="space-y-6">${projectsHtml}</div>
  </section>

  ${hasExperience ? `
  <section class="space-y-6">
    <h2 class="text-2xl font-bold text-stone-900 border-b border-stone-200 pb-2">Professional &amp; Academic Appointments</h2>
    <div class="space-y-6">${expHtml}</div>
  </section>` : ''}

  <footer class="border-t border-stone-300 pt-8 flex justify-between items-center text-xs font-sans text-stone-500">
    <span>© ${new Date().getFullYear()} ${safeName}.</span>
    <a href="mailto:${safeEmail}" class="underline font-bold text-stone-800">${safeEmail}</a>
  </footer>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// TEMPLATE 6: AURORA / DEEP SPACE (AI/ML, Data Science, Web3)
// ---------------------------------------------------------------------------
function renderAuroraTemplate(data: PortfolioData): string {
  const safeName = escapeHtml(data.name || "Innovator");
  const safeTitle = escapeHtml(data.title || "AI & Data Scientist");
  const safeBio = escapeHtml(data.bio || "");
  const safeEmail = escapeHtml(data.email || "contact@vayloai.online");
  const avatarElement = renderAvatar(data.avatarUrl, data.name, "neon");

  const statsHtml = (data.stats || [
    { label: "Intelligence Focus", value: "Neural" },
    { label: "Model Deployments", value: `${(data.projects || []).length}` },
    { label: "Stack Competencies", value: `${(data.skills || []).length}+` },
  ])
    .map(
      (s) => `
      <div class="bg-slate-900/80 border border-cyan-500/30 p-6 rounded-2xl text-center backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.1)]">
        <div class="text-3xl font-mono font-bold text-cyan-300">${escapeHtml(s.value)}</div>
        <div class="text-xs font-mono text-cyan-500 uppercase tracking-widest mt-1">${escapeHtml(s.label)}</div>
      </div>`
    )
    .join("");

  const skillsHtml = (data.skills || [])
    .map((s) => `<span class="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs shadow-[0_0_10px_rgba(6,182,212,0.1)]">${escapeHtml(s)}</span>`)
    .join("");

  const projectsHtml = (data.projects || [])
    .map(
      (p) => `
      <div class="bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 p-8 rounded-3xl transition-all duration-300 space-y-4 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">${escapeHtml(p.title)}</h3>
          <span class="text-xs font-mono text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">Neural Net</span>
        </div>
        <p class="text-sm text-slate-300 leading-relaxed font-sans">${escapeHtml(p.description)}</p>
        ${p.metrics ? `<div class="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl inline-block">⚡ ${escapeHtml(p.metrics)}</div>` : ""}
        <div class="pt-3 border-t border-slate-800 text-xs font-mono text-cyan-400/80">
          Architecture: ${escapeHtml(p.tech)}
        </div>
      </div>`
    )
    .join("");

  const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;
  const expHtml = hasExperience
    ? (data.experience || [])
        .map(
          (e) => `
        <div class="p-6 rounded-2xl bg-slate-900/60 border border-cyan-900/40 space-y-1 font-mono">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h4 class="text-lg font-bold text-white">${escapeHtml(e.role)}</h4>
            <span class="text-xs text-cyan-400">${escapeHtml(e.period)}</span>
          </div>
          <div class="text-xs text-cyan-500">${escapeHtml(e.company)}</div>
          <p class="text-sm text-slate-300 font-sans pt-2">${escapeHtml(e.summary)}</p>
        </div>`
        )
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeName} — ${safeTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #030712; color: #f1f5f9; }
    .heading { font-family: 'Space Grotesk', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="min-h-screen p-6 sm:p-12 md:p-16 max-w-5xl mx-auto space-y-16">
  <header class="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-slate-950 via-cyan-950 to-emerald-950 border border-cyan-900/50 space-y-6 shadow-2xl relative overflow-hidden">
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
      ${avatarElement}
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
          ● NEURAL_MESH_ONLINE
        </div>
        <h1 class="text-3xl sm:text-5xl font-bold heading text-white">${safeName}</h1>
        <p class="text-xl font-semibold text-cyan-400 heading">${safeTitle}</p>
      </div>
    </div>
    <p class="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl pt-2">${safeBio}</p>
    
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-slate-800">
      ${statsHtml}
    </div>
  </header>

  <section class="space-y-6">
    <h2 class="text-2xl font-bold heading text-white font-mono">// Algorithms &amp; Tech Stack</h2>
    <div class="flex flex-wrap gap-2.5">${skillsHtml}</div>
  </section>

  <section class="space-y-6">
    <h2 class="text-2xl font-bold heading text-white font-mono">// AI Research &amp; Machine Learning Pipelines</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">${projectsHtml}</div>
  </section>

  ${hasExperience ? `
  <section class="space-y-6">
    <h2 class="text-2xl font-bold heading text-white font-mono">// Engineering Experience</h2>
    <div class="space-y-4">${expHtml}</div>
  </section>` : ''}

  <footer class="p-8 rounded-3xl bg-slate-900/80 border border-cyan-900/40 flex justify-between items-center flex-wrap gap-4 text-xs font-mono text-slate-400">
    <span>© ${new Date().getFullYear()} ${safeName}. Built with Vaylo AI.</span>
    <a href="mailto:${safeEmail}" class="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all">
      Connect: ${safeEmail}
    </a>
  </footer>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// MASTER GENERATOR DISPATCHER
// ---------------------------------------------------------------------------
export function generatePortfolioHTML(data: PortfolioData, template: PortfolioTemplateId = "technical"): string {
  switch (template) {
    case "minimal":
      return renderMinimalTemplate(data);
    case "executive":
      return renderExecutiveTemplate(data);
    case "vibrant":
      return renderVibrantTemplate(data);
    case "editorial":
      return renderEditorialTemplate(data);
    case "aurora":
      return renderAuroraTemplate(data);
    case "technical":
    default:
      return renderTechnicalTemplate(data);
  }
}
