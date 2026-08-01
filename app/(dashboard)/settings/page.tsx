"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { UpgradeModal } from "@/components/shared/UpgradeModal";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import { Loader2, Check, Clock, ShieldCheck, XCircle, CreditCard } from "lucide-react";

interface UserPaymentRequest {
  id: string;
  requested_plan: string;
  amount_claimed: number;
  utr_number: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [paymentRequests, setPaymentRequests] = useState<UserPaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setProfile(data.profile);
          setFullName(data.profile.full_name || "");
          if (data.paymentRequests) {
            setPaymentRequests(data.paymentRequests);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ full_name: fullName }).eq("id", profile.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Account &amp; Billing Settings</h1>
        <p className="text-text-secondary mt-1">Manage your candidate profile, active tier plan, and UPI verification status.</p>
      </div>

      {/* Profile Info */}
      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" value={profile?.email || ""} disabled className="mt-1.5 opacity-60 bg-surface-elevated font-mono text-xs" />
          </div>
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5 bg-surface-elevated border-border"
            />
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2 bg-accent text-white font-bold text-xs">
            {saved ? <Check className="w-4 h-4" /> : null}
            {saving ? "Saving..." : saved ? "Changes Saved" : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      {/* Subscription Tier */}
      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-accent" /> Active Subscription Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface-elevated">
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Current Membership Tier</p>
              <div className="mt-1.5 flex items-center gap-2">
                <PlanBadge plan={profile?.plan || "free"} />
                {profile?.plan !== "free" && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Plan Unlocked &amp; Active
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted mt-2">
                {profile?.plan === "career_pack"
                  ? "Lifetime Unlimited Career Access"
                  : profile?.expires_at
                  ? `Active until ${new Date(profile.expires_at).toLocaleDateString("en-IN")}`
                  : profile?.plan !== "free"
                  ? "30-Day Active Monthly Access"
                  : "Free Tier (2 Scans / Month)"}
              </p>
            </div>
            {profile?.plan === "free" && (
              <Link href="/pricing">
                <Button size="sm" className="bg-accent text-white font-bold text-xs">
                  Upgrade Plan
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-surface-elevated">
              <p className="text-xs text-text-muted font-semibold uppercase">ATS Scans Used</p>
              <p className="text-2xl font-extrabold text-text-primary mt-1">
                {profile?.plan === "free" ? `${profile.analyses_used || 0} / 2` : "Unlimited"}
              </p>
              {profile?.plan === "free" && (
                <p className="text-xs text-text-muted mt-1">
                  {Math.max(0, 2 - (profile?.analyses_used || 0))} free scans remaining this month
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl border border-border bg-surface-elevated">
              <p className="text-xs text-text-muted font-semibold uppercase">PDF / DOCX Exports</p>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                {profile?.plan === "free" ? "Unlocked" : "Unlimited"}
              </p>
              <p className="text-xs text-text-muted mt-1">100% unlocked PDF &amp; Word exports</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UPI Payment Verification History */}
      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle className="text-base font-bold text-text-primary flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" /> UPI Payment Verification Requests
          </CardTitle>
          <CardDescription>
            History of UTR transaction reference submissions and admin verification status.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {paymentRequests.length === 0 ? (
            <div className="p-6 text-center bg-surface-elevated/40 rounded-xl border border-border">
              <p className="text-xs text-text-muted">No UPI payment submission records found on file.</p>
              <Link href="/pricing" className="inline-block mt-3">
                <Button size="sm" variant="outline" className="text-xs font-semibold">
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-elevated text-xs font-bold text-text-secondary uppercase border-b border-border">
                    <th className="p-3">Plan</th>
                    <th className="p-3">UTR Reference</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Submitted Date</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {paymentRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="p-3 font-extrabold uppercase text-text-primary">{req.requested_plan}</td>
                      <td className="p-3 font-mono text-amber-400 font-bold">{req.utr_number}</td>
                      <td className="p-3 font-bold text-emerald-400">₹{req.amount_claimed}</td>
                      <td className="p-3 text-text-muted">
                        {new Date(req.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="p-3 text-right">
                        {req.status === "approved" ? (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold text-[10px]">
                            <Check className="w-3 h-3 mr-1" /> Approved &amp; Unlocked
                          </Badge>
                        ) : req.status === "rejected" ? (
                          <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold text-[10px]">
                            <XCircle className="w-3 h-3 mr-1" /> Verification Failed
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold text-[10px] animate-pulse">
                            <Clock className="w-3 h-3 mr-1" /> Under Review
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {showUpgrade && <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />}
    </div>
  );
}
