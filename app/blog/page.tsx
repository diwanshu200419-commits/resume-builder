import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career & Resume Blog | Vaylo AI",
  description: "Read expert tips on resume writing, passing ATS scanners, landing tech interviews, and optimizing your LinkedIn profile.",
};

const BLOG_POSTS = [
  {
    title: "How to Build an ATS-Friendly Resume in 2026",
    slug: "ats-friendly-resume-guide",
    description: "Learn the secrets behind Applicant Tracking Systems and how to write bullet points that guarantee you land interviews.",
    readTime: "5 min read",
    tag: "ATS Tips",
    date: "July 20, 2026",
  },
  {
    title: "Cracking the Software Engineer Interview at Google & Microsoft",
    slug: "cracking-tech-interviews",
    description: "A comprehensive walkthrough on behavioral questions, coding design patterns, and how to practice using AI mock interviews.",
    readTime: "8 min read",
    tag: "Interview Prep",
    date: "July 18, 2026",
  },
  {
    title: "LinkedIn SEO: Optimize Your Profile for Inbound Recruiter DMs",
    slug: "linkedin-profile-seo",
    description: "Discover how to naturally insert key skills and write a professional bio that puts your profile at the top of recruiter searches.",
    readTime: "6 min read",
    tag: "LinkedIn Optimization",
    date: "July 15, 2026",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="default" className="gap-1.5 px-3 py-1 text-xs">
          <BookOpen className="w-3.5 h-3.5" /> Career Intelligence
        </Badge>
        <h1 className="text-4xl font-extrabold text-text-primary tracking-tight">
          Vaylo AI Blog &amp; Resources
        </h1>
        <p className="text-text-secondary text-sm">
          Stay ahead of the market with expert guides on ATS compatibility, resume optimization, and mock interviews.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {BLOG_POSTS.map((post) => (
          <Card key={post.slug} className="hover:border-accent/40 transition-colors flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readTime}
                </span>
                <Badge variant="outline" className="text-[10px] uppercase font-bold flex items-center gap-1 border-accent/20 text-accent">
                  <Tag className="w-2.5 h-2.5" /> {post.tag}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-snug hover:text-accent transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </CardTitle>
              <CardDescription className="text-xs line-clamp-3 leading-relaxed">
                {post.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-6 flex items-center justify-between text-xs text-text-muted">
              <span>{post.date}</span>
              <Link href={`/blog/${post.slug}`}>
                <Button size="sm" variant="ghost" className="gap-1 text-accent hover:text-accent-hover font-semibold">
                  Read Article <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
