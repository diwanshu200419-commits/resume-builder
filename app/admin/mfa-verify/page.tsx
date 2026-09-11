"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Loader2, AlertCircle, KeyRound, QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminMfaVerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCodeUri, setQrCodeUri] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [needsEnrollment, setNeedsEnrollment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkMfa() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError) throw factorsError;

        const totpFactor = (factors?.totp || []).find((f: any) => f.status === "verified");

        if (totpFactor) {
          setFactorId(totpFactor.id);
          setNeedsEnrollment(false);
        } else {
          // Admin needs to enroll TOTP
          setNeedsEnrollment(true);
          const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
            factorType: "totp",
            issuer: "Vaylo AI Admin",
          });

          if (enrollError) throw enrollError;
          setFactorId(enrollData.id);
          setQrCodeUri(enrollData.totp.qr_code);
          setSecret(enrollData.totp.secret);
        }
      } catch (err: any) {
        setError(err.message || "Failed to initialize MFA challenge.");
      } finally {
        setLoading(false);
      }
    }

    checkMfa();
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6 || !factorId) return;

    setError(null);
    setVerifying(true);

    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: code.trim(),
      });

      if (verifyError) throw verifyError;

      // Successful verification -> navigate to admin dashboard
      router.replace("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid 6-digit TOTP code. Please check your authenticator app.");
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-border bg-surface shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-bold text-text-primary">
            Admin Two-Factor Authentication
          </CardTitle>
          <CardDescription className="text-xs text-text-muted">
            {needsEnrollment
              ? "Enroll an Authenticator App (Google Authenticator, Authy, or 1Password) to secure admin operations."
              : "Enter the 6-digit security code from your Authenticator app to unlock the admin console."}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3 text-xs text-text-muted">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
              <span>Verifying admin security assurance...</span>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {needsEnrollment && qrCodeUri && (
                <div className="p-4 rounded-xl bg-surface-elevated border border-border flex flex-col items-center text-center gap-3">
                  <div className="bg-white p-2 rounded-lg">
                    <img src={qrCodeUri} alt="TOTP QR Code" className="w-44 h-44" />
                  </div>
                  <div className="text-xs text-text-muted">
                    <p className="font-semibold text-text-primary">Scan with your authenticator</p>
                    <p className="mt-1 font-mono text-[11px] select-all bg-background px-2 py-1 rounded border border-border">
                      Secret: {secret}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5 text-center">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-text-muted absolute left-3 top-3.5" />
                  <Input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className="pl-9 text-center font-mono text-xl tracking-[0.4em] font-bold bg-background border-border"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={verifying || code.length < 6}
                className="w-full bg-accent hover:bg-accent-hover text-white font-bold text-sm shadow-md"
              >
                {verifying ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  "Verify & Access Admin Console"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
