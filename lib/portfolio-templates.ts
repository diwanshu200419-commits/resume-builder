// lib/portfolio-templates.ts
//
// Vaylo AI — Multi-Design Portfolio Template Engine
// 6 Fully Responsive, Modern, Production-Ready, 100% Self-Contained Themes
// Engineered for 320px Mobile, 768px Tablet, and 1440px+ Desktop Screens
// Features: Project Screenshots, Testimonials, Resume Download Link, SEO Meta & Schema.org JSON-LD

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
  imageUrl?: string;
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

export interface PortfolioTestimonial {
  author: string;
  role: string;
  company?: string;
  quote: string;
  avatarUrl?: string;
}

export interface PortfolioCertification {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  resumeUrl?: string;
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
  testimonials?: PortfolioTestimonial[];
  certifications?: PortfolioCertification[];
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
    return `<div class="avatar-wrap avatar-${style}">
      <img src="${safeUrl}" alt="${safeName}" class="avatar-img" />
    </div>`;
  }

  return `<div class="avatar-wrap avatar-${style} avatar-initials">
    ${initials}
  </div>`;
}

function formatUrl(url: string): string {
  const clean = (url || "").trim();
  if (!clean) return "";
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }
  return `https://${clean}`;
}

function renderSeoHead(data: PortfolioData): string {
  const safeName = escapeHtml(data.name || "Professional");
  const safeTitle = escapeHtml(data.title || "Portfolio");
  const safeBio = escapeHtml(data.bio || `Explore the portfolio and projects of ${data.name}.`);
  const safeAvatar = data.avatarUrl ? escapeHtml(data.avatarUrl) : "https://www.vayloai.online/og-default.png";
  
  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": data.name || "Candidate",
    "jobTitle": data.title || "Professional",
    "description": data.bio || "",
    "email": data.email || undefined,
    "url": data.website || undefined,
    "sameAs": [
      data.github ? formatUrl(data.github) : undefined,
      data.linkedin ? formatUrl(data.linkedin) : undefined,
    ].filter(Boolean),
  }).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

  return `
  <meta name="description" content="${safeBio}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${safeName} — ${safeTitle}">
  <meta property="og:description" content="${safeBio}">
  <meta property="og:image" content="${safeAvatar}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeName} — ${safeTitle}">
  <meta name="twitter:description" content="${safeBio}">
  <script type="application/ld+json">
    ${schemaJson}
  </script>`;
}

// Global Common CSS Reset & Base Helpers
const GLOBAL_RESPONSIVE_CSS = `
  html, body {
    max-width: 100vw;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-size-adjust: 100%;
  }
  *, *::before, *::after {
    box-sizing: border-box;
    min-width: 0;
  }
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
  a {
    word-break: break-word;
  }
  p, h1, h2, h3, h4, h5, h6, span {
    overflow-wrap: break-word;
    word-break: break-word;
  }
  .proj-img-box {
    width: 100%;
    height: 160px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 12px;
    background: #0f172a;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .proj-img-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  .proj-img-box:hover img {
    transform: scale(1.04);
  }
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
    margin-top: 16px;
  }
  .quote-icon {
    font-size: 24px;
    line-height: 1;
    margin-bottom: 8px;
  }
`;

