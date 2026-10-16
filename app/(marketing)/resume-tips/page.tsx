import { type Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileText,
  Zap,
  Target,
  GraduationCap,
} from "lucide-react";

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "25 Resume Tips That Get You Hired in 2026 | VayloAI",
  description:
    "Top 25 resume tips for Indian job seekers in 2026. Expert advice for freshers, software engineers, and MBAs. Make your resume ATS-proof and recruiter-ready.",
  keywords: [
    "resume tips",
    "resume tips for freshers India",
    "resume writing tips 2026",
    "resume tips for software engineers",
    "ATS resume tips India",
    "professional resume tips",
    "resume tips India 2026",
    "VayloAI",
  ],
  alternates: {
    canonical: `${APP_URL}/resume-tips`,
  },
  openGraph: {
    title: "25 Resume Tips That Get You Hired in 2026 | VayloAI",
    description:
      "Top 25 resume tips for Indian job seekers in 2026. Expert advice for freshers, software engineers, and MBAs. Make your resume ATS-proof and recruiter-ready.",
    url: `${APP_URL}/resume-tips`,
    siteName: "VayloAI",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "25 Resume Tips That Get You Hired in 2026 | VayloAI",
    description:
      "Top 25 resume tips for Indian job seekers in 2026. Expert advice for freshers, software engineers, and MBAs. Make your resume ATS-proof and recruiter-ready.",
    creator: "@vayloai",
  },
};

type Tip = {
  num: number;
  title: string;
  desc: string;
};

const formattingTips: Tip[] = [
  {
    num: 1,
    title: "Use a single-column layout",
    desc: "Multi-column resumes look impressive to the eye but fail ATS parsing catastrophically. Stick to a clean, single-column format. All major ATS systems — Workday, Greenhouse, Taleo — parse single-column resumes most reliably.",
  },
  {
    num: 2,
    title: "Choose the right font and size",
    desc: "Use professional, highly readable fonts: Calibri (11pt), Arial (11pt), or Georgia (11pt) for body text, and 13-14pt for your name. Avoid decorative fonts like Comic Sans or Papyrus. Font consistency signals professionalism.",
  },
  {
    num: 3,
    title: "Keep margins at 0.5–1 inch",
    desc: "Narrow margins (below 0.5 inch) make text feel cramped and risk content getting cut in some ATS. Wide margins waste valuable space. A 0.75 inch margin on all sides is the sweet spot.",
  },
  {
    num: 4,
    title: "Limit resume length based on experience",
    desc: "Freshers and candidates with under 5 years of experience: 1 page. Senior professionals with 5–15 years: up to 2 pages. Never exceed 2 pages, regardless of experience. Brevity shows communication mastery.",
  },
  {
    num: 5,
    title: "Use consistent date formats",
    desc: "Pick one format and stick to it throughout: 'Jan 2022 – Mar 2024' or '01/2022 – 03/2024'. Inconsistent date formats confuse both ATS software and human readers scanning quickly.",
  },
  {
    num: 6,
    title: "Keep whitespace intentional, not empty",
    desc: "Whitespace improves readability, but excessive blank space signals that you lack content. Every section should have purpose. If you have blank space at the bottom, add a projects or certifications section.",
  },
  {
    num: 7,
    title: "Use clear, standard section headings",
    desc: "Label sections with universally recognized names: 'Work Experience' (not 'My Journey'), 'Education' (not 'Academic Background'), 'Skills' (not 'My Toolbox'). ATS systems match standard headings to extract data.",
  },
  {
    num: 8,
    title: "Save as PDF — unless told otherwise",
    desc: "PDF preserves your formatting perfectly across all devices and operating systems. Only submit DOCX if the job posting explicitly requests it. Never submit .pages, .odt, or image formats.",
  },
];

