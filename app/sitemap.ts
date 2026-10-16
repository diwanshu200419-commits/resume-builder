import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import { ROLE_PAGES_DATA } from "@/lib/seo/role-pages";

const BASE_URL = "https://www.vayloai.online";

// Last meaningful update date — bump this when you make significant content changes
const LAST_UPDATED = new Date("2026-10-16");

// ─────────────────────────────────────────────────────────────────
// CRAWL BUDGET STRATEGY (new domain, Sep-Oct 2026)
//
// Google allocates crawl budget based on domain authority.
// As a new site, submitting 60+ pages causes Google to "discover"
// them all but index almost none — this is the exact wall we hit.
//
// Strategy: Submit only our highest-value pages.
// Expand in phases as each wave gets indexed:
//   Phase 1: Core product + top blog + top role pages + technical MCQ
// ─────────────────────────────────────────────────────────────────

export default function sitemap(): MetadataRoute.Sitemap {
  // ── Tier 1: Core product pages — highest commercial intent ──────
  const coreRoutes = [
    { path: "",                            priority: 1.0, changeFreq: "daily" },
    { path: "/free-ats-resume-checker",    priority: 1.0, changeFreq: "daily" },
    { path: "/technical-interview-mcq",    priority: 0.95, changeFreq: "daily" },
    { path: "/ai-resume-builder",          priority: 0.95, changeFreq: "daily" },
    { path: "/interview-preparation",      priority: 0.90, changeFreq: "weekly" },
    { path: "/pricing",                    priority: 0.90, changeFreq: "weekly" },
    { path: "/cover-letter-generator",     priority: 0.85, changeFreq: "weekly" },
    { path: "/how-to-write-a-resume",      priority: 0.95, changeFreq: "weekly" },
    { path: "/fresher-resume-guide",       priority: 0.95, changeFreq: "weekly" },
    { path: "/ats-resume-guide",           priority: 0.95, changeFreq: "weekly" },
    { path: "/resume-tips",                priority: 0.90, changeFreq: "weekly" },
    { path: "/job-search-tips",            priority: 0.90, changeFreq: "weekly" },
    { path: "/interview-questions-and-answers", priority: 0.95, changeFreq: "weekly" },
    { path: "/blog",                       priority: 0.85, changeFreq: "daily" },
    { path: "/about",                      priority: 0.60, changeFreq: "monthly" },
  ];

  // ── Tier 2: Top blog posts — highest search intent / word count ──
  // PHASE 1: High authority, high intent.
  const PHASE1_BLOG_SLUGS = [
    "top-15-fullstack-interview-questions-2026",      // high intent: technical interview practice
    "what-is-an-ats-resume",                          // informational → funnels to product
    "why-ats-rejects-resumes",                        // high intent: problem-aware users
    "how-to-check-ats-score",                         // direct product match query
    "ats-resume-format",                              // high-volume keyword
    "case-study-fresher-to-sde-ats-transformation",   // social proof / conversion
    "generative-engine-optimization-geo-guide",        // GEO — zero-competition keyword
    "resume-quantification-guide-india",               // high commercial intent
    "linkedin-profile-optimization-india-2026",        // high search volume India
  ];

  // ── Tier 3: Role pages — top 5 highest-volume roles only ────────
  // PHASE 1: Submit only top 5. Expand once domain authority improves.
  const PHASE1_ROLE_SLUGS = [
    "software-engineer",
    "data-scientist",
    "product-manager",
    "frontend-developer",
    "backend-developer",
  ];

  // ── Build phase-1 blog URLs ──────────────────────────────────────
  const blogMapped = BLOG_POSTS
    .filter((post) => PHASE1_BLOG_SLUGS.includes(post.slug))
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: (post as { date?: string }).date
        ? new Date((post as { date?: string }).date!)
        : LAST_UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

  // ── Build phase-1 role URLs ──────────────────────────────────────
  const roleMapped = PHASE1_ROLE_SLUGS
    .filter((slug) => ROLE_PAGES_DATA[slug])
    .map((slug) => ({
      url: `${BASE_URL}/resume/${slug}`,
      lastModified: LAST_UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.80,
    }));

  // ── Core routes mapped ───────────────────────────────────────────
  const coreMapped = coreRoutes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: LAST_UPDATED,
    changeFrequency: r.changeFreq as "daily" | "weekly" | "monthly",
    priority: r.priority,
  }));

  // Phase 1 total: 8 core + up to 5 blog + up to 5 role = ~18 pages
  return [...coreMapped, ...blogMapped, ...roleMapped];
}

