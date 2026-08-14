import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, BLOG_POSTS } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Clock, Tag, Calendar, User, Sparkles, ShieldCheck, Share2, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

const APP_URL = "https://www.vayloai.online";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return {};

  const articleUrl = `${APP_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} | Vaylo AI Blog`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: articleUrl,
      siteName: "Vaylo AI",
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/og-image.png"],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const articleUrl = `${APP_URL}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: [`${APP_URL}/og-image.png`],
    datePublished: new Date(post.date).toISOString(),
    author: {
      "@type": "Organization",
      name: post.author,
      url: APP_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Vaylo AI",
      url: APP_URL,
      logo: {
        "@type": "ImageObject",
        url: `${APP_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-background py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Top Navigation */}
          <div className="flex items-center justify-between">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="gap-2 text-text-secondary hover:text-text-primary">
                <ArrowLeft className="w-4 h-4" /> Back to Blog
              </Button>
            </Link>

            <Link href="/free-ats-checker">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-1.5 rounded-xl">
                <ShieldCheck className="w-3.5 h-3.5" /> Free ATS Check
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" className="gap-1 px-3 py-1 text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-semibold">
                <BookOpen className="w-3.5 h-3.5" /> {post.tag}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              {post.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-border py-4 text-xs text-text-muted">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium text-text-primary">
                  <User className="w-3.5 h-3.5 text-indigo-400" /> {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-text-muted" /> {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-text-muted" /> {post.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                <div className="flex flex-wrap gap-1">
                  {post.keywords.slice(0, 3).map((kw) => (
                    <span key={kw} className="bg-surface border border-border px-2 py-0.5 rounded text-[10px] font-medium text-text-secondary">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <article className="prose prose-invert max-w-none text-text-secondary text-sm sm:text-base leading-relaxed space-y-6 pt-2">
            <div
              className="space-y-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-text-primary [&_h2]:pt-6 [&_h2]:border-t [&_h2]:border-border [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-indigo-300 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_strong]:text-text-primary"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* High-Converting CTA Box */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 text-left space-y-4 shadow-2xl relative overflow-hidden my-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Optimize Your Resume with Vaylo AI</h3>
                <p className="text-xs text-indigo-300">Beat ATS filters &amp; practice real interviews for free</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Don't leave your job applications to chance. Vaylo AI scans your resume against Greenhouse, Workday, and Lever filters, extracts missing high-intent keywords, and gives 1-click bullet auto-fixes.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/free-ats-checker">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Start Free 10-Sec ATS Scan
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl">
                  View All Plans (₹0 - ₹499)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
