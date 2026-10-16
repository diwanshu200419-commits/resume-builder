import { type Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ArrowRight,
  XCircle,
  Sparkles,
  FileText,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "How to Write a Resume in 2026 — Step-by-Step Guide | VayloAI",
  description:
    "Learn how to write a professional resume in 2026. Step-by-step guide for Indian job seekers, freshers, and experienced professionals. Free ATS check included.",
  keywords: [
    "how to write a resume",
    "resume writing tips India 2026",
    "how to make a resume for freshers",
    "resume writing guide India",
    "professional resume writing",
    "ATS resume tips India",
    "VayloAI",
  ],
  alternates: {
    canonical: `${APP_URL}/how-to-write-a-resume`,
  },
  openGraph: {
    title: "How to Write a Resume in 2026 — Step-by-Step Guide | VayloAI",
    description:
      "Learn how to write a professional resume in 2026. Step-by-step guide for Indian job seekers, freshers, and experienced professionals. Free ATS check included.",
    url: `${APP_URL}/how-to-write-a-resume`,
    siteName: "VayloAI",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Write a Resume in 2026 — Step-by-Step Guide | VayloAI",
    description:
      "Learn how to write a professional resume in 2026. Step-by-step guide for Indian job seekers, freshers, and experienced professionals. Free ATS check included.",
    creator: "@vayloai",
  },
};

const steps = [
  {
    name: "Step 1: Add Your Contact Information",
    text: "Begin your resume with your full name, phone number, professional email address, LinkedIn profile URL, and city/state. For Indian job seekers applying on Naukri or LinkedIn, ensure your phone number includes the +91 country code. Avoid adding unnecessary details like your date of birth, marital status, or a photograph — these are not required by most modern recruiters.",
    icon: "📞",
  },
  {
    name: "Step 2: Write a Powerful Resume Summary",
    text: "A resume summary (2-4 lines) sits right below your contact details and tells recruiters who you are and what you bring. For freshers, frame it as an objective; for experienced professionals, highlight your years of experience, top skills, and a key achievement. Example: 'Full-stack developer with 3 years of experience at TCS, specializing in React and Node.js, with a track record of reducing page load times by 40%.'",
    icon: "✍️",
  },
  {
    name: "Step 3: Detail Your Work Experience",
    text: "List your jobs in reverse chronological order — most recent first. For each role, include the company name, your job title, and the dates of employment (month/year). Use 3-5 bullet points per role and quantify achievements wherever possible. Instead of 'Managed team', write 'Led a 6-member team to deliver a ₹2 Cr project 2 weeks ahead of schedule.' Roles at companies like Infosys, Wipro, or HCL carry strong brand recognition on Indian job portals.",
    icon: "💼",
  },
  {
    name: "Step 4: List Your Education",
    text: "Place your highest degree first. Include the institution name, degree, branch/specialization, and graduation year. Add your CGPA or percentage if it is 7.0+. For freshers from NITs, IITs, or top private colleges, education is a strong differentiator — list it prominently. Mention any relevant coursework, honors, or departmental rank if applicable.",
    icon: "🎓",
  },
  {
    name: "Step 5: Build a Strong Skills Section",
    text: "Create a concise skills section with technical and soft skills relevant to the job description. Group them by category: Programming Languages (Python, Java, C++), Frameworks (Spring Boot, Django, React), Tools (Git, Docker, Jira), and Databases (MySQL, MongoDB). Avoid generic terms like 'good communicator' — instead, demonstrate communication through concrete achievements in your work experience section.",
    icon: "🛠️",
  },
  {
    name: "Step 6: Add Certifications",
    text: "Certifications validate your skills and boost your ATS score significantly. Include certifications from NPTEL, Coursera (Google, IBM, Meta), AWS, Microsoft Azure, or Oracle. List the certification name, issuing authority, and year of completion. Certifications are especially powerful for freshers who lack extensive work experience — they signal initiative and continuous learning.",
    icon: "🏆",
  },
  {
    name: "Step 7: Showcase Projects",
    text: "A strong projects section can set you apart, especially for B.Tech freshers or developers pivoting to a new stack. For each project, include the project name, a 1-line description of what it does, the tech stack used, your specific role, and a quantifiable outcome or impact. Add GitHub or live demo links. For example: 'Built a MERN-stack expense tracker used by 200+ beta users, reducing manual data entry by 70%.'",
    icon: "🚀",
  },
  {
    name: "Step 8: Optimize for ATS",
    text: "Most companies in India — including mid-size IT firms and large MNCs — use Applicant Tracking Systems (ATS) to filter resumes before a human ever reads them. Use a clean, single-column format with standard section headings. Mirror keywords from the job description naturally in your resume. Avoid tables, graphics, headers/footers, and columns — these break ATS parsing. Use a free ATS checker to score your resume before applying.",
    icon: "🤖",
  },
];

