"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase/client";
import { Check, Loader2 } from "lucide-react";

const features = [
  "2 free resume analyses every month",
  "Instant ATS score breakdown",
  "Keyword gap analysis",
  "No credit card required",
];

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogleSignup = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
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

      <div className="flex-1 flex items-center justify-center p-6 purple-glow">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-surface p-8 card-glow">
            <h1 className="text-2xl font-bold text-text-primary mb-2">Create your account</h1>
            <p className="text-text-secondary text-sm mb-6">Get your ATS score in under 2 minutes</p>

            <form onSubmit={handleSignup} className="space-y-4">
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create free account"}
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

            <Button variant="outline" className="w-full" onClick={handleGoogleSignup}>
              Continue with Google
            </Button>

            <p className="text-center text-sm text-text-muted mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
