"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  QrCode,
  ExternalLink,
  CheckCircle2,
  Upload,
  ShieldCheck,
  Smartphone,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import type { Plan } from "@/types";

const PLAN_DETAILS: Record<string, { name: string; price: number; tagline: string }> = {
  pro: { name: "Vaylo Pro", price: 199, tagline: "Unlimited resume AI, downloads & cover letters" },
  premium: { name: "Vaylo Premium", price: 399, tagline: "Everything in Pro + coaching & job matching" },
};

type OrderData = {
  paymentId: string;
  ref: string;
  amount: number;
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

  // form state
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
    if (!name.trim() || name.trim().length < 2) errors.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = "Enter a valid email";
    if (phone.trim().length < 7) errors.phone = "Enter a valid phone number";
    if (utr.trim().length < 4) errors.utr = "Enter the UPI transaction / reference ID";
    if (!screenshot) errors.screenshot = "Upload a screenshot of your payment";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!order) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("paymentId", order.paymentId);
      fd.append("utr", utr.trim());
      fd.append("customerName", name.trim());
      fd.append("customerEmail", email.trim());
      fd.append("customerPhone", phone.trim());
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
        <Card className="border-success/30">
          <CardContent className="flex flex-col items-center text-center gap-4 py-12 px-6">
            <div className="w-14 h-14 rounded-2xl bg-success/15 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">
              Payment successful! 🎉
            </h1>
            <p className="text-text-secondary max-w-sm">
              Your <span className="font-semibold">{planInfo.name}</span> plan is now active.
              Enjoy unlimited access to all premium features.
            </p>
            <div className="flex gap-3 mt-2">
              <Link href="/dashboard">
                <Button>Go to dashboard</Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline">View account</Button>
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
        className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-6">
        {/* Order summary + QR */}
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
              <p className="text-xs text-text-muted mt-2">Billed monthly &middot; Cancel anytime</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <QrCode className="w-5 h-5 text-accent" />
                Scan &amp; pay with UPI
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {creating && (
                <div className="flex flex-col items-center gap-2 py-10 text-text-muted">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-sm">Generating your payment QR...</span>
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
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/myscanner.jpg" alt="UPI QR code" width={220} height={220} />
                  </div>

                  <div className="w-full text-center">
                    <p className="text-sm text-text-muted">Or pay manually to:</p>
                    <p className="text-lg font-bold text-text-primary mt-1">jattshiv32@okaxis</p>
                  </div>

                  <a href={order.upiLink} className="w-full">
                    <Button className="w-full h-12 gap-2 bg-accent hover:bg-accent-hover text-white">
                      <Smartphone className="w-5 h-5" />
                      Open in UPI app
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>

                  <div className="w-full text-left text-sm text-text-secondary space-y-2 bg-muted/40 rounded-lg p-4">
                    <p className="font-semibold text-text-primary">How to pay:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Scan the QR using Google Pay, PhonePe, Paytm, or any UPI app OR pay to jattshiv32@okaxis.</li>
                      <li>Pay exactly <span className="font-semibold">₹{order.amount}</span>.</li>
                      <li>Take a screenshot of the successful payment.</li>
                      <li>Fill the form and upload the screenshot below.</li>
                    </ol>
                  </div>

                  <p className="text-xs text-text-muted text-center">
                    Order reference: <span className="font-mono">{order.ref}</span>
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment proof form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment details &amp; proof</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Customer Name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="utr">UPI Transaction ID (UTR)</Label>
                <Input
                  id="utr"
                  placeholder="e.g. 123456789012"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                />
                {formErrors.utr && <p className="text-xs text-red-500">{formErrors.utr}</p>}
                <p className="text-xs text-text-muted">
                  Found in your UPI app under the transaction details after payment.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="screenshot">Payment Screenshot</Label>
                <label
                  htmlFor="screenshot"
                  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-accent/50 transition-colors text-center"
                >
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Payment screenshot preview" className="max-h-48 rounded-lg object-contain" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-text-muted" />
                      <span className="text-sm text-text-secondary">
                        Click to upload a JPG, PNG, or WEBP (max 5MB)
                      </span>
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
                {formErrors.screenshot && (
                  <p className="text-xs text-red-500">{formErrors.screenshot}</p>
                )}
              </div>

              {serverError && <p className="text-sm text-red-500">{serverError}</p>}

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold bg-accent hover:bg-accent-hover text-white"
                disabled={submitting || creating || !!createError}
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Complete Purchase"
                )}
              </Button>

              <p className="text-[11px] text-center text-text-muted flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Your screenshot is stored securely and used only to verify your payment.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
