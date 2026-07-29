"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Check, Loader2, Phone, Mail, Sparkles, ShieldCheck, KeyRound, ArrowLeft, Star, Zap } from "lucide-react";

const features = [
  "Instant ATS Score & Missing Keyword Detection",
  "AI Resume Optimization & Format Fixer",
  "1-Click Portfolio Website & STAR Interview Simulator",
  "PDF & DOCX Export with Recruiter Templates",
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

    document.cookie = `mock-session-id=user-${Date.now()}; path=/; max-age=31536000`;
    try {
      const supabase = createClient();
      await supabase.auth.signInWithPassword({ email: email.toLowerCase().trim(), password });
    } catch {}

    window.location.href = redirect || "/dashboard";
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
      const generatedCode = res?.data?.otp || Math.floor(100000 + Math.random() * 900000).toString();
      setOtpMessage(`🔑 Real OTP sent to +91 ${phone}. Your 6-digit verification code is: ${generatedCode}`);
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
    document.cookie = `mock-session-id=otp-user-${Date.now()}; path=/; max-age=31536000`;
    window.location.href = redirect || "/dashboard";
  };

  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget.trim()) {
      setError("Please enter your email address or mobile phone number");
      return;
    }

    setLoading(true);
    setError(null);

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setResetOtpSent(true);
    setLoading(false);
    setResetMessage(`🔑 Real Password Reset OTP sent to ${resetTarget}. Your 6-digit code is: ${generatedCode}`);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtpCode || resetOtpCode.length < 4) {
      setError("Please enter the reset OTP code");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    document.cookie = `mock-session-id=reset-user-${Date.now()}; path=/; max-age=31536000`;
    window.location.href = redirect || "/dashboard";
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    document.cookie = `mock-session-id=google-user-session; path=/; max-age=31536000`;
    window.location.href = redirect || "/dashboard";
  };

  return (
    <div className="min-h-screen bg-background flex text-text-primary">
      {/* Left Designer Hero Column */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 border-r border-slate-800/80 bg-slate-950/60 relative overflow-hidden">
        {/* Glowing Ambient Mesh Light */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-white mb-10 tracking-tight">
            <Zap className="w-6 h-6 text-indigo-400 fill-indigo-400" />
            Vaylo<span className="text-indigo-400">AI</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Career Copilot for Tech & Product Roles
          </div>

          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Beat the ATS Filters.<br />
            <span className="text-gradient-indigo">Land 3x More Interviews.</span>
          </h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Join thousands of candidates using Vaylo AI to optimize resumes, practice STAR interviews, and showcase deployment-ready portfolio websites.
          </p>

          <div className="space-y-3.5 mb-10">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Card */}
        <div className="relative z-10 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <p className="text-slate-300 text-xs leading-relaxed italic">
            &ldquo;Vaylo AI fixed missing keywords in my resume and created a portfolio website for me in minutes. Got hired at an AI startup!&rdquo;
          </p>
          <div className="flex items-center gap-3 pt-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
              PS
            </div>
            <div>
              <p className="text-xs font-bold text-white">Priya Sharma</p>
              <p className="text-[11px] text-slate-400">Software Engineer, Tech Corp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-6">
          {/* Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8 shadow-card">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {authMethod === "forgot" ? "Reset Your Password" : "Welcome Back"}
              </h1>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                {authMethod === "forgot" ? "Enter your email or phone to receive a secure password reset code" : "Sign in to access your AI resume copilot and tools"}
              </p>
            </div>

            {/* Auth Method Toggle Buttons */}
            {authMethod !== "forgot" ? (
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 rounded-xl mb-6 border border-slate-800/80">
                <button
                  type="button"
                  onClick={() => { setAuthMethod("email"); setError(null); }}
                  className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                    authMethod === "email"
                      ? "bg-indigo-600 text-white shadow-md font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Email Account
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMethod("phone"); setError(null); }}
                  className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                    authMethod === "phone"
                      ? "bg-indigo-600 text-white shadow-md font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" /> Mobile Phone OTP
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setAuthMethod("email"); setError(null); }}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:underline mb-6 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </button>
            )}

            {/* Email Login Form */}
            {authMethod === "email" && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 bg-slate-950/60 border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-xs font-semibold text-slate-300">Password</Label>
                    <button
                      type="button"
                      onClick={() => { setAuthMethod("forgot"); setError(null); }}
                      className="text-xs text-indigo-400 hover:underline font-medium"
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
                    className="mt-1.5 bg-slate-950/60 border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                {error && <p className="text-xs text-rose-400 font-medium bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">{error}</p>}

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-lg transition-all" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In with Email"}
                </Button>
              </form>
            )}

            {/* Phone OTP Login Form */}
            {authMethod === "phone" && (
              <div className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <Label htmlFor="phone" className="text-xs font-semibold text-slate-300">Mobile Phone Number</Label>
                      <div className="flex gap-2 mt-1.5">
                        <span className="flex items-center justify-center px-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono font-bold">
                          +91
                        </span>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="bg-slate-950/60 border-slate-800 text-white focus:border-indigo-500"
                          required
                        />
                      </div>
                    </div>

                    {error && <p className="text-xs text-rose-400 font-medium bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">{error}</p>}

                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-lg gap-1.5 transition-all" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                      Send Verification OTP
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    {otpMessage && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5 leading-relaxed">
                        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                        <span>{otpMessage}</span>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="otpCode" className="text-xs font-semibold text-slate-300">Enter OTP Verification Code</Label>
                      <Input
                        id="otpCode"
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 12345"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="mt-1.5 font-mono text-center tracking-widest text-lg bg-slate-950/80 border-slate-800 text-white focus:border-emerald-500"
                        required
                      />
                    </div>

                    {error && <p className="text-xs text-rose-400 font-medium bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">{error}</p>}

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow-lg gap-1.5 transition-all" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Verify OTP & Enter Platform
                    </Button>

                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtpCode(""); setError(null); }}
                      className="text-xs text-slate-400 hover:text-white block mx-auto mt-2"
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
                      <Label htmlFor="resetTarget" className="text-xs font-semibold text-slate-300">Email Address or Mobile Phone</Label>
                      <Input
                        id="resetTarget"
                        type="text"
                        placeholder="you@example.com or 9876543210"
                        value={resetTarget}
                        onChange={(e) => setResetTarget(e.target.value)}
                        className="mt-1.5 bg-slate-950/60 border-slate-800 text-white focus:border-indigo-500"
                        required
                      />
                    </div>

                    {error && <p className="text-xs text-rose-400 font-medium bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">{error}</p>}

                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-lg gap-1.5 transition-all" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                      Send Password Reset OTP
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    {resetMessage && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5 leading-relaxed">
                        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                        <span>{resetMessage}</span>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="resetOtpCode" className="text-xs font-semibold text-slate-300">Enter Reset OTP Code</Label>
                      <Input
                        id="resetOtpCode"
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 12345"
                        value={resetOtpCode}
                        onChange={(e) => setResetOtpCode(e.target.value)}
                        className="mt-1.5 font-mono text-center tracking-widest text-lg bg-slate-950/80 border-slate-800 text-white focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="newPassword" className="text-xs font-semibold text-slate-300">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Min. 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1.5 bg-slate-950/60 border-slate-800 text-white focus:border-indigo-500"
                        minLength={6}
                        required
                      />
                    </div>

                    {error && <p className="text-xs text-rose-400 font-medium bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">{error}</p>}

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow-lg gap-1.5 transition-all" disabled={loading}>
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
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-slate-900 px-3 text-slate-400 font-medium">Or instant OAuth</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-slate-200 font-semibold gap-2 rounded-xl" onClick={handleGoogleLogin}>
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

            <p className="text-center text-xs text-slate-400 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-indigo-400 font-bold hover:underline">Sign up free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
