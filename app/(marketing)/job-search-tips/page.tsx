import { type Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "20 Job Search Tips to Get Hired Faster in India 2026 | VayloAI",
  description:
    "Practical job search tips for Indian professionals and freshers in 2026. How to use LinkedIn, Naukri, referrals, and AI tools to land your dream job faster.",
  keywords: [
    "job search tips India",
    "how to find job in India 2026",
    "job hunting tips freshers",
    "LinkedIn job search tips India",
  ],
  alternates: {
    canonical: `${APP_URL}/job-search-tips`,
  },
  openGraph: {
    title: "20 Job Search Tips to Get Hired Faster in India 2026 | VayloAI",
    description:
      "Practical job search tips for Indian professionals and freshers in 2026. How to use LinkedIn, Naukri, referrals, and AI tools to land your dream job faster.",
    url: `${APP_URL}/job-search-tips`,
    siteName: "VayloAI",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "20 Job Search Tips to Get Hired Faster in India 2026 | VayloAI",
    description:
      "Practical job search tips for Indian professionals and freshers in 2026. How to use LinkedIn, Naukri, referrals, and AI tools to land your dream job faster.",
    creator: "@vayloai",
  },
};

export default function JobSearchTipsPage() {
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
            name: "Job Search Tips",
            item: `${APP_URL}/job-search-tips`,
          },
        ],
      },
      {
        "@type": "Article",
        headline: "20 Job Search Tips to Get Hired Faster in India (2026)",
        description:
          "Practical guide covering LinkedIn, Naukri, referrals, resume optimization, and interview preparation for Indian job seekers in 2026.",
        author: { "@type": "Organization", name: "VayloAI" },
        publisher: {
          "@type": "Organization",
          name: "VayloAI",
          url: APP_URL,
        },
        url: `${APP_URL}/job-search-tips`,
        datePublished: "2026-01-01",
        dateModified: "2026-10-01",
        mainEntityOfPage: `${APP_URL}/job-search-tips`,
        keywords:
          "job search tips India, how to find job India 2026, job hunting freshers, LinkedIn job search",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How long does a job search take in India in 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "On average, a job search in India takes 2–4 months for experienced professionals and 3–6 months for freshers. However, candidates who tailor resumes per application, actively network, and use referrals typically get offers 40–60% faster than those who rely solely on job boards.",
            },
          },
          {
            "@type": "Question",
            name: "Is LinkedIn or Naukri better for job search in India?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Both serve different purposes. Naukri.com has the highest volume of IT and non-IT jobs in India and is preferred by service companies (TCS, Infosys, Wipro). LinkedIn is better for product companies, startups, and FAANG India roles. Use both simultaneously — Naukri for mass applications, LinkedIn for networking and direct recruiter outreach.",
            },
          },
          {
            "@type": "Question",
            name: "How important are referrals for getting a job in India?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Referrals are the single most effective job search strategy in India. Research suggests referred candidates are 4x more likely to get hired and move through the process significantly faster. Most large tech companies (Google, Microsoft, Amazon India, Flipkart) prioritize referred candidates because they skip initial ATS screening.",
            },
          },
          {
            "@type": "Question",
            name: "Should freshers apply to startups or MNCs first?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "It depends on your goals. MNCs (Infosys, TCS, Wipro, HCL) offer structured training, job security, and good starting salaries for freshers — ideal if you want stability. Startups offer faster growth, broader responsibilities, and potentially higher upside, but require more self-direction. Many freshers apply to both and choose based on first offers.",
            },
          },
          {
            "@type": "Question",
            name: "What ATS keywords should freshers include in their resume?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Freshers should include: core technical skills from their coursework (Python, Java, C++, SQL, HTML/CSS, React), frameworks used in projects, tools (Git, VS Code, Jupyter), soft skills (problem-solving, teamwork, communication), relevant certifications (AWS Cloud Practitioner, Google Data Analytics, Meta Frontend), and academic projects with outcomes.",
            },
          },
        ],
      },
    ],
  };

  const tips = [
    // Section 1: Before You Start
    {
      num: 1,
      section: "before",
      title: "Audit and update your resume before sending a single application",
      desc: "Your resume is your first impression in 99% of applications. Update it with your latest experience, quantify achievements with numbers (percentages, team sizes, revenue impact), and run it through an ATS checker to fix formatting issues. Sending an outdated or ATS-broken resume is the #1 mistake job seekers make.",
    },
    {
      num: 2,
      section: "before",
      title: "Optimize your LinkedIn profile to All-Star status",
      desc: "Recruiters on LinkedIn search for candidates daily. An All-Star profile (with photo, headline, About section, 5+ skills, and 3+ recommendations) appears 40x more in recruiter searches. Update your 'Open to Work' status with target role, location preferences, and start date. Add a custom LinkedIn URL (linkedin.com/in/yourname).",
    },
    {
      num: 3,
      section: "before",
      title: "Build a target company list of 20–30 firms",
      desc: "Random applications burn time. Research companies aligned with your skills, values, and career goals. Create a spreadsheet with company name, role, portal link, application date, and follow-up date. For Indian tech seekers: prioritize FAANG India offices, unicorn startups (Razorpay, CRED, Meesho, Zepto), and top-tier IT services if you're a fresher.",
    },
    {
      num: 4,
      section: "before",
      title: "Identify and close your skill gaps before applying",
      desc: "Review 10–15 job descriptions for your target role. List skills you're missing. Prioritize high-frequency gaps and address them with free or affordable courses: Google, AWS, Meta, and Coursera certifications carry real weight on Indian resumes. Even a 4-week certification in a demanded tool (dbt, Terraform, LangChain) can open new doors.",
    },
    {
      num: 5,
      section: "before",
      title: "Build a portfolio or project showcase",
      desc: "For tech roles, working code beats credentials. Create a GitHub profile with 3–5 well-documented projects. Host at least one live project (Vercel, Railway, or Render are free). For non-tech roles, build a portfolio site or Notion page showcasing work samples, case studies, and outcomes. Link this in your resume and LinkedIn headline.",
    },
    // Section 2: Where to Find Jobs
    {
      num: 6,
      section: "where",
      title: "Use Naukri.com with a fully optimized profile",
      desc: "Naukri.com is India's largest job board with millions of listings. Keep your profile updated (Naukri ranks active profiles higher in recruiter searches), attach a keyword-rich resume, and set job alerts for your target roles. Premium features like Naukri Priority Applicant can give you visibility, especially for mass-hiring at service companies.",
    },
    {
      num: 7,
      section: "where",
      title: "Use LinkedIn Jobs with targeted searches and saved searches",
      desc: "LinkedIn's Jobs tab lets you filter by company, location, experience level, and date posted. Save searches and enable alerts. Apply within 24 hours of posting — early applicants get significantly more recruiter views. Use the 'Easy Apply' feature for initial reach but always customize your application for roles you really want.",
    },
    {
      num: 8,
      section: "where",
      title: "Apply directly on company career pages",
      desc: "Bypass Naukri/LinkedIn middlemen for your dream companies. Visit careers.google.com, amazon.jobs, microsoft.com/en-us/careers, and India-specific pages for Flipkart, Swiggy, CRED, and Razorpay. Direct applications often have less competition and go straight into the company's ATS. Bookmark 10–15 company career pages and check weekly.",
    },
    {
      num: 9,
      section: "where",
      title: "Activate your referral network aggressively",
      desc: "Message ex-colleagues, college seniors (LinkedIn alumni search is powerful), professors, and friends at target companies. Be specific: 'I'm applying for the SDE-2 role at Flipkart (job ID: XXXX). Are you able to refer me internally?' Make it easy for them with your ATS-ready resume attached. Referred candidates skip ATS and get direct recruiter attention.",
    },
    {
      num: 10,
      section: "where",
      title: "Attend virtual and in-person job fairs",
      desc: "India has a growing virtual job fair ecosystem. NASSCOM events, IIT/IIM placement fairs (some open to alumni), and startup-focused events (TechSparks, YourStory events) are good hunting grounds. Hackathons hosted by Google, Microsoft, and Amazon India also directly convert to interview calls. Register for relevant upcoming events.",
    },
    // Section 3: How to Apply Effectively
    {
      num: 11,
      section: "apply",
      title: "Tailor your resume for every application — not just skills",
      desc: "Don't send the same resume to every company. Spend 10–15 minutes adjusting your summary, skill keywords, and 2–3 bullet points to match each JD. This single habit can double your call-back rate. Use VayloAI to automate keyword tailoring — paste the JD and get a customized resume in minutes.",
    },
    {
      num: 12,
      section: "apply",
      title: "Write a compelling cover letter for roles you deeply want",
      desc: "Cover letters aren't dead — they differentiate you for competitive roles. Keep it to 3 paragraphs: why this role excites you, what specific experience makes you uniquely valuable, and a confident close. For FAANG India and top startups, a thoughtful cover letter can get you through even when your resume is borderline.",
    },
    {
      num: 13,
      section: "apply",
      title: "Optimize for ATS keywords on every application",
      desc: "For every application, run a quick keyword gap analysis: identify the top 10 technical skills in the JD and verify they appear in your resume. Use VayloAI's free ATS checker to get a match score before hitting submit. Aiming for 70%+ keyword match is a good baseline for most roles.",
    },
    {
      num: 14,
      section: "apply",
      title: "Track every application in a spreadsheet",
      desc: "Build a simple tracker with columns: Company | Role | JD URL | Applied Date | Status | Follow-up Date | Contact Name. Reviewing this weekly keeps you organized and prevents you from applying to the same role twice. Use it to identify patterns — which company types respond most, which roles you advance furthest in.",
    },
    {
      num: 15,
      section: "apply",
      title: "Follow up after 5–7 business days if you don't hear back",
      desc: "A polite follow-up email to the recruiter (find them on LinkedIn) shows enthusiasm and keeps you top-of-mind. Template: 'Hi [Name], I applied for [Role] on [Date] and wanted to briefly check on the status. I'm very interested in the opportunity and happy to provide any additional information.' Keep it short and professional.",
    },
    // Section 4: Interview & Offer Stage
    {
      num: 16,
      section: "interview",
      title: "Prepare STAR-format answers for behavioral questions",
      desc: "Every behavioral interview (tell me about a time you...) should be answered using the STAR method: Situation, Task, Action, Result. Prepare 8–10 stories from your experience that can flex to cover different question types. Practice them aloud — fluency matters as much as content. Use VayloAI's AI interview coach to get live feedback.",
    },
    {
      num: 17,
      section: "interview",
      title: "Do deep company research before every interview",
      desc: "Know the company's recent news, their product, their tech stack, and why they're hiring for this role. For FAANG India interviews, understand the team's domain. For startups, read their funding news, product reviews, and Glassdoor reviews. Reference specific company details in your answers — it signals genuine interest.",
    },
    {
      num: 18,
      section: "interview",
      title: "Practice technical questions out loud, not just in your head",
      desc: "Solving LeetCode in your head and explaining a solution on a live call are completely different skills. Practice speaking your thought process while coding. Use platforms like Pramp (peer mock interviews) or practice with friends. For system design rounds (SDE-2+), practice drawing architectures verbally and defending trade-off decisions.",
    },
    {
      num: 19,
      section: "interview",
      title: "Don't accept the first offer without negotiating",
      desc: "In India, 67% of job offers have negotiation room. Research market rates on Glassdoor, AmbitionBox, and LinkedIn Salary. Come prepared with a range anchored 15–20% above your target. Always negotiate base salary, joining bonus, stock options (for startups/product companies), and remote/hybrid flexibility. The worst answer is 'no', and you can always say 'I need 24–48 hours to consider'.",
    },
    {
      num: 20,
      section: "interview",
      title: "Manage multiple offer timelines strategically",
      desc: "If you're in final rounds at multiple companies, time your offers to land close together. Be transparent with recruiters: 'I'm in final stages with another company — can we expedite the timeline?' Most will accommodate. Having multiple competing offers significantly strengthens your negotiation position for salary and role scope.",
    },
  ];

  const mistakes = [
    "Applying to 100+ jobs with the same generic resume instead of 20 targeted, tailored applications",
    "Only looking on Naukri and ignoring LinkedIn, referrals, and company career pages",
    "Sending applications and waiting passively — no follow-ups, no networking",
    "Ignoring your LinkedIn profile while applying (recruiters check it before calling you)",
    "Accepting the first offer out of anxiety without comparing market rates",
    "Not preparing for behavioral questions — only grinding LeetCode",
    "Applying for roles 3–5 experience levels above your current level with no strategy",
    "Using a visually fancy Canva template that fails ATS and never reaches a recruiter",
  ];

  const sectionMeta: Record<string, { label: string; color: string }> = {
    before: { label: "Before You Start Applying", color: "indigo" },
    where: { label: "Where to Find Jobs in India", color: "accent" },
    apply: { label: "How to Apply Effectively", color: "emerald" },
    interview: { label: "Interview & Offer Stage", color: "violet" },
  };

  const sections = ["before", "where", "apply", "interview"] as const;

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
            <span className="text-text-secondary">Job Search Tips</span>
          </nav>

          {/* Hero */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
              ✦ India Job Market — 2026 Edition
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
              20 Job Search Tips to Get Hired Faster in{" "}
              <span className="text-gradient">India (2026)</span>
            </h1>

            {/* AEO direct-answer intro */}
            <div className="p-5 rounded-2xl border border-accent/20 bg-accent/5">
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                <strong className="text-text-primary">Quick answer:</strong> The fastest way to get a job in India in 2026 is to
                combine a{" "}
                <strong className="text-text-primary">tailored ATS-optimized resume</strong>, active{" "}
                <strong className="text-text-primary">LinkedIn and Naukri presence</strong>, aggressive{" "}
                <strong className="text-text-primary">referral networking</strong>, and consistent{" "}
                <strong className="text-text-primary">interview preparation</strong>. Candidates who do all four typically
                receive offers 2–3x faster than those relying on job boards alone.
              </p>
            </div>

            <p className="text-text-secondary text-sm leading-relaxed">
              India's tech job market in 2026 is more competitive than ever — but also more opportunity-rich. AI, fintech, and deeptech
              sectors are hiring aggressively. Service companies are expanding headcounts. Remote roles are opening opportunities across
              tier-2 cities. The job seekers who win aren't necessarily the most qualified — they're the most strategic.
              This guide gives you the exact playbook, tip by tip.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="p-5 rounded-xl border border-border bg-surface space-y-3">
            <h2 className="text-sm font-bold text-text-primary">In This Guide</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.map((s) => (
                <a
                  key={s}
                  href={`#${s}`}
                  className="flex items-center gap-2 text-xs text-text-secondary hover:text-accent transition-colors"
                >
                  <span className="text-accent">→</span>
                  {sectionMeta[s].label}
                </a>
              ))}
              <a href="#mistakes" className="flex items-center gap-2 text-xs text-text-secondary hover:text-accent transition-colors">
                <span className="text-accent">→</span> Job Search Mistakes to Avoid
              </a>
              <a href="#faq" className="flex items-center gap-2 text-xs text-text-secondary hover:text-accent transition-colors">
                <span className="text-accent">→</span> FAQ
              </a>
            </div>
          </div>

          {/* Tips by Section */}
          {sections.map((sectionKey) => {
            const meta = sectionMeta[sectionKey];
            const sectionTips = tips.filter((t) => t.section === sectionKey);
            const firstTip = sectionTips[0];
            const lastTip = sectionTips[sectionTips.length - 1];
            return (
              <section key={sectionKey} id={sectionKey} className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider px-2">
                    Tips {firstTip.num}–{lastTip.num}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary">{meta.label}</h2>
                <div className="space-y-4">
                  {sectionTips.map((tip) => (
                    <div
                      key={tip.num}
                      className="flex gap-4 p-5 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors"
                    >
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-extrabold text-sm">
                        {tip.num}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-text-primary">{tip.title}</h3>
                        <p className="text-xs text-text-secondary leading-relaxed">{tip.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Mistakes Section */}
          <section id="mistakes" className="space-y-5">
            <h2 className="text-2xl font-bold text-text-primary">Job Search Mistakes to Avoid</h2>
            <p className="text-text-secondary text-sm">
              Avoiding these common mistakes is just as important as following best practices:
            </p>
            <div className="space-y-3">
              {mistakes.map((mistake, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
                  <span className="shrink-0 text-rose-400 font-bold text-sm">✕</span>
                  <p className="text-xs text-text-secondary leading-relaxed">{mistake}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-background to-background p-8 space-y-5 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
              ✦ Step 1 of Every Successful Job Search
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Get Your Resume Job-Search Ready</h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xl mx-auto">
              A strong resume is the foundation of every tip in this guide. Build an ATS-optimized, keyword-rich resume with VayloAI
              in under 10 minutes. Trusted by Indian job seekers targeting roles at TCS, Flipkart, Google India, Amazon, and beyond.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent-hover text-white font-bold shadow-lg shadow-accent/20">
                <Link href="/builder">✦ Build My Resume Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border text-text-primary font-semibold">
                <Link href="/free-ats-resume-checker">Check ATS Score Free →</Link>
              </Button>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="space-y-5">
            <h2 className="text-2xl font-bold text-text-primary">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                {
                  q: "How long does a job search take in India in 2026?",
                  a: "On average, 2–4 months for experienced professionals and 3–6 months for freshers. Candidates using referrals and tailored resumes typically receive offers 40–60% faster.",
                },
                {
                  q: "Is LinkedIn or Naukri better for job search in India?",
                  a: "Use both. Naukri has the highest volume for IT and non-IT jobs (service companies). LinkedIn is better for product companies, startups, and FAANG India. Apply on both simultaneously.",
                },
                {
                  q: "How important are referrals for getting a job in India?",
                  a: "Extremely important. Referred candidates are 4x more likely to get hired. At FAANG and top product companies, referrals skip ATS screening entirely and go directly to the recruiter.",
                },
                {
                  q: "Should freshers apply to startups or MNCs first?",
                  a: "Apply to both. MNCs offer structured training and stability. Startups offer faster growth. Many freshers apply broadly and choose based on first responses and offers.",
                },
                {
                  q: "What ATS keywords should freshers include in their resume?",
                  a: "Core technical skills (Python, Java, SQL, HTML/CSS, React), frameworks from projects, tools (Git, VS Code), certifications, academic projects with measurable outcomes, and role-specific skills from target JDs.",
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
            <h2 className="text-lg font-bold text-text-primary">Related Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "How to Pass ATS — Complete Guide", href: "/ats-resume-guide" },
                { label: "How to Write a Resume Step-by-Step", href: "/how-to-write-a-resume" },
                { label: "Interview Questions & Answers 2026", href: "/interview-questions-and-answers" },
                { label: "AI Interview Preparation Coach", href: "/interview-preparation" },
                { label: "Resume Tips for Indian Professionals", href: "/resume-tips" },
                { label: "View Pricing Plans", href: "/pricing" },
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

        </div>
      </main>
      <Footer />
    </div>
  );
}
