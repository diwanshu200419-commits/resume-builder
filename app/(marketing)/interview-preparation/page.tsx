import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Mic, Target, Zap, Clock, ShieldCheck, ChevronRight, CheckCircle2, MessageSquare, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'AI Interview Preparation — Practice STAR Voice Interviews',
  description: 'Practice real-time voice interviews with our AI coach. Master STAR method responses, get instant feedback, and prepare for FAANG questions.',
  alternates: {
    canonical: 'https://www.vayloai.online/interview-preparation',
  },
  openGraph: {
    title: 'AI Interview Preparation — Practice STAR Voice Interviews',
    description: 'Practice real-time voice interviews with our AI coach. Master STAR method responses and get instant feedback.',
    url: 'https://www.vayloai.online/interview-preparation',
    siteName: 'VayloAI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Interview Preparation — Practice STAR Voice Interviews',
    description: 'Practice real-time voice interviews with our AI coach.',
  },
  keywords: ['AI interview prep', 'voice interview practice', 'STAR method', 'mock interview AI', 'FAANG interview prep'],
};

export default function InterviewPrepPage() {
  const jsonLdSoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VayloAI Interview Preparation",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
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
      }
    ]
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does the AI voice coach work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI coach simulates a real interviewer using conversational voice AI. It asks role-specific questions and listens to your verbal responses."
        }
      },
      {
        "@type": "Question",
        "name": "Does it support the STAR method?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, the AI specifically evaluates your behavioral answers using the STAR (Situation, Task, Action, Result) framework."
        }
      },
      {
        "@type": "Question",
        "name": "What kind of questions will I be asked?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Questions are dynamically generated based on your target role, industry, and seniority level, including common FAANG behavioral and technical prompts."
        }
      },
      {
        "@type": "Question",
        "name": "Can I practice for technical roles?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. You can select roles like Software Engineer, Data Analyst, Product Manager, and more to get targeted technical and behavioral questions."
        }
      },
      {
        "@type": "Question",
        "name": "Is my voice data saved?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your audio is processed in real-time for evaluation and transcription, but we do not store your voice recordings."
        }
      }
    ]
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16 overflow-hidden">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-6">
            <Mic className="w-4 h-4" /> AI Voice Coach
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary tracking-tight mb-6 max-w-4xl mx-auto">
            Master Your Next Interview with <span className="text-accent">AI Voice Practice</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            Practice real-time voice interviews. Get instant feedback on your STAR method responses, filler words, and delivery for FAANG & top tech roles.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white font-bold h-14 px-8 text-lg rounded-xl shadow-lg shadow-accent/20">
                Start Practicing Free <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-surface-elevated py-24 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-text-primary mb-4">Why Practice with VayloAI?</h2>
              <p className="text-text-secondary max-w-2xl mx-auto">Everything you need to build confidence and deliver flawless answers.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Mic,
                  title: "Realistic Voice AI",
                  desc: "Converse naturally with our AI interviewer just like a real Zoom or phone screen.",
                  color: "text-blue-500",
                  bg: "bg-blue-500/10"
                },
                {
                  icon: Target,
                  title: "STAR Method Scoring",
                  desc: "Get graded on your Situation, Task, Action, and Result formatting for every answer.",
                  color: "text-purple-500",
                  bg: "bg-purple-500/10"
                },
                {
                  icon: Briefcase,
                  title: "Role-Specific Questions",
                  desc: "Thousands of questions tailored for Engineering, Product, Design, and Data roles.",
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10"
                },
                {
                  icon: Zap,
                  title: "Instant Actionable Feedback",
                  desc: "Receive real-time tips on filler words, pacing, and how to improve your response.",
                  color: "text-amber-500",
                  bg: "bg-amber-500/10"
                }
              ].map((feature, i) => (
                <div key={i} className="bg-surface p-6 rounded-2xl border border-border">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.bg}`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-white font-bold text-2xl flex items-center justify-center rounded-2xl mx-auto mb-6 shadow-lg shadow-accent/20">1</div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Select Your Role</h3>
              <p className="text-text-secondary">Choose your target position and seniority level. We customize the question bank instantly.</p>
            </div>
            <div className="text-center relative">
              <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0 -z-10" />
              <div className="w-16 h-16 bg-accent text-white font-bold text-2xl flex items-center justify-center rounded-2xl mx-auto mb-6 shadow-lg shadow-accent/20">2</div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Speak Naturally</h3>
              <p className="text-text-secondary">The AI asks a question. You answer using your microphone just like a real interview.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-white font-bold text-2xl flex items-center justify-center rounded-2xl mx-auto mb-6 shadow-lg shadow-accent/20">3</div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Review & Improve</h3>
              <p className="text-text-secondary">Get a detailed scorecard, transcription, and rewritten examples of how to answer better.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-surface-elevated py-24 border-t border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-text-primary mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {jsonLdFaq.mainEntity.map((faq, index) => (
                <div key={index} className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-text-primary mb-2 flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    {faq.name}
                  </h3>
                  <p className="text-text-secondary pl-8">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Mic className="w-48 h-48 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 relative z-10">
              Ready to crush your next interview?
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto relative z-10">
              Stop memorizing answers and start practicing them out loud.
            </p>
            <Link href="/signup" className="relative z-10">
              <Button size="lg" className="bg-accent hover:bg-accent-hover text-white font-bold h-14 px-8 text-lg rounded-xl shadow-lg shadow-accent/20">
                Start Your First Mock Interview
              </Button>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
