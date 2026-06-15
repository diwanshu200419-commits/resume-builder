"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Plan } from "@/types";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
  requiredPlan?: "pro" | "premium";
}

const proFeatures = [
  "Unlimited resume analyses",
  "Unlimited ATS score checks",
  "DOCX + PDF export",
  "Cover letter generator",
  "Interview prep tools",
  "LinkedIn profile optimizer",
  "Priority processing",
];

const planLabels: Record<Exclude<Plan, "free">, { name: string; price: string }> = {
  pro: { name: "Pro Plan", price: "₹199" },
  premium: { name: "Premium Plan", price: "₹399" },
};

export function UpgradeModal({
  open,
  onOpenChange,
  feature = "this feature",
  requiredPlan = "pro",
}: UpgradeModalProps) {
  const router = useRouter();
  const plan = requiredPlan;

  const handleBuyNow = () => {
    onOpenChange(false);
    router.push(`/checkout/${plan}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-border bg-surface">
        <div className="bg-gradient-to-br from-accent/20 via-background to-background p-8">
          <DialogHeader className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center card-glow">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-center text-text-primary">
              Unlock Vaylo AI {plan === "pro" ? "Pro" : "Premium"}
            </DialogTitle>
            <DialogDescription className="text-center text-text-secondary mt-2">
              Unlock {feature} and take your career to the next level with unlimited AI power.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mb-8">
            {proFeatures.map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-text-secondary">
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-success" />
                </div>
                {f}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-accent/10 border border-accent/20">
              <div>
                <p className="text-sm font-semibold text-text-primary">{planLabels[plan].name}</p>
                <p className="text-xs text-text-muted">Unlimited monthly access</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-text-primary">{planLabels[plan].price}</p>
                <p className="text-xs text-text-muted">per month</p>
              </div>
            </div>

            <Button
              className="w-full h-12 text-lg font-bold gap-2 bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20"
              onClick={handleBuyNow}
            >
              <Zap className="w-5 h-5 fill-current" />
              Buy Now
            </Button>

            <p className="text-[10px] text-center text-text-muted flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Pay securely via UPI (Google Pay, PhonePe, Paytm)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
