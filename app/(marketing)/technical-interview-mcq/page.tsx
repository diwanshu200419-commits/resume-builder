import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { MCQInteractiveQuiz } from '@/components/marketing/MCQInteractiveQuiz';
import { MCQ_QUESTION_BANK } from '@/lib/interview/mcq-bank';
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  Code2, 
  Cpu, 
  ArrowRight, 
  Layers, 
  Zap, 
  FileCheck2,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Technical Interview MCQ Practice 2026 — 50+ Real Questions with Explanations',
  description: 'Practice high-frequency technical interview MCQs for Frontend, Backend, System Design, DevOps, Python, AI & Core CS. Real-time scoring, detailed architectural explanations & FAANG assessment prep.',
  alternates: {
    canonical: 'https://www.vayloai.online/technical-interview-mcq',
  },
  openGraph: {
    title: 'Technical Interview MCQ Practice 2026 — Full Stack, Backend & System Design Quiz',
    description: 'Free technical interview MCQ practice test with explanations. Master React, Next.js, PostgreSQL, Redis, System Design & Core CS concepts for 2026 tech placements.',
    url: 'https://www.vayloai.online/technical-interview-mcq',
    siteName: 'VayloAI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technical Interview MCQ Practice 2026 — 50+ Real Questions with Explanations',
    description: 'Practice technical multiple-choice questions for software engineering interviews with in-depth answers and explanations.',
  },
  keywords: [
    'technical interview mcq',
    'full stack interview questions mcq',
    'react mcq questions and answers',
    'backend interview mcqs with explanation',
    'system design mcq quiz',
    'sql database mcqs for interview',
    'campus placement technical mcqs 2026',
    'software engineer online assessment practice',
    'VayloAI technical mcq'
  ],
};

