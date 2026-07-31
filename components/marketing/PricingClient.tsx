"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, ShieldCheck, Laptop, Award, ArrowRight, HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Plan } from "@/types";

const plans = [
  {
    id: "free" as Plan,
    name: "Free Copilot",
    price: "₹0",
    period: "forever",
    description: "Perfect to audit your resume and test ATS filters",
    icon: Sparkles,
    badgeColor: "bg-slate-800 text-slate-300 border-slate-700",
    features: [
      { text: "2 Full ATS Resume Scans / mo", included: true },
      { text: "Basic 0-100% ATS Compatibility Score", included: true },
      { text: "Missing Keyword & Skills Detection", included: true },
      { text: "Standard Recruiter PDF Export", included: true },
      { text: "AI Cover Letter Generator", included: false },
      { text: "AI Portfolio Generator", included: false },
      { text: "STAR Voice Interview Simulator", included: false },
    ],
    cta: "Start Free",
    popular: false,
    cardBg: "border-slate-800 bg-slate-950/60",
  },
  {
    id: "pro" as Plan,
    name: "Pro Copilot",
    price: "₹99",
    period: "/month",
    description: "Essential optimization engine for active job seekers",
    icon: Zap,
    badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    features: [
      { text: "Unlimited ATS Resume Scans & Fixes", included: true },
      { text: "1-Click Auto-Fix Missing Keywords", included: true },
      { text: "Unlimited PDF & DOCX Downloads", included: true },
      { text: "AI Cover Letter Generator", included: true },
      { text: "LinkedIn Profile & Banner Studio", included: true },
      { text: "No Watermarks on Exports", included: true },
      { text: "AI Portfolio Generator", included: false },
    ],
    cta: "Upgrade to Pro",
    popular: false,
    cardBg: "border-slate-800 bg-slate-950/60",
  },
  {
    id: "premium" as Plan,
    name: "Premium AI Career OS",
    price: "₹299",
    period: "/month",
    description: "Complete career acceleration stack with voice coaching",
    icon: Laptop,
    badgeColor: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold",
    features: [
      { text: "Everything in Pro Copilot", included: true },
      { text: "One-Click AI Portfolio Website (username.vaylo.ai)", included: true },
      { text: "STAR Voice Interview Simulator (Web Speech API)", included: true },
      { text: "AI Recruiter 10-Sec Eye Screen", included: true },
      { text: "AI Hiring Probability Predictor", included: true },
      { text: "AI Salary Negotiator & Pay Benchmarks", included: true },
      { text: "GitHub Auto-Sync Portfolio", included: true },
    ],
    cta: "Unlock Premium OS",
    popular: true,
    cardBg: "border-indigo-500/50 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 shadow-2xl shadow-indigo-500/10",
  },
  {
    id: "career-pack" as Plan,
    name: "Lifetime Career Pack",
    price: "₹499",
    period: "one-time",
    description: "Lifetime placement assistance pack with priority channel",
    icon: Award,
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    features: [
      { text: "Everything in Premium AI OS", included: true },
      { text: "Lifetime Unlimited Access (No Monthly Fees)", included: true },
      { text: "24/7 Priority Support Channel", included: true },
      { text: "Exclusive Fortune 500 Executive Templates", included: true },
      { text: "Deep AI Multi-Model Processing", included: true },
      { text: "Guaranteed Recruiter Format Verification", included: true },
    ],
    cta: "Get Lifetime Access",
    popular: false,
    cardBg: "border-amber-500/30 bg-slate-950/80",
  },
];

const faqs = [
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes! You can cancel or upgrade your subscription anytime from your /settings billing dashboard with zero penalty fees.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support instant UPI (Google Pay, PhonePe, Paytm, CRED), Credit/Debit Cards, NetBanking, and Instant UTR verification.",
  },
  {
    q: "How does the 1-Click Portfolio Deployment work?",
    a: "When you upgrade to Premium or Career Pack, Vaylo AI generates a full single-page dark mode HTML portfolio and deploys it live to username.vaylo.ai with SSL instantly.",
  },
];

export function PricingClient() {
  const [userPlan, setUserPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then((res: any) => {
      const user = res?.data?.user;
      if (user) {
        supabase.from("profiles").select("plan").eq("id", user.id).single().then((profileRes: any) => {
          if (profileRes?.data) setUserPlan(profileRes.data.plan as Plan);
        });
      }
    });
  }, []);

  const handleUpgrade = (planId: string) => {
    if (planId === "free") {
      window.location.href = "/signup";
      return;
    }
    window.location.href = `/checkout/${planId}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Glow Meshes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="outline" className="px-3.5 py-1 rounded-full border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            Transparent India-First Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Invest in your career.{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
              Land 3x more interviews.
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Start for free. Upgrade anytime with instant UPI payments and 100% money-back guarantee.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = userPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 hover:translate-y-[-4px] ${plan.cardBg}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    {isCurrent && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                        Current Plan
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-extrabold text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6 flex items-baseline gap-1.5 border-b border-slate-800/80 pb-6">
                    <span className="text-4xl font-extrabold text-white tracking-tight">{plan.price}</span>
                    <span className="text-xs text-slate-400 font-medium">{plan.period}</span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2.5 text-xs leading-relaxed">
                        <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span className={f.included ? "text-slate-200 font-medium" : "text-slate-500 line-through"}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Submit CTA Button */}
                <Button
                  className={`w-full py-6 rounded-xl font-bold gap-2 text-sm transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white"
                  }`}
                  disabled={isCurrent}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {isCurrent ? "Current Plan" : (
                    <>
                      {plan.cta}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Security & Money-Back Guarantee Banner */}
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">100% Risk-Free Guarantee</h4>
              <p className="text-xs text-slate-400 mt-0.5">Try any paid plan for 7 days. If your ATS score does not improve by at least 25%, get a 100% full refund.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono font-semibold">Instant UPI ID: <strong className="text-indigo-400">jattshiv32@okaxis</strong></span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6 pt-6">
          <h2 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-400" />
            Frequently Asked Questions
          </h2>
          <div className="grid gap-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1.5">
                <h3 className="text-sm font-bold text-white">{faq.q}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