// ---------------------------------------------------------------------------
// 1. TEMPLATE 1: TECHNICAL / NEO-TERMINAL (RESPONSIVE + FULL FEATURES)
// ---------------------------------------------------------------------------
function renderTechnicalTemplate(data: PortfolioData): string {
  const safeName = escapeHtml(data.name || "Developer");
  const safeTitle = escapeHtml(data.title || "Software Engineer");
  const safeBio = escapeHtml(data.bio || "");
  const safeEmail = escapeHtml(data.email || "contact@vayloai.online");
  const safeGithub = data.github ? escapeHtml(data.github) : null;
  const safeLinkedin = data.linkedin ? escapeHtml(data.linkedin) : null;
  const safeResumeUrl = data.resumeUrl ? escapeHtml(formatUrl(data.resumeUrl)) : null;
  const avatarHtml = renderAvatar(data.avatarUrl, data.name, "terminal");

  const statsHtml = (data.stats || [
    { label: "Code Architecture", value: "Production" },
    { label: "Core Competencies", value: `${(data.skills || []).length}+` },
    { label: "Featured Projects", value: `${(data.projects || []).length}` },
  ])
    .map(
      (s) => `
      <div class="stat-card">
        <div class="stat-val">${escapeHtml(s.value)}</div>
        <div class="stat-lbl">${escapeHtml(s.label)}</div>
      </div>`
    )
    .join("");

  const skillsHtml = (data.skills || [])
    .map((s) => `<span class="skill-tag"><span class="tag-dot"></span>${escapeHtml(s)}</span>`)
    .join("");

  const projectsHtml = (data.projects || [])
    .map(
      (p) => `
      <div class="project-card">
        ${p.imageUrl ? `
        <div class="proj-img-box">
          <img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" loading="lazy" />
        </div>` : ""}
        <div class="project-header">
          <h3 class="project-title">${escapeHtml(p.title)}</h3>
          <span class="badge-status">Active</span>
        </div>
        <p class="project-desc">${escapeHtml(p.description)}</p>
        ${p.metrics ? `<div class="project-metric">⚡ ${escapeHtml(p.metrics)}</div>` : ""}
        <div class="project-footer">
          <span class="project-tech">${escapeHtml(p.tech)}</span>
          ${p.link ? `<a href="${escapeHtml(formatUrl(p.link))}" target="_blank" class="link-btn">Launch →</a>` : ""}
        </div>
      </div>`
    )
    .join("");

  const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;
  const expHtml = hasExperience
    ? (data.experience || [])
        .map(
          (e) => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-header">
            <h4 class="timeline-role">${escapeHtml(e.role)} <span class="accent-text">@ ${escapeHtml(e.company)}</span></h4>
            <span class="timeline-period">${escapeHtml(e.period)}</span>
          </div>
          <p class="timeline-desc">${escapeHtml(e.summary)}</p>
        </div>`
        )
        .join("")
    : "";

  const hasTestimonials = Array.isArray(data.testimonials) && data.testimonials.length > 0;
  const testimonialsHtml = hasTestimonials
    ? (data.testimonials || [])
        .map(
          (t) => `
        <div class="testi-card">
          <div class="quote-icon" style="color: #38bdf8;">“</div>
          <p class="testi-quote">${escapeHtml(t.quote)}</p>
          <div class="testi-author">
            <strong>${escapeHtml(t.author)}</strong>
            <span>${escapeHtml(t.role)}${t.company ? ` @ ${escapeHtml(t.company)}` : ""}</span>
          </div>
        </div>`
        )
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${safeName} — ${safeTitle}</title>
  ${renderSeoHead(data)}
  <style>
    ${GLOBAL_RESPONSIVE_CSS}
    body {
      background-color: #030712;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
    }
    .container { max-width: 1000px; margin: 0 auto; padding: clamp(16px, 4vw, 36px) clamp(12px, 3vw, 24px); }
    header.top-nav {
      position: sticky; top: 0; z-index: 50;
      background: rgba(3, 7, 18, 0.9); backdrop-filter: blur(12px);
      border-bottom: 1px solid #1e293b; padding: 12px 16px;
    }
    .nav-inner { max-width: 1000px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .brand-logo { font-family: monospace; font-size: 13px; font-weight: bold; color: #fff; display: flex; align-items: center; gap: 8px; white-space: nowrap; }
    .online-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981; flex-shrink: 0; }
    .nav-links { display: flex; align-items: center; gap: 14px; font-size: 12px; font-family: monospace; color: #94a3b8; flex-wrap: wrap; }
    .nav-links a { color: #94a3b8; text-decoration: none; transition: color 0.2s; }
    .nav-links a:hover { color: #38bdf8; }
    .btn-touch { background: #2563eb; color: #fff !important; padding: 6px 12px; border-radius: 8px; font-weight: 600; text-decoration: none; white-space: nowrap; }
    .btn-cv { background: #0f172a; border: 1px solid #38bdf8; color: #38bdf8 !important; padding: 6px 12px; border-radius: 8px; font-weight: 600; text-decoration: none; white-space: nowrap; }

    /* Hero Card */
    .hero-card {
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(3, 7, 18, 0.98) 100%);
      border: 1px solid #1e3a8a; border-radius: clamp(16px, 3vw, 24px);
      padding: clamp(20px, 4vw, 36px) clamp(16px, 3vw, 28px);
      margin-top: 16px; margin-bottom: 32px; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5);
    }
    .hero-top { display: flex; align-items: center; gap: 20px; margin-bottom: 16px; flex-wrap: wrap; }
    .status-badge { display: inline-flex; align-items: center; gap: 6px; font-family: monospace; font-size: 11px; color: #10b981; margin-bottom: 6px; }
    .hero-title { font-family: monospace; font-size: clamp(24px, 5vw, 36px); font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2; }
    .hero-subtitle { font-family: monospace; font-size: clamp(14px, 3vw, 18px); color: #38bdf8; font-weight: 600; margin-top: 4px; }
    .hero-bio { color: #cbd5e1; font-size: clamp(13px, 2.5vw, 15px); line-height: 1.7; max-width: 800px; margin-top: 14px; }

    /* Avatars */
    .avatar-wrap { width: clamp(70px, 12vw, 90px); height: clamp(70px, 12vw, 90px); border-radius: 18px; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
    .avatar-terminal { border: 2px solid #10b981; background: #0f172a; box-shadow: 0 0 20px rgba(16,185,129,0.3); }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-initials { font-family: monospace; font-weight: bold; font-size: clamp(22px, 4vw, 28px); color: #10b981; background: #0f172a; }

    /* Links Row */
    .social-row { display: flex; align-items: center; gap: 12px; margin-top: 16px; padding-top: 14px; border-top: 1px solid #1e293b; font-family: monospace; font-size: 12px; flex-wrap: wrap; }
    .social-link { color: #38bdf8; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
    .social-link:hover { text-decoration: underline; }

    /* Stats */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-top: 20px; }
    .stat-card { background: rgba(15, 23, 42, 0.8); border: 1px solid #1e3a8a; border-radius: 12px; padding: 12px; text-align: center; }
    .stat-val { font-family: monospace; font-size: clamp(18px, 3.5vw, 22px); font-weight: bold; color: #38bdf8; }
    .stat-lbl { font-family: monospace; font-size: 10px; color: #94a3b8; margin-top: 4px; }

    /* Sections */
    .section-title { font-family: monospace; font-size: clamp(16px, 3vw, 20px); font-weight: bold; color: #ffffff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .section-title span { color: #38bdf8; }
    .section { margin-bottom: 36px; }

    /* Skills */
    .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-tag { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; background: rgba(30, 58, 138, 0.3); border: 1px solid #1e40af; color: #93c5fd; font-family: monospace; font-size: 12px; }
    .tag-dot { width: 6px; height: 6px; border-radius: 50%; background: #38bdf8; }

    /* Projects */
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .project-card { background: rgba(15, 23, 42, 0.75); border: 1px solid #1e293b; border-radius: 16px; padding: clamp(16px, 3vw, 22px); transition: transform 0.2s, border-color 0.2s; display: flex; flex-direction: column; justify-content: space-between; }
    .project-card:hover { border-color: #38bdf8; }
    .project-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
    .project-title { font-family: monospace; font-size: 15px; font-weight: bold; color: #ffffff; }
    .badge-status { font-family: monospace; font-size: 10px; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; background: rgba(16, 185, 129, 0.15); border: 1px solid #059669; color: #34d399; }
    .project-desc { font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 14px; }
    .project-metric { font-family: monospace; font-size: 12px; color: #34d399; margin-bottom: 12px; }
    .project-footer { display: flex; align-items: center; justify-content: space-between; font-size: 11px; font-family: monospace; color: #94a3b8; border-top: 1px solid #1e293b; padding-top: 10px; margin-top: 8px; flex-wrap: wrap; gap: 6px; }
    .project-tech { color: #93c5fd; }
    .link-btn { color: #38bdf8; text-decoration: none; font-weight: bold; }

    /* Timeline */
    .timeline { background: rgba(15, 23, 42, 0.5); border: 1px solid #1e293b; border-radius: 16px; padding: clamp(16px, 3vw, 24px); }
    .timeline-item { position: relative; padding-left: 20px; padding-bottom: 20px; border-left: 2px solid #1e3a8a; }
    .timeline-item:last-child { padding-bottom: 0; }
    .timeline-dot { position: absolute; left: -6px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #3b82f6; border: 2px solid #030712; }
    .timeline-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
    .timeline-role { font-family: monospace; font-size: 14px; font-weight: bold; color: #ffffff; }
    .accent-text { color: #38bdf8; }
    .timeline-period { font-family: monospace; font-size: 11px; background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #1e293b; color: #94a3b8; }
    .timeline-desc { font-size: 13px; color: #cbd5e1; line-height: 1.6; }

    /* Testimonials */
    .testi-card { background: rgba(15, 23, 42, 0.7); border: 1px solid #1e3a8a; border-radius: 16px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; }
    .testi-quote { font-size: 13px; color: #cbd5e1; font-style: italic; line-height: 1.6; margin-bottom: 12px; }
    .testi-author strong { display: block; font-family: monospace; font-size: 13px; color: #fff; }
    .testi-author span { font-size: 11px; color: #94a3b8; }

    /* Contact Box */
    .contact-card { text-align: center; background: #0f172a; border: 1px solid #1e3a8a; border-radius: 20px; padding: clamp(24px, 5vw, 40px) 16px; margin-top: 32px; }
    .contact-card h2 { font-family: monospace; font-size: clamp(18px, 4vw, 24px); color: #fff; margin-bottom: 8px; }
    .contact-card p { color: #94a3b8; font-size: 13px; margin-bottom: 20px; }
    .btn-main { display: inline-flex; align-items: center; gap: 8px; background: #10b981; color: #fff; padding: 10px 24px; border-radius: 10px; font-family: monospace; font-weight: bold; font-size: 13px; text-decoration: none; box-shadow: 0 0 20px rgba(16,185,129,0.3); }

    footer { text-align: center; padding: 24px 0; font-family: monospace; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; margin-top: 32px; }

    @media (max-width: 640px) {
      .hero-top { flex-direction: column; align-items: flex-start; }
      .nav-links { display: none; }
    }
  </style>
</head>
<body>
  <header class="top-nav">
    <div class="nav-inner">
      <div class="brand-logo">
        <span class="online-dot"></span>
        <span>~/${safeName.toLowerCase().replace(/\s+/g, "-")}</span>
      </div>
      <nav class="nav-links">
        <a href="#about">01. About</a>
        <a href="#skills">02. Stack</a>
        <a href="#projects">03. Projects</a>
        ${hasExperience ? '<a href="#experience">04. Timeline</a>' : ''}
        ${hasTestimonials ? '<a href="#testimonials">05. Endorsements</a>' : ''}
        ${safeResumeUrl ? `<a href="${safeResumeUrl}" target="_blank" class="btn-cv">View Resume 📄</a>` : ""}
        <a href="mailto:${safeEmail}" class="btn-touch">Get in Touch</a>
      </nav>
    </div>
  </header>

  <div class="container">
    <section id="about" class="hero-card">
      <div class="hero-top">
        ${avatarHtml}
        <div>
          <div class="status-badge">
            <span class="online-dot"></span> STATUS: OPEN_FOR_ROLES
          </div>
          <h1 class="hero-title">&gt; ${safeName}</h1>
          <div class="hero-subtitle">[ ${safeTitle} ]</div>
        </div>
      </div>
      <p class="hero-bio">${safeBio}</p>
      
      <div class="social-row">
        ${safeGithub ? `<span>GitHub: <a href="${escapeHtml(formatUrl(safeGithub))}" target="_blank" class="social-link">${safeGithub} →</a></span>` : ""}
        ${safeLinkedin ? `<span>LinkedIn: <a href="${escapeHtml(formatUrl(safeLinkedin))}" target="_blank" class="social-link">${safeLinkedin} →</a></span>` : ""}
        ${safeResumeUrl ? `<span>CV: <a href="${safeResumeUrl}" target="_blank" class="social-link">Download PDF ↗</a></span>` : ""}
        <span>Email: <a href="mailto:${safeEmail}" class="social-link">${safeEmail}</a></span>
      </div>

      <div class="stats-grid">
        ${statsHtml}
      </div>
    </section>

    <section id="skills" class="section">
      <h2 class="section-title"><span>// 02.</span> Core Competencies &amp; Stack</h2>
      <div class="skills-grid">${skillsHtml}</div>
    </section>

    <section id="projects" class="section">
      <h2 class="section-title"><span>// 03.</span> Featured Systems &amp; Projects</h2>
      <div class="projects-grid">${projectsHtml}</div>
    </section>

    ${hasExperience ? `
    <section id="experience" class="section">
      <h2 class="section-title"><span>// 04.</span> Engineering Career Timeline</h2>
      <div class="timeline">${expHtml}</div>
    </section>` : ''}

    ${hasTestimonials ? `
    <section id="testimonials" class="section">
      <h2 class="section-title"><span>// 05.</span> Peer Recommendations &amp; Impact</h2>
      <div class="testimonials-grid">${testimonialsHtml}</div>
    </section>` : ''}

    <section class="contact-card">
      <h2>Let&#39;s Build Scalable Systems</h2>
      <p>Available for engineering roles, technical architecture, and consulting.</p>
      <a href="mailto:${safeEmail}" class="btn-main">Initiate Contact &gt;</a>
    </section>

    <footer>
      © ${new Date().getFullYear()} ${safeName}. Built with Vaylo AI Studio.
    </footer>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// 2. TEMPLATE 2: MINIMAL / BENTO STUDIO (RESPONSIVE + FULL FEATURES)
// ---------------------------------------------------------------------------
function renderMinimalTemplate(data: PortfolioData): string {
  const safeName = escapeHtml(data.name || "Designer");
  const safeTitle = escapeHtml(data.title || "Product Designer & Strategist");
  const safeBio = escapeHtml(data.bio || "");
  const safeEmail = escapeHtml(data.email || "contact@vayloai.online");
  const safeLinkedin = data.linkedin ? escapeHtml(data.linkedin) : null;
  const safeResumeUrl = data.resumeUrl ? escapeHtml(formatUrl(data.resumeUrl)) : null;
  const avatarHtml = renderAvatar(data.avatarUrl, data.name, "bento");

  const skillsHtml = (data.skills || [])
    .map((s) => `<span class="bento-pill">${escapeHtml(s)}</span>`)
    .join("");

  const projectsHtml = (data.projects || [])
    .map(
      (p) => `
      <div class="bento-card">
        ${p.imageUrl ? `
        <div class="proj-img-box" style="background: #f1f5f9; border-color: #e2e8f0;">
          <img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" loading="lazy" />
        </div>` : ""}
        <div class="card-tag">Case Study</div>
        <h3 class="card-title">${escapeHtml(p.title)}</h3>
        <p class="card-desc">${escapeHtml(p.description)}</p>
        ${p.metrics ? `<div class="card-metric">✦ ${escapeHtml(p.metrics)}</div>` : ""}
        <div class="card-footer">
          <span>${escapeHtml(p.tech)}</span>
          ${p.link ? `<a href="${escapeHtml(formatUrl(p.link))}" target="_blank">View ↗</a>` : ""}
        </div>
      </div>`
    )
    .join("");

  const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;
  const expHtml = hasExperience
    ? (data.experience || [])
        .map(
          (e) => `
        <div class="exp-row">
          <div>
            <div class="exp-role">${escapeHtml(e.role)}</div>
            <div class="exp-company">${escapeHtml(e.company)}</div>
            <p class="exp-desc">${escapeHtml(e.summary)}</p>
          </div>
          <div class="exp-period">${escapeHtml(e.period)}</div>
        </div>`
        )
        .join("")
    : "";

  const hasTestimonials = Array.isArray(data.testimonials) && data.testimonials.length > 0;
  const testimonialsHtml = hasTestimonials
    ? (data.testimonials || [])
        .map(
          (t) => `
        <div class="bento-card" style="background: #f8fafc;">
          <div class="quote-icon" style="color: #4f46e5;">“</div>
          <p style="font-size: 13px; color: #475569; font-style: italic; line-height: 1.6; margin-bottom: 10px;">${escapeHtml(t.quote)}</p>
          <div style="font-size: 12px; font-weight: 700; color: #0f172a;">${escapeHtml(t.author)}</div>
          <div style="font-size: 11px; color: #64748b;">${escapeHtml(t.role)}${t.company ? ` · ${escapeHtml(t.company)}` : ""}</div>
        </div>`
        )
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${safeName} — Portfolio</title>
  ${renderSeoHead(data)}
  <style>
    ${GLOBAL_RESPONSIVE_CSS}
    body {
      background-color: #f8fafc; color: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', Roboto, sans-serif;
      line-height: 1.6;
    }
    .container { max-width: 960px; margin: 0 auto; padding: clamp(16px, 4vw, 36px) clamp(12px, 3vw, 24px); }
    
    /* Bento Hero Grid */
    .hero-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 20px; }
    .bento-hero {
      background: #ffffff; border: 1px solid #e2e8f0; border-radius: clamp(18px, 3vw, 28px);
      padding: clamp(20px, 4vw, 36px) clamp(16px, 3vw, 32px); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.04);
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .hero-header { display: flex; align-items: center; gap: 16px; margin-bottom: 14px; flex-wrap: wrap; }
    .bento-side {
      background: #4f46e5; color: #ffffff; border-radius: clamp(18px, 3vw, 28px);
      padding: clamp(20px, 4vw, 36px) clamp(16px, 3vw, 28px); display: flex; flex-direction: column; justify-content: space-between;
      box-shadow: 0 15px 35px -10px rgba(79, 70, 229, 0.4);
    }
    .badge-soft {
      display: inline-block; padding: 4px 10px; border-radius: 9999px;
      background: #f1f5f9; color: #475569; font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;
    }
    .name-h1 { font-size: clamp(24px, 5vw, 32px); font-weight: 800; color: #0f172a; line-height: 1.2; }
    .role-p { font-size: clamp(14px, 3vw, 16px); font-weight: 600; color: #4f46e5; margin-top: 2px; }
    .bio-p { color: #475569; font-size: clamp(13px, 2.5vw, 14px); line-height: 1.7; margin-top: 10px; }
    .btn-say-hello {
      display: inline-flex; align-items: center; gap: 6px; background: #0f172a;
      color: #fff; padding: 10px 20px; border-radius: 9999px; font-size: 12px;
      font-weight: 700; text-decoration: none; margin-top: 16px; width: fit-content;
    }
    .btn-bento-cv {
      display: inline-flex; align-items: center; gap: 6px; background: #e0e7ff;
      color: #4338ca; padding: 10px 20px; border-radius: 9999px; font-size: 12px;
      font-weight: 700; text-decoration: none; margin-top: 16px; width: fit-content;
    }

    /* Avatars */
    .avatar-wrap { width: clamp(68px, 12vw, 84px); height: clamp(68px, 12vw, 84px); border-radius: 20px; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
    .avatar-bento { border: 3px solid #e0e7ff; background: #f1f5f9; }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-initials { font-weight: 800; font-size: clamp(20px, 4vw, 26px); color: #ffffff; background: #4f46e5; }

    /* Bento Boxes */
    .bento-box {
      background: #ffffff; border: 1px solid #e2e8f0; border-radius: clamp(16px, 3vw, 24px);
      padding: clamp(16px, 3vw, 28px); margin-bottom: 20px; box-shadow: 0 4px 20px -5px rgba(0,0,0,0.03);
    }
    .box-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 12px; }
    .pills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
    .bento-pill { background: #f1f5f9; border: 1px solid #e2e8f0; color: #1e293b; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }

    /* Projects Grid */
    .sec-h2 { font-size: clamp(16px, 3vw, 20px); font-weight: 800; color: #0f172a; margin-bottom: 14px; }
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .bento-card {
      background: #ffffff; border: 1px solid #e2e8f0; border-radius: clamp(16px, 3vw, 24px);
      padding: clamp(16px, 3vw, 24px); box-shadow: 0 4px 15px -3px rgba(0,0,0,0.03);
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .card-tag { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #4f46e5; background: #eef2ff; padding: 3px 8px; border-radius: 9999px; width: fit-content; margin-bottom: 8px; }
    .card-title { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
    .card-desc { font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 12px; }
    .card-metric { font-size: 11px; font-weight: 700; color: #059669; background: #ecfdf5; padding: 4px 8px; border-radius: 6px; width: fit-content; margin-bottom: 10px; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8; font-weight: 600; border-top: 1px solid #f1f5f9; padding-top: 10px; flex-wrap: wrap; gap: 6px; }
    .card-footer a { color: #4f46e5; text-decoration: none; font-weight: 700; }

    /* Experience */
    .exp-row { display: flex; justify-content: space-between; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f1f5f9; flex-wrap: wrap; }
    .exp-row:last-child { border-bottom: none; }
    .exp-role { font-size: 14px; font-weight: 700; color: #0f172a; }
    .exp-company { font-size: 12px; font-weight: 600; color: #4f46e5; margin-top: 2px; }
    .exp-desc { font-size: 13px; color: #64748b; margin-top: 4px; }
    .exp-period { font-size: 11px; color: #94a3b8; font-weight: 500; }

    footer { text-align: center; padding: 20px 0; font-size: 11px; color: #94a3b8; }

    @media (max-width: 768px) {
      .hero-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero-grid">
      <div class="bento-hero">
        <div>
          <div class="hero-header">
            ${avatarHtml}
            <div>
              <span class="badge-soft">Portfolio</span>
              <h1 class="name-h1">${safeName}</h1>
              <div class="role-p">${safeTitle}</div>
            </div>
          </div>
          <p class="bio-p">${safeBio}</p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-top: 14px;">
          <a href="mailto:${safeEmail}" class="btn-say-hello">Say Hello ↗</a>
          ${safeResumeUrl ? `<a href="${safeResumeUrl}" target="_blank" class="btn-bento-cv">Resume 📄</a>` : ""}
          ${safeLinkedin ? `<a href="${escapeHtml(formatUrl(safeLinkedin))}" target="_blank" style="font-size: 12px; font-weight: 700; color: #4f46e5; text-decoration: none; padding: 10px 0;">LinkedIn ↗</a>` : ""}
        </div>
      </div>

      <div class="bento-side">
        <div>
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #c7d2fe;">Design Focus</div>
          <h3 style="font-size: clamp(16px, 3.5vw, 20px); font-weight: 800; margin-top: 8px; line-height: 1.4;">Crafting intuitive user-first experiences.</h3>
        </div>
        <div style="margin-top: 16px;">
          <div style="font-size: clamp(24px, 5vw, 32px); font-weight: 800;">${(data.skills || []).length}+</div>
          <div style="font-size: 11px; color: #c7d2fe;">Core capabilities &amp; toolsets</div>
        </div>
      </div>
    </div>

    <div class="bento-box">
      <div class="box-title">Toolkit &amp; Methodologies</div>
      <div class="pills-wrap">${skillsHtml}</div>
    </div>

    <h2 class="sec-h2">Featured Work &amp; Case Studies</h2>
    <div class="projects-grid">${projectsHtml}</div>

    ${hasExperience ? `
    <div class="bento-box">
      <div class="box-title">Professional Journey</div>
      <div>${expHtml}</div>
    </div>` : ''}

    ${hasTestimonials ? `
    <h2 class="sec-h2">Endorsements &amp; Recommendations</h2>
    <div class="projects-grid">${testimonialsHtml}</div>` : ''}

    <footer>
      © ${new Date().getFullYear()} ${safeName}. Built with Vaylo AI Studio.
    </footer>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// 3. TEMPLATE 3: EXECUTIVE / MODERN GLASS (RESPONSIVE + FULL FEATURES)
// ---------------------------------------------------------------------------
function renderExecutiveTemplate(data: PortfolioData): string {
  const safeName = escapeHtml(data.name || "Leader");
  const safeTitle = escapeHtml(data.title || "Executive Director & Strategist");
  const safeBio = escapeHtml(data.bio || "");
  const safeEmail = escapeHtml(data.email || "executive@example.com");
  const safeLinkedin = data.linkedin ? escapeHtml(data.linkedin) : null;
  const safeResumeUrl = data.resumeUrl ? escapeHtml(formatUrl(data.resumeUrl)) : null;
  const avatarHtml = renderAvatar(data.avatarUrl, data.name, "glass");

  const statsHtml = (data.stats || [
    { label: "Strategic Focus", value: "Executive" },
    { label: "Core Competencies", value: `${(data.skills || []).length}+` },
    { label: "Key Initiatives", value: `${(data.projects || []).length}` },
  ])
    .map(
      (s) => `
      <div class="exec-stat-card">
        <div class="exec-stat-val">${escapeHtml(s.value)}</div>
        <div class="exec-stat-lbl">${escapeHtml(s.label)}</div>
      </div>`
    )
    .join("");

  const skillsHtml = (data.skills || [])
    .map((s) => `<span class="exec-skill">${escapeHtml(s)}</span>`)
    .join("");

  const projectsHtml = (data.projects || [])
    .map(
      (p) => `
      <div class="exec-card">
        ${p.imageUrl ? `
        <div class="proj-img-box" style="background: #0f172a; border-color: #334155;">
          <img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" loading="lazy" />
        </div>` : ""}
        <div class="exec-card-head">
          <h3 class="exec-card-title">${escapeHtml(p.title)}</h3>
          <span class="exec-tag">Initiative</span>
        </div>
        <p class="exec-card-desc">${escapeHtml(p.description)}</p>
        ${p.metrics ? `<div class="exec-metric">⚡ Impact: ${escapeHtml(p.metrics)}</div>` : ""}
        <div class="exec-card-foot">Focus: ${escapeHtml(p.tech)}</div>
      </div>`
    )
    .join("");

  const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;
  const expHtml = hasExperience
    ? (data.experience || [])
        .map(
          (e) => `
        <div class="exec-timeline-row">
          <div class="exec-time-head">
            <h4 class="exec-time-role">${escapeHtml(e.role)} · <span style="color: #38bdf8;">${escapeHtml(e.company)}</span></h4>
            <span class="exec-time-period">${escapeHtml(e.period)}</span>
          </div>
          <p class="exec-time-desc">${escapeHtml(e.summary)}</p>
        </div>`
        )
        .join("")
    : "";

  const hasTestimonials = Array.isArray(data.testimonials) && data.testimonials.length > 0;
  const testimonialsHtml = hasTestimonials
    ? (data.testimonials || [])
        .map(
          (t) => `
        <div class="exec-card">
          <div class="quote-icon" style="color: #38bdf8;">“</div>
          <p style="font-size: 13px; color: #cbd5e1; font-style: italic; line-height: 1.6; margin-bottom: 10px;">${escapeHtml(t.quote)}</p>
          <div style="font-size: 13px; font-weight: 700; color: #fff;">${escapeHtml(t.author)}</div>
          <div style="font-size: 11px; color: #94a3b8;">${escapeHtml(t.role)}${t.company ? ` · ${escapeHtml(t.company)}` : ""}</div>
        </div>`
        )
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${safeName} — Executive Brief</title>
  ${renderSeoHead(data)}
  <style>
    ${GLOBAL_RESPONSIVE_CSS}
    body {
      background-color: #0b1120; color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif;
      line-height: 1.6;
    }
    .container { max-width: 980px; margin: 0 auto; padding: clamp(16px, 4vw, 40px) clamp(12px, 3vw, 24px); }
    
    .exec-hero {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%);
      border: 1px solid rgba(56, 189, 248, 0.25); border-radius: clamp(18px, 3vw, 28px);
      padding: clamp(20px, 4vw, 40px) clamp(16px, 3vw, 36px); box-shadow: 0 20px 45px -10px rgba(0,0,0,0.6);
      margin-bottom: 32px; backdrop-filter: blur(12px);
    }
    .hero-top { display: flex; align-items: center; gap: 20px; margin-bottom: 16px; flex-wrap: wrap; }
    .exec-badge {
      display: inline-block; padding: 4px 10px; border-radius: 9999px;
      background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3);
      color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;
    }
    .exec-name { font-size: clamp(24px, 5vw, 36px); font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2; }
    .exec-title { font-size: clamp(14px, 3vw, 18px); font-weight: 600; color: #94a3b8; margin-top: 2px; }
    .exec-bio { color: #cbd5e1; font-size: clamp(13px, 2.5vw, 15px); line-height: 1.7; max-width: 820px; margin-top: 12px; }

    /* Avatars */
    .avatar-wrap { width: clamp(70px, 12vw, 88px); height: clamp(70px, 12vw, 88px); border-radius: 20px; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
    .avatar-glass { border: 2px solid #334155; background: #1e293b; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-initials { font-weight: 800; font-size: clamp(22px, 4vw, 26px); color: #38bdf8; background: #1e293b; }

    /* Exec Stats */
    .exec-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #334155; }
    .exec-stat-card { background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 12px; padding: 12px; text-align: center; }
    .exec-stat-val { font-size: clamp(18px, 3.5vw, 24px); font-weight: 800; color: #38bdf8; }
    .exec-stat-lbl { font-size: 10px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-top: 4px; }

    /* Sections */
    .sec-h2 { font-size: clamp(16px, 3vw, 20px); font-weight: 700; color: #ffffff; margin-bottom: 14px; border-left: 4px solid #38bdf8; padding-left: 10px; }
    .section { margin-bottom: 32px; }
    
    .exec-skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
    .exec-skill { background: rgba(30, 41, 59, 0.8); border: 1px solid #334155; color: #cbd5e1; padding: 6px 14px; border-radius: 10px; font-size: 12px; font-weight: 600; }

    /* Cards */
    .exec-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .exec-card {
      background: rgba(15, 23, 42, 0.75); border: 1px solid #334155; border-radius: 18px;
      padding: clamp(16px, 3vw, 22px); box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    .exec-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px; }
    .exec-card-title { font-size: 15px; font-weight: 700; color: #ffffff; }
    .exec-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #38bdf8; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); padding: 3px 8px; border-radius: 9999px; }
    .exec-card-desc { font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 10px; }
    .exec-metric { font-size: 11px; font-weight: 700; color: #34d399; background: rgba(16, 185, 129, 0.1); padding: 5px 10px; border-radius: 6px; width: fit-content; margin-bottom: 10px; }
    .exec-card-foot { font-size: 11px; color: #64748b; font-weight: 500; border-top: 1px solid #1e293b; padding-top: 8px; }

    /* Timeline */
    .exec-timeline { background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 20px; padding: clamp(16px, 3vw, 24px); }
    .exec-timeline-row { padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid #1e293b; }
    .exec-timeline-row:last-child { padding-bottom: 0; margin-bottom: 0; border-bottom: none; }
    .exec-time-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 6px; margin-bottom: 4px; }
    .exec-time-role { font-size: 15px; font-weight: 700; color: #ffffff; }
    .exec-time-period { font-size: 11px; font-weight: 600; color: #38bdf8; }
    .exec-time-desc { font-size: 13px; color: #94a3b8; line-height: 1.6; }

    /* CTA Box */
    .exec-cta { text-align: center; background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 20px; padding: clamp(24px, 4vw, 36px) 16px; }
    .exec-cta h3 { font-size: clamp(18px, 4vw, 22px); font-weight: 700; color: #fff; margin-bottom: 8px; }
    .exec-cta p { font-size: 13px; color: #94a3b8; margin-bottom: 18px; }
    .btn-exec { display: inline-block; background: #0284c7; color: #fff; padding: 10px 24px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none; margin-right: 8px; }
    .btn-exec-cv { display: inline-block; background: #1e293b; border: 1px solid #38bdf8; color: #38bdf8; padding: 10px 24px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none; }

    footer { text-align: center; padding: 20px 0; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="exec-hero">
      <div class="hero-top">
        ${avatarHtml}
        <div>
          <span class="exec-badge">Executive Profile</span>
          <h1 class="exec-name">${safeName}</h1>
          <div class="exec-title">${safeTitle}</div>
        </div>
      </div>
      <p class="exec-bio">${safeBio}</p>
      
      <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap; margin-top: 14px; font-size: 12px; color: #94a3b8;">
        ${safeLinkedin ? `<span>LinkedIn: <a href="${escapeHtml(formatUrl(safeLinkedin))}" target="_blank" style="color: #38bdf8; text-decoration: underline;">${safeLinkedin} ↗</a></span>` : ""}
        ${safeResumeUrl ? `<span>Curriculum Vitae: <a href="${safeResumeUrl}" target="_blank" style="color: #38bdf8; text-decoration: underline;">Executive PDF ↗</a></span>` : ""}
      </div>

      <div class="exec-stats-grid">${statsHtml}</div>
    </div>

    <section class="section">
      <h2 class="sec-h2">Core Competencies &amp; Governance</h2>
      <div class="exec-skills-wrap">${skillsHtml}</div>
    </section>

    <section class="section">
      <h2 class="sec-h2">Strategic Initiatives &amp; Impact</h2>
      <div class="exec-grid">${projectsHtml}</div>
    </section>

    ${hasExperience ? `
    <section class="section">
      <h2 class="sec-h2">Leadership History</h2>
      <div class="exec-timeline">${expHtml}</div>
    </section>` : ''}

    ${hasTestimonials ? `
    <section class="section">
      <h2 class="sec-h2">Executive Endorsements</h2>
      <div class="exec-grid">${testimonialsHtml}</div>
    </section>` : ''}

    <div class="exec-cta">
      <h3>Direct Advisory &amp; Leadership Inquiries</h3>
      <p>Confidential discussions for executive roles, board advisory, and consulting.</p>
      <a href="mailto:${safeEmail}" class="btn-exec">Contact Executive</a>
      ${safeResumeUrl ? `<a href="${safeResumeUrl}" target="_blank" class="btn-exec-cv">Download CV PDF</a>` : ""}
    </div>

    <footer>
      © ${new Date().getFullYear()} ${safeName}. Built with Vaylo AI Studio.
    </footer>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// 4. TEMPLATE 4: VIBRANT / GRADIENT SAAS (RESPONSIVE + FULL FEATURES)
// ---------------------------------------------------------------------------
function renderVibrantTemplate(data: PortfolioData): string {
  const safeName = escapeHtml(data.name || "Creator");
  const safeTitle = escapeHtml(data.title || "Growth Marketer & Builder");
  const safeBio = escapeHtml(data.bio || "");
  const safeEmail = escapeHtml(data.email || "contact@vayloai.online");
  const safeLinkedin = data.linkedin ? escapeHtml(data.linkedin) : null;
  const safeResumeUrl = data.resumeUrl ? escapeHtml(formatUrl(data.resumeUrl)) : null;
  const avatarHtml = renderAvatar(data.avatarUrl, data.name, "gradient");

  const statsHtml = (data.stats || [
    { label: "Growth Focus", value: "Metrics" },
    { label: "Campaign Strategies", value: `${(data.projects || []).length}` },
    { label: "Growth Capabilities", value: `${(data.skills || []).length}+` },
  ])
    .map(
      (s) => `
      <div class="vib-stat-card">
        <div class="vib-stat-val">${escapeHtml(s.value)}</div>
        <div class="vib-stat-lbl">${escapeHtml(s.label)}</div>
      </div>`
    )
    .join("");

  const skillsHtml = (data.skills || [])
    .map((s) => `<span class="vib-skill">✨ ${escapeHtml(s)}</span>`)
    .join("");

  const projectsHtml = (data.projects || [])
    .map(
      (p) => `
      <div class="vib-card">
        ${p.imageUrl ? `
        <div class="proj-img-box" style="background: #180d2e; border-color: #4c1d95;">
          <img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" loading="lazy" />
        </div>` : ""}
        <div class="vib-tag">Campaign</div>
        <h3 class="vib-card-title">${escapeHtml(p.title)}</h3>
        <p class="vib-card-desc">${escapeHtml(p.description)}</p>
        ${p.metrics ? `<div class="vib-metric">🚀 Impact: ${escapeHtml(p.metrics)}</div>` : ""}
        <div class="vib-card-foot">Channels: ${escapeHtml(p.tech)}</div>
      </div>`
    )
    .join("");

  const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;
  const expHtml = hasExperience
    ? (data.experience || [])
        .map(
          (e) => `
        <div class="vib-exp-card">
          <div class="vib-exp-head">
            <h4 class="vib-exp-role">${escapeHtml(e.role)}</h4>
            <span class="vib-exp-period">${escapeHtml(e.period)}</span>
          </div>
          <div class="vib-exp-comp">${escapeHtml(e.company)}</div>
          <p class="vib-exp-desc">${escapeHtml(e.summary)}</p>
        </div>`
        )
        .join("")
    : "";

  const hasTestimonials = Array.isArray(data.testimonials) && data.testimonials.length > 0;
  const testimonialsHtml = hasTestimonials
    ? (data.testimonials || [])
        .map(
          (t) => `
        <div class="vib-card">
          <div class="quote-icon" style="color: #f472b6;">“</div>
          <p style="font-size: 13px; color: #e9d5ff; font-style: italic; line-height: 1.6; margin-bottom: 10px;">${escapeHtml(t.quote)}</p>
          <div style="font-size: 13px; font-weight: 700; color: #fff;">${escapeHtml(t.author)}</div>
          <div style="font-size: 11px; color: #c084fc;">${escapeHtml(t.role)}${t.company ? ` · ${escapeHtml(t.company)}` : ""}</div>
        </div>`
        )
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${safeName} — Growth &amp; Strategy</title>
  ${renderSeoHead(data)}
  <style>
    ${GLOBAL_RESPONSIVE_CSS}
    body {
      background-color: #070714; color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
    }
    .container { max-width: 960px; margin: 0 auto; padding: clamp(16px, 4vw, 40px) clamp(12px, 3vw, 24px); }

    .vib-hero {
      background: linear-gradient(135deg, #180d2e 0%, #0c071e 100%);
      border: 1px solid #4c1d95; border-radius: clamp(18px, 3vw, 28px);
      padding: clamp(20px, 4vw, 40px) clamp(16px, 3vw, 36px); box-shadow: 0 20px 50px -10px rgba(139, 92, 246, 0.25);
      margin-bottom: 32px;
    }
    .hero-top { display: flex; align-items: center; gap: 20px; margin-bottom: 16px; flex-wrap: wrap; }
    .vib-badge {
      display: inline-block; padding: 4px 10px; border-radius: 9999px;
      background: rgba(236, 72, 153, 0.15); border: 1px solid rgba(236, 72, 153, 0.4);
      color: #f472b6; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;
    }
    .vib-name { font-size: clamp(24px, 5vw, 36px); font-weight: 800; color: #ffffff; background: linear-gradient(90deg, #fff 0%, #f472b6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.2; }
    .vib-title { font-size: clamp(14px, 3vw, 18px); font-weight: 700; color: #c084fc; margin-top: 2px; }
    .vib-bio { color: #cbd5e1; font-size: clamp(13px, 2.5vw, 15px); line-height: 1.7; max-width: 800px; margin-top: 12px; }

    /* Avatars */
    .avatar-wrap { width: clamp(70px, 12vw, 88px); height: clamp(70px, 12vw, 88px); border-radius: 50%; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; padding: 3px; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
    .avatar-initials { font-weight: 800; font-size: clamp(22px, 4vw, 26px); color: #f472b6; background: #0c071e; width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

    /* Stats */
    .vib-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #2e1065; }
    .vib-stat-card { background: rgba(30, 15, 60, 0.6); border: 1px solid #4c1d95; border-radius: 14px; padding: 12px; text-align: center; }
    .vib-stat-val { font-size: clamp(18px, 3.5vw, 24px); font-weight: 800; color: #f472b6; }
    .vib-stat-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #c084fc; margin-top: 4px; }

    /* Sections */
    .sec-h2 { font-size: clamp(16px, 3vw, 20px); font-weight: 800; color: #ffffff; margin-bottom: 14px; }
    .section { margin-bottom: 32px; }
    
    .vib-skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
    .vib-skill { background: linear-gradient(90deg, #2e1065 0%, #1e1b4b 100%); border: 1px solid #4c1d95; color: #e9d5ff; padding: 6px 14px; border-radius: 10px; font-size: 12px; font-weight: 700; }

    /* Cards */
    .vib-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .vib-card {
      background: #0f0b24; border: 1px solid #2e1065; border-radius: 18px;
      padding: clamp(16px, 3vw, 22px); transition: border-color 0.2s;
    }
    .vib-card:hover { border-color: #ec4899; }
    .vib-tag { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #f472b6; background: rgba(236, 72, 153, 0.15); padding: 3px 8px; border-radius: 9999px; width: fit-content; margin-bottom: 8px; }
    .vib-card-title { font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 6px; }
    .vib-card-desc { font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 10px; }
    .vib-metric { font-size: 11px; font-weight: 700; color: #34d399; background: rgba(16, 185, 129, 0.15); padding: 5px 10px; border-radius: 6px; width: fit-content; margin-bottom: 10px; }
    .vib-card-foot { font-size: 11px; color: #a855f7; font-weight: 600; border-top: 1px solid #1f1640; padding-top: 8px; }

    /* Experience */
    .vib-exp-card { background: rgba(30, 15, 60, 0.3); border: 1px solid #2e1065; border-radius: 14px; padding: 16px; margin-bottom: 10px; }
    .vib-exp-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 6px; }
    .vib-exp-role { font-size: 15px; font-weight: 700; color: #ffffff; }
    .vib-exp-period { font-size: 11px; font-weight: 700; color: #f472b6; }
    .vib-exp-comp { font-size: 12px; font-weight: 700; color: #c084fc; margin-top: 2px; }
    .vib-exp-desc { font-size: 13px; color: #cbd5e1; margin-top: 4px; }

    /* CTA */
    .vib-cta { text-align: center; background: linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%); border: 1px solid #4c1d95; border-radius: 20px; padding: clamp(24px, 5vw, 36px) 16px; }
    .vib-cta h3 { font-size: clamp(18px, 4vw, 22px); font-weight: 800; color: #fff; margin-bottom: 8px; }
    .vib-cta p { font-size: 13px; color: #d8b4fe; margin-bottom: 18px; }
    .btn-vib { display: inline-block; background: linear-gradient(90deg, #9333ea 0%, #db2777 100%); color: #fff; padding: 10px 24px; border-radius: 9999px; font-size: 13px; font-weight: 800; text-decoration: none; }

    footer { text-align: center; padding: 20px 0; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="vib-hero">
      <div class="hero-top">
        ${avatarHtml}
        <div>
          <span class="vib-badge">Growth Architect</span>
          <h1 class="vib-name">${safeName}</h1>
          <div class="vib-title">${safeTitle}</div>
        </div>
      </div>
      <p class="vib-bio">${safeBio}</p>
      <div class="vib-stats-grid">${statsHtml}</div>
    </div>

    <section class="section">
      <h2 class="sec-h2">Growth Stack &amp; Channels</h2>
      <div class="vib-skills-wrap">${skillsHtml}</div>
    </section>

    <section class="section">
      <h2 class="sec-h2">Campaign Case Studies</h2>
      <div class="vib-grid">${projectsHtml}</div>
    </section>

    ${hasExperience ? `
    <section class="section">
      <h2 class="sec-h2">Growth Track Record</h2>
      <div>${expHtml}</div>
    </section>` : ''}

    ${hasTestimonials ? `
    <section class="section">
      <h2 class="sec-h2">Testimonials &amp; Growth Impact</h2>
      <div class="vib-grid">${testimonialsHtml}</div>
    </section>` : ''}

    <div class="vib-cta">
      <h3>Ready to accelerate your next milestone?</h3>
      <p>Open for growth marketing leadership, consulting, and ambitious collaborations.</p>
      <a href="mailto:${safeEmail}" class="btn-vib">Let&#39;s Talk Growth 🚀</a>
    </div>

    <footer>
      © ${new Date().getFullYear()} ${safeName}. Built with Vaylo AI Studio.
    </footer>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// 5. TEMPLATE 5: EDITORIAL / WARM SERIF (RESPONSIVE + FULL FEATURES)
// ---------------------------------------------------------------------------
function renderEditorialTemplate(data: PortfolioData): string {
  const safeName = escapeHtml(data.name || "Scholar");
  const safeTitle = escapeHtml(data.title || "Writer, Researcher & Academic");
  const safeBio = escapeHtml(data.bio || "");
  const safeEmail = escapeHtml(data.email || "contact@vayloai.online");
  const safeResumeUrl = data.resumeUrl ? escapeHtml(formatUrl(data.resumeUrl)) : null;
  const avatarHtml = renderAvatar(data.avatarUrl, data.name, "serif");

  const skillsHtml = (data.skills || [])
    .map((s) => `<span class="edit-skill">${escapeHtml(s)}</span>`)
    .join("");

  const projectsHtml = (data.projects || [])
    .map(
      (p) => `
      <article class="edit-card">
        ${p.imageUrl ? `
        <div class="proj-img-box" style="background: #f5f5f4; border-color: #e7e5e4;">
          <img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" loading="lazy" />
        </div>` : ""}
        <div class="edit-tag">${escapeHtml(p.tech)}</div>
        <h3 class="edit-card-title">${escapeHtml(p.title)}</h3>
        <p class="edit-card-desc">${escapeHtml(p.description)}</p>
        ${p.link ? `<div style="margin-top: 10px;"><a href="${escapeHtml(formatUrl(p.link))}" target="_blank" class="edit-link">Read Publication ↗</a></div>` : ""}
      </article>`
    )
    .join("");

  const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;
  const expHtml = hasExperience
    ? (data.experience || [])
        .map(
          (e) => `
        <div class="edit-time-row">
          <div class="edit-time-head">
            <h4 class="edit-time-role">${escapeHtml(e.role)} — <span style="font-style: italic; font-weight: normal; color: #44403c;">${escapeHtml(e.company)}</span></h4>
            <span class="edit-time-period">${escapeHtml(e.period)}</span>
          </div>
          <p class="edit-time-desc">${escapeHtml(e.summary)}</p>
        </div>`
        )
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${safeName} — Selected Works</title>
  ${renderSeoHead(data)}
  <style>
    ${GLOBAL_RESPONSIVE_CSS}
    body {
      background-color: #faf8f5; color: #1c1917;
      font-family: Georgia, 'Times New Roman', serif;
      line-height: 1.7;
    }
    .container { max-width: 800px; margin: 0 auto; padding: clamp(20px, 5vw, 48px) clamp(14px, 3vw, 24px); }

    header.edit-head { border-bottom: 2px solid #e7e5e4; padding-bottom: 24px; margin-bottom: 30px; }
    .hero-top { display: flex; align-items: center; gap: 20px; margin-bottom: 14px; flex-wrap: wrap; }
    .cv-badge { font-family: -apple-system, sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #92400e; }
    .edit-name { font-size: clamp(26px, 5vw, 38px); font-weight: normal; color: #0c0a09; line-height: 1.2; }
    .edit-title { font-size: clamp(14px, 3vw, 18px); font-style: italic; color: #57534e; margin-top: 4px; }
    .edit-bio { font-size: clamp(14px, 2.5vw, 16px); color: #292524; line-height: 1.8; margin-top: 12px; }

    /* Avatars */
    .avatar-wrap { width: clamp(68px, 12vw, 84px); height: clamp(68px, 12vw, 84px); border-radius: 50%; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
    .avatar-serif { border: 2px solid #b45309; background: #fef3c7; }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-initials { font-weight: bold; font-size: clamp(20px, 4vw, 26px); color: #92400e; background: #fef3c7; }

    /* Sections */
    .sec-h2 { font-size: clamp(18px, 3.5vw, 22px); font-weight: bold; color: #1c1917; border-bottom: 1px solid #e7e5e4; padding-bottom: 6px; margin-bottom: 16px; }
    .section { margin-bottom: 32px; }

    .skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
    .edit-skill { background: #f5f5f4; border: 1px solid #d6d3d1; color: #292524; padding: 4px 12px; border-radius: 4px; font-size: 12px; }

    /* Articles */
    .edit-card { background: #ffffff; border: 1px solid #e7e5e4; border-radius: 14px; padding: clamp(14px, 3vw, 20px); margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
    .edit-tag { font-family: -apple-system, sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #92400e; letter-spacing: 0.5px; margin-bottom: 4px; }
    .edit-card-title { font-size: clamp(15px, 3vw, 18px); font-weight: bold; color: #0c0a09; margin-bottom: 6px; }
    .edit-card-desc { font-size: 14px; color: #44403c; line-height: 1.7; }
    .edit-link { font-size: 12px; font-weight: bold; color: #92400e; text-decoration: underline; }

    /* Timeline */
    .edit-timeline { background: #ffffff; border: 1px solid #e7e5e4; border-radius: 14px; padding: clamp(16px, 3vw, 22px); }
    .edit-time-row { padding-bottom: 14px; margin-bottom: 14px; border-bottom: 1px solid #f5f5f4; }
    .edit-time-row:last-child { padding-bottom: 0; margin-bottom: 0; border-bottom: none; }
    .edit-time-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 6px; }
    .edit-time-role { font-size: 15px; font-weight: bold; color: #1c1917; }
    .edit-time-period { font-family: monospace; font-size: 11px; color: #78716c; }
    .edit-time-desc { font-size: 14px; color: #44403c; margin-top: 4px; }

    footer { display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #e7e5e4; padding-top: 18px; font-family: -apple-system, sans-serif; font-size: 11px; color: #78716c; flex-wrap: wrap; gap: 8px; }
    footer a { color: #92400e; font-weight: bold; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <header class="edit-head">
      <div class="hero-top">
        ${avatarHtml}
        <div>
          <div class="cv-badge">Curriculum Vitae &amp; Selected Works</div>
          <h1 class="edit-name">${safeName}</h1>
          <div class="edit-title">${safeTitle}</div>
        </div>
      </div>
      <p class="edit-bio">${safeBio}</p>
    </header>

    <section class="section">
      <h2 class="sec-h2">Areas of Inquiry &amp; Competence</h2>
      <div class="skills-wrap">${skillsHtml}</div>
    </section>

    <section class="section">
      <h2 class="sec-h2">Selected Publications &amp; Projects</h2>
      <div>${projectsHtml}</div>
    </section>

    ${hasExperience ? `
    <section class="section">
      <h2 class="sec-h2">Professional &amp; Academic Appointments</h2>
      <div class="edit-timeline">${expHtml}</div>
    </section>` : ''}

    <footer>
      <span>© ${new Date().getFullYear()} ${safeName}.</span>
      <a href="mailto:${safeEmail}">Correspond via Email →</a>
    </footer>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// 6. TEMPLATE 6: AURORA / DEEP SPACE (RESPONSIVE + FULL FEATURES)
// ---------------------------------------------------------------------------
function renderAuroraTemplate(data: PortfolioData): string {
  const safeName = escapeHtml(data.name || "Innovator");
  const safeTitle = escapeHtml(data.title || "AI & Data Scientist");
  const safeBio = escapeHtml(data.bio || "");
  const safeEmail = escapeHtml(data.email || "contact@vayloai.online");
  const safeGithub = data.github ? escapeHtml(data.github) : null;
  const safeResumeUrl = data.resumeUrl ? escapeHtml(formatUrl(data.resumeUrl)) : null;
  const avatarHtml = renderAvatar(data.avatarUrl, data.name, "neon");

  const statsHtml = (data.stats || [
    { label: "Intelligence Focus", value: "Neural" },
    { label: "Model Deployments", value: `${(data.projects || []).length}` },
    { label: "Stack Competencies", value: `${(data.skills || []).length}+` },
  ])
    .map(
      (s) => `
      <div class="aurora-stat-card">
        <div class="aurora-stat-val">${escapeHtml(s.value)}</div>
        <div class="aurora-stat-lbl">${escapeHtml(s.label)}</div>
      </div>`
    )
    .join("");

  const skillsHtml = (data.skills || [])
    .map((s) => `<span class="aurora-skill">&gt; ${escapeHtml(s)}</span>`)
    .join("");

  const projectsHtml = (data.projects || [])
    .map(
      (p) => `
      <div class="aurora-card">
        ${p.imageUrl ? `
        <div class="proj-img-box" style="background: #020617; border-color: rgba(6, 182, 212, 0.35);">
          <img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.title)}" loading="lazy" />
        </div>` : ""}
        <div class="aurora-tag">Neural Pipeline</div>
        <h3 class="aurora-card-title">${escapeHtml(p.title)}</h3>
        <p class="aurora-card-desc">${escapeHtml(p.description)}</p>
        ${p.metrics ? `<div class="aurora-metric">⚡ ${escapeHtml(p.metrics)}</div>` : ""}
        <div class="aurora-card-foot">Architecture: ${escapeHtml(p.tech)}</div>
      </div>`
    )
    .join("");

  const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;
  const expHtml = hasExperience
    ? (data.experience || [])
        .map(
          (e) => `
        <div class="aurora-time-card">
          <div class="aurora-time-head">
            <h4 class="aurora-time-role">${escapeHtml(e.role)} <span style="color: #06b6d4;">· ${escapeHtml(e.company)}</span></h4>
            <span class="aurora-time-period">${escapeHtml(e.period)}</span>
          </div>
          <p class="aurora-time-desc">${escapeHtml(e.summary)}</p>
        </div>`
        )
        .join("")
    : "";

  const hasTestimonials = Array.isArray(data.testimonials) && data.testimonials.length > 0;
  const testimonialsHtml = hasTestimonials
    ? (data.testimonials || [])
        .map(
          (t) => `
        <div class="aurora-card">
          <div class="quote-icon" style="color: #22d3ee;">“</div>
          <p style="font-size: 13px; color: #cbd5e1; font-style: italic; line-height: 1.6; margin-bottom: 10px;">${escapeHtml(t.quote)}</p>
          <div style="font-size: 13px; font-weight: 700; color: #fff;">${escapeHtml(t.author)}</div>
          <div style="font-size: 11px; color: #06b6d4;">${escapeHtml(t.role)}${t.company ? ` · ${escapeHtml(t.company)}` : ""}</div>
        </div>`
        )
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${safeName} — AI &amp; Intelligence</title>
  ${renderSeoHead(data)}
  <style>
    ${GLOBAL_RESPONSIVE_CSS}
    body {
      background-color: #020617; color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
    }
    .container { max-width: 960px; margin: 0 auto; padding: clamp(16px, 4vw, 40px) clamp(12px, 3vw, 24px); }

    .aurora-hero {
      background: radial-gradient(circle at top right, rgba(6, 182, 212, 0.15), rgba(2, 6, 23, 0.95)), #020617;
      border: 1px solid rgba(6, 182, 212, 0.35); border-radius: clamp(18px, 3vw, 28px);
      padding: clamp(20px, 4vw, 40px) clamp(16px, 3vw, 36px); box-shadow: 0 0 50px rgba(6, 182, 212, 0.12);
      margin-bottom: 32px;
    }
    .hero-top { display: flex; align-items: center; gap: 20px; margin-bottom: 16px; flex-wrap: wrap; }
    .aurora-badge {
      display: inline-flex; align-items: center; gap: 6px; font-family: monospace;
      padding: 4px 10px; border-radius: 9999px; background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.4); color: #22d3ee; font-size: 11px; font-weight: 700;
      text-transform: uppercase; margin-bottom: 6px;
    }
    .aurora-name { font-family: monospace; font-size: clamp(24px, 5vw, 36px); font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2; }
    .aurora-title { font-family: monospace; font-size: clamp(14px, 3vw, 18px); color: #22d3ee; margin-top: 2px; }
    .aurora-bio { color: #cbd5e1; font-size: clamp(13px, 2.5vw, 15px); line-height: 1.7; max-width: 800px; margin-top: 12px; }

    /* Avatars */
    .avatar-wrap { width: clamp(70px, 12vw, 88px); height: clamp(70px, 12vw, 88px); border-radius: 20px; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
    .avatar-neon { border: 2px solid #06b6d4; background: #0f172a; box-shadow: 0 0 25px rgba(6, 182, 212, 0.4); }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-initials { font-family: monospace; font-weight: bold; font-size: clamp(22px, 4vw, 26px); color: #22d3ee; background: #0f172a; }

    /* Stats */
    .aurora-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #1e293b; }
    .aurora-stat-card { background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(6, 182, 212, 0.25); border-radius: 14px; padding: 12px; text-align: center; }
    .aurora-stat-val { font-family: monospace; font-size: clamp(18px, 3.5vw, 24px); font-weight: 800; color: #22d3ee; }
    .aurora-stat-lbl { font-family: monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #0891b2; margin-top: 4px; }

    /* Sections */
    .sec-h2 { font-family: monospace; font-size: clamp(16px, 3vw, 20px); font-weight: 700; color: #ffffff; margin-bottom: 14px; }
    .sec-h2 span { color: #22d3ee; }
    .section { margin-bottom: 32px; }
    
    .aurora-skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
    .aurora-skill { background: #0f172a; border: 1px solid rgba(6, 182, 212, 0.35); color: #67e8f9; font-family: monospace; padding: 6px 14px; border-radius: 10px; font-size: 12px; }

    /* Cards */
    .aurora-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .aurora-card {
      background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(6, 182, 212, 0.25); border-radius: 18px;
      padding: clamp(16px, 3vw, 22px); transition: border-color 0.2s;
    }
    .aurora-card:hover { border-color: #22d3ee; }
    .aurora-tag { font-family: monospace; font-size: 10px; text-transform: uppercase; color: #22d3ee; background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); padding: 3px 8px; border-radius: 9999px; width: fit-content; margin-bottom: 8px; }
    .aurora-card-title { font-family: monospace; font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 6px; }
    .aurora-card-desc { font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 10px; }
    .aurora-metric { font-family: monospace; font-size: 11px; color: #34d399; background: rgba(16, 185, 129, 0.15); padding: 5px 10px; border-radius: 6px; width: fit-content; margin-bottom: 10px; }
    .aurora-card-foot { font-family: monospace; font-size: 11px; color: #06b6d4; border-top: 1px solid #1e293b; padding-top: 8px; }

    /* Timeline */
    .aurora-time-card { background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 14px; padding: 16px; margin-bottom: 10px; font-family: monospace; }
    .aurora-time-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 6px; }
    .aurora-time-role { font-size: 14px; font-weight: 700; color: #ffffff; }
    .aurora-time-period { font-size: 11px; color: #22d3ee; }
    .aurora-time-desc { font-family: -apple-system, sans-serif; font-size: 13px; color: #cbd5e1; margin-top: 4px; }

    /* CTA */
    .aurora-cta { text-align: center; background: #0b1222; border: 1px solid rgba(6, 182, 212, 0.35); border-radius: 20px; padding: clamp(24px, 5vw, 36px) 16px; }
    .aurora-cta h3 { font-family: monospace; font-size: clamp(18px, 4vw, 22px); font-weight: 800; color: #fff; margin-bottom: 8px; }
    .aurora-cta p { font-size: 13px; color: #94a3b8; margin-bottom: 18px; }
    .btn-aurora { display: inline-block; background: #06b6d4; color: #020617; padding: 10px 24px; border-radius: 10px; font-family: monospace; font-size: 13px; font-weight: 800; text-decoration: none; }

    footer { text-align: center; padding: 20px 0; font-family: monospace; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="aurora-hero">
      <div class="hero-top">
        ${avatarHtml}
        <div>
          <span class="aurora-badge">● Neural Mesh Online</span>
          <h1 class="aurora-name">${safeName}</h1>
          <div class="aurora-title">${safeTitle}</div>
        </div>
      </div>
      <p class="hero-bio">${safeBio}</p>
      
      ${safeGithub ? `
      <div style="margin-top: 14px; font-family: monospace; font-size: 12px; color: #94a3b8;">
        GitHub: <a href="${escapeHtml(formatUrl(safeGithub))}" target="_blank" style="color: #22d3ee; text-decoration: underline;">${safeGithub} →</a>
      </div>` : ""}

      <div class="aurora-stats-grid">${statsHtml}</div>
    </div>

    <section class="section">
      <h2 class="sec-h2"><span>#</span> Algorithms &amp; AI Stack</h2>
      <div class="aurora-skills-wrap">${skillsHtml}</div>
    </section>

    <section class="section">
      <h2 class="sec-h2"><span>#</span> Machine Learning Deployments</h2>
      <div class="aurora-grid">${projectsHtml}</div>
    </section>

    ${hasExperience ? `
    <section class="section">
      <h2 class="sec-h2"><span>#</span> Systems Experience</h2>
      <div>${expHtml}</div>
    </section>` : ''}

    ${hasTestimonials ? `
    <section class="section">
      <h2 class="sec-h2"><span>#</span> Network Recommendations</h2>
      <div class="aurora-grid">${testimonialsHtml}</div>
    </section>` : ''}

    <div class="aurora-cta">
      <h3>Deploy Machine Learning Systems</h3>
      <p>Open for generative AI pipelines, LLM fine-tuning, and machine learning infrastructure roles.</p>
      <a href="mailto:${safeEmail}" class="btn-aurora">Connect &gt;</a>
    </div>

    <footer>
      © ${new Date().getFullYear()} ${safeName}. Built with Vaylo AI Studio.
    </footer>
  </div>
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
