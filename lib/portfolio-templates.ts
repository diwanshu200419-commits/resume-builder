// lib/portfolio-templates.ts
//
// Vaylo AI — Multi-Design Portfolio Template Engine
// Renders 3 distinct responsive portfolio design directions:
// 1. Minimal / Editorial
// 2. Technical / Terminal
// 3. Executive / Corporate

import { detectDomainFromJD, DomainCategory } from "./domain-intelligence";

export type PortfolioTemplateId = "minimal" | "technical" | "executive";

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  projects: { title: string; description: string; tech: string }[];
  experience: { role: string; company: string; period: string; summary: string }[];
}

export function autoSuggestTemplate(resumeText: string): PortfolioTemplateId {
  const domain = detectDomainFromJD(resumeText);
  if (domain === "Software/IT" || domain === "Data/Analytics") return "technical";
  if (domain === "Product Management" || domain === "Design/UX" || domain === "Marketing/Growth") return "minimal";
  return "executive";
}

// SECURITY: HTML escape helper — must be applied to all user-provided strings
// before interpolating into raw HTML template strings to prevent XSS injection.
function esc(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function generatePortfolioHTML(data: PortfolioData, template: PortfolioTemplateId): string {
  // Precompute escaped top-level fields
  const safeName = esc(data.name);
  const safeTitle = esc(data.title);
  const safeBio = esc(data.bio);

  const skillsPills = data.skills.map((s) => `<span class="skill-pill">${esc(s)}</span>`).join(" ");

  const projectCards = data.projects
    .map(
      (p) => `
    <div class="card">
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.description)}</p>
      <div class="tech-tag">${esc(p.tech)}</div>
    </div>`
    )
    .join("");

  const experienceRows = data.experience
    .map(
      (e) => `
    <div class="exp-item">
      <div class="exp-header">
        <strong>${esc(e.role)}</strong> — <span>${esc(e.company)}</span>
        <span class="exp-period">${esc(e.period)}</span>
      </div>
      <p>${esc(e.summary)}</p>
    </div>`
    )
    .join("");

  if (template === "minimal") {
    // 1. MINIMAL / EDITORIAL DESIGN
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeName} — ${safeTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400&family=Inter:wght@300;400;600&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #0c0a09; color: #e7e5e4; }
    h1, h2, .serif { font-family: 'Playfair Display', serif; }
    .skill-pill { background: #1c1917; border: 1px solid #44403c; color: #d6d3d1; padding: 4px 12px; border-radius: 9999px; font-size: 0.75rem; margin: 2px; display: inline-block; }
    .card { background: #1c1917; border: 1px solid #292524; padding: 24px; border-radius: 16px; transition: all 0.2s; }
    .card:hover { border-color: #78716c; transform: translateY(-2px); }
    .tech-tag { color: #a8a29e; font-size: 0.75rem; margin-top: 12px; }
    .exp-item { border-left: 2px solid #44403c; padding-left: 20px; margin-bottom: 24px; }
    .exp-period { float: right; color: #a8a29e; font-size: 0.8rem; }
  </style>
</head>
<body class="p-6 md:p-16 max-w-4xl mx-auto space-y-16">
  <header class="space-y-4 pt-8">
    <div class="text-xs uppercase tracking-widest text-stone-400 font-semibold">Editorial Portfolio</div>
    <h1 class="text-4xl md:text-6xl font-normal text-stone-100">${safeName}</h1>
    <p class="text-xl text-stone-300 italic serif">${safeTitle}</p>
    <p class="text-sm md:text-base text-stone-400 max-w-2xl leading-relaxed">${safeBio}</p>
  </header>

  <section class="space-y-6">
    <h2 class="text-2xl text-stone-200 border-b border-stone-800 pb-2">Core Competencies</h2>
    <div>${skillsPills}</div>
  </section>

  <section class="space-y-6">
    <h2 class="text-2xl text-stone-200 border-b border-stone-800 pb-2">Featured Impact &amp; Projects</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${projectCards}</div>
  </section>

  <section class="space-y-6">
    <h2 class="text-2xl text-stone-200 border-b border-stone-800 pb-2">Career Journey</h2>
    <div>${experienceRows}</div>
  </section>

  <footer class="text-xs text-stone-500 border-t border-stone-800 pt-8 flex justify-between">
    <span>© ${new Date().getFullYear()} ${safeName}</span>
    <span>Powered by Vaylo AI Portfolio Engine</span>
  </footer>
</body>
</html>`;
  }

  if (template === "technical") {
    // 2. TECHNICAL / TERMINAL DESIGN
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeName} // ${safeTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&family=Inter:wght@400;600&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #030712; color: #f3f4f6; }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .skill-pill { background: #111827; border: 1px solid #1f2937; color: #60a5fa; padding: 4px 10px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; margin: 3px; display: inline-block; }
    .card { background: #0b0f19; border: 1px solid #1f2937; padding: 20px; border-radius: 12px; }
    .card h3 { font-family: 'JetBrains Mono', monospace; color: #93c5fd; font-weight: 600; margin-bottom: 8px; }
    .tech-tag { font-family: 'JetBrains Mono', monospace; color: #34d399; font-size: 0.75rem; margin-top: 10px; }
    .exp-item { background: #0b0f19; border: 1px solid #1f2937; padding: 16px; border-radius: 10px; margin-bottom: 16px; }
    .exp-period { float: right; font-family: 'JetBrains Mono', monospace; color: #9ca3af; font-size: 0.75rem; }
  </style>
</head>
<body class="p-6 md:p-12 max-w-5xl mx-auto space-y-12">
  <header class="space-y-4 border border-blue-950/60 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
    <div class="flex items-center gap-2 text-xs mono text-emerald-400">
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> SYSTEM_ONLINE // TERMINAL PORTFOLIO
    </div>
    <h1 class="text-3xl md:text-5xl font-extrabold text-white mono">&gt; ${safeName}</h1>
    <p class="text-lg text-blue-400 mono">[ ${safeTitle} ]</p>
    <p class="text-sm text-slate-300 max-w-3xl leading-relaxed">${safeBio}</p>
  </header>

  <section class="space-y-4">
    <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider mono">// Stack &amp; Technologies</h2>
    <div>${skillsPills}</div>
  </section>

  <section class="space-y-4">
    <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider mono">// Architectural Projects &amp; Repositories</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${projectCards}</div>
  </section>

  <section class="space-y-4">
    <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider mono">// Work History</h2>
    <div>${experienceRows}</div>
  </section>

  <footer class="text-xs text-slate-500 mono border-t border-slate-900 pt-6 flex justify-between">
    <span>BUILD_VER: 2026.08</span>
    <span>Deployed via Vaylo AI Engine</span>
  </footer>
</body>
</html>`;
  }

  // 3. EXECUTIVE / CORPORATE DESIGN
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeName} — ${safeTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0f172a; color: #f8fafc; }
    .skill-pill { background: #1e293b; border: 1px solid #334155; color: #f1f5f9; padding: 6px 14px; border-radius: 8px; font-weight: 600; font-size: 0.8rem; margin: 3px; display: inline-block; }
    .card { background: #1e293b; border: 1px solid #334155; p: 24px; padding: 24px; border-radius: 16px; }
    .card h3 { font-size: 1.1rem; font-weight: 700; color: #38bdf8; margin-bottom: 8px; }
    .tech-tag { color: #94a3b8; font-size: 0.75rem; font-weight: 600; margin-top: 12px; }
    .exp-item { background: #1e293b; border: 1px solid #334155; padding: 20px; border-radius: 12px; margin-bottom: 16px; }
    .exp-period { float: right; color: #38bdf8; font-weight: 600; font-size: 0.8rem; }
  </style>
</head>
<body class="p-6 md:p-12 max-w-5xl mx-auto space-y-12">
  <header class="p-8 md:p-12 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
    <div class="inline-block bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
      Executive Leadership Profile
    </div>
    <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tight">${safeName}</h1>
    <p class="text-xl font-semibold text-sky-400">${safeTitle}</p>
    <p class="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">${safeBio}</p>
  </header>

  <section class="space-y-4">
    <h2 class="text-xl font-bold text-white border-l-4 border-sky-500 pl-3">Core Competencies &amp; Expertise</h2>
    <div>${skillsPills}</div>
  </section>

  <section class="space-y-4">
    <h2 class="text-xl font-bold text-white border-l-4 border-sky-500 pl-3">Strategic Initiatives &amp; Projects</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${projectCards}</div>
  </section>

  <section class="space-y-4">
    <h2 class="text-xl font-bold text-white border-l-4 border-sky-500 pl-3">Professional Experience</h2>
    <div>${experienceRows}</div>
  </section>

  <footer class="text-xs text-slate-400 border-t border-slate-800 pt-6 flex justify-between">
    <span>© ${new Date().getFullYear()} ${safeName}</span>
    <span>Vaylo Executive Portfolio System</span>
  </footer>
</body>
</html>`;
}
