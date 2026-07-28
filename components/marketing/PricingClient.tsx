"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Plan } from "@/types";

const plans = [
  {
    id: "free" as Plan,
    name: "Vaylo Free",
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
    popular: false,
  },
  {
    id: "pro" as Plan,
    name: "Vaylo Pro",
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
    popular: true,
  },
  {
    id: "premium" as Plan,
    name: "Vaylo Premium",
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
    popular: false,
  },
  {
    id: "career" as Plan,
    name: "Career Pack",
    price: "₹499",
    period: "/one-time",
    description: "Full service placement help",
    features: [
      { text: "Everything in Premium", included: true },
      { text: "24/7 Priority support channel", included: true },
      { text: "Exclusive premium templates", included: true },
      { text: "Deep AI analysis processing", included: true },
      { text: "Guaranteed recruiter format", included: true },
      { text: "Lifetime roadmap access", included: true },
    ],
    cta: "Get Career Pack",
    popular: false,
  },
];

export function PricingClient() {
  const [userPlan, setUserPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from("profiles").select("plan").eq("id", user.id).single().then(({ data }) => {
          if (data) setUserPlan(data.plan as Plan);
        });
      }
    });
  }, []);

  const handleUpgrade = (plan: Plan) => {
    if (plan === "free") {
      window.location.href = "/signup";
      return;
    }
    window.location.href = `/checkout/${plan}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-text-primary mb-3">Simple, India-first pricing</h1>
            <p className="text-text-secondary text-base">Start free. Upgrade when you are ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl border p-6 flex flex-col justify-between transition-all duration-200 ${
                  plan.popular
                    ? "border-accent bg-surface card-glow lg:scale-105 z-10"
                    : "border-border bg-surface hover:border-border-active"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white border-0 font-bold px-3">
                    MOST POPULAR
                  </Badge>
                )}
                {userPlan === plan.id && (
                  <Badge variant="success" className="absolute top-4 right-4">Current</Badge>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-text-primary">{plan.name}</h3>
                    <p className="text-xs text-text-muted mt-1">{plan.description}</p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-text-primary">{plan.price}</span>
                      <span className="text-text-muted text-xs font-semibold">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-center gap-2 text-xs">
                        {f.included ? (
                          <Check className="w-4 h-4 text-success shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-text-muted shrink-0" />
                        )}
                        <span className={f.included ? "text-text-secondary" : "text-text-muted"}>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={`w-full font-semibold ${
                    plan.popular ? "bg-accent hover:bg-accent-hover text-white shadow-md" : "border-border hover:bg-surface-elevated"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  disabled={userPlan === plan.id}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {userPlan === plan.id ? "Current plan" : plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
