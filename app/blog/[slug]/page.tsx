import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Clock, Tag, Calendar, User } from "lucide-react";
import type { Metadata } from "next";

const BLOG_DATABASE: Record<
  string,
  {
    title: string;
    description: string;
    tag: string;
    date: string;
    readTime: string;
    content: string;
  }
> = {
  "ats-friendly-resume-guide": {
    title: "How to Build an ATS-Friendly Resume in 2026",
    description: "Learn the secrets behind Applicant Tracking Systems and how to write bullet points that maximize interview callbacks.",
    tag: "ATS Tips",
    date: "July 20, 2026",
    readTime: "5 min read",
    content: `
      <h2>Understanding the Applicant Tracking System (ATS)</h2>
      <p>Most Fortune 500 companies use an ATS to scan resumes before they ever reach a human recruiter. If your resume lacks the correct keywords, formatting, or action verbs, it will likely be automatically filtered out.</p>

      <h2>Key Formatting Rules for ATS Compatibility</h2>
      <ul>
        <li><strong>Use a clean structure:</strong> Avoid multiple columns, complex tables, text boxes, and non-standard symbols. Stick to bullet points.</li>
        <li><strong>Choose standard section names:</strong> Use clear headings like "Experience", "Skills", "Education", and "Projects" so the parser knows what it's reading.</li>
        <li><strong>Export to PDF correctly:</strong> Ensure the PDF text is highlightable and selectable, not flattened into an image.</li>
      </ul>

      <h2>Optimizing Keywords Naturally</h2>
      <p>Analyze the target job description and note the skills and technologies listed. Integrate these exact keywords into your bullet points, demonstrating how you applied them with quantifiable metrics (e.g. "Increased engagement by 40%").</p>
    `,
  },
  "cracking-tech-interviews": {
    title: "Cracking the Software Engineer Interview at Google & Microsoft",
    description: "A comprehensive walkthrough on behavioral questions, coding design patterns, and how to practice using AI mock interviews.",
    tag: "Interview Prep",
    date: "July 18, 2026",
    readTime: "8 min read",
    content: `
      <h2>The Tech Hiring Bar</h2>
      <p>Engineering interviews at major tech firms consist of behavioral (STAR method), technical coding, and system design rounds. Preparing for these rounds systematically is key to landing the offer.</p>

      <h2>Mastering the STAR Method for Behavioral Rounds</h2>
      <p>Structure every answer using <strong>Situation, Task, Action, and Result</strong>. Highlight your individual contributions and quantifiably verify the impact of your actions on the team or product.</p>

      <h2>AI Mock Practice</h2>
      <p>Use interactive AI career tools to practice HR and coding questions dynamically, getting instant feedback on body language, vocabulary, and technical clarity.</p>
    `,
  },
  "linkedin-profile-seo": {
    title: "LinkedIn SEO: Optimize Your Profile for Inbound Recruiter DMs",
    description: "Discover how to naturally insert key skills and write a professional bio that puts your profile at the top of recruiter searches.",
    tag: "LinkedIn Optimization",
    date: "July 15, 2026",
    readTime: "6 min read",
    content: `
      <h2>Why LinkedIn SEO Matters</h2>
      <p>Recruiters use advanced filters and search queries to find candidates. Your headline, summary, and skills section act as keywords that determine whether your profile appears in their results.</p>

      <h2>Writing a High-Converting Headline</h2>
      <p>Do not just state your job title. Use a formula: <strong>Role | Key Technologies | Notable Achievement or Value Statement</strong> (e.g., "Full Stack Engineer | React, Next.js, Node.js | Developed AI tools used by 10k+ users").</p>

      <h2>The About Section Blueprint</h2>
      <p>Write in the first person. Structure it with an engaging hook, a summary of your key strengths/specialties, a bulleted list of core skills, and a clear call to action.</p>
    `,
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = BLOG_DATABASE[params.slug];
  if (!post) return {};
  return {
    title: `${post.title} | Vaylo AI Blog`,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_DATABASE[params.slug];
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 space-y-8">
      <Link href="/blog">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Button>
      </Link>

      <div className="space-y-4">
        <Badge variant="default" className="gap-1.5 px-3 py-1 text-xs">
          <BookOpen className="w-3.5 h-3.5" /> {post.tag}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Written by Vaylo AI Team</span>
        </div>
      </div>

      <div
        className="prose prose-invert max-w-none text-text-secondary text-sm leading-relaxed space-y-6 pt-6 border-t border-border"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
