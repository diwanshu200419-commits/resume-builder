import { redirect } from "next/navigation";
import Link from "next/link";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getEffectivePlan, PLAN_CONFIG, getRemainingAnalyses } from "@/lib/plans";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlanBadge } from "@/components/shared/PlanBadge";
import {
  CreditCard,
  Zap,
  Target,
  Award,
  FileSearch,
  FilePen,
  Palette,
  FileText,
  Flame,
  Users,
  Languages,
  GraduationCap,
  Eye,
  Compass,
  DollarSign,
  Laptop,
  MessageSquare,
  Check,
  ArrowRight,
  Crown,
  Sparkles,
  ShieldCheck,
  Clock,
  BarChart3,
} from "lucide-react";

const FEATURE_DISPLAY: { key: string; label: string; icon: any }[] = [
  { key: "ats_scan", label: "ATS Resume Scans", icon: FileSearch },
  { key: "bullet_rewrite", label: "Bullet Rewrites", icon: FilePen },
  { key: "linkedin_optimizer", label: "LinkedIn Optimization", icon: Palette },
  { key: "cover_letter", label: "Cover Letter Generator", icon: FileText },
  { key: "resume_roast", label: "Resume Roast", icon: Flame },
  { key: "networking", label: "Networking Tools", icon: Users },
  { key: "translation", label: "Resume Translator", icon: Languages },
  { key: "interview_eval", label: "STAR Voice Interviews", icon: GraduationCap },
  { key: "hiring_readiness", label: "Hiring Readiness", icon: Target },
  { key: "recruiter_simulation", label: "Recruiter Simulation", icon: Eye },
  { key: "career_roadmap", label: "Career Roadmap", icon: Compass },
  { key: "salary_analysis", label: "Salary Insights", icon: DollarSign },
  { key: "portfolio_generation", label: "Portfolio Builder", icon: Laptop },
  { key: "career_coach", label: "AI Career Coach", icon: MessageSquare },
];

