import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Clock, Tag, User, Sparkles, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "Career & Resume Blog — ATS Tips, Interview Guides & Salary Secrets | Vaylo AI",
  description:
    "Expert articles on passing Greenhouse & Workday ATS scanners, cracking FAANG STAR interviews, tech salary negotiation in India, and fresher resume building.",
  keywords: [
    "Vaylo AI blog",
    "ATS resume guide",
    "STAR interview answers",
    "tech salary negotiation India",
    "fresher resume tips",
    "AI career guides"
  ],
  alternates: {
    canonical: `${APP_URL}/blog`,
  },
  openGraph: {
    title: "Vaylo AI Career & Resume Blog",
    description: "Expert tips on ATS optimization, STAR interviews, and tech salary negotiation.",
    url: `${APP_URL}/blog`,
    siteName: "Vaylo AI",
    images: ["/og-image.png"],
    locale: "en_US",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const featuredPost = BLOG_POSTS[0];
  const remainingPosts = BLOG_POSTS.slice(1);

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="default" className="gap-1.5 px-3.5 py-1.5 text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Vaylo AI Career Intelligence Hub
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
            Insider Guides for <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 bg-clip-text text-transparent">Tech Job Seekers</span>
          </h1>
          <p className="text-text-secondary text-base leading-relaxed">
            Data-backed articles on passing ATS filters, cracking STAR behavioral rounds, negotiating top-percentile compensation, and landing more interview callbacks.
          </p>
        </div>

        {/* Featured Hero Article Card */}
        {featuredPost && (
          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-indigo-600 text-white font-bold text-xs px-3 py-1">Featured Guide</Badge>
                <span className="text-xs text-indigo-300 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                <Link href={`/blog/${featuredPost.slug}`} className="hover:text-indigo-400 transition-colors">
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {featuredPost.description}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{featuredPost.author}</span>
                  <span>•</span>
                  <span>{featuredPost.date}</span>
                </div>
                <Link href={`/blog/${featuredPost.slug}`}>
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-2 rounded-xl">
                    Read Full Article <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingPosts.map((post) => (
            <Card key={post.slug} className="border-border bg-surface hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
              <CardHeader className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" /> {post.readTime}
                  </span>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold flex items-center gap-1 border-indigo-500/20 text-indigo-400">
                    <Tag className="w-2.5 h-2.5" /> {post.tag}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-text-primary leading-snug hover:text-indigo-400 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                  {post.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6 flex items-center justify-between text-xs text-text-muted border-t border-border/50 mt-4">
                <span>{post.date}</span>
                <Link href={`/blog/${post.slug}`}>
                  <Button size="sm" variant="ghost" className="gap-1 text-indigo-400 hover:text-indigo-300 font-semibold text-xs">
                    Read Guide <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* High-Converting CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-5 shadow-2xl relative">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-extrabold text-white">
              Ready to test your resume against ATS filters?
            </h3>
            <p className="text-slate-400 text-sm">
              Get your instant 0–100% ATS score breakdown and 1-click AI bullet fixes in under 10 seconds.
            </p>
          </div>
          <Link href="/free-ats-checker">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-6 rounded-xl text-base shadow-lg hover:scale-[1.02] transition-all gap-2">
              <ShieldCheck className="w-5 h-5" /> Start Free ATS Resume Check
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
