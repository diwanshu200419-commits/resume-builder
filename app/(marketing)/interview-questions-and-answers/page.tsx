import { type Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Briefcase,
  Code2,
  Users,
  Lightbulb,
  Check,
  Zap,
} from "lucide-react";

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "50 Common Interview Questions & Answers for 2026 | VayloAI",
  description:
    "Top 50 interview questions and model answers for Indian job seekers in 2026. HR round questions, STAR behavioral method, technical fundamentals, and questions to ask the interviewer.",
  keywords: [
    "interview questions and answers India",
    "common interview questions 2026",
    "HR interview questions for freshers",
    "behavioral interview questions STAR method",
    "technical interview questions India",
    "tell me about yourself sample answer",
    "campus placement interview questions",
    "VayloAI interview prep",
  ],
  alternates: {
    canonical: `${APP_URL}/interview-questions-and-answers`,
  },
  openGraph: {
    title: "50 Common Interview Questions & Answers for 2026 | VayloAI",
    description:
      "Master HR and technical interview rounds. Proven model answers for freshers and experienced professionals in India, using the STAR method.",
    url: `${APP_URL}/interview-questions-and-answers`,
    siteName: "VayloAI",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "50 Common Interview Questions & Answers for 2026 | VayloAI",
    description:
      "Master HR and technical interview rounds. Proven model answers for freshers and experienced professionals in India, using the STAR method.",
    creator: "@vayloai",
  },
};

const topQuestions = [
  {
    q: "1. Tell me about yourself.",
    category: "HR / Icebreaker",
    tip: "Use the Present-Past-Future formula. Keep it under 90 seconds. Focus on your professional identity and relevant technical achievements rather than your personal life history.",
    sample:
      "I am a Computer Science graduate with hands-on experience in full-stack development using React and Spring Boot. During college, I interned at a fintech startup where I developed REST APIs for payment processing and built an automated resume parsing tool. I am passionate about cloud infrastructure and scalable backend services, which is why I am eager to contribute to your engineering team.",
  },
  {
    q: "2. Why do you want to join our company?",
    category: "HR / Motivation",
    tip: "Demonstrate that you did genuine homework on their business, product line, engineering blog, or recent company milestones.",
    sample:
      "I have been closely following your engineering team's migration to microservices and your recent product expansion in automated logistics. Your focus on high-throughput distributed systems aligns directly with my interests in database optimization and event-driven architecture. I want to build systems that scale to millions of Indian users.",
  },
  {
    q: "3. What are your greatest strengths and weaknesses?",
    category: "HR / Self-Awareness",
    tip: "Pair every strength with concrete proof. For your weakness, choose a genuine, non-critical skill and explain the exact steps you are actively taking to improve it.",
    sample:
      "My greatest strength is systematic debugging and breaking down ambiguous requirements into actionable tasks. As for a weakness, I used to struggle with delegating tasks during college group projects because I wanted everything to be perfect. Recently, I adopted Agile sprint planning and Kanban boards, which has helped me trust teammates and collaborate more efficiently.",
  },
  {
    q: "4. Where do you see yourself in 5 years?",
    category: "HR / Career Goals",
    tip: "Show commitment to continuous learning and organizational growth without making unrealistic claims like 'I want to be the CEO'.",
    sample:
      "Over the next two years, my focus is to master your tech stack and take full ownership of core product modules. Within five years, I aim to grow into a Senior Software Engineer or Technical Lead role where I can architect robust backend services and mentor junior developers.",
  },
  {
    q: "5. Describe a time you faced a tough technical challenge and how you overcame it (STAR).",
    category: "Behavioral (STAR Method)",
    tip: "Situation: Context | Task: Goal | Action: What you specifically did | Result: Measurable outcome.",
    sample:
      "During our capstone project (Situation), our PostgreSQL queries experienced 4-second latency during concurrent user mock testing (Task). I profiled the query execution plans using EXPLAIN ANALYZE, discovered missing composite indexes, and implemented a Redis caching layer for read-heavy catalog endpoints (Action). As a result, API response times dropped by 72% from 4s to 120ms (Result).",
  },
  {
    q: "6. How do you handle disagreements with teammates or your manager?",
    category: "Behavioral / Teamwork",
    tip: "Recruiters test emotional intelligence and conflict resolution. Emphasize data-driven discussion, active listening, and committing to the team consensus.",
    sample:
      "I believe technical disagreements are healthy when guided by benchmarks and objective metrics. During a college hackathon, a teammate and I disagreed over whether to use MongoDB or PostgreSQL. Instead of debating, we benchmarked our write-read ratios and latency requirements. The data proved relational joins were necessary, so we aligned smoothly and delivered on time.",
  },
  {
    q: "7. Why should we hire you over other candidates?",
    category: "HR / Value Proposition",
    tip: "Summarize your unique combination of verified skills, quick learning ability, and genuine alignment with the company's culture.",
    sample:
      "Beyond having solid fundamentals in Java, SQL, and data structures, I bring a demonstrated track record of building production-ready projects outside the classroom. I don't just write code that passes tests; I consider edge cases, write comprehensive documentation, and take initiative to unblock team blockers.",
  },
  {
    q: "8. Explain Object-Oriented Programming (OOP) concepts with real-world examples.",
    category: "Technical Fundamentals",
    tip: "Explain Encapsulation, Abstraction, Inheritance, and Polymorphism concisely using an intuitive analogy like an Automobile or Payment System.",
    sample:
      "Encapsulation binds data and methods together (e.g., a BankAccount class protecting the balance variable). Abstraction hides complex implementation details and exposes only necessary interfaces (e.g., calling startEngine() without needing internal piston mechanics). Inheritance enables code reuse (e.g., ElectricCar extending Vehicle). Polymorphism allows one interface to take multiple forms (e.g., pay() method behaving differently for UPI, Card, and NetBanking).",
  },
  {
    q: "9. What is the difference between SQL and NoSQL databases, and when would you choose which?",
    category: "Technical Fundamentals",
    tip: "Focus on ACID transactions, schema rigidity, horizontal vs vertical scaling, and specific use-cases.",
    sample:
      "SQL databases (PostgreSQL, MySQL) are relational, use structured schemas, and guarantee strict ACID compliance, making them essential for financial transactions, user accounts, and inventory where data consistency is paramount. NoSQL databases (MongoDB, DynamoDB, Redis) offer schema flexibility and effortless horizontal scaling, making them ideal for high-velocity unstructured data like real-time analytics, event logs, or caching.",
  },
  {
    q: "10. What questions do you have for us?",
    category: "Questions for the Interviewer",
    tip: "Never say 'I have no questions'. Asking smart questions proves high interest and critical thinking.",
    sample:
      "What does success look like for someone in this role during their first 90 days? Also, how does your engineering team approach code reviews, continuous deployment, and testing before shipping features to production?",
  },
];