const faqs = [
  {
    q: "How long should a resume be in India?",
    a: "For freshers and candidates with less than 5 years of experience, a one-page resume is ideal and strongly preferred by most Indian recruiters. For experienced professionals with 5-10+ years across multiple roles, a two-page resume is acceptable. Never exceed two pages — keep content tight and relevant.",
  },
  {
    q: "Should I include a photo on my resume in India?",
    a: "No. A photo is not required and is increasingly discouraged on Indian resumes, especially for IT and corporate roles. Including a photo can introduce unconscious bias and wastes valuable space. Leading companies like TCS, Infosys, and Flipkart specifically recommend photo-free resumes.",
  },
  {
    q: "What is the best resume format for freshers in 2026?",
    a: "The reverse-chronological format is best for freshers. Lead with a strong objective/summary, followed by education, projects, internships, skills, and certifications. Avoid functional resumes — most ATS systems and Indian recruiters find them difficult to parse.",
  },
  {
    q: "How do I write a resume with no work experience?",
    a: "Focus on internships, college projects, open-source contributions, freelance work, and certifications. Quantify any impact you had, even in academic projects. A strong skills section with relevant technologies and a well-written objective can compensate for lack of formal experience.",
  },
  {
    q: "What is an ATS and why does it matter for Indian job seekers?",
    a: "An ATS (Applicant Tracking System) is software used by companies to scan, filter, and rank resumes based on keyword relevance before a human recruiter reviews them. Over 90% of Fortune 500 companies and many large Indian IT firms use ATS. If your resume fails to pass the ATS, it gets rejected automatically — even if you are highly qualified.",
  },
  {
    q: "Should I tailor my resume for every job application?",
    a: "Yes, ideally. You should customize your resume summary, skills section, and top bullet points to mirror the specific keywords in each job description. VayloAI's AI resume builder can automatically tailor your resume to any job description in under 60 seconds — saving hours of manual editing.",
  },
];

const dos = [
  "Use a clean, single-column layout with standard fonts (Calibri, Arial, Georgia)",
  "Quantify every achievement with numbers, percentages, or outcomes",
  "Tailor your resume keywords to match each job description",
  "Use reverse chronological order for work and education",
  "Include a professional email (firstname.lastname@gmail.com)",
  "Run your resume through a free ATS checker before applying",
  "Use action verbs: Led, Built, Reduced, Increased, Optimized",
  "Save and submit your resume as a PDF unless the employer specifies otherwise",
];

const donts = [
  "Don't use tables, columns, graphics, or text boxes — ATS can't parse them",
  "Don't include your date of birth, gender, or religion",
  "Don't use pronouns (I, me, my) — write in third-person implied",
  "Don't add a photo unless explicitly asked",
  "Don't use the same generic resume for every application",
  "Don't write 'References available on request' — it wastes space",
  "Don't lie or exaggerate — background checks are common in India",
  "Don't use a fancy template with multiple columns or sidebars",
];

