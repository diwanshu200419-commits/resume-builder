"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect to try Vaylo AI",
    features: [
      { text: "2 resume downloads", included: true },
      { text: "Basic ATS check", included: true },
      { text: "Watermark on PDF export", included: true },
      { text: "Cover letter generator", included: false },
      { text: "LinkedIn optimizer", included: false },
      { text: "Portfolio generator", included: false },
    ],
    cta: "Start free",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹99",
    period: "/month",
    description: "Essential optimization tools",
    features: [
      { text: "Unlimited PDF downloads", included: true },
      { text: "Unlimited Resume builds", included: true },
      { text: "Cover letter generator", included: true },
      { text: "ATS Score optimization", included: true },
      { text: "LinkedIn profile optimizer", included: true },
      { text: "No watermark", included: true },
    ],
    cta: "Upgrade to Pro",
    href: "/checkout/pro",
    popular: true,
  },
  {
    name: "Premium",
    price: "₹299",
    period: "/month",
    description: "Complete career copilot",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Portfolio website generator", included: true },
      { text: "Interview question prep", included: true },
      { text: "AI Career Coach mentor", included: true },
      { text: "AI Job matcher analysis", included: true },
      { text: "Career Roadmap planner", included: true },
    ],
    cta: "Go Premium",
    href: "/checkout/premium",
    popular: false,
  },
  {
    name: "Career Pack",
    price: "₹499",
    period: "/one-time",
    description: "Lifetime AI Career Toolkit",
    features: [
      { text: "Everything in Premium", included: true },
      { text: "Lifetime access to Career Pack features", included: true },
      { text: "Recruiter-Friendly Premium Templates", included: true },
      { text: "Advanced Career Analysis", included: true },
      { text: "Lifetime Career Roadmap Access", included: true },
      { text: "Portfolio & Personal Branding Tools", included: true },
      { text: "Higher AI Fair-Use Limits", included: true },
      { text: "24/7 Priority Support", included: true },
    ],
    cta: "Get Lifetime Access",
    href: "/checkout/career-pack",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Simple, India-first pricing
          </h2>
          <p className="text-text-secondary">Start free. Upgrade when you&apos;re ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-xl border p-6 ${
                plan.popular
                  ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                  : "border-border bg-surface"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white font-bold text-[10px] px-3 py-0.5">
                  Most popular
                </Badge>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-bold text-text-primary">{plan.name}</h3>
                <p className="text-xs text-text-secondary mt-1">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-text-primary">{plan.price}</span>
                <span className="text-xs text-text-muted">{plan.period}</span>
              </div>

              <ul className="space-y-3 text-xs mb-8">
                {plan.features.map((feat) => (
                  <li key={feat.text} className="flex items-center gap-2">
                    {feat.included ? (
                      <Check className="w-4 h-4 text-success shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-text-muted shrink-0" />
                    )}
                    <span className={feat.included ? "text-text-primary" : "text-text-muted"}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full font-bold ${
                  plan.popular
                    ? "bg-accent hover:bg-accent-hover text-white"
                    : "bg-surface-elevated hover:bg-border text-text-primary border border-border"
                }`}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-[11px] text-text-muted font-mono">
            *AI-powered features are subject to reasonable fair-use and abuse-prevention limits.
          </p>
        </div>
      </div>
    </section>
  );
}
