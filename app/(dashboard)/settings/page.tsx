"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { UpgradeModal } from "@/components/shared/UpgradeModal";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import { Loader2, Check } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
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
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your account and subscription</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile?.email || ""} disabled className="mt-1.5 opacity-60" />
          </div>
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saved ? <Check className="w-4 h-4" /> : null}
            {saving ? "Saving..." : saved ? "Saved" : "Save changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface-elevated">
            <div>
              <p className="text-sm text-text-muted">Current plan</p>
              <div className="mt-1 flex items-center gap-2">
                <PlanBadge plan={profile?.plan || "free"} />
                {profile?.plan === "pro" && (
                  <span className="text-xs text-success flex items-center gap-1">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
            </div>
            {profile?.plan === "free" && (
              <Button size="sm" onClick={() => setShowUpgrade(true)}>
                Upgrade to Pro
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border">
              <p className="text-sm text-text-muted">Analyses used</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {profile?.plan === "free"
                  ? `${profile.analyses_used}/2`
                  : "Unlimited"}
              </p>
              {profile?.plan === "free" && (
                <p className="text-xs text-text-muted mt-1">
                  {2 - (profile?.analyses_used || 0)} free analyses remaining
                </p>
              )}
            </div>
            <div className="p-4 rounded-xl border border-border">
              <p className="text-sm text-text-muted">Total ATS checks</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {profile?.total_ats_checks || 0}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border">
              <p className="text-sm text-text-muted">Total downloads</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {profile?.total_resume_downloads || 0}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border">
              <p className="text-sm text-text-muted">Subscription status</p>
              <p className="text-lg font-semibold text-text-primary mt-1 capitalize">
                {profile?.subscription_status || "Active"}
              </p>
              {profile?.current_period_start && (
                <p className="text-xs text-text-muted mt-1">
                  Started on {new Date(profile.current_period_start).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
}
