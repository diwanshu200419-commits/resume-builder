import { type Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "How to Pass ATS in 2026: Make Your Resume ATS-Friendly | VayloAI",
  description:
    "Learn how ATS systems work and how to make your resume pass every ATS filter. Free ATS checker for Indian job seekers. Beat the bots and get interviews.",
  keywords: [
    "ATS resume tips India",
    "how to pass ATS",
    "ATS friendly resume",
    "beat ATS system",
    "applicant tracking system resume",
  ],
  alternates: {
    canonical: `${APP_URL}/ats-resume-guide`,
  },
  openGraph: {
    title: "How to Pass ATS in 2026: Make Your Resume ATS-Friendly | VayloAI",
    description:
      "Learn how ATS systems work and how to make your resume pass every ATS filter. Free ATS checker for Indian job seekers. Beat the bots and get interviews.",
    url: `${APP_URL}/ats-resume-guide`,
    siteName: "VayloAI",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Pass ATS in 2026: Make Your Resume ATS-Friendly | VayloAI",
    description:
      "Learn how ATS systems work and how to make your resume pass every ATS filter. Free ATS checker for Indian job seekers. Beat the bots and get interviews.",
    creator: "@vayloai",
  },
};

export default function ATSResumeGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "ATS Resume Guide",
            item: `${APP_URL}/ats-resume-guide`,
          },
        ],
      },
      {
        "@type": "Article",
        headline: "How to Make Your Resume Pass ATS in 2026",
        description:
          "Complete guide to making your resume ATS-friendly for Indian job seekers in 2026. Covers formatting, keywords, and common mistakes.",
        author: { "@type": "Organization", name: "VayloAI" },
        publisher: {
          "@type": "Organization",
          name: "VayloAI",
          url: APP_URL,
        },
        url: `${APP_URL}/ats-resume-guide`,
        datePublished: "2026-01-01",
        dateModified: "2026-10-01",
        mainEntityOfPage: `${APP_URL}/ats-resume-guide`,
        keywords:
          "ATS resume, applicant tracking system, ATS friendly resume India, how to pass ATS",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is ATS (Applicant Tracking System)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "ATS (Applicant Tracking System) is software used by 90% of large companies — including Infosys, TCS, Wipro, Flipkart, and FAANG India offices — to automatically screen, rank, and filter resumes before a human recruiter ever reads them. It parses your resume for keywords, skills, job titles, and formatting compliance.",
            },
          },
          {
            "@type": "Question",
            name: "Do Indian companies use ATS systems?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Most large Indian IT and product companies use ATS platforms. Infosys, TCS, Wipro, HCL, and Accenture India use enterprise ATS tools. Product companies like Flipkart, Swiggy, Meesho, and FAANG India offices (Google, Microsoft, Amazon) use platforms like Greenhouse, Lever, and Workday. Even mid-sized startups increasingly use tools like Zoho Recruit or Freshteam.",
            },
          },
          {
            "@type": "Question",
            name: "Why do resumes fail ATS screening?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Resumes fail ATS for several reasons: using tables, columns, or graphics that confuse parsers; missing job-relevant keywords; using non-standard section headings; submitting in the wrong file format; having inconsistent date formats; and including headers/footers with contact information that ATS systems often skip.",
            },
          },
          {
            "@type": "Question",
            name: "What file format is best for ATS — PDF or Word?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Both .docx (Word) and .pdf formats work, but .docx is more universally parsed by older ATS platforms. Modern systems like Greenhouse and Lever handle PDFs well. When in doubt, submit .docx unless the job posting specifically requests PDF. Avoid image-based PDFs at all costs.",
            },
          },
          {
            "@type": "Question",
            name: "How do I find the right keywords for ATS?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Copy the job description and identify the most frequently repeated technical skills, tools, and role titles. Mirror that exact language in your resume — if the JD says 'React.js', don't write 'ReactJS'. Use VayloAI's free ATS checker to match your resume keywords against a job description automatically.",
            },
          },
          {
            "@type": "Question",
            name: "Can ATS read resumes with tables or columns?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Most ATS systems struggle with multi-column layouts, tables, text boxes, and images. They read left to right, top to bottom, and will garble or skip content inside table cells. Always use a single-column, linear format for ATS-safe resumes. Reserve fancy templates for personal portfolio sites or emailed PDFs to known contacts.",
            },
          },
        ],
      },
    ],
  };

  const atsTips = [
    {
      num: "01",
      title: "Use a single-column layout",
      desc: "Multi-column resumes confuse ATS parsers. Text in the right column often gets read out of order or skipped entirely. Stick to one clean column.",
    },
    {
      num: "02",
      title: "Use standard section headings",
      desc: 'Name your sections exactly: "Work Experience", "Education", "Skills", "Certifications". Creative names like "My Journey" or "What I Bring" confuse parsers.',
    },
    {
      num: "03",
      title: "Mirror keywords from the job description",
      desc: "Copy the exact phrasing used in the JD. If they say 'Python (Django)', write 'Python (Django)' — not just 'Python'. Exact match wins.",
    },
    {
      num: "04",
      title: "Spell out abbreviations at least once",
      desc: "Write 'Machine Learning (ML)' the first time. Some ATS systems search for the full term, not the acronym.",
    },
    {
      num: "05",
      title: "Avoid headers and footers for contact info",
      desc: "Many ATS tools skip content in header/footer areas. Place your name, email, phone, and LinkedIn URL in the main body of the document.",
    },
    {
      num: "06",
      title: "Use consistent date formats",
      desc: "Pick one format and stick to it: 'Jan 2023 – Present' or '2023–Present'. Inconsistent dates confuse timeline parsing algorithms.",
    },
    {
      num: "07",
      title: "Submit .docx or clean .pdf (not scanned)",
      desc: "Never submit a scanned image of your resume. ATS cannot read images. Use a text-based PDF or Word document.",
    },
    {
      num: "08",
      title: "Include a dedicated Skills section",
      desc: "Place a Skills section near the top with a comma-separated or bulleted list of your core technical and soft skills. ATS specifically scans this area.",
    },
    {
      num: "09",
      title: "Quantify achievements but keep them text-based",
      desc: "Numbers are great: 'Reduced API response time by 40%'. But put them in plain text bullet points, not charts or progress bars.",
    },
    {
      num: "10",
      title: "Check your ATS score before applying",
      desc: "Use VayloAI's free ATS checker to see your keyword match score, formatting issues, and exactly what a bot will read before you submit.",
    },
  ];

  const rejectionReasons = [
    {
      reason: "Wrong file format",
      detail:
        "Submitting image-based PDFs, .pages files (Mac), or .odt documents. Many ATS systems only reliably parse .docx and text-based .pdf files.",
    },
    {
      reason: "Multi-column or table-based layout",
      detail:
        "The most common mistake. Fancy two-column templates from Canva or Zety often have their right column entirely skipped by ATS parsers.",
    },
    {
      reason: "Missing keywords",
      detail:
        "Your resume doesn't contain the exact technical skills or role titles from the job description. An ATS looking for 'Node.js' won't match 'NodeJS'.",
    },
    {
      reason: "Non-standard section headings",
      detail:
        "Headings like 'Professional Journey', 'Core Competencies Showcase', or 'Things I've Built' confuse parsers trained on standard headings.",
    },
    {
      reason: "Contact info in headers/footers",
      detail:
        "Many ATS systems skip the header/footer region entirely, meaning your resume may be imported with no name or email attached.",
    },
    {
      reason: "Embedded images, charts, and icons",
      detail:
        "Profile photos, skill rating bars, pie charts, and decorative icons are invisible to ATS. Worse, they can corrupt the text around them.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs text-text-muted flex items-center gap-1.5">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <span className="text-text-secondary">ATS Resume Guide</span>
          </nav>

          {/* Hero */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
              ✦ Updated for 2026
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
              How to Make Your Resume Pass{" "}
              <span className="text-gradient">ATS in 2026</span>
            </h1>

            {/* Featured snippet / AEO paragraph */}
            <div className="p-5 rounded-2xl border border-accent/20 bg-accent/5">
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                <strong className="text-text-primary">Quick answer:</strong> ATS (Applicant Tracking System) is software used by{" "}
                <strong className="text-text-primary">90% of large companies</strong> to filter resumes before a human sees them.
                To pass ATS, your resume must use{" "}
                <strong className="text-text-primary">standard formatting</strong>, include{" "}
                <strong className="text-text-primary">job-relevant keywords</strong>, and avoid{" "}
                <strong className="text-text-primary">graphics, tables, and multi-column layouts</strong>.
              </p>
            </div>

            <p className="text-text-secondary text-sm leading-relaxed">
              In India, large IT companies like TCS, Infosys, Wipro, and HCL process thousands of applications per opening using ATS platforms.
              Product companies (Flipkart, Meesho, Swiggy, PhonePe) and FAANG India offices use enterprise ATS tools like Greenhouse, Lever, and Workday.
              If your resume isn't ATS-optimized, a recruiter may never see it — no matter how qualified you are.
            </p>
          </div>

          {/* What Is ATS */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-text-primary">What Is ATS and How Does It Work?</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              An <strong className="text-text-primary">Applicant Tracking System (ATS)</strong> is HR software that automates the collection,
              sorting, and ranking of job applications. When you apply on Naukri, LinkedIn, or a company's career page, your resume is
              typically parsed by an ATS long before it reaches a human recruiter.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  step: "Step 1",
                  title: "Parse",
                  desc: "ATS extracts your contact info, work history, skills, and education from your resume's raw text.",
                  color: "indigo",
                },
                {
                  step: "Step 2",
                  title: "Match",
                  desc: "It compares your parsed data against the job description, scoring your resume based on keyword overlap and role relevance.",
                  color: "accent",
                },
                {
                  step: "Step 3",
                  title: "Rank",
                  desc: "Resumes are ranked by match score. Only the top-scoring candidates are surfaced to human recruiters.",
                  color: "emerald",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`p-5 rounded-xl border border-border bg-surface space-y-2`}
                >
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{item.step}</span>
                  <h3 className="text-base font-bold text-text-primary">{item.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Popular ATS platforms used by Indian companies include{" "}
              <strong className="text-text-primary">Greenhouse</strong>,{" "}
              <strong className="text-text-primary">Lever</strong>,{" "}
              <strong className="text-text-primary">Workday</strong>,{" "}
              <strong className="text-text-primary">iCIMS</strong>,{" "}
              <strong className="text-text-primary">Zoho Recruit</strong>, and{" "}
              <strong className="text-text-primary">Freshteam</strong>.
              Each has slightly different parsing behavior, but all share the same core requirements: clean text, standard formatting, and relevant keywords.
            </p>
          </section>

          {/* Why resumes get rejected */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-text-primary">Why Your Resume Gets Rejected by ATS</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Studies show that over{" "}
              <strong className="text-text-primary">75% of resumes are rejected by ATS</strong> before a human sees them.
              Here are the most common reasons — most of which are completely avoidable:
            </p>
            <div className="space-y-3">
              {rejectionReasons.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-xl border border-border bg-surface/60"
                >
                  <div className="shrink-0 w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs">
                    ✕
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{item.reason}</p>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ATS Optimization Checklist */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-text-primary">How to Optimize Your Resume for ATS — 10 Actionable Tips</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Follow this checklist before submitting any resume to a company using ATS. Each tip directly improves your parse rate and keyword match score.
            </p>
            <div className="space-y-3">
              {atsTips.map((tip) => (
                <div
                  key={tip.num}
                  className="flex gap-4 p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors"
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-extrabold text-xs">
                    {tip.num}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{tip.title}</p>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ATS-Safe Formatting Rules */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-text-primary">ATS-Safe Formatting Rules</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Formatting is where most Indian job seekers go wrong. Canva, Novoresume, and many free templates look great visually but are
              ATS disasters. Here are the non-negotiable formatting rules:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { do: true, rule: "Use standard fonts: Arial, Calibri, Times New Roman, or Garamond (11–12pt)" },
                { do: false, rule: "Use decorative fonts, colored text in body, or font sizes below 10pt" },
                { do: true, rule: "Use bullet points (•) for experience descriptions" },
                { do: false, rule: "Use icons, emojis, star ratings, or progress bars for skills" },
                { do: true, rule: "Keep margins between 0.5 and 1 inch on all sides" },
                { do: false, rule: "Use text boxes, shapes, or Word Art elements" },
                { do: true, rule: "Use reverse-chronological order for work experience" },
                { do: false, rule: "Include a profile photo (wastes space and can cause bias or parsing errors)" },
                { do: true, rule: "Include a hyperlinked LinkedIn URL and GitHub in plain text" },
                { do: false, rule: "Use tables to structure skills or education sections" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg ${item.do ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-rose-500/5 border border-rose-500/20"}`}
                >
                  <span className={`shrink-0 font-bold text-sm ${item.do ? "text-emerald-400" : "text-rose-400"}`}>
                    {item.do ? "✓" : "✕"}
                  </span>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.rule}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Keywords Section */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-text-primary">Keywords: The Most Important ATS Factor</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Keyword matching is the primary mechanism ATS uses to score your resume. Getting this right is the single biggest lever you can pull
              to improve your ATS pass rate. Here's how to do it systematically:
            </p>
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-border bg-surface space-y-2">
                <h3 className="text-sm font-bold text-text-primary">Step 1 — Deconstruct the Job Description</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Copy the JD into a text editor. Highlight every technical skill, tool, framework, and role title mentioned.
                  Pay special attention to skills mentioned multiple times — those are the highest-weight keywords.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border bg-surface space-y-2">
                <h3 className="text-sm font-bold text-text-primary">Step 2 — Match Exact Phrasing</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Use the exact words from the JD. If the posting says "REST APIs", don't write "RESTful web services".
                  If it says "AWS (EC2, S3, Lambda)", include those exact service names. ATS pattern-matching is often literal.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border bg-surface space-y-2">
                <h3 className="text-sm font-bold text-text-primary">Step 3 — Distribute Keywords Naturally</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Place keywords in your Summary, Skills, and Work Experience sections. Don't keyword-stuff — use each skill in context.
                  Legitimate experience backed by keywords scores far better than a keyword list with no supporting experience.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border bg-surface space-y-2">
                <h3 className="text-sm font-bold text-text-primary">Step 4 — Use VayloAI to Automate This</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Our AI resume builder and ATS checker automatically identifies missing keywords from your target job description,
                  suggests where to add them, and shows your real-time match score.{" "}
                  <Link href="/ai-resume-builder" className="text-accent hover:underline font-semibold">
                    Try the AI Resume Builder →
                  </Link>
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-border bg-surface-elevated/60">
              <h3 className="text-sm font-bold text-text-primary mb-3">High-Value Keywords for Indian Tech Roles (2026)</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Python", "Java", "React.js", "Node.js", "AWS", "Docker", "Kubernetes",
                  "SQL", "PostgreSQL", "MongoDB", "REST APIs", "Microservices", "CI/CD",
                  "Git", "Agile", "Scrum", "System Design", "LLMs", "GenAI", "Spring Boot",
                  "TypeScript", "Next.js", "Redis", "Kafka", "Terraform", "GCP", "Azure",
                ].map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 rounded-md bg-surface border border-border text-xs text-text-secondary font-mono"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Free ATS Checker CTA */}
          <section className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-background to-background p-8 space-y-5 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
              ✦ Free Tool — No Sign-up Required
            </div>
            <h2 className="text-2xl font-bold text-text-primary">
              Check Your Resume&apos;s ATS Score for Free
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xl mx-auto">
              Upload your resume and paste a job description. VayloAI&apos;s ATS checker will give you a keyword match score,
              identify formatting issues, and show you exactly what the bots will read. No account needed.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent-hover text-white font-bold shadow-lg shadow-accent/20">
                <Link href="/free-ats-resume-checker">
                  ✦ Check My ATS Score Free
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border text-text-primary font-semibold">
                <Link href="/ai-resume-builder">
                  Build ATS-Ready Resume →
                </Link>
              </Button>
            </div>
            <p className="text-xs text-text-muted">
              Trusted by 10,000+ Indian job seekers · Works for Naukri, LinkedIn, and company career portals
            </p>
          </section>

          {/* FAQ */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-text-primary">Frequently Asked Questions About ATS</h2>
            <div className="space-y-3">
              {[
                {
                  q: "What is ATS (Applicant Tracking System)?",
                  a: "ATS is software used by 90% of large companies — including TCS, Infosys, Flipkart, and FAANG India offices — to automatically screen, rank, and filter resumes. It parses your resume for keywords, skills, and formatting before a human recruiter sees it.",
                },
                {
                  q: "Do Indian companies use ATS systems?",
                  a: "Yes. Most large Indian IT and product companies use ATS platforms. Service companies use enterprise tools; product companies (Flipkart, Swiggy, Meesho) use Greenhouse and Lever; startups use Zoho Recruit or Freshteam.",
                },
                {
                  q: "Why do resumes fail ATS screening?",
                  a: "The most common reasons: multi-column layouts, missing keywords, non-standard section headings, wrong file format, contact info in headers/footers, and embedded images or charts.",
                },
                {
                  q: "What file format is best for ATS — PDF or Word?",
                  a: ".docx is safest for older ATS systems. Modern platforms handle text-based PDFs well. Never submit scanned image PDFs.",
                },
                {
                  q: "How do I find the right keywords for ATS?",
                  a: "Analyze the job description and mirror the exact technical skills and role titles used. Use VayloAI's free ATS checker to automate keyword gap analysis.",
                },
                {
                  q: "Can ATS read resumes with tables or columns?",
                  a: "No — most ATS systems struggle with tables and multi-column layouts. They read linearly (top to bottom, left to right) and will garble or skip table content. Use a single-column format.",
                },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl border border-border bg-surface space-y-2">
                  <h3 className="text-sm font-bold text-text-primary">{item.q}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Internal links */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-text-primary">Continue Learning</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "How to Write a Resume (Step-by-Step)", href: "/how-to-write-a-resume" },
                { label: "Resume Tips for Indian Job Seekers", href: "/resume-tips" },
                { label: "Interview Preparation with AI", href: "/interview-preparation" },
                { label: "Pricing — Start for Free", href: "/pricing" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface hover:border-accent/40 hover:text-accent transition-all text-sm font-medium text-text-secondary"
                >
                  {link.label}
                  <span className="text-accent">→</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className="rounded-2xl border border-border bg-surface p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-text-primary">Ready to Beat the ATS Bots?</h2>
            <p className="text-text-secondary text-sm">
              Build an ATS-optimized resume with VayloAI in under 10 minutes. Our AI handles keyword matching, formatting, and impact bullet writing so you can focus on getting interviews — not chasing bots.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent-hover text-white font-bold shadow-md shadow-accent/20">
              <Link href="/signup">Get Started Free — No Credit Card</Link>
            </Button>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
