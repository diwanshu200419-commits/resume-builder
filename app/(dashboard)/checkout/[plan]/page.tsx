"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Check,
  Zap,
  Tag,
  Sparkles,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { initializeRazorpayPayment } from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/client";

const PLAN_DETAILS: Record<string, { name: string; price: number; tagline: string }> = {
  pro: { name: "Vaylo Pro", price: 99, tagline: "Unlimited resume AI, downloads & cover letters" },
  premium: { name: "Vaylo Premium", price: 299, tagline: "Everything in Pro + coaching & job matching" },
  career: { name: "Vaylo Career Pack", price: 499, tagline: "Complete placement pack with 1-on-1 AI review" },
  "career-pack": { name: "Vaylo Career Pack", price: 499, tagline: "Complete placement pack with 1-on-1 AI review" },
  career_pack: { name: "Vaylo Career Pack", price: 499, tagline: "Complete placement pack with 1-on-1 AI review" },
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const plan = String(params.plan || "").toLowerCase();
  const planInfo = PLAN_DETAILS[plan];

  // User Profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then((res: any) => {
      if (res?.data?.user) {
        setEmail(res.data.user.email || "");
        setName(res.data.user.user_metadata?.full_name || res.data.user.user_metadata?.name || "");
      }
    });
  }, []);

  // Discount Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [discountDetails, setDiscountDetails] = useState<{
    code: string;
    discountAmount: number;
    finalPrice: number;
    description: string;
  } | null>(null);

  // Form State
  const [utr, setUtr] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Razorpay Standard Checkout state
  const [rzpLoading, setRzpLoading] = useState(false);
  const [rzpError, setRzpError] = useState<string | null>(null);

  const handleRazorpayPay = async () => {
    setRzpError(null);
    setRzpLoading(true);
    try {
      // Step 1: Create Razorpay order on backend
      const res = await fetch("/api/payment/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          couponCode: discountDetails?.code || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not initiate Razorpay payment");

      // Step 2: Open Razorpay Standard Checkout modal
      await initializeRazorpayPayment({
        key: data.key,
        amount: data.amount,
        plan,
        planName: planInfo.name,
        orderId: data.orderId,
        customerName: name || "Customer",
        customerEmail: email || "",
        onSuccess: async (response) => {
          // Step 3: Verify payment signature on backend
          try {
            const verifyRes = await fetch("/api/payment/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                plan,
                amount: data.amount,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");
            // Show instant success screen
            setUtr(`RZP_${response.razorpay_payment_id}`);
            setSubmitted(true);
          } catch (err: any) {
            setRzpError(err.message || "Payment verification failed. Contact support with your payment ID.");
          } finally {
            setRzpLoading(false);
          }
        },
        onFailure: (error) => {
          setRzpError(error?.description || error?.reason || "Payment failed. Please try again.");
          setRzpLoading(false);
        },
        onDismiss: () => {
          setRzpLoading(false);
        },
      });
    } catch (err: any) {
      setRzpError(err.message || "Something went wrong. Please try again.");
      setRzpLoading(false);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const cleanCode = couponInput.trim().toUpperCase();
    if (!cleanCode) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setApplyingCoupon(true);
    try {
      const res = await fetch("/api/payment/coupon/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleanCode, plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid coupon code");

      if (data.isFullAccess) {
        setUtr(`COUPON_${data.coupon}`);
        setSubmitted(true);
      } else {
        setDiscountDetails({
          code: data.coupon,
          discountAmount: data.discountAmount,
          finalPrice: data.finalPrice,
          description: data.description,
        });
        setCouponSuccess(`Coupon '${data.coupon}' applied! You saved ₹${data.discountAmount}.`);
      }
    } catch (err: any) {
      setCouponError(err.message || "Could not apply coupon code.");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const effectivePrice = discountDetails ? discountDetails.finalPrice : planInfo.price;

  if (submitted) {
    const isCoupon = utr.startsWith("COUPON_");
    const isRazorpay = utr.startsWith("RZP_");
    const isInstantSuccess = isCoupon || isRazorpay;

    return (
      <div className="max-w-xl mx-auto py-16">
        <Card className={`border-surface shadow-2xl ${isInstantSuccess ? "border-emerald-500/30" : "border-amber-500/30"}`}>
          <CardContent className="flex flex-col items-center text-center gap-4 py-12 px-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${isInstantSuccess ? "bg-emerald-500/15 border-emerald-500/30" : "bg-amber-500/15 border-amber-500/30"}`}>
              {isInstantSuccess ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
              ) : (
                <Zap className="w-8 h-8 text-amber-500 dark:text-amber-400" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-text-primary">
              {isCoupon
                ? "Coupon Verified — Plan Unlocked! 🎉"
                : isRazorpay
                ? "Payment Successful — Plan Unlocked! 🎉"
                : "Payment Submitted — Verification Pending ⏳"}
            </h1>
            <p className="text-sm text-text-secondary max-w-md leading-relaxed">
              {isCoupon ? (
                <>Your <span className="font-bold text-emerald-600 dark:text-emerald-400">{planInfo.name}</span> plan pass has been verified. All paid features are now active!</>
              ) : isRazorpay ? (
                <>Your Razorpay payment was verified and your <span className="font-bold text-emerald-600 dark:text-emerald-400">{planInfo.name}</span> plan is now active! All features are unlocked immediately.</>
              ) : (
                <>Payment submitted. Your payment is being verified. Please wait while our team confirms your transaction reference (Ref: <span className="font-mono text-amber-500 dark:text-amber-300 font-bold">{utr}</span>). You don&apos;t need to pay again.</>
              )}
            </p>
            <div className={`p-4 rounded-xl text-xs text-left w-full space-y-1.5 ${isInstantSuccess ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300" : "bg-surface-elevated border border-border text-text-secondary"}`}>
              <p className={`font-bold ${isInstantSuccess ? "text-emerald-700 dark:text-emerald-200" : "text-amber-600 dark:text-amber-300"}`}>
                {isInstantSuccess ? "🚀 All Plan Features Unlocked:" : "ℹ️ Verification Details:"}
              </p>
              {isInstantSuccess ? (
                <div className="space-y-1 text-xs text-text-secondary">
                  <p>• 1-Click Auto-Fix Bullets &amp; Keyword Optimizer</p>
                  <p>• Unwatermarked PDF &amp; DOCX Resume Exports</p>
                  <p>• LinkedIn Branding Studio &amp; AI Cover Letters</p>
                  <p>• STAR Voice Practice &amp; Recruiter Eye-Screen Simulation</p>
                </div>
              ) : (
                <>
                  <p>• Transaction Reference: <span className="font-mono text-amber-500 dark:text-amber-300 font-bold">{utr}</span></p>
                  <p>• Plan Requested: <span className="font-bold text-text-primary">{planInfo.name}</span></p>
                  <p>• Status: <span className="text-amber-500 dark:text-amber-400 font-bold">Pending Admin / Webhook Verification</span></p>
                  <p className="text-[11px] text-text-muted pt-1">Your features will unlock automatically upon verification. You may return to the dashboard anytime.</p>
                </>
              )}
            </div>
            <div className="flex gap-3 mt-2">
              <Link href="/dashboard">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
                  Return to Dashboard →
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
        {/* Left Column: Order Summary Card */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-500/10 via-surface to-surface border-indigo-500/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl font-bold text-text-primary">
                <span>{planInfo.name}</span>
                <div className="text-right">
                  {discountDetails ? (
                    <div className="flex flex-col items-end">
                      <span className="text-xs line-through text-text-muted">₹{planInfo.price}</span>
                      <span className="text-3xl font-extrabold text-emerald-500 dark:text-emerald-400">₹{discountDetails.finalPrice}</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-extrabold text-indigo-600 dark:text-amber-300">₹{planInfo.price}</span>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary">{planInfo.tagline}</p>
              {discountDetails && (
                <div className="mt-3 p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Coupon '{discountDetails.code}' Applied
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">-₹{discountDetails.discountAmount} OFF</span>
                </div>
              )}
              <p className="text-xs text-text-muted mt-2 font-medium">
                {plan === "career_pack" || plan === "career-pack" || plan === "career"
                  ? "One-time Lifetime Access"
                  : "30-Day Active Access"}
              </p>
            </CardContent>
          </Card>

          {/* Feature Highlights */}
          <Card className="border-border bg-surface shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-text-primary flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                What&apos;s Included in {planInfo.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-text-secondary">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Unlimited AI Resume ATS Enhancements &amp; Bullet Fixes</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Unwatermarked PDF &amp; DOCX Export Downloads</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Cover Letter Generator &amp; LinkedIn Optimizer</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Instant activation right after successful payment</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Razorpay Checkout Button + Coupon Card */}
        <div className="space-y-6">
          {/* ── Razorpay Instant Checkout Card ── */}
          <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-600/5 via-surface to-surface shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base text-text-primary">
                <span className="flex items-center gap-2 font-bold">
                  <CreditCard className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  Instant Online Checkout
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Instant Activation
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-text-secondary">
                Pay securely via UPI (GPay, PhonePe, Paytm), Credit/Debit Card, Net Banking, or Wallets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-surface-elevated rounded-xl border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-muted">Total payable amount</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-emerald-400">₹{effectivePrice}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">
                    Verified Razorpay Gateway
                  </span>
                </div>
              </div>

              <Button
                className="w-full h-12 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-lg rounded-xl transition-all"
                disabled={rzpLoading}
                onClick={handleRazorpayPay}
              >
                {rzpLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Launching Razorpay…</>
                ) : (
                  <><CreditCard className="w-4 h-4" /> Pay ₹{effectivePrice} with Razorpay</>
                )}
              </Button>

              {rzpError && (
                <p className="text-xs text-rose-500 dark:text-rose-400 font-medium text-center bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
                  {rzpError}
                </p>
              )}

              <div className="flex items-center justify-center gap-2 text-[11px] text-text-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>256-bit TLS encrypted · Powered by Razorpay Standard</span>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {["Google Pay", "PhonePe", "Paytm", "UPI", "Cards", "Net Banking"].map((method) => (
                  <span
                    key={method}
                    className="px-2.5 py-1 rounded-md bg-surface-elevated border border-border text-[11px] text-text-secondary font-medium"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* DISCOUNT / PROMO CODE CARD */}
          <Card className="border-border bg-surface shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-text-primary font-bold">
                <Tag className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                Have a Promo or Coupon Code?
              </CardTitle>
              <CardDescription className="text-xs text-text-secondary">
                Enter your coupon code to apply an instant discount before paying.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApplyCoupon} className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="ENTER COUPON CODE"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="bg-surface-elevated border-border text-xs font-mono font-bold tracking-wider text-text-primary placeholder:text-text-muted uppercase"
                  />
                  <Button
                    type="submit"
                    disabled={applyingCoupon}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 shadow-md shrink-0"
                  >
                    {applyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                  </Button>
                </div>
                {couponError && <p className="text-[11px] text-rose-500 dark:text-rose-400 font-medium">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{couponSuccess}</p>}
              </form>
            </CardContent>
          </Card>

          {/* Legal & Guarantee Links */}
          <div className="flex items-center justify-between text-xs text-text-muted px-1">
            <Link href="/privacy" target="_blank" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
            <Link href="/refund" target="_blank" className="hover:text-text-primary transition-colors">Refund Policy</Link>
            <Link href="/terms" target="_blank" className="hover:text-text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