export default async function PlanUsagePage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const plan = getEffectivePlan(profile);
  const planCfg = PLAN_CONFIG[plan];
  const remaining = getRemainingAnalyses(profile);

  const todayStr = new Date().toISOString().split("T")[0];
  const supabase = await createClient();

  let dailyUsage: Record<string, number> = {};
  try {
    const { data } = await supabase
      .from("feature_usage_daily")
      .select("*")
      .eq("user_id", profile.id)
      .eq("date", todayStr)
      .maybeSingle();
    if (data) {
      dailyUsage = data as Record<string, number>;
    }
  } catch {}

  const analysesLimitText =
    plan === "free" ? `${profile.analyses_used || 0}/2` : "Unlimited";

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  const lastActive = profile.last_seen_at
    ? new Date(profile.last_seen_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Never";

  const subscriptionStatus =
    profile.subscription_status || (plan === "free" ? "active" : "active");

  const billingLabel =
    planCfg.billingType === "lifetime"
      ? "Lifetime Access"
      : planCfg.billingType === "recurring"
      ? `Monthly Billing`
      : "Free Forever";

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full min-w-0 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Plan &amp; Usage</h1>
          <p className="text-text-secondary mt-1 text-sm">
            Monitor your plan, AI usage, quotas, and subscription details.
          </p>
        </div>
        {plan !== "career_pack" && (
          <div className="shrink-0 flex items-center gap-2 self-start">
            {plan === "free" ? (
              <Badge variant="warning" className="gap-1 text-xs font-bold px-3 py-1">
                <Sparkles className="w-3 h-3" /> Upgrade Available
              </Badge>
            ) : plan === "pro" ? (
              <Badge variant="success" className="gap-1 text-xs font-bold px-3 py-1">
                <Award className="w-3 h-3" /> Pro Active
              </Badge>
            ) : (
              <Badge variant="warning" className="gap-1 text-xs font-bold px-3 py-1">
                <Crown className="w-3 h-3" /> Premium Active
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={`lg:col-span-2 border-border bg-surface ${plan === "career_pack" ? "ring-2 ring-amber-500/40" : ""}`}>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2.5 rounded-xl shrink-0 ${plan === "career_pack" ? "bg-amber-500/15 text-amber-400" : plan === "premium" ? "bg-warning/15 text-warning" : plan === "pro" ? "bg-success/15 text-success" : "bg-accent/15 text-accent"}`}>
                  {plan === "career_pack" ? (
                    <Crown className="w-5 h-5" />
                  ) : plan === "premium" || plan === "pro" ? (
                    <Sparkles className="w-5 h-5" />
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg sm:text-xl font-bold text-text-primary">
                      {planCfg.name}
                    </CardTitle>
                    <PlanBadge plan={plan} />
                  </div>
                  <CardDescription className="mt-1 text-xs text-text-muted">
                    {planCfg.tagline}
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end shrink-0 gap-0.5">
                <div className="flex items-baseline gap-1">
                  {planCfg.priceInr === 0 ? (
                    <span className="text-2xl font-extrabold text-text-primary">Free</span>
                  ) : (
                    <>
                      <span className="text-xs text-text-muted">₹</span>
                      <span className="text-2xl font-extrabold text-text-primary">
                        {planCfg.priceInr}
                      </span>
                      <span className="text-xs text-text-muted">{planCfg.periodLabel}</span>
                    </>
                  )}
                </div>
                <Badge variant={planCfg.billingType === "lifetime" ? "warning" : planCfg.billingType === "recurring" ? "success" : "default"} className="text-[10px] font-bold">
                  {billingLabel}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 pt-2">
              <div className="p-3 sm:p-4 rounded-xl border border-border bg-surface-elevated">
                <p className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">
                  ATS Analyses
                </p>
                <p className="text-lg sm:text-xl font-bold text-text-primary mt-1">
                  {analysesLimitText}
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  {typeof remaining === "number" ? `${remaining} remaining` : "Included"}
                </p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl border border-border bg-surface-elevated">
                <p className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Total ATS Checks
                </p>
                <p className="text-lg sm:text-xl font-bold text-text-primary mt-1">
                  {profile.total_ats_checks || 0}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-text-muted mt-0.5">
                  <BarChart3 className="w-3 h-3" /> Lifetime
                </div>
              </div>
              <div className="p-3 sm:p-4 rounded-xl border border-border bg-surface-elevated">
                <p className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Member Since
                </p>
                <p className="text-base sm:text-lg font-bold text-text-primary mt-1">
                  {memberSince}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-text-muted mt-0.5">
                  <ShieldCheck className="w-3 h-3" /> {subscriptionStatus}
                </div>
              </div>
              <div className="p-3 sm:p-4 rounded-xl border border-border bg-surface-elevated">
                <p className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Last Active
                </p>
                <p className="text-base sm:text-lg font-bold text-text-primary mt-1">
                  {lastActive}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-text-muted mt-0.5">
                  <Clock className="w-3 h-3" /> Recent
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-success" /> Plan Features Included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {planCfg.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-xs sm:text-sm text-text-secondary">
                    <div className="w-4 h-4 rounded-full bg-success/15 border border-success/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-success" />
                    </div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {plan === "career_pack" && (
              <div className="mt-5 p-4 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-surface to-surface">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-text-primary flex items-center gap-2 flex-wrap">
                      Career Pack Lifetime Access{" "}
                      <Badge variant="warning" className="text-[10px] font-bold">
                        LIFETIME ✓
                      </Badge>
                    </p>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      Your one-time purchase includes lifetime access to all Career Pack features.
                      AI-powered features are subject to daily fair-use limits; these limits reset
                      automatically at midnight UTC every day.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-surface">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-accent" /> Billing
            </CardTitle>
            <CardDescription className="text-xs text-text-muted">
              Subscription &amp; upgrade options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-surface-elevated p-4">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Current Cycle
              </p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Plan</span>
                  <span className="font-semibold text-text-primary">{planCfg.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Billing</span>
                  <span className="font-semibold text-text-primary">{billingLabel}</span>
                </div>
                {planCfg.billingType === "recurring" && (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-muted">Started</span>
                      <span className="font-semibold text-text-primary">
                        {profile.current_period_start
                          ? new Date(profile.current_period_start).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                          : memberSince}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-muted">Renews</span>
                      <span className="font-semibold text-text-primary">
                        {profile.current_period_end
                          ? new Date(profile.current_period_end).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                          : "Active"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {plan !== "career_pack" && (
              <div className="space-y-2">
                {plan === "free" && (
                  <Link href="/pricing" className="block">
                    <Button className="w-full bg-gradient-to-r from-accent to-accent-hover text-white font-bold gap-1 h-11 shadow-md hover:scale-[1.01] transition-all">
                      <Sparkles className="w-4 h-4" /> Upgrade to Pro
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
                {plan === "pro" && (
                  <Link href="/pricing" className="block">
                    <Button className="w-full bg-gradient-to-r from-warning to-warning text-white font-bold gap-1 h-11 shadow-md hover:scale-[1.01] transition-all">
                      <Crown className="w-4 h-4" /> Get Career Pack (Lifetime)
                    </Button>
                  </Link>
                )}
                {plan === "premium" && (
                  <Link href="/pricing" className="block">
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white font-bold gap-1 h-11 shadow-md hover:scale-[1.01] transition-all">
                      <Crown className="w-4 h-4" /> Upgrade to Career Pack
                    </Button>
                  </Link>
                )}
                <Link href="/pricing" className="block">
                  <Button variant="outline" className="w-full h-10 text-xs font-semibold text-text-secondary">
                    View all plans
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-surface">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" /> Today&apos;s AI Usage
              </CardTitle>
              <CardDescription className="text-xs text-text-muted mt-1">
                Daily fair-use allowance for AI-powered features. Resets at midnight UTC.
              </CardDescription>
            </div>
            <Badge variant="default" className="w-fit text-[10px] font-bold px-2.5 py-1">
              Date: {todayStr}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FEATURE_DISPLAY.map(({ key, label, icon: Icon }) => {
              const limit = planCfg.limits[key] ?? 0;
              const used = (dailyUsage as any)[key] || 0;
              const percentage = limit === 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));
              const isUnavailable = limit === 0 && plan !== "career_pack";
              const isInfinite = plan === "career_pack" && limit > 0;

              return (
                <div
                  key={key}
                  className={`p-4 rounded-xl border transition-all ${
                    isUnavailable
                      ? "border-border bg-surface-elevated/40 opacity-60"
                      : "border-border bg-surface-elevated"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isUnavailable ? "bg-surface text-text-muted" : "bg-accent/15 text-accent"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-text-primary truncate">
                          {label}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isUnavailable ? (
                    <div className="mt-3">
                      <Badge variant="default" className="text-[10px] font-bold w-full justify-center h-7">
                        Not in {planCfg.name.split(" ")[0]}
                      </Badge>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-extrabold text-text-primary">
                          {isInfinite ? "∞" : used}
                        </span>
                        <span className="text-[11px] text-text-muted">
                          {isInfinite ? "Fair use" : `/ ${limit}`}
                        </span>
                      </div>
                      <Progress
                        value={isInfinite ? Math.min(25, percentage || 5) : percentage}
                        className="h-1.5"
                      />
                      <div className="flex items-center justify-between text-[10px] text-text-muted">
                        <span>
                          {isInfinite
                            ? "Daily fair-use applied"
                            : used >= limit
                            ? "Limit reached for today"
                            : `${limit - used} remaining today`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
