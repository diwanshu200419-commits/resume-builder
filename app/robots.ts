import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const privateRoutes = [
    "/dashboard",
    "/dashboard/",
    "/api/",
    "/admin",
    "/admin/",
    "/checkout/",
    "/account/",
    "/login",
    "/signup",
    "/settings",
    "/results/",
    "/share/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: privateRoutes,
      },
    ],
    sitemap: "https://www.vayloai.online/sitemap.xml",
  };
}
