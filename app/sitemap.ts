import type { MetadataRoute } from "next";

const BASE_URL = "https://resume-builder-murex-mu.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1.0, changeFreq: "daily" },
    { path: "/free-ats-checker", priority: 0.95, changeFreq: "daily" },
    { path: "/analyze", priority: 0.95, changeFreq: "daily" },
    { path: "/builder", priority: 0.9, changeFreq: "weekly" },
    { path: "/pricing", priority: 0.9, changeFreq: "weekly" },
    { path: "/recruiter-simulation", priority: 0.85, changeFreq: "weekly" },
    { path: "/hiring-probability", priority: 0.85, changeFreq: "weekly" },
    { path: "/interview-prep", priority: 0.85, changeFreq: "weekly" },
    { path: "/salary-calculator", priority: 0.85, changeFreq: "weekly" },
    { path: "/branding-studio", priority: 0.8, changeFreq: "weekly" },
    { path: "/portfolio/deploy", priority: 0.8, changeFreq: "weekly" },
    { path: "/translate", priority: 0.8, changeFreq: "weekly" },
    { path: "/blog", priority: 0.8, changeFreq: "daily" },
    { path: "/career-coach", priority: 0.75, changeFreq: "weekly" },
    { path: "/applications", priority: 0.7, changeFreq: "weekly" },
    { path: "/github-sync", priority: 0.7, changeFreq: "weekly" },
    { path: "/roast", priority: 0.7, changeFreq: "weekly" },
    { path: "/roadmap", priority: 0.7, changeFreq: "weekly" },
    { path: "/about", priority: 0.6, changeFreq: "monthly" },
    { path: "/privacy", priority: 0.5, changeFreq: "monthly" },
    { path: "/terms", priority: 0.5, changeFreq: "monthly" },
    { path: "/refund", priority: 0.5, changeFreq: "monthly" },
  ];

  return routes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFreq as "daily" | "weekly" | "monthly",
    priority: r.priority,
  }));
}

