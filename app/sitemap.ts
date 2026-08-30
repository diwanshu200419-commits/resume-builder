import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "../lib/blog.ts";
import { ROLE_PAGES_DATA } from "../lib/seo/role-pages.ts";

const BASE_URL = "https://www.vayloai.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", priority: 1.0, changeFreq: "daily" },
    { path: "/free-ats-resume-checker", priority: 1.0, changeFreq: "daily" },
    { path: "/ats-resume-checker", priority: 0.95, changeFreq: "daily" },
    { path: "/ats-score-checker", priority: 0.95, changeFreq: "daily" },
    { path: "/ai-resume-checker", priority: 0.95, changeFreq: "daily" },
    { path: "/resume-optimizer", priority: 0.9, changeFreq: "daily" },
    { path: "/ai-resume-builder", priority: 0.95, changeFreq: "daily" },
    { path: "/free-ats-checker", priority: 0.9, changeFreq: "daily" },
    { path: "/cover-letter-generator", priority: 0.85, changeFreq: "weekly" },
    { path: "/pricing", priority: 0.9, changeFreq: "weekly" },
    { path: "/blog", priority: 0.85, changeFreq: "daily" },
    { path: "/about", priority: 0.6, changeFreq: "monthly" },
    { path: "/privacy", priority: 0.5, changeFreq: "monthly" },
    { path: "/terms", priority: 0.5, changeFreq: "monthly" },
    { path: "/refund", priority: 0.5, changeFreq: "monthly" },
  ];

  const blogRoutes = BLOG_POSTS.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: 0.85,
    changeFreq: "weekly",
  }));

  const roleRoutes = Object.keys(ROLE_PAGES_DATA).map((slug) => ({
    path: `/resume/${slug}`,
    priority: 0.85,
    changeFreq: "weekly",
  }));

  const allRoutes = [...staticRoutes, ...blogRoutes, ...roleRoutes];

  return allRoutes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFreq as "daily" | "weekly" | "monthly",
    priority: r.priority,
  }));
}
