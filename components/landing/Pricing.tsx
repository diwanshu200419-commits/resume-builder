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
    description: "Perfect to try ResumeAI",
    features: [
      { text: "2 resume analyses/month", included: true },
      { text: "ATS score check", included: true },
      { text: "Basic keyword suggestions", included: true },
      { text: "PDF + DOCX download", included: false },
      { text: "Cover letter generator", included: false },
      { text: "Interview prep", included: false },
    ],
    cta: "Start free",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹199",
    period: "/month",
    description: "For active job seekers",
    features: [
      { text: "Unlimited analyses", included: true },
      { text: "Full ATS optimization", included: true },
      { text: "PDF + DOCX download", included: true },
      { text: "Cover letter generator", included: true },
      { text: "Before/after comparison", included: true },
      { text: "Interview prep", included: false },
    ],
    cta: "Upgrade to Pro",
    href: "/checkout/pro",
    popular: true,
  },
  {
    name: "Premium",
    price: "₹399",
    period: "/month",
    description: "Complete career toolkit",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Interview question generator", included: true },
      { text: "LinkedIn profile optimizer", included: true },
      { text: "Career roadmap", included: true },
      { text: "Priority support", included: true },
      { text: "Early access to features", included: true },
    ],
    cta: "Go Premium",
    href: "/checkout/premium",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-xl border p-6 ${
                plan.popular
                  ? "border-accent bg-surface card-glow scale-105"
                  : "border-border bg-surface"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white border-0">
                  MOST POPULAR
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-text-primary">{plan.name}</h3>
                <p className="text-sm text-text-muted mt-1">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-text-primary">{plan.price}</span>
                  <span className="text-text-muted text-sm">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-2 text-sm">
                    {f.included ? (
                      <Check className="w-4 h-4 text-success shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-text-muted shrink-0" />
                    )}
                    <span className={f.included ? "text-text-secondary" : "text-text-muted"}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
