import { type Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  ArrowRight,
  XCircle,
  Sparkles,
  GraduationCap,
  Briefcase,
  Code2,
  FileCheck2,
  Lightbulb,
  Award,
  ChevronRight,
  Layers,
} from "lucide-react";

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "Resume for Freshers India 2026: Complete Guide & Format | VayloAI",
  description:
    "How to write an ATS-proof resume for freshers in India. Perfect resume format for B.Tech, BCA, MCA, MBA, and college graduates with zero work experience. Free ATS checker.",
  keywords: [
    "resume for freshers India",
    "how to make resume for freshers",
    "fresher resume format 2026",
    "B.Tech fresher resume format",
    "BCA fresher resume",
    "MBA fresher resume India",
    "entry level resume guide",
    "ATS resume builder for freshers",
    "VayloAI",
  ],
  alternates: {
    canonical: `${APP_URL}/fresher-resume-guide`,
  },
  openGraph: {
    title: "Resume for Freshers India 2026: Complete Guide & Format | VayloAI",
    description:
      "Step-by-step fresher resume guide for Indian graduates. Discover what IT recruiters look for, high-impact project descriptions, and avoid ATS rejection.",
    url: `${APP_URL}/fresher-resume-guide`,
    siteName: "VayloAI",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume for Freshers India 2026: Complete Guide & Format | VayloAI",
    description:
      "Step-by-step fresher resume guide for Indian graduates. Discover what IT recruiters look for, high-impact project descriptions, and avoid ATS rejection.",
    creator: "@vayloai",
  },
};

