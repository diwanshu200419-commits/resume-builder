import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog";

const BASE_URL = "https://www.vayloai.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", priority: 1.0, changeFreq: "daily" },
    { path: "/free-ats-checker", priority: 0.95, changeFreq: "daily" },
    { path: "/pricing", priority: 0.9, changeFreq: "weekly" },
    { path: "/blog", priority: 0.8, changeFreq: "daily" },
    { path: "/about", priority: 0.6, changeFreq: "monthly" },
    { path: "/privacy", priority: 0.5, changeFreq: "monthly" },
    { path: "/terms", priority: 0.5, changeFreq: "monthly" },
    { path: "/refund", priority: 0.5, changeFreq: "monthly" },
  ];

  const blogRoutes = BLOG_POSTS.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: 0.8,
    changeFreq: "weekly",
  }));

  const allRoutes = [...staticRoutes, ...blogRoutes];

  return allRoutes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFreq as "daily" | "weekly" | "monthly",
    priority: r.priority,
  }));
}