const contentTips: Tip[] = [
  {
    num: 9,
    title: "Write a targeted resume summary",
    desc: "Craft a 2-4 line summary that mirrors the job description's language. Include your years of experience, top 2-3 skills, and one impressive achievement. 'Senior Java Developer with 6 years at Wipro, specializing in microservices architecture and reducing deployment times by 60%.'",
  },
  {
    num: 10,
    title: "Quantify every bullet point",
    desc: "Numbers transform vague duties into powerful achievements. Replace 'Worked on backend APIs' with 'Developed 15+ RESTful APIs in Django, handling 100K+ daily requests with 99.9% uptime.' Add percentages, INR values, user counts, or time savings.",
  },
  {
    num: 11,
    title: "Lead every bullet point with a strong action verb",
    desc: "Start each bullet with a past-tense action verb: Built, Developed, Led, Optimized, Reduced, Increased, Architected, Delivered, Mentored, Automated. Avoid passive phrases like 'Was responsible for' or 'Helped with'.",
  },
  {
    num: 12,
    title: "Prioritize your most relevant experience",
    desc: "Within each role, lead with the most relevant and impressive bullets for the target job. Recruiters spend an average of 6-7 seconds scanning a resume — the first 2 bullets per role get the most attention.",
  },
  {
    num: 13,
    title: "Tailor your skills section to the job description",
    desc: "Don't list every tool you've ever touched. Curate your skills section to reflect what the job description requires. If the role asks for AWS, put AWS prominently — don't bury it in a wall of text.",
  },
  {
    num: 14,
    title: "Include relevant certifications",
    desc: "Certifications from AWS, Google Cloud, Microsoft, NPTEL, Coursera, and Udemy add credibility and keywords. Always list: certification name, issuing body, and year. Certifications from globally recognized bodies carry more weight than local ones.",
  },
  {
    num: 15,
    title: "Add a projects section with links",
    desc: "Include 2-3 relevant projects with: project name, 1-line description, tech stack, your role, and a GitHub or live link. Projects are especially powerful for freshers and career changers with limited formal experience in the new domain.",
  },
  {
    num: 16,
    title: "Proofread for zero typos",
    desc: "A single typo can eliminate you from consideration — especially for roles requiring attention to detail. Use Grammarly, and also read your resume backward to catch errors your eyes skip over. Ask a friend to read it too.",
  },
  {
    num: 17,
    title: "Don't include personal information",
    desc: "Skip date of birth, gender, religion, caste, marital status, and photographs. These details are not relevant to job performance and can introduce unconscious bias. Modern Indian companies, especially in IT and MNCs, explicitly don't want these on resumes.",
  },
];

const atsTips: Tip[] = [
  {
    num: 18,
    title: "Mirror keywords from the job description",
    desc: "Copy key phrases directly from the JD and weave them naturally into your resume. If the JD says 'Agile/Scrum methodology', your resume should say 'Agile/Scrum methodology' — not 'worked in an agile team'. Exact phrase matching boosts your ATS score dramatically.",
  },
  {
    num: 19,
    title: "Avoid tables, columns, text boxes, and images",
    desc: "These elements break ATS text extraction. A beautiful resume that fails ATS parsing is worse than a plain-text resume that scores 85+. Test your resume by copying all text out of the PDF — if it doesn't copy cleanly in order, it will fail ATS.",
  },
  {
    num: 20,
    title: "Don't put critical info in headers or footers",
    desc: "Many ATS systems skip headers and footers when parsing. Put your name and contact information in the main body of the document — not in a fancy header design that looks pretty but gets ignored by software.",
  },
  {
    num: 21,
    title: "Use both spelled-out and abbreviated forms",
    desc: "Write 'Search Engine Optimization (SEO)' or 'Machine Learning (ML)' on first use. Some ATS search for the full form, others for the abbreviation. Using both ensures you match all keyword variations.",
  },
  {
    num: 22,
    title: "Run a free ATS check before every application",
    desc: "VayloAI's free ATS checker scores your resume against any job description in under 30 seconds. It shows you your keyword match rate, missing skills, and formatting issues — allowing you to fix them before you apply and lose your chance.",
  },
];

const fresherTips: Tip[] = [
  {
    num: 23,
    title: "Lead with education if you're a recent graduate",
    desc: "For freshers graduating from IITs, NITs, IIITs, or top private engineering colleges, education is your strongest credential. Place it right after your summary. Include your CGPA if it's 7.5+, relevant coursework, and any academic awards or departmental rank.",
  },
  {
    num: 24,
    title: "Treat internships like full work experience",
    desc: "Internship experience — even 1-2 months — is highly valuable. Describe internship roles with the same quantified bullet format as full-time jobs. Include the company name (even a startup), your role, and specific contributions. A Naukri survey found that resumes with internship experience get 3x more callbacks.",
  },
  {
    num: 25,
    title: "Add college projects with full tech stack details",
    desc: "For B.Tech and MCA freshers with no work experience, projects are the backbone of your resume. Include your final year project, mini projects, hackathon submissions, and any open-source contributions. For each, list: problem solved, technologies used (React, Python, TensorFlow, etc.), your role, and a measurable outcome or link to the GitHub repo.",
  },
];

