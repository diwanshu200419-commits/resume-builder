import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import { ROLE_PAGES_DATA } from "@/lib/seo/role-pages";

const BASE_URL = "https://www.vayloai.online";

// Last meaningful update date — bump this when you make significant content changes
const LAST_UPDATED = new Date("2026-09-12");

export default function sitemap(): MetadataRoute.Sitemap {
  // High-priority pages updated frequently
  const highFreqRoutes = [
    { path: "", priority: 1.0, changeFreq: "daily" },
    { path: "/free-ats-resume-checker", priority: 1.0, changeFreq: "daily" },
    { path: "/ats-resume-checker", priority: 0.95, changeFreq: "daily" },
    { path: "/ats-score-checker", priority: 0.95, changeFreq: "daily" },
    { path: "/ai-resume-checker", priority: 0.95, changeFreq: "daily" },
    { path: "/resume-optimizer", priority: 0.9, changeFreq: "daily" },
    { path: "/ai-resume-builder", priority: 0.95, changeFreq: "daily" },
    // /free-ats-checker removed — 308 permanent redirect to /free-ats-resume-checker
    { path: "/resume", priority: 0.85, changeFreq: "weekly" },
    { path: "/cover-letter-generator", priority: 0.85, changeFreq: "weekly" },
    { path: "/pricing", priority: 0.9, changeFreq: "weekly" },
    { path: "/blog", priority: 0.85, changeFreq: "daily" },
    { path: "/interview-preparation", priority: 0.9, changeFreq: "weekly" },
  ];

  // Stable pages — only re-crawled when lastModified changes
  const stableRoutes = [
    { path: "/about", priority: 0.6, changeFreq: "monthly" },
    { path: "/privacy", priority: 0.5, changeFreq: "monthly" },
    { path: "/terms", priority: 0.5, changeFreq: "monthly" },
    { path: "/refund", priority: 0.5, changeFreq: "monthly" },
  ];

  const blogRoutes = BLOG_POSTS.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: 0.85,
    changeFreq: "weekly",
    // Use post date if available, otherwise fallback to last updated
    lastMod: (post as { date?: string }).date ? new Date((post as { date?: string }).date!) : LAST_UPDATED,
  }));

  const roleRoutes = Object.keys(ROLE_PAGES_DATA).map((slug) => ({
    path: `/resume/${slug}`,
    priority: 0.85,
    changeFreq: "weekly",
    lastMod: LAST_UPDATED,
  }));

  const highFreqMapped = highFreqRoutes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: LAST_UPDATED,
    changeFrequency: r.changeFreq as "daily" | "weekly" | "monthly",
    priority: r.priority,
  }));

  const stableMapped = stableRoutes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: new Date("2026-07-01"), // Legal/about pages — only update when actually revised
    changeFrequency: r.changeFreq as "daily" | "weekly" | "monthly",
    priority: r.priority,
  }));

  const blogMapped = blogRoutes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: r.lastMod,
    changeFrequency: r.changeFreq as "daily" | "weekly" | "monthly",
    priority: r.priority,
  }));

  const roleMapped = roleRoutes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: r.lastMod,
    changeFrequency: r.changeFreq as "daily" | "weekly" | "monthly",
    priority: r.priority,
  }));

  return [...highFreqMapped, ...stableMapped, ...blogMapped, ...roleMapped];
}