export default function TechnicalMCQPage() {
  // Schema.org Quiz structured data for rich snippets in Google Search
  const jsonLdQuiz = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": "Technical Software Engineering Interview MCQ Practice Quiz 2026",
    "description": "Comprehensive multiple choice questions testing frontend, backend, system design, databases, and core computer science concepts for technical interviews.",
    "educationalLevel": "Intermediate to Advanced",
    "about": {
      "@type": "Thing",
      "name": "Software Engineering Technical Interviews"
    },
    "hasPart": MCQ_QUESTION_BANK.slice(0, 10).map((q) => ({
      "@type": "Question",
      "name": q.scenario,
      "text": q.scenario,
      "suggestedAnswer": q.options.map((opt, i) => ({
        "@type": "Answer",
        "position": i + 1,
        "text": opt,
        "comment": i === q.correctIndex ? q.explanation : "Incorrect"
      })),
      "acceptedAnswer": {
        "@type": "Answer",
        "position": q.correctIndex + 1,
        "text": q.options[q.correctIndex],
        "comment": q.explanation
      }
    }))
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What topics are covered in VayloAI Technical Interview MCQs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The question bank covers Frontend (React 18, Next.js App Router, JavaScript Event Loop, TypeScript), Backend (Node.js, PostgreSQL transactions, Redis caching), System Design (CAP Theorem, Idempotency, Microservices), DevOps (Docker, Kubernetes), Data AI (Python generators, Vector Search RAG), and Core Computer Science fundamentals (OS Paging, DBMS B+ Trees, TCP/TLS)."
        }
      },
      {
        "@type": "Question",
        "name": "Are multiple choice questions used in real tech company hiring?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Top tech companies, campus placement drives, and tech startups use timed online assessment (OA) MCQ rounds on platforms like HackerEarth, HackerRank, Mettl, and Codility before candidates reach coding rounds."
        }
      },
      {
        "@type": "Question",
        "name": "How does VayloAI help beyond MCQ test practice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "VayloAI offers a complete career copilot: check your resume against job descriptions with our Free ATS Resume Checker, practice spoken behavioral answers with our AI STAR Voice Coach, and generate tailored cover letters."
        }
      },
      {
        "@type": "Question",
        "name": "Is this technical MCQ practice quiz free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, this online technical interview practice quiz is 100% free with instant answer explanations and score calculation."
        }
      }
    ]
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.vayloai.online"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Interview Preparation",
        "item": "https://www.vayloai.online/interview-preparation"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Technical MCQ Practice",
        "item": "https://www.vayloai.online/technical-interview-mcq"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-accent selection:text-white">
      <Navbar />

      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdQuiz) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <main className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-text-muted">
            <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/interview-preparation" className="hover:text-text-primary transition-colors">Interview Preparation</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary font-medium">Technical MCQ Quiz</span>
          </nav>

          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <Badge className="bg-accent/15 text-accent border-accent/30 px-3.5 py-1 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> 2026 Tech Screening Simulator
            </Badge>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
              Technical Interview <span className="text-accent">MCQ Practice</span> with In-Depth Explanations
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              Master the core technical scenarios asked in online assessments (OA), campus placements, and FAANG screening rounds. Test your knowledge in Frontend, Backend, Databases, System Design, and Core CS.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-text-muted">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Answers & Explanations
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Free & Interactive
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real FAANG & Indian Unicorn Scenarios
              </div>
            </div>
          </div>

          {/* Interactive Quiz Engine */}
          <section aria-label="Technical Quiz Engine">
            <MCQInteractiveQuiz questions={MCQ_QUESTION_BANK} />
          </section>

          {/* Comprehensive Educational Guide (SEO Pillar) */}
          <section className="pt-10 border-t border-border space-y-12">
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                How Technical MCQ Rounds Work in 2026 Tech Hiring
              </h2>
              <p className="text-sm text-text-secondary">
                Why modern recruiters and automated screening platforms rely on scenario-based multiple-choice assessments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-text-primary">1. Conceptual Depth Over Syntax</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Top tier companies don&apos;t ask trivial definition questions. They test how concepts interact: Event Loop execution ordering, React re-render isolation, and asynchronous race condition management.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-text-primary">2. Trade-Off Evaluation</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  System design MCQs test whether you understand the cost of architectural decisions: CAP Theorem partition handling, Redis cache stampede mitigation, and SQL transaction isolation levels.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-text-primary">3. Campus & SDE-1 Placement Cutoffs</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  In mass campus placement tests (TCS Digital, Infosys, Wipro, Cognizant, Swiggy, Flipkart), candidates must clear 70-80% cutoffs in core CS (OS, DBMS, Computer Networks) before their code is evaluated.
                </p>
              </div>
            </div>

            {/* In-depth Advice Box */}
            <div className="p-8 rounded-2xl bg-surface-elevated/70 border border-border space-y-4">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" /> 3 Golden Rules for Scoring High on Technical MCQ Rounds
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-accent shrink-0">Rule 1:</span>
                  <span><strong>Look for Extreme Distractors:</strong> Options claiming &quot;zero memory overhead&quot; or &quot;complete elimination of all database locks&quot; are almost universally incorrect in real engineering systems.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-accent shrink-0">Rule 2:</span>
                  <span><strong>Trace the Asynchronous Stack:</strong> When analyzing JavaScript or Python async code snippets, separate synchronous call stack items from microtasks (promises) and macrotasks (timers) on scratch paper.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-accent shrink-0">Rule 3:</span>
                  <span><strong>Align Resume Keywords with Assessed Topics:</strong> The exact same keywords tested in these MCQs (PostgreSQL Indexing, React Server Components, Redis Mutex) must appear inside your experience bullet points with quantified results.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Frequently Asked Questions (FAQ) Accordion */}
          <section className="pt-6 border-t border-border space-y-8">
            <div className="max-w-2xl mx-auto text-center space-y-2">
              <h2 className="text-2xl font-bold text-text-primary">Frequently Asked Questions</h2>
              <p className="text-xs sm:text-sm text-text-secondary">
                Everything you need to know about technical multiple choice assessments and interview preparation.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              <div className="p-5 rounded-xl border border-border bg-surface space-y-2">
                <h4 className="font-semibold text-sm sm:text-base text-text-primary">
                  What topics are covered in VayloAI Technical Interview MCQs?
                </h4>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  The bank covers React 18 & Next.js App Router, JavaScript Event Loop & Microtasks, TypeScript Discriminated Unions, Node.js Worker Threads, PostgreSQL Transaction Isolation Levels, Redis Cache Stampede prevention, CAP Theorem, Idempotency keys, Docker Multi-stage builds, Python Generators, Vector Search RAG, and Core Computer Science (OS Paging, DBMS B+ Trees, TCP/TLS handshakes).
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border bg-surface space-y-2">
                <h4 className="font-semibold text-sm sm:text-base text-text-primary">
                  Are multiple choice questions used in real tech company hiring?
                </h4>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Yes. Tech giants and startups alike use automated Online Assessments (OAs) on platforms such as HackerEarth, HackerRank, Mettl, and Codility as a cost-effective filter to assess baseline technical competence before scheduling expensive engineer-led live coding rounds.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border bg-surface space-y-2">
                <h4 className="font-semibold text-sm sm:text-base text-text-primary">
                  How can I prepare for behavioral and system design vocal rounds?
                </h4>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  MCQs build conceptual muscle memory, but live interview rounds require clear vocal communication. You can use VayloAI&apos;s <Link href="/interview-preparation" className="text-accent underline font-semibold">STAR Voice Interview Coach</Link> to practice speaking out loud with real-time AI feedback on filler words, tone, and technical clarity.
                </p>
              </div>
            </div>
          </section>

          {/* Sticky/Bottom CTA Strip */}
          <div className="p-8 rounded-3xl bg-surface border border-border shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-xl font-bold text-text-primary">
                Are your technical skills visible to ATS resume scanners?
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary">
                Over 75% of candidate resumes are filtered out before reaching technical assessment rounds. Check your match rate in 30 seconds.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/free-ats-resume-checker">
                <Button size="lg" className="bg-accent hover:bg-accent-hover text-white font-bold gap-2">
                  <FileCheck2 className="w-4 h-4" /> Check ATS Score Free
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