const faqs = topQuestions.map((item) => ({
  q: item.q,
  a: `Category: ${item.category}. Strategy: ${item.tip} Model Answer: ${item.sample}`,
}));

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "50 Common Interview Questions & Answers for 2026",
      description:
        "Comprehensive guide covering top HR, behavioral, and technical interview questions with STAR method answers for Indian freshers and engineers.",
      author: {
        "@type": "Organization",
        name: "VayloAI",
        url: APP_URL,
      },
      publisher: {
        "@type": "Organization",
        name: "VayloAI",
        url: APP_URL,
      },
      datePublished: "2026-02-01T00:00:00+05:30",
      dateModified: "2026-10-16T00:00:00+05:30",
      mainEntityOfPage: `${APP_URL}/interview-questions-and-answers`,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: APP_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Interview Questions and Answers",
          item: `${APP_URL}/interview-questions-and-answers`,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
  ],
};

export default function InterviewQuestionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="min-h-screen bg-background text-text-primary pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-6 pt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Campus Placement & Job Interview Guide 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
              50 Common Interview Questions &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">
                Model Answers (2026)
              </span>
            </h1>

            {/* AEO Direct Answer Summary */}
            <div className="max-w-3xl mx-auto bg-surface-elevated/80 border border-border rounded-2xl p-5 text-left text-sm text-text-secondary leading-relaxed shadow-sm">
              <p className="font-semibold text-text-primary mb-1 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                AEO Direct Answer: What Do Interviewers Evaluate?
              </p>
              Recruiters in Indian tech and corporate hiring evaluate candidates across three core pillars: <strong>Clarity of Communication</strong> (articulating answers under 90 seconds without rambling), <strong>Structural Thinking</strong> (using the STAR method: Situation, Task, Action, Result), and <strong>Technical Depth</strong> (explaining trade-offs and real-world system constraints rather than rote textbook definitions).
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/interview-preparation">
                <Button size="lg" className="bg-accent hover:bg-accent-hover text-white font-bold gap-2 shadow-lg">
                  Practice with AI Mock Interview <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/free-ats-checker">
                <Button size="lg" variant="outline" className="border-border hover:bg-surface-elevated font-semibold gap-2">
                  Check Resume ATS Alignment
                </Button>
              </Link>
            </div>
          </section>

          {/* STAR Method Breakdown Box */}
          <section className="p-6 sm:p-8 rounded-3xl bg-surface border border-accent/20 space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-accent text-white font-bold">The Gold Standard</Badge>
              <h2 className="text-xl font-bold text-text-primary">Mastering the STAR Response Method</h2>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Whenever an interviewer asks a question beginning with <em>&quot;Tell me about a time when...&quot;</em> or <em>&quot;Describe a situation where...&quot;</em>, structure your response into four clear phases:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-surface-elevated border border-border/70 space-y-1">
                <div className="font-extrabold text-accent text-lg">S</div>
                <div className="font-bold text-sm text-text-primary">Situation</div>
                <p className="text-[11px] text-text-muted">Briefly set the scene, company, or college project context in 1-2 sentences.</p>
              </div>

              <div className="p-4 rounded-xl bg-surface-elevated border border-border/70 space-y-1">
                <div className="font-extrabold text-purple-400 text-lg">T</div>
                <div className="font-bold text-sm text-text-primary">Task</div>
                <p className="text-[11px] text-text-muted">Explain the specific problem, bug, deadline, or challenge you had to resolve.</p>
              </div>

              <div className="p-4 rounded-xl bg-surface-elevated border border-border/70 space-y-1">
                <div className="font-extrabold text-emerald-400 text-lg">A</div>
                <div className="font-bold text-sm text-text-primary">Action</div>
                <p className="text-[11px] text-text-muted">Describe the exact technical steps, tools, and decisions YOU personally took.</p>
              </div>

              <div className="p-4 rounded-xl bg-surface-elevated border border-border/70 space-y-1">
                <div className="font-extrabold text-amber-400 text-lg">R</div>
                <div className="font-bold text-sm text-text-primary">Result</div>
                <p className="text-[11px] text-text-muted">Share measurable metrics: % latency reduced, bug resolved, or project delivered on time.</p>
              </div>
            </div>
          </section>

          {/* Top 10 Questions with Detailed Breakdowns */}
          <section className="space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-2xl font-bold tracking-tight">
                Top 10 High-Frequency Questions with Model Responses
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Tested across TCS, Infosys, Cognizant, Wipro, Amazon India, and product startups
              </p>
            </div>

            <div className="space-y-6">
              {topQuestions.map((item, index) => (
                <div key={index} className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
                    <h3 className="font-bold text-base sm:text-lg text-text-primary">{item.q}</h3>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono border-accent/30 text-accent">
                      {item.category}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Interviewer Strategy Tip:
                    </p>
                    <p className="text-xs text-text-muted leading-relaxed pl-5">{item.tip}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-elevated/70 border border-border/60 space-y-1.5">
                    <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Model Candidate Answer:
                    </p>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-5 italic">
                      &quot;{item.sample}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Top 5 Smart Questions to Ask the Interviewer */}
          <section className="space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-2xl font-bold tracking-tight">
                5 Smart Questions You Should Ask the Interviewer
              </h2>
              <p className="text-sm text-text-muted mt-1">
                At the end of the round, stand out from other candidates by asking thoughtful questions
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                <span className="text-xs font-bold text-accent">Question 1:</span>
                <p className="text-sm font-semibold text-text-primary">
                  &quot;What does a typical day or sprint look like for an engineer on this team?&quot;
                </p>
                <p className="text-xs text-text-muted">
                  Shows you are eager to understand real workflow cadence and daily responsibilities.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                <span className="text-xs font-bold text-accent">Question 2:</span>
                <p className="text-sm font-semibold text-text-primary">
                  &quot;What are the most challenging technical bottlenecks your team solved recently?&quot;
                </p>
                <p className="text-xs text-text-muted">
                  Demonstrates high curiosity for real engineering architecture and team problem-solving.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                <span className="text-xs font-bold text-accent">Question 3:</span>
                <p className="text-sm font-semibold text-text-primary">
                  &quot;What performance metrics define success for someone in this role over their first 6 months?&quot;
                </p>
                <p className="text-xs text-text-muted">
                  Proves you are results-driven and thinking about tangible organizational impact.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                <span className="text-xs font-bold text-accent">Question 4:</span>
                <p className="text-sm font-semibold text-text-primary">
                  &quot;How does the company support ongoing technical upskilling and certification?&quot;
                </p>
                <p className="text-xs text-text-muted">
                  Signals that you are a growth-minded candidate who invests in technical excellence.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Box */}
          <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-surface to-surface-elevated border border-accent/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="space-y-2 max-w-2xl mx-auto">
              <Badge className="bg-accent/20 text-accent border-accent/40 font-bold mb-2">
                AI Interview Practice
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                Simulate Your Next Interview with AI
              </h2>
              <p className="text-sm text-text-secondary">
                Practice role-specific technical and HR mock questions tailored to your target job description. Receive instant evaluation on communication, correctness, and completeness.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/interview-preparation">
                <Button size="lg" className="bg-accent hover:bg-accent-hover text-white font-bold gap-2">
                  Launch AI Mock Interview <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/free-ats-checker">
                <Button size="lg" variant="outline" className="border-border hover:bg-surface-elevated font-semibold">
                  Test Resume ATS Score First
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
