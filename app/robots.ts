import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
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
        ],
      },
    ],
    sitemap: "https://www.vayloai.online/sitemap.xml",
  };
}
