"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  QrCode,
  CheckCircle2,
  Upload,
  ShieldCheck,
  Smartphone,
  ArrowLeft,
  Copy,
  Check,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

const PLAN_DETAILS: Record<string, { name: string; price: number; tagline: string }> = {
  pro: { name: "Vaylo Pro", price: 99, tagline: "Unlimited resume AI, downloads & cover letters" },
  premium: { name: "Vaylo Premium", price: 299, tagline: "Everything in Pro + coaching & job matching" },
  career: { name: "Vaylo Career Pack", price: 499, tagline: "Complete placement pack with 1-on-1 AI review" },
  "career-pack": { name: "Vaylo Career Pack", price: 499, tagline: "Complete placement pack with 1-on-1 AI review" },
  career_pack: { name: "Vaylo Career Pack", price: 499, tagline: "Complete placement pack with 1-on-1 AI review" },
};

type OrderData = {
  paymentId: string;
  ref: string;
  amount: number;
  upiId?: string;
  upiLink: string;
  qrUrl: string;
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const plan = String(params.plan || "").toLowerCase();
  const planInfo = PLAN_DETAILS[plan];

  const [order, setOrder] = useState<OrderData | null>(null);
  const [creating, setCreating] = useState(true);
  const [createError, setCreateError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Manual Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [utr, setUtr] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!planInfo) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/payment/upi/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not start payment");
        if (!cancelled) setOrder(data);
      } catch (e: any) {
        if (!cancelled) setCreateError(e.message || "Something went wrong. Please try again.");
      } finally {
        if (!cancelled) setCreating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [plan, planInfo]);

  if (!planInfo) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Plan not found</h1>
        <p className="text-text-secondary mb-6">Please choose a valid plan to continue.</p>
        <Link href="/pricing">
          <Button>Back to pricing</Button>
        </Link>
      </div>
    );
  }

  const handleCopyUpi = () => {
    navigator.clipboard.writeText("jattshiv32@okaxis");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setScreenshot(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    const cleanUtr = utr.trim().replace(/\s+/g, "");

    if (!name.trim() || name.trim().length < 2) errors.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = "Enter a valid email address";

    if (!/^\d{12}$/.test(cleanUtr)) {
      errors.utr = "Enter a valid 12-digit numeric UPI transaction UTR reference number (e.g. 421098765432)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("paymentId", order?.paymentId || `pay_${Date.now()}`);
      fd.append("utr", utr.trim().replace(/\s+/g, ""));
      fd.append("customerName", name.trim());
      fd.append("customerEmail", email.trim());
      fd.append("customerPhone", phone.trim());
      fd.append("plan", plan);
      if (screenshot) fd.append("screenshot", screenshot);

      const res = await fetch("/api/payment/upi/submit", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit payment proof");
      setSubmitted(true);
    } catch (e: any) {
      setServerError(e.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-16">
        <Card className="border-amber-500/30 bg-surface shadow-xl">
          <CardContent className="flex flex-col items-center text-center gap-4 py-12 px-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 flex items-center justify-center border border-amber-500/30">
              <CheckCircle2 className="w-7 h-7 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">
              Payment Submitted — Under Admin Review! ⏳
            </h1>
            <p className="text-sm text-text-secondary max-w-md leading-relaxed">
              Your payment proof for the <span className="font-bold text-amber-400">{planInfo.name}</span> plan (UTR: <span className="font-mono text-indigo-400 font-bold">{utr}</span>) has been submitted successfully.
            </p>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 text-left w-full space-y-1">
              <p className="font-bold text-amber-200">🔍 What happens next?</p>
              <p>Our admin team manually verifies UTR numbers against UPI bank app statements within <strong>1-2 hours</strong>. Once verified, your plan features will unlock automatically.</p>
            </div>
            <div className="flex gap-3 mt-2">
              <Link href="/dashboard">
                <Button className="bg-accent text-white font-bold text-xs">Go to Dashboard</Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" className="border-border text-xs">View Billing Status</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-6 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Pricing
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-6">
        {/* Order summary + QR Code */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-accent/10 via-surface to-surface border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{planInfo.name}</span>
                <span className="text-2xl font-bold text-text-primary">₹{planInfo.price}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary">{planInfo.tagline}</p>
              <p className="text-xs text-text-muted mt-2">
                {plan === "career_pack" || plan === "career-pack" || plan === "career"
                  ? "One-time Lifetime Access"
                  : "30-Day Active Access"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <QrCode className="w-5 h-5 text-amber-400" />
                Pay ₹{planInfo.price} via Any UPI App
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {creating && (
                <div className="flex flex-col items-center gap-2 py-10 text-text-muted">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                  <span className="text-sm">Generating payment details...</span>
                </div>
              )}

              {createError && (
                <div className="text-center py-6">
                  <p className="text-sm text-red-500 mb-3">{createError}</p>
                  <Button variant="outline" onClick={() => location.reload()}>
                    Try again
                  </Button>
                </div>
              )}

              {order && (
                <>
                  {/* Clean QR Code */}
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={order.qrUrl} alt="UPI QR code" width={200} height={200} />
                  </div>

                  {/* Copy UPI VPA Section */}
                  <div className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <p className="text-[11px] text-slate-400 text-center font-medium">Official Vaylo AI UPI VPA:</p>
                    <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                      <span className="font-mono text-sm font-bold text-amber-300">jattshiv32@okaxis</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopyUpi}
                        className="h-7 text-xs gap-1 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? "Copied!" : "Copy"}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Deep Link Open Button */}
                  <div className="w-full space-y-2">
                    <a href={order.upiLink} className="w-full block">
                      <Button className="w-full h-11 gap-2 bg-accent hover:bg-accent-hover text-white font-bold text-xs shadow-lg">
                        <Smartphone className="w-4 h-4" />
                        Open in GPay / PhonePe / Paytm
                      </Button>
                    </a>

                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                      <p className="font-bold text-slate-300 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> GPay "Payment Declined" Notice:
                      </p>
                      <p className="leading-relaxed">
                        If GPay shows <em>"Payment has not been debited"</em>, open GPay manually, select <strong>"Pay UPI ID"</strong>, paste <strong className="text-amber-300 font-mono">jattshiv32@okaxis</strong>, and pay ₹{planInfo.price}.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Manual Payment proof form */}
        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle className="text-base">Payment Details &amp; Proof</CardTitle>
            <CardDescription className="text-xs">
              Enter your details and the 12-digit UTR number from your GPay / PhonePe payment receipt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs">Candidate Full Name</Label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-surface-elevated border-border text-xs"
                />
                {formErrors.name && <p className="text-[11px] text-rose-400 font-medium">{formErrors.name}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-surface-elevated border-border text-xs"
                />
                {formErrors.email && <p className="text-[11px] text-rose-400 font-medium">{formErrors.email}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-surface-elevated border-border text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="utr" className="text-xs">12-Digit UPI UTR Reference Number *</Label>
                <Input
                  id="utr"
                  placeholder="e.g. 421098765432"
                  value={utr}
                  maxLength={12}
                  onChange={(e) => setUtr(e.target.value)}
                  className="bg-surface-elevated border-border text-xs font-mono tracking-wider font-bold text-amber-300"
                />
                {formErrors.utr ? (
                  <p className="text-[11px] text-rose-400 font-medium">{formErrors.utr}</p>
                ) : (
                  <p className="text-[10px] text-text-muted">
                    Found in GPay, PhonePe, or Paytm under transaction history (12 numeric digits).
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="screenshot" className="text-xs">Payment Screenshot (Optional)</Label>
                <label
                  htmlFor="screenshot"
                  className="flex flex-col items-center justify-center gap-1.5 border border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-accent/50 transition-colors text-center bg-surface-elevated"
                >
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Screenshot preview" className="max-h-36 rounded object-contain" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-text-muted" />
                      <span className="text-xs text-text-secondary">Click to upload image (max 5MB)</span>
                    </>
                  )}
                  <input
                    id="screenshot"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {serverError && <p className="text-xs text-rose-400 font-medium">{serverError}</p>}

              <Button
                type="submit"
                className="w-full h-11 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white gap-1.5 shadow-md"
                disabled={submitting}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Proof for Manual Admin Review"}
              </Button>

              <p className="text-[10px] text-center text-text-muted flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Proof stored securely for admin verification only.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
