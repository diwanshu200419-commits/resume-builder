import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ROLE_PAGES_DATA } from "@/lib/seo/role-pages";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, FileText, Code2, ShieldCheck, ChevronRight, HelpCircle } from "lucide-react";

interface RolePageProps {
  params: { slug: string };
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.vayloai.online";

export async function generateStaticParams() {
  return Object.keys(ROLE_PAGES_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RolePageProps): Promise<Metadata> {
  const data = ROLE_PAGES_DATA[params.slug];
  if (!data) return {};

  const pageUrl = `${APP_URL}/resume/${data.slug}`;

  return {
    title: `${data.title} | VayloAI`,
    description: data.metaDescription,
    keywords: data.keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${data.title} | VayloAI`,
      description: data.metaDescription,
      url: pageUrl,
      siteName: "VayloAI",
      images: [
        {
          url: `${APP_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `VayloAI ${data.targetRole} Resume ATS Guide`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} | VayloAI`,
      description: data.metaDescription,
      images: [`${APP_URL}/og-image.png`],
    },
  };
}

export default function RoleResumeGuidePage({ params }: RolePageProps) {
  const data = ROLE_PAGES_DATA[params.slug];
  if (!data) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": APP_URL },
          { "@type": "ListItem", "position": 2, "name": "Resume Guides", "item": `${APP_URL}/resume` },
          { "@type": "ListItem", "position": 3, "name": data.targetRole, "item": `${APP_URL}/resume/${data.slug}` }
        ]
      },
      {
        "@type": "Article",
        "headline": data.title,
        "description": data.metaDescription,
        "url": `${APP_URL}/resume/${data.slug}`,
        "author": { "@type": "Organization", "name": "Vaylo AI Career Research Team" },
        "publisher": { "@type": "Organization", "name": "Vaylo AI", "logo": { "@type": "ImageObject", "url": `${APP_URL}/logo.png` } }
      },
      {
        "@type": "FAQPage",
        "mainEntity": data.faq.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": { "@type": "Answer", "text": item.answer }
        }))
      }
    ]
  };

  const otherRoleSlugs = Object.keys(ROLE_PAGES_DATA).filter((s) => s !== data.slug).slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-indigo-400">Home</Link>
            <span>/</span>
            <Link href="/free-ats-resume-checker" className="hover:text-indigo-400">Resume Guides</Link>
            <span>/</span>
            <span className="text-slate-200 font-semibold">{data.targetRole}</span>
          </nav>

          {/* Hero Section */}
          <div className="space-y-4">
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold px-3 py-1">
              Official ATS Resume & Keywords Guide
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {data.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
              {data.subtitle}
            </p>

            {/* Instant Scanner CTA Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl mt-6">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                  <Sparkles className="w-5 h-5 text-indigo-400" /> Check Your {data.targetRole} ATS Score
                </h3>
                <p className="text-xs text-slate-300">
                  Scan your resume against Greenhouse, Workday &amp; Lever ATS filters in 10 seconds.
                </p>
              </div>
              <Link href="/free-ats-checker" className="shrink-0 w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-11 px-6 rounded-xl shadow-lg gap-2">
                  Check Your Resume Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Recommended Structure */}
          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-400" /> Recommended Resume Structure
            </h2>
            <Card className="border-slate-800 bg-slate-900/80">
              <CardContent className="p-6">
                <ul className="space-y-3 text-sm text-slate-300">
                  {data.recommendedStructure.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Must-Have & Preferred Keywords */}
          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Code2 className="w-6 h-6 text-indigo-400" /> High-Intent ATS Keywords for {data.targetRole}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-slate-800 bg-slate-900/80">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Must-Have Technical Keywords (35% Weight)
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {data.mustHaveKeywords.map((kw) => (
                      <span key={kw} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-lg">
                        {kw}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/80">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Preferred / Bonus Keywords (30% Weight)
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {data.preferredKeywords.map((kw) => (
                      <span key={kw} className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold rounded-lg">
                        {kw}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Before & After Bullet Formulas */}
          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold text-white">Google X-Y-Z Bullet Point Optimization Examples</h2>
            <div className="space-y-4">
              {data.exampleBullets.map((bullet, idx) => (
                <Card key={idx} className="border-slate-800 bg-slate-900/80">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Weak / Generic Bullet:
                      </div>
                      <p className="text-xs font-mono bg-slate-950 p-3 rounded-lg text-slate-400 border border-slate-800">
                        &quot;{bullet.before}&quot;
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> FAANG-Grade ATS Bullet:
                      </div>
                      <p className="text-xs font-mono bg-emerald-950/30 p-3 rounded-lg text-emerald-300 border border-emerald-500/30 font-semibold">
                        &quot;{bullet.after}&quot;
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 italic">💡 {bullet.explanation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* What Recruiters Look For vs Common Mistakes */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-800 bg-slate-900/80">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> What Recruiters Look For
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {data.recruiterFocus.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/80">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> Common Screening Mistakes
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {data.commonMistakes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* FAQ Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-indigo-400" /> Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {data.faq.map((item, idx) => (
                <Card key={idx} className="border-slate-800 bg-slate-900/80">
                  <CardContent className="p-5 space-y-2">
                    <h3 className="text-sm font-bold text-slate-200">{item.question}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Bottom Conversion CTA */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/40 text-center space-y-4 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Scan Your {data.targetRole} Resume?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Get your instant 100-Point ATS score breakdown, missing keyword alerts, and 1-click AI bullet fixes.
            </p>
            <div className="pt-2">
              <Link href="/free-ats-checker">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs h-12 px-8 rounded-xl shadow-xl gap-2">
                  Check Your Resume For Free <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Internal Links to Other Role Guides */}
          <section className="pt-6 border-t border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Explore Other Role Guides</h3>
            <div className="flex flex-wrap gap-2">
              {otherRoleSlugs.map((slug) => {
                const item = ROLE_PAGES_DATA[slug];
                if (!item) return null;
                return (
                  <Link key={slug} href={`/resume/${slug}`}>
                    <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 text-xs rounded-lg transition-colors inline-block">
                      {item.targetRole} Resume
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
