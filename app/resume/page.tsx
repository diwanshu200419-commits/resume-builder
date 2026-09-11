import { Metadata } from 'next';
import Link from 'next/link';
import { ROLE_PAGES_DATA } from '@/lib/seo/role-pages';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { ArrowRight, Briefcase, GraduationCap, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ATS Resume Guides for 2026 Roles | VayloAI — Free Samples',
  description: 'Master ATS optimization with role-specific resume guides. Get exact keywords, X-Y-Z bullet formulas, and India job market insights. Try VayloAI free.',
  alternates: {
    canonical: 'https://www.vayloai.online/resume',
  },
  openGraph: {
    title: 'ATS Resume Guides for 2026 Roles | VayloAI — Free Samples',
    description: 'Master ATS optimization with role-specific resume guides. Get exact keywords, X-Y-Z bullet formulas, and India job market insights. Try VayloAI free.',
    url: 'https://www.vayloai.online/resume',
    siteName: 'VayloAI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATS Resume Guides for 2026 Roles | VayloAI — Free Samples',
    description: 'Master ATS optimization with role-specific resume guides. Get exact keywords, X-Y-Z bullet formulas, and India job market insights. Try VayloAI free.',
    creator: '@vayloai',
  },
  keywords: ['resume guides', 'role-specific resume', 'ATS optimization', 'resume examples', 'resume keywords', 'VayloAI'],
};

export default function ResumeHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Resume Guides — Role-Specific ATS Optimization",
    "description": "Comprehensive role-specific resume guides for ATS optimization.",
    "url": "https://www.vayloai.online/resume",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": Object.values(ROLE_PAGES_DATA).map((role, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://www.vayloai.online/resume/${role.slug}`,
        "name": role.title
      }))
    }
  };

  const breadcrumbLd = {
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
        "name": "Resume Guides",
        "item": "https://www.vayloai.online/resume"
      }
    ]
  };

  const roles = Object.values(ROLE_PAGES_DATA);
  const byRole = roles.filter((r) => r.category === 'role');
  const byEducation = roles.filter((r) => r.category === 'degree');
  const byCountry = roles.filter((r) => r.category === 'country');

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-6">
              Resume Guides & <span className="text-accent">ATS Optimization</span>
            </h1>
            <p className="text-lg text-text-secondary">
              Discover exactly what recruiters and Applicant Tracking Systems look for in your specific field. 
              Get targeted keywords, bullet formulas, and proven structures to land more interviews.
            </p>
          </div>

          <div className="space-y-16">
            {byRole.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Briefcase className="w-8 h-8 text-accent" />
                  <h2 className="text-3xl font-bold text-text-primary">By Role</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {byRole.map((role) => (
                    <Link key={role.slug} href={`/resume/${role.slug}`} className="group block">
                      <div className="bg-surface border border-border rounded-xl p-6 h-full hover:border-accent hover:shadow-lg transition-all duration-300">
                        <h3 className="text-xl font-bold text-text-primary group-hover:text-accent transition-colors mb-3">
                          {role.targetRole}
                        </h3>
                        <p className="text-sm text-text-secondary mb-4 line-clamp-3">
                          {role.subtitle}
                        </p>
                        <div className="flex items-center text-sm font-semibold text-accent mt-auto">
                          Read Guide <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {byEducation.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <GraduationCap className="w-8 h-8 text-indigo-500" />
                  <h2 className="text-3xl font-bold text-text-primary">By Education</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {byEducation.map((role) => (
                    <Link key={role.slug} href={`/resume/${role.slug}`} className="group block">
                      <div className="bg-surface border border-border rounded-xl p-6 h-full hover:border-indigo-500 hover:shadow-lg transition-all duration-300">
                        <h3 className="text-xl font-bold text-text-primary group-hover:text-indigo-500 transition-colors mb-3">
                          {role.targetRole}
                        </h3>
                        <p className="text-sm text-text-secondary mb-4 line-clamp-3">
                          {role.subtitle}
                        </p>
                        <div className="flex items-center text-sm font-semibold text-indigo-500 mt-auto">
                          Read Guide <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {byCountry.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Globe className="w-8 h-8 text-emerald-500" />
                  <h2 className="text-3xl font-bold text-text-primary">By Country</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {byCountry.map((role) => (
                    <Link key={role.slug} href={`/resume/${role.slug}`} className="group block">
                      <div className="bg-surface border border-border rounded-xl p-6 h-full hover:border-emerald-500 hover:shadow-lg transition-all duration-300">
                        <h3 className="text-xl font-bold text-text-primary group-hover:text-emerald-500 transition-colors mb-3">
                          {role.targetRole}
                        </h3>
                        <p className="text-sm text-text-secondary mb-4 line-clamp-3">
                          {role.subtitle}
                        </p>
                        <div className="flex items-center text-sm font-semibold text-emerald-500 mt-auto">
                          Read Guide <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