const faqs = [
  {
    q: "What is the best resume format for freshers in India?",
    a: "The reverse-chronological format is universally recommended by Indian recruiters and ATS platforms. For freshers with no formal corporate experience, place your Education and Academic Projects sections directly below your Contact Details and Career Objective, followed by Technical Skills, Certifications, and Extracurricular Achievements.",
  },
  {
    q: "How many pages should a fresher resume be?",
    a: "A fresher resume must strictly be exactly one page. Recruiters spend an average of 6 to 8 seconds scanning an entry-level resume. Multi-page resumes for freshers often contain fluff and get penalized by both applicant tracking systems and human hiring managers.",
  },
  {
    q: "What should freshers write if they have zero job experience?",
    a: "Focus heavily on real-world projects (capstone, academic, or personal side projects), summer internships, industry certifications (AWS, Google Cloud, Meta, NPTEL, Coursera), hackathons, and technical leadership roles in college clubs. Include GitHub repositories and live deployment URLs to prove practical execution.",
  },
  {
    q: "Should freshers mention their 10th and 12th marks on their resume?",
    a: "In India, top IT service companies like TCS, Infosys, Wipro, and Cognizant frequently require 60%+ throughout 10th, 12th, and graduation for campus eligibility. If your percentages or CGPA meet or exceed these thresholds, list them concisely in an education table or bullet points. If applying to global startups or product companies, only your degree and graduation year matter.",
  },
  {
    q: "Do I need a photograph on my resume in India?",
    a: "No. Modern ATS systems cannot parse photos, and including graphics often causes character encoding glitches that lead to automatic rejection. Keep your resume clean, text-based, and focused on competencies unless applying for modeling, cabin crew, or on-camera roles.",
  },
  {
    q: "How can I make my fresher resume ATS-friendly?",
    a: "Use standard single-column layout, standard headers ('Education', 'Projects', 'Technical Skills'), clean fonts like Arial or Calibri, and match exact keywords from the target job description. Avoid skill progress bars (e.g., 'Python 80%'), icons, tables, or text boxes that break OCR parsing.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Resume for Freshers India 2026: Complete Guide & Format",
      description:
        "Comprehensive guide on crafting an ATS-proof fresher resume for Indian engineering, science, and management graduates with zero experience.",
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
      datePublished: "2026-01-15T00:00:00+05:30",
      dateModified: "2026-10-16T00:00:00+05:30",
      mainEntityOfPage: `${APP_URL}/fresher-resume-guide`,
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
          name: "Fresher Resume Guide",
          item: `${APP_URL}/fresher-resume-guide`,
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

export default function FresherResumeGuidePage() {
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
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Placements & Off-Campus Hiring 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
              Resume for Freshers in India:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">
                The Complete Guide & ATS Format
              </span>
            </h1>

            {/* AEO Quick Summary */}
            <div className="max-w-3xl mx-auto bg-surface-elevated/80 border border-border rounded-2xl p-5 text-left text-sm text-text-secondary leading-relaxed shadow-sm">
              <p className="font-semibold text-text-primary mb-1 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Quick Answer: What Makes a Winning Fresher Resume?
              </p>
              A successful fresher resume in India must be strictly <strong>1 page</strong>, use a clean <strong>single-column layout</strong>, and prioritize <strong>technical projects with live URLs/GitHub links</strong> over generic hobby lists. Because freshers lack formal job tenure, recruiters at companies like TCS, Infosys, Zoho, and Swiggy evaluate practical coding skills, problem-solving ability, and verified certifications.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/builder">
                <Button size="lg" className="bg-accent hover:bg-accent-hover text-white font-bold gap-2 shadow-lg">
                  Build Fresher Resume Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/free-ats-checker">
                <Button size="lg" variant="outline" className="border-border hover:bg-surface-elevated font-semibold gap-2">
                  Check Existing Resume Score
                </Button>
              </Link>
            </div>
          </section>

          {/* Section: What Recruiters Look For */}
          <section className="space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-2xl font-bold tracking-tight">
                What Indian Recruiters Actually Look for in a Fresher Resume
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Whether applying through On-Campus drives, Naukri, or LinkedIn referrals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-surface border-border">
                <CardContent className="pt-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-text-primary">Proof of Execution</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Recruiters discard resumes with just &quot;Knowledge of Java & Python&quot;. They want GitHub repositories, hosted demo links, or LeetCode/HackerRank profiles proving you can build working software.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardContent className="pt-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-text-primary">Academic Eligibility</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Mass recruiters (TCS NQT, Infosys DSE, Wipro Turbo) set strict cutoff criteria (typically 60% or 6.5+ CGPA). State your board percentages and branch clearly to clear automated screens.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardContent className="pt-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-text-primary">Validated Upskilling</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Industry-recognized certifications (AWS Certified Cloud Practitioner, Oracle Java, NPTEL Elite, Google Cloud) immediately elevate you above candidates with plain syllabi coursework.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section: Complete Section-by-Section Breakdown */}
          <section className="space-y-8">
            <div className="border-b border-border pb-4">
              <h2 className="text-2xl font-bold tracking-tight">
                Recommended Fresher Resume Structure (Top to Bottom)
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Follow this exact hierarchy for maximum readability and ATS character indexing
              </p>
            </div>

            <div className="space-y-6">
              {/* Part 1 */}
              <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent/20 text-accent font-extrabold flex items-center justify-center text-sm">
                    1
                  </span>
                  <h3 className="text-lg font-bold text-text-primary">Contact Header (Essential Data Only)</h3>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Include: Full Name, Professional Email (e.g. <code>rahul.sharma.dev@gmail.com</code>), Mobile Number with <code>+91</code>, City & State, LinkedIn URL, and GitHub Profile.
                </p>
                <div className="bg-surface-elevated/60 p-3 rounded-lg text-xs font-mono text-text-muted border border-border/50">
                  Rahul Sharma | Bengaluru, Karnataka | +91 98765 43210 | rahul.dev@gmail.com | linkedin.com/in/rahul-dev | github.com/rahul-codes
                </div>
              </div>

              {/* Part 2 */}
              <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent/20 text-accent font-extrabold flex items-center justify-center text-sm">
                    2
                  </span>
                  <h3 className="text-lg font-bold text-text-primary">Career Objective (Targeted, Not Generic)</h3>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Never write: <em>&quot;Seeking a challenging position in a reputed company to utilize my skills...&quot;</em>. Instead, specify your tech stack and target role:
                </p>
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-xs text-text-primary leading-relaxed">
                  <strong>Recommended Example:</strong> &quot;B.Tech Computer Science graduate (8.4 CGPA) skilled in Java, Spring Boot, and PostgreSQL. Built and deployed 3 full-stack web applications with RESTful APIs. Seeking an Associate Software Engineer role at a fast-scaling tech enterprise.&quot;
                </div>
              </div>

              {/* Part 3 */}
              <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent/20 text-accent font-extrabold flex items-center justify-center text-sm">
                    3
                  </span>
                  <h3 className="text-lg font-bold text-text-primary">Education Section</h3>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  List your highest degree first. Include Degree name, College/University, Graduation Year, and CGPA or Percentage.
                </p>
                <ul className="text-xs sm:text-sm text-text-secondary space-y-1.5 pl-4 list-disc">
                  <li><strong>Bachelor of Technology in Information Technology</strong> | SRM Institute of Science & Technology | 2022 – 2026 | CGPA: 8.6/10</li>
                  <li><strong>Senior Secondary (Class XII, CBSE)</strong> | Delhi Public School | 2022 | 89.4%</li>
                </ul>
              </div>

              {/* Part 4 */}
              <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent/20 text-accent font-extrabold flex items-center justify-center text-sm">
                    4
                  </span>
                  <h3 className="text-lg font-bold text-text-primary">Academic & Personal Projects (The Heart of Your Resume)</h3>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  List 2 to 3 substantive projects. For each project, write 2–3 bullet points using the <strong>Action Verb + Task + Impact (Metrics)</strong> formula:
                </p>
                <div className="bg-surface-elevated/70 border border-border p-4 rounded-xl space-y-2 text-xs text-text-secondary">
                  <div className="flex items-center justify-between font-bold text-text-primary">
                    <span>E-Commerce Microservices Engine | React, Spring Boot, MySQL, Docker</span>
                    <span className="text-accent font-mono text-[11px]">github.com/rahul/ecommerce-api</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Architected REST APIs handling user authentication, order processing, and payment gateway webhooks.</li>
                    <li>Integrated Redis cache layer, reducing database query response times by 35% during peak load testing.</li>
                    <li>Containerized services with Docker and deployed on AWS EC2 with CI/CD GitHub Actions pipeline.</li>
                  </ul>
                </div>
              </div>

              {/* Part 5 */}
              <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent/20 text-accent font-extrabold flex items-center justify-center text-sm">
                    5
                  </span>
                  <h3 className="text-lg font-bold text-text-primary">Technical Skills Categorization</h3>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Group skills logically into categories so both recruiters and ATS parsers index them immediately:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-surface-elevated/50 border border-border/60 rounded-lg">
                    <span className="font-bold text-text-primary block mb-1">Programming Languages:</span>
                    Java (Core & Advanced), Python, JavaScript (ES6+), C++
                  </div>
                  <div className="p-3 bg-surface-elevated/50 border border-border/60 rounded-lg">
                    <span className="font-bold text-text-primary block mb-1">Frameworks & Libraries:</span>
                    React.js, Node.js, Express, Spring Boot, Tailwind CSS
                  </div>
                  <div className="p-3 bg-surface-elevated/50 border border-border/60 rounded-lg">
                    <span className="font-bold text-text-primary block mb-1">Databases:</span>
                    PostgreSQL, MySQL, MongoDB, Redis
                  </div>
                  <div className="p-3 bg-surface-elevated/50 border border-border/60 rounded-lg">
                    <span className="font-bold text-text-primary block mb-1">Tools & Platforms:</span>
                    Git, GitHub, Docker, Postman, Linux CLI, AWS Basics
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Common Mistakes */}
          <section className="space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-2xl font-bold tracking-tight text-rose-400">
                Top 5 Mistakes That Cause Fresher Resume Rejections
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Avoid these pitfalls to ensure your resume reaches the HR interview round
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-400 text-sm">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>1. Skill Rating Percentage Bars</span>
                </div>
                <p className="text-xs text-text-secondary">
                  Writing &quot;Java: 90%&quot; or &quot;C++: ★★★★☆&quot; is meaningless to recruiters and confuses ATS resume scanners. List skills cleanly without arbitrary graphics.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-400 text-sm">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>2. Irrelevant Personal Information</span>
                </div>
                <p className="text-xs text-text-secondary">
                  Including marital status, religion, caste, father&apos;s occupation, or full permanent home addresses wastes valuable space. Modern employers only need your city and phone number.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-400 text-sm">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>3. Multi-Column Canva Templates</span>
                </div>
                <p className="text-xs text-text-secondary">
                  Fancy 2-column or 3-column designs with custom icons frequently get parsed in the wrong reading order by ATS software like Taleo or Workday. Use a single-column layout.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-400 text-sm">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>4. No GitHub or Project Links</span>
                </div>
                <p className="text-xs text-text-secondary">
                  If you claim you built a &quot;Hospital Management System&quot; or &quot;Weather App&quot;, provide a clickable GitHub or live Vercel URL. Otherwise, recruiters assume it was a copied tutorial.
                </p>
              </div>
            </div>
          </section>

          {/* Section: FAQs */}
          <section className="space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-2xl font-bold tracking-tight">
                Frequently Asked Questions (Freshers & Campus Placements)
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-5 rounded-2xl bg-surface border border-border space-y-2">
                  <h3 className="font-bold text-base text-text-primary flex items-start gap-2">
                    <span className="text-accent font-mono text-sm">Q{index + 1}:</span>
                    {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary pl-6 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action Banner */}
          <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-surface to-surface-elevated border border-accent/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="space-y-2 max-w-2xl mx-auto">
              <Badge className="bg-accent/20 text-accent border-accent/40 font-bold mb-2">
                Free Instant ATS Scanner
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                Is Your Fresher Resume Ready for Placements?
              </h2>
              <p className="text-sm text-text-secondary">
                Upload your resume to get an instant ATS score, keyword gap analysis, and tailored recommendations before you apply.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/free-ats-checker">
                <Button size="lg" className="bg-accent hover:bg-accent-hover text-white font-bold gap-2">
                  Check Resume ATS Score Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/ai-resume-builder">
                <Button size="lg" variant="outline" className="border-border hover:bg-surface-elevated font-semibold">
                  Create with AI Resume Builder
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
