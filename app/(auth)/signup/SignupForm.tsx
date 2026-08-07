"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase/client";
import { Check, Loader2, Zap, UserPlus, Mail, Lock, ShieldCheck } from "lucide-react";

const features = [
  "2 free resume analyses every month",
  "Instant ATS score breakdown",
  "Keyword gap analysis",
  "Portfolio generation & interview prep",
];

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawNext = searchParams.get("next") || "/dashboard";
  const nextPath =
    rawNext.startsWith("/") &&
    !rawNext.startsWith("//") &&
    !rawNext.startsWith("/http")
      ? rawNext
      : "/dashboard";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<null | "verify" | null>(null);

  const mapSignupError = (message: string): string => {
    if (!message) return "Signup failed. Please try again.";
    const lower = message.toLowerCase();
    if (
      lower.includes("already registered") ||
      lower.includes("user already exists") ||
      lower.includes("already exists") ||
      lower.includes("user_already_exists")
    ) {
      return "An account with this email already exists. Please log in.";
    }
    if (lower.includes("rate limit") || lower.includes("rate_limit") || lower.includes("too many requests")) {
      return "Too many signup attempts. Please wait a moment or try signing up with Google.";
    }
    if (lower.includes("weak password") || lower.includes("password should be")) {
      return "Password must be at least 6 characters.";
    }
    return message;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) {
      setError("Please accept the terms and conditions.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const finalEmail = email.toLowerCase().trim();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: finalEmail,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });

      if (signUpError) {
        setLoading(false);
        setError(mapSignupError(signUpError.message));
        return;
      }

      // 1. Direct session returned by signUp
      if (data?.session) {
        router.replace(nextPath);
        router.refresh();
        return;
      }

      // 2. Attempt immediate sign-in if project has email auto-confirmation
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: finalEmail,
        password,
      });

      if (!signInError && signInData?.session) {
        router.replace(nextPath);
        router.refresh();
        return;
      }

      // 3. Check client session state
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        router.replace(nextPath);
        router.refresh();
        return;
      }

      // 4. Fallback to verification notice if email confirmation is enforced
      setSuccessState("verify");
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(mapSignupError(err?.message || ""));
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });

      if (oauthError) {
        setGoogleLoading(false);
        setError(mapSignupError(oauthError.message));
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
    } catch (err: any) {
      setGoogleLoading(false);
      setError(mapSignupError(err?.message || ""));
    }
  };

  if (successState === "verify") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-text-primary">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mb-5">
              <ShieldCheck className="w-7 h-7 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
              Verify your email
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Please verify your email to activate your account. If email verification is disabled in Supabase project settings, you may proceed to sign in directly.
            </p>
            <Link href="/login">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex text-text-primary">
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 border-r border-slate-800/80 bg-slate-950/60 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-white mb-10 tracking-tight">
            <Zap className="w-6 h-6 text-indigo-400 fill-indigo-400" />
            Vaylo<span className="text-indigo-400">AI</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Start free — no credit card needed
          </h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Everything you need to beat ATS filters and land more interviews — free.
          </p>

          <div className="space-y-3.5">
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

        <div className="relative z-10">
          <div className="px-5 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <p className="text-xs text-slate-400 leading-relaxed">
              Built for ambitious candidates in tech, product, and data roles.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Create your Vaylo AI Account
              </h1>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Get your ATS score in under 2 minutes
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-xs font-semibold text-slate-300">Full name</Label>
                <div className="relative mt-1.5">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-9 bg-slate-950/60 border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-xs font-semibold text-slate-300">Email address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-slate-950/60 border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-xs font-semibold text-slate-300">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 bg-slate-950/60 border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Checkbox
                  id="terms"
                  checked={terms}
                  onCheckedChange={(c) => setTerms(c === true)}
                  className="mt-0.5"
                />
                <label htmlFor="terms" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              {error && (
                <p className="text-xs text-rose-400 font-medium bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-lg transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Free Account"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900 px-3 text-slate-400 font-medium">Or instant OAuth</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-slate-200 font-semibold gap-2 rounded-xl"
              onClick={handleGoogleSignup}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              Sign Up with Google
            </Button>

            <p className="text-center text-xs text-slate-400 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-400 font-bold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
