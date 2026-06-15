"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Check, Loader2 } from "lucide-react";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?redirect=${redirect}`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 border-r border-border">
        <div className="max-w-md">
          <Link href="/" className="text-2xl font-bold text-text-primary mb-8 block">
            Resume<span className="text-accent">AI</span>
          </Link>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Beat the ATS. Land the interview.</h2>
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

      <div className="flex-1 flex items-center justify-center p-6 purple-glow">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-surface p-8 card-glow">
            <h1 className="text-2xl font-bold text-text-primary mb-2">Welcome back</h1>
            <p className="text-text-secondary text-sm mb-6">Log in to continue optimizing your resume</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>

              {error && <p className="text-danger text-sm">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log in"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface px-2 text-text-muted">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
              Continue with Google
            </Button>

            <p className="text-center text-sm text-text-muted mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-accent hover:underline">Sign up free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
