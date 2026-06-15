import { Badge } from "@/components/ui/badge";
import type { Plan } from "@/types";
import { Crown, Sparkles, Zap } from "lucide-react";

const planConfig: Record<Plan, { label: string; variant: "default" | "success" | "warning"; icon: React.ReactNode }> = {
  free: { label: "Free", variant: "default", icon: <Zap className="w-3 h-3" /> },
  pro: { label: "Pro", variant: "success", icon: <Sparkles className="w-3 h-3" /> },
  premium: { label: "Premium", variant: "warning", icon: <Crown className="w-3 h-3" /> },
};

export function PlanBadge({ plan }: { plan: Plan }) {
  const config = planConfig[plan];
  return (
    <Badge variant={config.variant} className="gap-1">
      {config.icon}
      {config.label}
    </Badge>
  );
}
