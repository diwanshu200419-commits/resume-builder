import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, Clock } from "lucide-react";
import type { Analysis, Profile } from "@/types";
import { formatRelativeDate } from "@/lib/utils";
import { getRemainingAnalyses } from "@/lib/plans";

interface StatsBarProps {
  profile: Profile;
  analyses: Analysis[];
}

export function StatsBar({ profile, analyses }: StatsBarProps) {
  const remaining = getRemainingAnalyses(profile);
  const completed = analyses.filter((a) => a.status === "done");

  const avgImprovement =
    completed.length > 0
      ? Math.round(
          completed.reduce(
            (sum, a) =>
              sum + ((a.optimized_ats_score || 0) - (a.original_ats_score || 0)),
            0
          ) / completed.length
        )
      : 0;

  const lastAnalysis = completed[0];

  const stats = [
    {
      label: "Analyses used",
      value:
        profile.plan === "free"
          ? `${profile.analyses_used}/2`
          : "Unlimited",
      icon: BarChart3,
      color: "text-accent",
    },
    {
      label: "Avg ATS improvement",
      value: completed.length > 0 ? `+${avgImprovement}%` : "—",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      label: "Last analyzed",
      value: lastAnalysis ? formatRelativeDate(lastAnalysis.created_at) : "Never",
      icon: Clock,
      color: "text-info",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border bg-surface min-w-0 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-text-muted font-medium truncate">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-text-primary mt-0.5 truncate">{stat.value}</p>
                {stat.label === "Analyses used" && remaining !== "unlimited" && (
                  <p className="text-[11px] text-text-muted mt-0.5 truncate">{remaining} remaining</p>
                )}
              </div>
              <div className={`p-2.5 sm:p-3 rounded-xl bg-surface-elevated shrink-0 ${stat.color}`}>
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
