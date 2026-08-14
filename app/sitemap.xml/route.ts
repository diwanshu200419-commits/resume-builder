import { NextResponse } from "next/server";
import { BLOG_POSTS } from "@/lib/blog";
import { ROLE_PAGES_DATA } from "@/lib/seo/role-pages";

const BASE_URL = "https://www.vayloai.online";

export const dynamic = "force-dynamic";

export async function GET() {
  const staticRoutes = [
    { path: "", priority: "1.0", changeFreq: "daily" },
    { path: "/free-ats-checker", priority: "0.95", changeFreq: "daily" },
    { path: "/cover-letter-generator", priority: "0.85", changeFreq: "weekly" },
    { path: "/pricing", priority: "0.90", changeFreq: "weekly" },
    { path: "/blog", priority: "0.80", changeFreq: "daily" },
    { path: "/about", priority: "0.60", changeFreq: "monthly" },
    { path: "/privacy", priority: "0.50", changeFreq: "monthly" },
    { path: "/terms", priority: "0.50", changeFreq: "monthly" },
    { path: "/refund", priority: "0.50", changeFreq: "monthly" },
  ];

  const blogRoutes = BLOG_POSTS.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: "0.80",
    changeFreq: "weekly",
  }));

  const roleRoutes = Object.keys(ROLE_PAGES_DATA).map((slug) => ({
    path: `/resume/${slug}`,
    priority: "0.85",
    changeFreq: "weekly",
  }));

  const allRoutes = [...staticRoutes, ...blogRoutes, ...roleRoutes];
  const currentDate = new Date().toISOString().split("T")[0];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (r) => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${r.changeFreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xmlContent, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
