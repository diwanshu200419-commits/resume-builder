"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Profile } from "@/types";
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  Target,
  Award,
  Save,
  LogOut,
  Shield,
  Mail,
  KeyRound,
  Loader2,
  Check,
  Calendar,
  Clock,
} from "lucide-react";

function getInitials(name: string | null): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function calculateProfileStrength(p: Profile): number {
  let count = 0;
  if (p.full_name && p.full_name.trim().length > 1) count++;
  if (p.target_role && p.target_role.trim().length > 0) count++;
  if (p.experience_level && p.experience_level.trim().length > 0) count++;
  if (Array.isArray(p.skills) ? p.skills.length > 0 : p.skills && String(p.skills).trim().length > 0) count++;
  if (p.location && p.location.trim().length > 0) count++;
  if (p.headline && p.headline.trim().length > 0) count++;
  return Math.round((count / 6) * 100);
}

const EXPERIENCE_OPTIONS = [
  "Intern",
  "Entry Level (0-2 yrs)",
  "Mid Level (2-5 yrs)",
  "Senior (5-8 yrs)",
  "Lead / Staff (8+ yrs)",
];

const INDUSTRY_OPTIONS = [
  "Technology",
  "Finance",
  "Healthcare",
  "E-commerce",
  "Education",
  "Consulting",
  "Other",
];

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authUser, setAuthUser] = useState<{ email?: string; email_confirmed_at?: string | null } | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [headline, setHeadline] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [industry, setIndustry] = useState("");
  const [skills, setSkills] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.replace("/login");
        return;
      }

      setAuthUser({
        email: authData.user.email,
        email_confirmed_at: (authData.user as any).email_confirmed_at || null,
      });

      const { data: profileRow, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (error || !profileRow) {
        setLoading(false);
        return;
      }

      const p = profileRow as Profile;
      setProfile(p);
      setFullName(p.full_name || "");
      setPhone(p.phone || "");
      setLocation(p.location || "");
      setHeadline(p.headline || "");
      setCurrentRole(p.current_role || "");
      setTargetRole(p.target_role || "");
      setExperienceLevel(p.experience_level || "");
      setIndustry(p.industry || "");
      setSkills(Array.isArray(p.skills) ? p.skills.join(", ") : p.skills ? String(p.skills) : "");
      setPreferredLocation(p.preferred_location || "");
      setLoading(false);
    }

    loadProfile();
  }, [router]);

  const profileStrength = useMemo(() => (profile ? calculateProfileStrength(profile) : 0), [profile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const allowedFields: Record<string, any> = {
      full_name: fullName.trim() || null,
      phone: phone.trim() || null,
      location: location.trim() || null,
      headline: headline.trim() || null,
      current_role: currentRole.trim() || null,
      target_role: targetRole.trim() || null,
      experience_level: experienceLevel || null,
      industry: industry || null,
      skills: skillsArray.length > 0 ? skillsArray : null,
      preferred_location: preferredLocation.trim() || null,
      updated_at: new Date().toISOString(),
    };

    try {
      const supabase = createClient();
      const { error } = await supabase.from("profiles").update(allowedFields).eq("id", profile.id);
      if (error) throw error;

      setProfile({ ...profile, ...allowedFields });
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Save Failed",
        description: err?.message || "There was a problem saving your profile.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!profile?.email) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
        redirectTo: window.location.origin + "/api/auth/callback?next=/settings",
      });
      if (error) throw error;
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for a password reset link.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Could not send password reset email.",
      });
    }
  }

  async function handleSignOutEverywhere() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut({ scope: "global" });
      router.replace("/login");
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Could not sign out.",
      });
    } finally {
      setSigningOut(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20 text-text-secondary">
        Unable to load profile. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">My Profile</h1>
        <p className="text-text-secondary mt-1">
          Manage your professional information, career preferences, and account settings.
        </p>
      </div>

      {/* SECTION 1: PROFILE COMPLETENESS BANNER */}
      <Card className="border-border bg-surface">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-end sm:items-center justify-between sm:justify-start sm:gap-4 mb-2">
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Profile Strength
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-text-primary">
                      {profileStrength}%
                    </span>
                    <span className="text-xs text-text-muted">
                      {profileStrength === 100 ? "Complete" : "Incomplete"}
                    </span>
                  </div>
                </div>
              </div>
              <Progress value={profileStrength} className="mt-3 h-2.5" />
            </div>
            {profileStrength < 100 && (
              <Link
                href="#edit-profile"
                className="shrink-0 text-xs sm:text-sm text-accent font-semibold hover:underline whitespace-nowrap"
              >
                Complete your profile →
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: PROFILE HEADER */}
      <Card className="border-border bg-surface">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="shrink-0">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || "Profile"}
                  className="w-20 h-20 rounded-full object-cover border-2 border-border bg-surface-elevated"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-accent/20 text-accent flex items-center justify-center text-2xl font-extrabold border-2 border-border">
                  {getInitials(profile.full_name)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <h2 className="text-2xl font-bold text-text-primary truncate">
                {profile.full_name || "No Name Set"}
              </h2>
              <p className="text-sm text-text-secondary">
                {profile.headline ? profile.headline : <span className="italic text-text-muted">(No headline yet)</span>}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                {profile.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {profile.email}
                  </span>
                )}
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {profile.location}
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: EDITABLE PROFILE DETAILS */}
      <Card className="border-border bg-surface" id="edit-profile">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-accent" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal details and career preferences. This helps us tailor recommendations for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-8">
            {/* GROUP A — PERSONAL */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-text-muted" />
                Personal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="headline">Professional Headline</Label>
                  <Input
                    id="headline"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Full-Stack Engineer | Building scalable products"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* GROUP B — CAREER INFORMATION */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-text-muted" />
                Career Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current_role">Current Role</Label>
                  <Input
                    id="current_role"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    placeholder="Software Engineer II"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_role" className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-text-muted" />
                    Target Role
                  </Label>
                  <Input
                    id="target_role"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Senior Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience_level" className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-text-muted" />
                    Experience Level
                  </Label>
                  <select
                    id="experience_level"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-text-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-border-active disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select experience level</option>
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <select
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-text-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-border-active disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select industry</option>
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="skills">Primary Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, TypeScript, Node.js, SQL"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="preferred_location">Preferred Location</Label>
                  <Input
                    id="preferred_location"
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    placeholder="Remote / New York, NY / London, UK"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <p className="text-xs text-text-muted">
                Account plan, role, and usage statistics are managed by Vaylo and cannot be edited from this page.
              </p>
              <Button type="submit" disabled={saving} className="gap-2 bg-accent text-white font-bold text-xs sm:text-sm shrink-0 self-end sm:self-auto">
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* SECTION 4: ACCOUNT (readonly) */}
      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            Account
          </CardTitle>
          <CardDescription>
            Read-only information about your account status and history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-surface-elevated">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Current Plan</p>
              <div className="mt-2">
                <PlanBadge plan={profile.plan || "free"} />
              </div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-surface-elevated">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Member Since</p>
              <p className="mt-2 text-sm font-bold text-text-primary">
                {profile.created_at
                  ? new Date(profile.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-surface-elevated">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last Active
              </p>
              <p className="mt-2 text-sm font-bold text-text-primary">
                {profile.last_seen_at
                  ? new Date(profile.last_seen_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Never"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 5: SECURITY */}
      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your account security, email verification, and active sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email status */}
          <div className="p-4 rounded-xl border border-border bg-surface-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-text-primary">Email Address</p>
                  {authUser?.email_confirmed_at ? (
                    <Badge variant="success" className="gap-1 text-[10px] font-bold">
                      <Check className="w-3 h-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="gap-1 text-[10px] font-bold">
                      Unverified / check your email
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-0.5 font-mono">
                  Linked to account: {profile.email || authUser?.email || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Password management */}
          <div className="p-4 rounded-xl border border-border bg-surface-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">Password</p>
                <p className="text-xs text-text-muted mt-0.5">
                  Change your account password periodically for better security.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleChangePassword} className="text-xs font-semibold shrink-0 self-start sm:self-auto">
              <KeyRound className="w-3.5 h-3.5" />
              Change Password
            </Button>
          </div>

          {/* Sign out everywhere */}
          <div className="p-4 rounded-xl border border-danger/30 bg-danger/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-danger/15 text-danger flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">Sign Out Everywhere</p>
                <p className="text-xs text-text-muted mt-0.5">
                  Log out of all active sessions across all devices immediately.
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleSignOutEverywhere}
              disabled={signingOut}
              className="text-xs font-semibold shrink-0 self-start sm:self-auto"
            >
              {signingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              {signingOut ? "Signing out..." : "Sign Out Everywhere"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
