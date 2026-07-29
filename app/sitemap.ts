import type { MetadataRoute } from "next";

const BASE_URL = "https://resume-builder-murex-mu.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/analyze",
    "/builder",
    "/portfolio/deploy",
    "/recruiter-simulation",
    "/hiring-probability",
    "/branding-studio",
    "/applications",
    "/salary-calculator",
    "/translate",
    "/github-sync",
    "/roast",
    "/roadmap",
    "/pricing",
    "/free-ats-checker",
    "/about",
    "/privacy",
    "/terms",
    "/refund",
    "/login",
    "/signup",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/analyze" || route === "/builder" ? 0.9 : 0.8,
  }));
}