const faqs = [
  {
    q: "What is the most important resume tip for freshers in India?",
    a: "The single most important tip for freshers is to quantify everything you can, even in projects and internships. Instead of 'Built a website', write 'Built a responsive e-commerce website using React and Node.js with 500+ products and integrated Razorpay for payments.' Specificity is what separates callbacks from silence.",
  },
  {
    q: "How many skills should I list on my resume?",
    a: "List 8-15 relevant skills organized by category. Don't list every tool you've ever heard of — it dilutes your profile. Focus on skills mentioned in the job description and tools you can confidently discuss in an interview.",
  },
  {
    q: "Should I use a resume template or build from scratch?",
    a: "Use a professionally designed, ATS-tested template — but customize it thoroughly. Generic template resumes are spotted immediately. VayloAI's templates are ATS-optimized and recruiter-tested, giving you a strong structural base without sacrificing personalization.",
  },
  {
    q: "How do I write resume bullet points with no work experience?",
    a: "Frame your academic projects, internships, volunteer work, and freelance gigs as experience. Use the STAR format: Situation, Task, Action, Result. For example: 'Developed a face recognition attendance system (Python, OpenCV) as final year project, achieving 94% accuracy and presented to 3 faculty judges.'",
  },
  {
    q: "Is it okay to apply for jobs on Naukri with an older resume?",
    a: "No. Update your resume before every major job search cycle. An outdated resume — with old dates, missing recent skills, or an obsolete format — signals to recruiters (and ATS) that you're not actively engaged. Update at minimum every 6 months.",
  },
];