export default function HowToWriteAResumePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
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
            name: "How to Write a Resume",
            item: `${APP_URL}/how-to-write-a-resume`,
          },
        ],
      },
      {
        "@type": "HowTo",
        name: "How to Write a Resume in 2026",
        description:
          "A complete step-by-step guide to writing a professional, ATS-optimized resume for Indian job seekers, freshers, and experienced professionals.",
        totalTime: "PT30M",
        supply: [
          { "@type": "HowToSupply", name: "Your work history and education details" },
          { "@type": "HowToSupply", name: "A free VayloAI account" },
          { "@type": "HowToSupply", name: "The job description you are applying for" },
        ],
        tool: [
          { "@type": "HowToTool", name: "VayloAI Resume Builder" },
          { "@type": "HowToTool", name: "VayloAI Free ATS Checker" },
        ],
        step: steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
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
            <span className="text-text-secondary font-medium">How to Write a Resume</span>
          </nav>

          {/* Hero */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-3 py-1 text-xs font-bold text-accent">
              <Sparkles className="w-3.5 h-3.5" /> Updated for 2026 · Indian Job Market
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
              How to Write a Resume in 2026: The Complete Step-by-Step Guide
            </h1>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-3xl">
              To write a professional resume in 2026, follow 8 key steps: start with clear contact information, write a targeted summary, detail your work experience with quantified achievements, list your education, build a keyword-rich skills section, add certifications and projects, and finally optimize the entire document for ATS (Applicant Tracking Systems). This guide covers every step in detail for Indian job seekers, freshers, and experienced professionals applying on Naukri, LinkedIn, or company portals.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="bg-accent hover:bg-accent-hover text-white font-bold shadow-lg shadow-accent/20">
                <Link href="/builder">
                  <Sparkles className="w-4 h-4 mr-2" /> Build My Resume Free
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border text-text-primary hover:bg-surface">
                <Link href="/free-ats-checker">
                  Check My Resume Score <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Why Resumes Get Rejected */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-text-primary">
              Why Your Resume Gets Rejected (Before a Human Reads It)
            </h2>
            <p className="text-text-secondary leading-relaxed">
              According to studies, over 75% of resumes are rejected by ATS software before they ever reach a recruiter. Here are the most common reasons Indian job seekers lose out — and how to fix them:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "ATS-Incompatible Formatting",
                  desc: "Multi-column layouts, tables, sidebars, and graphic-heavy templates break ATS parsers. The software reads your resume as garbled text and discards it.",
                },
                {
                  title: "Missing Keywords",
                  desc: "If your resume doesn't contain the exact keywords from the job description (e.g., 'React.js', 'Agile methodology', 'cross-functional collaboration'), the ATS ranks you low.",
                },
                {
                  title: "Generic, Unquantified Bullet Points",
                  desc: "Writing 'Responsible for backend development' tells recruiters nothing. 'Built REST APIs in Java Spring Boot handling 50K+ requests/day' is what gets callbacks.",
                },
                {
                  title: "Too Long or Too Short",
                  desc: "A 3-page fresher resume signals poor communication skills. A 1-page resume for a 15-year veteran looks like you're hiding something. Match length to your experience level.",
                },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl border border-border bg-surface space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <h3 className="font-bold text-text-primary text-sm">{item.title}</h3>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Step-by-Step Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary">
              The 8-Step Resume Writing Process (2026)
            </h2>
            <div className="space-y-5">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-5 p-6 rounded-xl border border-border bg-surface">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-xl">
                    {step.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-text-primary">{step.name}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ATS vs Human Reader */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-text-primary">
              ATS vs Human Reader: Writing for Both
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Your resume has two audiences: the ATS software and the human recruiter. A great resume satisfies both. Here is how they differ in what they need:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-6 rounded-xl border border-indigo-500/30 bg-indigo-500/5 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-text-primary">What ATS Looks For</h3>
                </div>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" /> Exact keyword matches from the job description</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" /> Standard section headings (Work Experience, Education, Skills)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" /> Clean single-column text without tables or graphics</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" /> Proper date formats (Jan 2023 – Present)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" /> PDF or DOCX file format (not image-based)</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-text-primary">What Recruiters Look For</h3>
                </div>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> Quantified achievements and measurable impact</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> Career progression and growth trajectory</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> Relevant skills and technologies for the role</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> Consistent formatting and professional tone</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> A compelling summary that answers "Why hire this person?"</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed bg-surface border border-border rounded-xl p-4">
              <strong className="text-text-primary">Pro Tip:</strong> Use{" "}
              <Link href="/free-ats-checker" className="text-accent hover:underline font-semibold">VayloAI&apos;s free ATS checker</Link>{" "}
              to instantly see how your resume scores against a specific job description. It pinpoints missing keywords, formatting issues, and section gaps — in under 30 seconds.
            </p>
          </section>

          {/* Do's and Don'ts */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-text-primary">Resume Do&apos;s and Don&apos;ts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-bold text-emerald-400 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4" /> Do&apos;s
                </h3>
                <ul className="space-y-2">
                  {dos.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-rose-400 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <XCircle className="w-4 h-4" /> Don&apos;ts
                </h3>
                <ul className="space-y-2">
                  {donts.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Internal Links */}
          <section className="p-6 rounded-xl border border-border bg-surface/50 space-y-4">
            <h2 className="text-lg font-bold text-text-primary">Related Resume Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                { label: "Free ATS Resume Checker", href: "/free-ats-checker", desc: "Score your resume against any job description instantly" },
                { label: "AI Resume Builder", href: "/ai-resume-builder", desc: "Build a job-winning resume with AI in under 10 minutes" },
                { label: "Interview Preparation", href: "/interview-preparation", desc: "Practice STAR-method answers with AI voice coaching" },
                { label: "Pricing Plans", href: "/pricing", desc: "Plans starting from ₹0 — upgrade when you need more" },
                { label: "Fresher Resume Guide", href: "/fresher-resume-guide", desc: "Specific guide for B.Tech and college freshers" },
                { label: "Resume Tips (25 Tips)", href: "/resume-tips", desc: "Expert tips for formatting, content, and ATS optimization" },
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

          {/* FAQ Section */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-text-primary">
              Frequently Asked Questions: Resume Writing in India
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
              <Sparkles className="w-3.5 h-3.5" /> Free — No Credit Card Required
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              Ready to Write Your Resume?
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto text-sm leading-relaxed">
              Use VayloAI to build a professional, ATS-optimized resume in under 10 minutes. Get a free ATS score, AI-powered bullet points, and expert-designed templates trusted by thousands of Indian job seekers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent-hover text-white font-bold shadow-lg shadow-accent/20">
                <Link href="/signup">
                  <Sparkles className="w-4 h-4 mr-2" /> Build My Resume Free
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
