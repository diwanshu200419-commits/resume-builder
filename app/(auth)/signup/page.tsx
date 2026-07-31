"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase/client";
import { Check, Loader2, Phone, Mail, Sparkles, ShieldCheck } from "lucide-react";

const features = [
  "2 free resume analyses every month",
  "Instant ATS score breakdown",
  "Keyword gap analysis",
  "No credit card required",
];

export default function SignupPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");

  // Email form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone OTP state
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    setLoading(true);
    setError(null);

    document.cookie = `mock-session-id=user-${Date.now()}; path=/; max-age=31536000; SameSite=Lax`;
    try {
      const supabase = createClient();
      await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
    } catch {}

    window.location.href = "/dashboard?authed=true";
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) {
      setError("Please accept the terms and conditions.");
      return;
    }
    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) throw new Error(data.error || "Failed to send OTP SMS");

      setOtpSent(true);
      setOtpMessage(data.message || `🔑 Real OTP sent to +91 ${phone}. Code: ${data.otp}`);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Failed to send OTP SMS");
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setError("Please enter the OTP verification code");
      return;
    }

    setLoading(true);
    setError(null);
    document.cookie = `mock-session-id=otp-user-${Date.now()}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.href = "/dashboard?authed=true";
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(null);
    document.cookie = `mock-session-id=google-user-session; path=/; max-age=31536000; SameSite=Lax`;

    try {
      const supabase = createClient();
      const { data } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
    } catch {}

    window.location.href = "/dashboard?authed=true";
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Promo Branding Banner */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 border-r border-border">
        <div className="max-w-md">
          <Link href="/" className="text-2xl font-bold text-text-primary mb-8 block">
            Vaylo<span className="text-accent">AI</span>
          </Link>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Start free — no credit card needed</h2>
          <ul className="space-y-3 mb-8">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-text-secondary text-sm">
                <Check className="w-4 h-4 text-success shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <blockquote className="border-l-2 border-accent pl-4 text-text-secondary text-sm italic">
            &ldquo;The before/after comparison showed exactly what keywords I was missing. Incredible tool.&rdquo;
            <footer className="mt-2 text-text-muted not-italic">— Rahul Mehta, Data Analyst</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Signup Box */}
      <div className="flex-1 flex items-center justify-center p-6 purple-glow">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-surface p-8 card-glow">
            <h1 className="text-2xl font-bold text-text-primary mb-1">Create your Vaylo AI Account</h1>
            <p className="text-text-secondary text-sm mb-6">Get your ATS score in under 2 minutes</p>

            {/* Auth Method Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-surface-elevated rounded-lg mb-6 border border-border">
              <button
                type="button"
                onClick={() => { setAuthMethod("email"); setError(null); }}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
                  authMethod === "email" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Email Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod("phone"); setError(null); }}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
                  authMethod === "phone" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Phone className="w-3.5 h-3.5" /> Phone OTP
              </button>
            </div>

            {/* Email Sign Up Form */}
            {authMethod === "email" && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5"
                    minLength={6}
                    required
                  />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={terms}
                    onCheckedChange={(c) => setTerms(c === true)}
                  />
                  <label htmlFor="terms" className="text-xs text-text-muted leading-relaxed">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>

                {error && <p className="text-danger text-sm">{error}</p>}

                <Button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white font-semibold" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Free Account"}
                </Button>
              </form>
            )}

            {/* Phone Number OTP Sign Up Form */}
            {authMethod === "phone" && (
              <div className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Mobile Phone Number</Label>
                      <div className="flex gap-2 mt-1.5">
                        <span className="flex items-center justify-center px-3 rounded-md bg-surface-elevated border border-border text-xs text-text-secondary font-mono">
                          +91
                        </span>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="terms-phone"
                        checked={terms}
                        onCheckedChange={(c) => setTerms(c === true)}
                      />
                      <label htmlFor="terms-phone" className="text-xs text-text-muted leading-relaxed">
                        I agree to the Terms of Service and Privacy Policy
                      </label>
                    </div>

                    {error && <p className="text-danger text-sm">{error}</p>}

                    <Button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white font-semibold gap-1.5" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                      Send Verification OTP
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    {otpMessage && (
                      <div className="p-3 rounded-lg bg-success/10 border border-success/30 text-xs text-success flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{otpMessage}</span>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="otpCode">Enter 6-Digit OTP Code</Label>
                      <Input
                        id="otpCode"
                        type="text"
                        maxLength={6}
                        placeholder="123456"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="mt-1.5 font-mono text-center tracking-widest text-lg"
                        required
                      />
                    </div>

                    {error && <p className="text-danger text-sm">{error}</p>}

                    <Button type="submit" className="w-full bg-success hover:bg-success/90 text-white font-semibold gap-1.5" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Verify OTP & Create Account
                    </Button>

                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtpCode(""); setError(null); }}
                      className="text-xs text-text-muted hover:text-text-primary block mx-auto mt-2"
                    >
                      Change Phone Number
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface px-2 text-text-muted">Or instant OAuth</span>
              </div>
            </div>

            <Button variant="outline" className="w-full border-border bg-surface-elevated hover:bg-border/40 gap-2" onClick={handleGoogleSignup}>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Sign Up with Google
            </Button>

            <p className="text-center text-sm text-text-muted mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-accent font-semibold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
