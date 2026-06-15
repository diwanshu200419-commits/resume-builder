"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Plan } from "@/types";

const plans = [
  {
    id: "free" as Plan,
    name: "Vaylo Free",
    price: "₹0",
    period: "forever",
    description: "Try Vaylo AI free",
    features: [
      { text: "2 resume analyses/month", included: true },
      { text: "2 ATS score checks/month", included: true },
      { text: "Basic AI insights", included: true },
      { text: "View missing keywords", included: true },
      { text: "PDF/DOCX export", included: false },
      { text: "Cover letter generator", included: false },
      { text: "Interview preparation", included: false },
    ],
    cta: "Start free",
    popular: false,
  },
  {
    id: "pro" as Plan,
    name: "Vaylo Pro",
    price: "₹199",
    period: "/month",
    description: "For active job seekers",
    features: [
      { text: "Unlimited Resume AI", included: true },
      { text: "Unlimited resume optimization", included: true },
      { text: "DOCX + PDF export", included: true },
      { text: "Cover letter generator", included: true },
      { text: "Interview prep tools", included: true },
      { text: "LinkedIn profile optimizer", included: true },
      { text: "Priority processing", included: true },
    ],
    cta: "Upgrade to Vaylo Pro",
    popular: true,
  },
  {
    id: "premium" as Plan,
    name: "Vaylo Premium",
    price: "₹399",
    period: "/month",
    description: "Full career growth platform",
    features: [
      { text: "Everything in Vaylo Pro", included: true },
      { text: "Vaylo Coach AI chat", included: true },
      { text: "Interview AI prep", included: true },
      { text: "Career roadmap", included: true },
      { text: "Job matching AI", included: true },
      { text: "Monthly career report", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Go Vaylo Premium",
    popular: false,
  },
];

export function PricingClient() {
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradePlan, setUpgradePlan] = useState<"pro" | "premium">("pro");

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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-text-primary mb-4">Simple, India-first pricing</h1>
            <p className="text-text-secondary">Start free. Upgrade when you're ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl border p-6 ${
                  plan.popular ? "border-accent bg-surface card-glow scale-105" : "border-border bg-surface"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white border-0">
                    MOST POPULAR
                  </Badge>
                )}
                {userPlan === plan.id && (
                  <Badge variant="success" className="absolute top-4 right-4">Current</Badge>
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
                      <span className={f.included ? "text-text-secondary" : "text-text-muted"}>{f.text}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
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
