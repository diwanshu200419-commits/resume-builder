"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Zap, Check, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";

const marketingFeatures = [
  "ATS-focused resume analysis",
  "Role-specific AI optimization",
  "Interview preparation tools",
  "Portfolio website generation",
];

const seriousJobSearchFeatures = [
  "ATS-focused resume analysis",
  "Role-specific AI optimization",
  "Interview preparation",
  "Portfolio generation",
];

function mapErrorMessage(error: any): string {
  const msg = error?.message || "";
  const lower = msg.toLowerCase();

  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid") ||
    lower.includes("credentials")
  ) {
    return "Incorrect email or password.";
  }
  if (lower.includes("email not confirmed") || lower.includes("not confirmed")) {
    return "Please verify your email before signing in.";
  }
  if (
    lower.includes("network") ||
    lower.includes("abort") ||
    lower.includes("timeout") ||
    lower.includes("fetch") ||
    error?.name === "AbortError"
  ) {
    return "Unable to connect. Please try again.";
  }
  return "Incorrect email or password.";
}

function validateNextParam(raw: string | null): string {
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/")) return "/dashboard";
  if (raw.startsWith("//")) return "/dashboard";
  if (raw.startsWith("/http")) return "/dashboard";
  return raw;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next");
  const nextPath = validateNextParam(rawNext);

  const [view, setView] = useState<"login" | "reset">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResendVerification = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.resend({
        type: "signup",
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard`,
        },
      });
      setResendSuccess(true);
    } catch {}
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = email.trim().toLowerCase();
    const finalPassword = password.trim();

    if (!finalEmail || !finalPassword) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: finalEmail,
        password: finalPassword,
      });

      if (loginError) {
        setError(mapErrorMessage(loginError));
        setLoading(false);
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch (err: any) {
      setError(mapErrorMessage(err));
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });

      if (oauthError) {
        setError(mapErrorMessage(oauthError));
        setLoading(false);
      }
    } catch (err: any) {
      setError(mapErrorMessage(err));
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = resetEmail.trim().toLowerCase();

    if (!finalEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        finalEmail,
        {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/settings&type=recovery`,
        }
      );

      if (resetError) {
        setError(mapErrorMessage(resetError));
        setLoading(false);
        return;
      }

      setResetSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError(mapErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-white">
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 border-r border-slate-800/80 bg-slate-950/60 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-white mb-10 tracking-tight">
            <Zap className="w-6 h-6 text-indigo-400 fill-indigo-400" />
            Vaylo<span className="text-indigo-400">AI</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Beat the ATS Filters.<br />
            Build a Stronger Application.
          </h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Optimize your resume, prepare for interviews, improve your professional profile, and manage your job-search toolkit from one workspace.
          </p>

          <div className="space-y-3.5 mb-10">
            {marketingFeatures.map((f) => (
              <div key={f} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
          <p className="text-[11px] font-bold text-indigo-400 tracking-widest uppercase">
            Built for Serious Job Searches
          </p>
          <div className="space-y-2.5">
            {seriousJobSearchFeatures.map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-slate-300 text-xs font-medium">
                <div className="w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-indigo-400" />
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8 shadow-card">
            {view === "login" && (
              <>
                <div className="lg:hidden mb-6">
                  <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-white tracking-tight">
                    <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400" />
                    Vaylo<span className="text-indigo-400">AI</span>
                  </Link>
                </div>

                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Welcome Back
                  </h1>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    Sign in to access your AI resume copilot and tools
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-300">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-xs font-semibold text-slate-300">
                        Password
                      </Label>
                      <button
                        type="button"
                        onClick={() => {
                          setView("reset");
                          setError(null);
                          setResetSuccess(false);
                        }}
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
                      className="mt-1.5 bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-xs text-rose-400 font-medium bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 space-y-2">
                      <p>{error}</p>
                      {error.includes("verify your email") && (
                        <div className="pt-1 border-t border-rose-500/20 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">Didn&apos;t receive email?</span>
                          <button
                            type="button"
                            onClick={handleResendVerification}
                            className="text-xs text-indigo-400 font-bold hover:underline"
                            disabled={loading}
                          >
                            {resendSuccess ? "Verification Email Sent!" : "Resend Link"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-lg transition-all h-11"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In with Email"
                    )}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-slate-900 px-3 text-slate-400 font-medium">
                      Or instant OAuth
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-slate-200 font-semibold gap-2 rounded-xl h-11"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </Button>

                <p className="text-center text-xs text-slate-400 mt-6">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-indigo-400 font-bold hover:underline">
                    Create account
                  </Link>
                </p>
              </>
            )}

            {view === "reset" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError(null);
                    setResetSuccess(false);
                  }}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:underline mb-6 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </button>

                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Reset Your Password
                  </h1>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    Enter your email to receive a password reset link
                  </p>
                </div>

                {resetSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-300">
                          Password reset email sent.
                        </p>
                        <p className="text-xs text-emerald-400/80 mt-1">
                          Check your inbox and follow the instructions to reset your password.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="resetEmail" className="text-xs font-semibold text-slate-300">
                        Email Address
                      </Label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                          id="resetEmail"
                          type="email"
                          placeholder="you@example.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="pl-10 bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-xs text-rose-400 font-medium bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-lg transition-all h-11"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending reset link...
                        </>
                      ) : (
                        "Send Password Reset Email"
                      )}
                    </Button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
