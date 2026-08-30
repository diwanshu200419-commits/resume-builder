import { BLOG_POSTS } from "@/lib/blog";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import type { Metadata } from "next";

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "Career & Technical Interview Blog — Real Questions, STAR Guides & ATS Secrets | Vaylo AI",
  description:
    "Master real-world FAANG system design interview questions, Google STAR behavioral answers, advanced React/Node coding rounds, and ATS resume scoring formulas.",
  keywords: [
    "technical interview questions",
    "system design interview",
    "STAR behavioral questions",
    "FAANG coding questions",
    "React interview questions",
    "ATS resume guide",
    "Vaylo AI blog"
  ],
  alternates: {
    canonical: `${APP_URL}/blog`,
  },
  openGraph: {
    title: "Vaylo AI Technical Interview & Career Blog",
    description: "Master real-world FAANG system design, Google STAR behavioral rounds, and ATS optimization.",
    url: `${APP_URL}/blog`,
    siteName: "Vaylo AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vaylo AI Technical Interview Blog" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaylo AI Technical Interview & Career Blog",
    description: "Master real-world FAANG system design, Google STAR behavioral rounds, and ATS optimization.",
    images: ["/og-image.png"],
  },
};

export default function BlogIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "name": "Vaylo AI Technical Interview & Career Intelligence Hub",
        "url": `${APP_URL}/blog`,
        "description": "Master real-world FAANG system design questions, Google STAR behavioral answers, and ATS scoring secrets.",
        "publisher": {
          "@type": "Organization",
          "name": "Vaylo AI",
          "url": APP_URL,
          "logo": `${APP_URL}/logo.png`
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": APP_URL
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog & Interview Guides",
            "item": `${APP_URL}/blog`
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BlogIndexClient posts={BLOG_POSTS} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
