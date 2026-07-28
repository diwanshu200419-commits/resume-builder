"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Check, Loader2, Phone, Mail, Sparkles, ShieldCheck, KeyRound, ArrowLeft } from "lucide-react";

const features = [
  "ATS score analysis in under 2 minutes",
  "AI-powered resume optimization",
  "Before/after comparison view",
  "PDF & DOCX download (Pro)",
];

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [authMethod, setAuthMethod] = useState<"email" | "phone" | "forgot">("email");

  // Email state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone OTP state
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

  // Forgot Password state
  const [resetTarget, setResetTarget] = useState("");
  const [resetOtpSent, setResetOtpSent] = useState(false);
  const [resetOtpCode, setResetOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message || "Failed to log in");
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const res = await (supabase.auth as any).signInWithOtp({ phone });
    setLoading(false);

    if (res?.error) {
      setError(res.error.message || "Failed to send OTP");
    } else {
      setOtpSent(true);
      setOtpMessage(`Verification OTP sent to +91 ${phone}. Please enter the 6-digit code to proceed.`);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 5) {
      setError("Please enter the OTP verification code");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const res = await (supabase.auth as any).verifyOtp({ phone, token: otpCode });
    if (res?.error) {
      setError(res.error.message || "Invalid OTP code. Please try again.");
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget.trim()) {
      setError("Please enter your email address or mobile phone number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/mock-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "auth",
          method: "sendPasswordResetOtp",
          payload: { target: resetTarget },
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.error) {
        setError(data.error.message || "Failed to send reset OTP");
      } else {
        setResetOtpSent(true);
        setResetMessage(`Password reset code sent to ${resetTarget}. Please enter the code below.`);
      }
    } catch {
      setError("Failed to send reset OTP. Try again.");
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtpCode || resetOtpCode.length < 5) {
      setError("Please enter the 5 or 6 digit reset OTP code");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/mock-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "auth",
          method: "resetPasswordWithOtp",
          payload: { target: resetTarget, token: resetOtpCode, newPassword },
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.error) {
        setError(data.error.message || "Invalid reset OTP code");
      } else {
        if (data.data?.session?.token) {
          document.cookie = `mock-session-id=${data.data.session.token}; path=/; max-age=31536000`;
        }
        router.push(redirect);
        router.refresh();
      }
    } catch {
      setError("Failed to reset password. Try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Promo Branding Banner */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 border-r border-border">
        <div className="max-w-md">
          <Link href="/" className="text-2xl font-bold text-text-primary mb-8 block">
            Vaylo<span className="text-accent">AI</span>
          </Link>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Beat the ATS. Land your dream role.</h2>
          <ul className="space-y-3 mb-8">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-text-secondary text-sm">
                <Check className="w-4 h-4 text-success shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <blockquote className="border-l-2 border-accent pl-4 text-text-secondary text-sm italic">
            &ldquo;My ATS score went from 54% to 88% in one session. Got 3 interview calls within a week.&rdquo;
            <footer className="mt-2 text-text-muted not-italic">— Priya Sharma, Software Engineer</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Login Form Box */}
      <div className="flex-1 flex items-center justify-center p-6 purple-glow">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-surface p-8 card-glow">
            <h1 className="text-2xl font-bold text-text-primary mb-1">
              {authMethod === "forgot" ? "Reset Your Password" : "Welcome to Vaylo AI"}
            </h1>
            <p className="text-text-secondary text-sm mb-6">
              {authMethod === "forgot" ? "Enter your email or phone to receive a reset OTP code" : "Sign in to access your workspace and AI resume tools"}
            </p>

            {/* Auth Method Selector */}
            {authMethod !== "forgot" ? (
              <div className="grid grid-cols-2 gap-2 p-1 bg-surface-elevated rounded-lg mb-6 border border-border">
                <button
                  type="button"
                  onClick={() => { setAuthMethod("email"); setError(null); }}
                  className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
                    authMethod === "email" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Email Account
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
            ) : (
              <button
                type="button"
                onClick={() => { setAuthMethod("email"); setError(null); }}
                className="flex items-center gap-1.5 text-xs text-accent hover:underline mb-6 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </button>
            )}

            {/* Email Login Form */}
            {authMethod === "email" && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
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
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => { setAuthMethod("forgot"); setError(null); }}
                      className="text-xs text-accent hover:underline font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>

                {error && <p className="text-danger text-sm">{error}</p>}

                <Button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white font-semibold" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In with Email"}
                </Button>
              </form>
            )}

            {/* Phone Number OTP Login Form */}
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
                      <Label htmlFor="otpCode">Enter OTP Verification Code</Label>
                      <Input
                        id="otpCode"
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 12345"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="mt-1.5 font-mono text-center tracking-widest text-lg"
                        required
                      />
                    </div>

                    {error && <p className="text-danger text-sm">{error}</p>}

                    <Button type="submit" className="w-full bg-success hover:bg-success/90 text-white font-semibold gap-1.5" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Verify OTP & Enter Platform
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

            {/* Forgot Password Reset Form */}
            {authMethod === "forgot" && (
              <div className="space-y-4">
                {!resetOtpSent ? (
                  <form onSubmit={handleSendResetOtp} className="space-y-4">
                    <div>
                      <Label htmlFor="resetTarget">Email Address or Mobile Phone</Label>
                      <Input
                        id="resetTarget"
                        type="text"
                        placeholder="you@example.com or 9876543210"
                        value={resetTarget}
                        onChange={(e) => setResetTarget(e.target.value)}
                        className="mt-1.5"
                        required
                      />
                    </div>

                    {error && <p className="text-danger text-sm">{error}</p>}

                    <Button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white font-semibold gap-1.5" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                      Send Password Reset OTP
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    {resetMessage && (
                      <div className="p-3 rounded-lg bg-success/10 border border-success/30 text-xs text-success flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{resetMessage}</span>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="resetOtpCode">Enter Reset OTP Code</Label>
                      <Input
                        id="resetOtpCode"
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 12345"
                        value={resetOtpCode}
                        onChange={(e) => setResetOtpCode(e.target.value)}
                        className="mt-1.5 font-mono text-center tracking-widest text-lg"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Min. 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1.5"
                        minLength={6}
                        required
                      />
                    </div>

                    {error && <p className="text-danger text-sm">{error}</p>}

                    <Button type="submit" className="w-full bg-success hover:bg-success/90 text-white font-semibold gap-1.5" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Update Password & Sign In
                    </Button>
                  </form>
                )}
              </div>
            )}

            {authMethod !== "forgot" && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-surface px-2 text-text-muted">Or instant OAuth</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-border bg-surface-elevated hover:bg-border/40 gap-2" onClick={handleGoogleLogin}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </Button>
              </>
            )}

            <p className="text-center text-sm text-text-muted mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-accent font-semibold hover:underline">Sign up free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
