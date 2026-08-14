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
  Zap,
  Tag,
  Gift,
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

  // Dedicated Coupon Column State
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Form State
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

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setApplyingCoupon(true);
    try {
      const res = await fetch("/api/payment/coupon/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid coupon code");

      setAppliedCoupon(data.coupon);
      setUtr(`COUPON_${data.coupon}`);
      setSubmitted(true);
    } catch (err: any) {
      setCouponError(err.message || "Could not apply coupon");
    } finally {
      setApplyingCoupon(false);
    }
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

    if (!cleanUtr || cleanUtr.length < 4) {
      errors.utr = "Enter a valid 12-digit UPI UTR number or Promo Code (e.g. 421098765432 or VAYLO100)";
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
      if (!res.ok) throw new Error(data.error || "Could not complete plan activation");
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
        <Card className="border-emerald-500/30 bg-surface shadow-2xl">
          <CardContent className="flex flex-col items-center text-center gap-4 py-12 px-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">
              Payment Verified — Plan Unlocked! 🎉
            </h1>
            <p className="text-sm text-text-secondary max-w-md leading-relaxed">
              Your <span className="font-bold text-emerald-400">{planInfo.name}</span> plan (Ref: <span className="font-mono text-indigo-400 font-bold">{utr}</span>) has been verified. All paid features are now active on your account!
            </p>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 text-left w-full space-y-1">
              <p className="font-bold text-emerald-200">🚀 All Plan Features Unlocked:</p>
              <p>• 1-Click Auto-Fix Bullets &amp; Keyword Optimizer</p>
              <p>• Unwatermarked PDF &amp; DOCX Resume Exports</p>
              <p>• LinkedIn Branding Studio &amp; AI Cover Letters</p>
              <p>• STAR Voice Practice &amp; Recruiter Eye-Screen Simulation</p>
            </div>
            <div className="flex gap-3 mt-2">
              <Link href="/dashboard">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
                  Go to Dashboard &amp; Start Using Features →
                </Button>
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
          <Card className="bg-gradient-to-br from-indigo-500/10 via-surface to-surface border-indigo-500/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl font-bold text-white">
                <span>{planInfo.name}</span>
                <span className="text-3xl font-extrabold text-amber-300">₹{planInfo.price}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary">{planInfo.tagline}</p>
              <p className="text-xs text-text-muted mt-2 font-medium">
                {plan === "career_pack" || plan === "career-pack" || plan === "career"
                  ? "One-time Lifetime Access"
                  : "30-Day Active Access"}
              </p>
            </CardContent>
          </Card>

          {/* QR Code & Direct UPI */}
          <Card className="border-border bg-surface shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <QrCode className="w-5 h-5 text-amber-400" />
                Pay ₹{planInfo.price} via Direct UPI QR / VPA
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
                  <div className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <p className="text-[11px] text-slate-400 text-center font-semibold">Official Vaylo AI UPI ID:</p>
                    <div className="flex items-center justify-between bg-slate-900 px-3.5 py-2.5 rounded-lg border border-slate-800">
                      <span className="font-mono text-sm font-bold text-amber-300">jattshiv32@okaxis</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopyUpi}
                        className="h-8 text-xs gap-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 font-bold"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? "Copied!" : "Copy VPA"}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Deep Link Open Button */}
                  <div className="w-full space-y-2">
                    <a href={order.upiLink} className="w-full block">
                      <Button className="w-full h-11 gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg">
                        <Smartphone className="w-4 h-4" />
                        Open GPay / PhonePe / Paytm App
                      </Button>
                    </a>

                    <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                      <p className="font-bold text-amber-300">📲 Easy 2-Step Payment Guide:</p>
                      <p className="leading-relaxed">
                        1. Tap <strong className="text-white">Copy VPA</strong> or scan QR code on GPay / PhonePe.<br />
                        2. Pay <strong>₹{planInfo.price}</strong>, copy the 12-digit UTR reference number from GPay history, and paste it on the right!
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Special Coupon Column + Payment Proof Form */}
        <div className="space-y-6">
          {/* SPECIAL DEDICATED COUPON COLUMN CARD */}
          <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-surface to-surface shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between text-white">
                <span className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-emerald-400" />
                  Special Coupon Code Column
                </span>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                  100% OFF Code
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-text-secondary">
                Have a promotional or discount coupon? Enter your code below for instant free activation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApplyCoupon} className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Coupon Code (e.g. VAYLO100)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="bg-surface-elevated border-emerald-500/30 text-xs font-mono font-bold tracking-wider text-emerald-300 placeholder:text-slate-500 uppercase"
                  />
                  <Button
                    type="submit"
                    disabled={applyingCoupon}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 shadow-md shrink-0"
                  >
                    {applyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply Code"}
                  </Button>
                </div>
                {couponError && <p className="text-[11px] text-rose-400 font-medium">{couponError}</p>}
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-emerald-400" /> Available Codes:{" "}
                  <strong className="text-emerald-300 font-mono">VAYLO100</strong>,{" "}
                  <strong className="text-emerald-300 font-mono">PROMO2026</strong>,{" "}
                  <strong className="text-emerald-300 font-mono">VIP2026</strong>
                </p>
              </form>
            </CardContent>
          </Card>

          {/* UTR Payment Proof Form */}
          <Card className="border-border bg-surface shadow-xl">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Payment Proof &amp; Activation</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Instant Allotment
                </span>
              </CardTitle>
              <CardDescription className="text-xs">
                Enter candidate details and your 12-digit UPI UTR reference number to unlock all features instantly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-semibold">Candidate Full Name</Label>
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
                  <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
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
                  <Label htmlFor="phone" className="text-xs font-semibold">Phone Number (Optional)</Label>
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
                  <Label htmlFor="utr" className="text-xs font-semibold">12-Digit UPI UTR Reference Number *</Label>
                  <Input
                    id="utr"
                    placeholder="e.g. 421098765432"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    className="bg-surface-elevated border-border text-xs font-mono tracking-wider font-bold text-amber-300"
                  />
                  {formErrors.utr ? (
                    <p className="text-[11px] text-rose-400 font-medium">{formErrors.utr}</p>
                  ) : (
                    <p className="text-[10px] text-text-muted">
                      Enter the 12-digit UTR from GPay / PhonePe history for instant activation.
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="screenshot" className="text-xs font-semibold">Payment Screenshot (Optional)</Label>
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
                  className="w-full h-11 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5 shadow-md"
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unlock Plan Features Instantly"}
                </Button>

                <p className="text-[10px] text-center text-text-muted flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Instant activation enabled. Features unlock immediately.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
