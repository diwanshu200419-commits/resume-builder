"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, ShieldCheck, Zap, Award, HelpCircle, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type Plan = "free" | "pro" | "premium" | "career-pack";

interface PricingClientProps {
  userPlan?: string;
}

const plans = [
  {
    id: "free" as Plan,
    name: "Free Developer OS",
    price: "₹0",
    period: "forever",
    description: "Perfect for testing ATS score parsing & basic layout export",
    icon: Sparkles,
    badgeColor: "bg-surface-elevated text-text-muted border-border",
    features: [
      { text: "2 ATS Resume Scans (Total)", included: true },
      { text: "Basic Resume Builder", included: true },
      { text: "PDF Export with Vaylo Watermark", included: true },
      { text: "Standard Template Selection", included: true },
      { text: "Auto-Fix AI Rewriter", included: false },
      { text: "LinkedIn Profile Optimizer", included: false },
      { text: "Portfolio Deploy Route", included: false },
    ],
    cta: "Start Free Now",
    popular: false,
    cardBg: "border-border bg-surface",
  },
  {
    id: "pro" as Plan,
    name: "Pro Engineer",
    price: "₹99",
    period: "per month",
    description: "For active job seekers who need unlimited clean PDF downloads",
    icon: Zap,
    badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    features: [
      { text: "Unlimited Clean PDF Downloads (No Watermark)", included: true },
      { text: "Auto-Fix AI Bullet Rewriter", included: true },
      { text: "LinkedIn Profile Branding Studio", included: true },
      { text: "DOCX / Word Format Export", included: true },
      { text: "Multi-Language Resume Translator", included: true },
      { text: "AI Cover Letter Generator", included: true },
      { text: "Higher AI Fair-Use Allowance", included: true },
    ],
    cta: "Upgrade to Pro",
    popular: false,
    cardBg: "border-border bg-surface",
  },
  {
    id: "premium" as Plan,
    name: "Premium Career Copilot",
    price: "₹299",
    period: "per month",
    description: "Full suite with STAR Voice Practice & Portfolio hosting",
    icon: ShieldCheck,
    badgeColor: "bg-accent/20 text-accent border-accent/30",
    features: [
      { text: "Everything in Pro Engineer Tier", included: true },
      { text: "AI Portfolio Website Builder (6 Pro Themes, Code Export & Free Host Hub)", included: true },
      { text: "STAR Voice Interview Practice Engine", included: true },
      { text: "Recruiter 10s Eye-Screen Simulation", included: true },
      { text: "Hiring Probability Predictor", included: true },
      { text: "AI Career Coach & Mentor Chat", included: true },
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
    description: "Lifetime AI Career Toolkit with no monthly subscription",
    icon: Award,
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    features: [
      { text: "Everything in Premium AI OS", included: true },
      { text: "Lifetime Access to Career Pack Features", included: true },
      { text: "Recruiter-Friendly Premium Templates", included: true },
      { text: "Advanced Career Analysis", included: true },
      { text: "Lifetime Career Roadmap Access", included: true },
      { text: "Portfolio & Personal Branding Tools", included: true },
      { text: "Higher AI Fair-Use Limits", included: true },
      { text: "24/7 Priority Support Channel", included: true },
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
    a: "Payment is currently available via UPI (Google Pay, PhonePe, Paytm, CRED, and any UPI app). After completing your UPI payment, submit your 12-digit UTR reference number. Your plan will be activated after our team manually verifies the transaction — typically within a few hours.",
  },
  {
    q: "How does Lifetime Access work on Career Pack?",
    a: "Career Pack (₹499 one-time) grants lifetime product feature access with no recurring monthly billing. AI features are subject to generous daily fair-use limits to prevent API abuse.",
  },
  {
    q: "How does the 1-Click Portfolio Deployment work?",
    a: "When you upgrade to Premium or Career Pack, Vaylo AI generates a full single-page dark mode HTML portfolio and deploys it live to username.vaylo.ai with SSL instantly.",
  },
];

export function PricingClient({ userPlan = "free" }: PricingClientProps) {
  const normalizedUserPlan = userPlan.toLowerCase().replace("-", "_");

  useEffect(() => {
    trackEvent("pricing_view");
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-16 text-text-primary">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge className="bg-accent/10 text-accent border-accent/20 text-xs px-3 py-1 font-bold">
          Transparent India-First Pricing
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Invest in Your Next Career Move
        </h1>
        <p className="text-text-secondary text-base sm:text-lg">
          No hidden locks. Cancel anytime or secure lifetime access with zero monthly commitments.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => {
          const Icon = p.icon;
          const isCurrentPlan = normalizedUserPlan === p.id.replace("-", "_");

          return (
            <Card key={p.id} className={`relative flex flex-col justify-between overflow-hidden ${p.cardBg}`}>
              {p.popular && (
                <div className="absolute top-0 right-0">
                  <span className="bg-accent text-white font-bold text-[10px] px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl border ${p.badgeColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isCurrentPlan && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                        CURRENT PLAN ✓
                      </Badge>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-text-primary">{p.name}</CardTitle>
                    <CardDescription className="text-xs text-text-secondary mt-1">{p.description}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-text-primary">{p.price}</span>
                    <span className="text-xs text-text-muted font-medium">{p.period}</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {p.features.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${f.included ? "text-emerald-400" : "text-text-muted opacity-40"}`} />
                        <span className={f.included ? "text-text-primary font-medium" : "text-text-muted opacity-40 line-through"}>
                          {f.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-6">
                {isCurrentPlan ? (
                  <Button disabled className="w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    CURRENT PLAN ✓
                  </Button>
                ) : (
                  <Button
                    asChild
                    onClick={() => trackEvent("checkout_started", { plan: p.id, price: p.price })}
                    className={`w-full text-xs font-bold ${
                      p.popular ? "bg-accent hover:bg-accent-hover text-white shadow-lg" : "bg-surface-elevated hover:bg-border text-text-primary border border-border"
                    }`}
                  >
                    <Link href={`/checkout/${p.id}`}>
                      {p.cta} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-[11px] text-text-muted font-mono">
          *AI-powered features are subject to reasonable fair-use and abuse-prevention limits.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto space-y-8 pt-8 border-t border-border">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-text-primary">Frequently Asked Questions</h2>
          <p className="text-xs text-text-secondary">Everything you need to know about Vaylo AI subscriptions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <Card key={i} className="border-border bg-surface p-5 space-y-2">
              <h3 className="font-bold text-xs text-text-primary flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-accent shrink-0" /> {faq.q}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed pl-6">{faq.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