export default function ResumeTipsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
          { "@type": "ListItem", position: 2, name: "Resume Tips", item: `${APP_URL}/resume-tips` },
        ],
      },
      {
        "@type": "Article",
        headline: "25 Resume Tips That Get You Hired in 2026",
        description:
          "Top 25 resume tips for Indian job seekers in 2026. Expert advice for freshers, software engineers, and MBAs. Make your resume ATS-proof and recruiter-ready.",
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
        datePublished: "2026-01-01",
        dateModified: "2026-10-01",
        mainEntityOfPage: `${APP_URL}/resume-tips`,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  const TipCard = ({ tip }: { tip: Tip }) => (
    <div className="flex gap-4 p-5 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-extrabold text-xs">
        {tip.num}
      </div>
      <div className="space-y-1.5">
        <h3 className="font-bold text-text-primary text-sm">{tip.title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed">{tip.desc}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs text-text-muted flex items-center gap-1.5">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <span className="text-text-secondary font-medium">Resume Tips</span>
          </nav>

          {/* Hero */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-3 py-1 text-xs font-bold text-accent">
              <Sparkles className="w-3.5 h-3.5" /> 25 Expert Tips · Updated October 2026
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
              25 Resume Tips That Get You Hired in 2026
            </h1>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-3xl">
              The most effective resume tips for 2026 focus on three things: ATS optimization, quantified achievements, and targeted customization. Whether you&apos;re a B.Tech fresher applying to your first role at an IT company, a software engineer targeting FAANG, or an MBA graduate seeking management positions, these 25 research-backed tips will transform your resume from a rejection to a callback.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild size="lg" className="bg-accent hover:bg-accent-hover text-white font-bold shadow-lg shadow-accent/20">
                <Link href="/free-ats-checker">
                  <Zap className="w-4 h-4 mr-2" /> Try Free ATS Check
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border text-text-primary hover:bg-surface">
                <Link href="/ai-resume-builder">
                  Build Resume with AI <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { stat: "75%+", label: "Resumes rejected by ATS before human review" },
              { stat: "6 sec", label: "Average recruiter scan time per resume" },
              { stat: "40%", label: "More callbacks with quantified bullets" },
              { stat: "3×", label: "Higher response rate with tailored resumes" },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-surface text-center space-y-1">
                <p className="text-2xl font-extrabold text-accent">{item.stat}</p>
                <p className="text-xs text-text-muted leading-snug">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Section 1: Formatting Tips */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Tips 1–8</p>
                <h2 className="text-xl font-bold text-text-primary">Formatting Tips</h2>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Formatting is the foundation. A brilliantly written resume with broken formatting will be discarded by ATS before it&apos;s ever read. Get this right first.
            </p>
            <div className="space-y-3">
              {formattingTips.map((tip) => <TipCard key={tip.num} tip={tip} />)}
            </div>
          </section>

          {/* Section 2: Content Tips */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Tips 9–17</p>
                <h2 className="text-xl font-bold text-text-primary">Content Tips</h2>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Content is what converts a screened resume into an interview call. These tips focus on the substance of what you write and how you frame your experience and achievements.
            </p>
            <div className="space-y-3">
              {contentTips.map((tip) => <TipCard key={tip.num} tip={tip} />)}
            </div>
          </section>

          {/* Section 3: ATS Tips */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Tips 18–22</p>
                <h2 className="text-xl font-bold text-text-primary">ATS Optimization Tips</h2>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              ATS optimization is non-negotiable in 2026. Companies like TCS, Infosys, Accenture, and most MNCs operating in India use ATS to filter candidates. These tips help you beat the algorithms before a human ever reviews you.
            </p>
            <div className="space-y-3">
              {atsTips.map((tip) => <TipCard key={tip.num} tip={tip} />)}
            </div>
            <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-text-primary text-sm">Check your ATS score right now — it&apos;s free</p>
                <p className="text-xs text-text-secondary">Paste your resume and job description. Get instant keyword analysis and formatting feedback.</p>
              </div>
              <Button asChild className="bg-accent hover:bg-accent-hover text-white font-bold shrink-0">
                <Link href="/free-ats-checker">
                  <Sparkles className="w-4 h-4 mr-1.5" /> Free ATS Check
                </Link>
              </Button>
            </div>
          </section>

          {/* Section 4: Fresher Tips */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Tips 23–25</p>
                <h2 className="text-xl font-bold text-text-primary">Tips for Freshers in India</h2>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Freshers face a unique challenge: competing for jobs with no formal work experience. These 3 tips are specifically designed for B.Tech, BCA, MCA, and MBA graduates entering the Indian job market for the first time.
            </p>
            <div className="space-y-3">
              {fresherTips.map((tip) => <TipCard key={tip.num} tip={tip} />)}
            </div>
          </section>

          {/* Internal Links */}
          <section className="p-6 rounded-xl border border-border bg-surface/50 space-y-4">
            <h2 className="text-lg font-bold text-text-primary">Explore More Resume Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                { label: "How to Write a Resume (Full Guide)", href: "/how-to-write-a-resume", desc: "Complete 8-step resume writing guide for 2026" },
                { label: "Fresher Resume Guide", href: "/fresher-resume-guide", desc: "Resume guide for B.Tech, BCA, and MBA freshers" },
                { label: "AI Resume Builder", href: "/ai-resume-builder", desc: "Build an ATS-proof resume with AI in minutes" },
                { label: "Interview Preparation", href: "/interview-preparation", desc: "AI-powered STAR method interview coaching" },
                { label: "Free ATS Checker", href: "/free-ats-checker", desc: "Instantly score your resume against any JD" },
                { label: "Pricing Plans", href: "/pricing", desc: "From ₹0 free to full career pack at ₹499" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="p-3.5 rounded-lg border border-border bg-surface hover:border-accent/40 transition-all group"
                >
                  <p className="font-semibold text-text-primary group-hover:text-accent transition-colors text-xs">{link.label}</p>
                  <p className="text-text-muted text-xs mt-0.5">{link.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-text-primary">
              Frequently Asked Questions: Resume Tips India
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-xl border border-border bg-surface space-y-2">
                  <h3 className="font-bold text-text-primary text-sm">{faq.q}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center space-y-5 py-10 px-6 rounded-2xl border border-accent/20 bg-accent/5">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-3 py-1 text-xs font-bold text-accent">
              <Sparkles className="w-3.5 h-3.5" /> Trusted by 10,000+ Indian Job Seekers
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              Put These Tips into Action Today
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto text-sm leading-relaxed">
              Use VayloAI to apply every single one of these 25 tips automatically. Our AI resume builder and free ATS checker help you build, optimize, and score your resume — all in one place.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent-hover text-white font-bold shadow-lg shadow-accent/20">
                <Link href="/signup">
                  <Sparkles className="w-4 h-4 mr-2" /> Start Free — No Credit Card
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border text-text-primary hover:bg-surface">
                <Link href="/free-ats-checker">
                  Check My ATS Score <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
