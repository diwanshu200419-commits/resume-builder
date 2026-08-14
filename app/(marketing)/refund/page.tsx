import Link from "next/link";
import { ShieldCheck, Mail, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Refund & Cancellation Policy — Vaylo AI",
  description: "Transparent refund and cancellation policy for Vaylo AI subscriptions and career tools.",
};

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-text-primary">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="border-b border-border pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Refund &amp; Cancellation Policy</h1>
        <p className="text-xs text-text-muted">Effective Date: July 1, 2026 | Last Updated: August 2026</p>
      </div>

      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs leading-relaxed space-y-1">
        <p className="font-bold text-emerald-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Transparent Refund Policy:
        </p>
        <p>
          We want you to be completely satisfied with Vaylo AI. Because AI feature execution consumes real-time cloud computation tokens, refund eligibility depends on whether paid AI analyses or exports have been used.
        </p>
      </div>

      <div className="space-y-8 text-xs text-text-secondary leading-relaxed">
        {/* 1. Refund Eligibility */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-400" /> 1. Refund Eligibility Criteria
          </h2>
          <p>
            You are eligible for a full refund under the following conditions:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-text-secondary">
            <li><strong>Unused Paid Features:</strong> You requested a refund within <strong>7 days</strong> of plan purchase AND have not executed any paid AI optimizations, ATS analyses, or unwatermarked PDF/DOCX downloads on your account.</li>
            <li><strong>Duplicate Payment:</strong> You were accidentally charged twice for the same transaction.</li>
            <li><strong>Technical Service Failure:</strong> A confirmed server error prevented your account from accessing the purchased plan features.</li>
          </ul>
        </section>

        {/* 2. Non-Refundable Items */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" /> 2. Non-Refundable Scenarios
          </h2>
          <p>Refunds will <strong>NOT</strong> be issued in the following circumstances:</p>
          <ul className="list-disc pl-5 space-y-1 text-text-secondary">
            <li>If paid AI features (Auto-Fix bullets, Cover Letters, Interview evaluations, or DOCX exports) have already been consumed on your account.</li>
            <li>If a refund request is submitted after the 7-day initial purchase window.</li>
            <li>Dissatisfaction based on external hiring outcomes, interview invitations, or third-party ATS system rejections (as outlined in our Terms of Service).</li>
          </ul>
        </section>

        {/* 3. Subscription Cancellation */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-text-primary">3. How Subscription Cancellation Works</h2>
          <p>
            You can cancel your monthly subscription (Pro ₹99/mo, Premium ₹299/mo) at any time through your Account Settings. Upon cancellation, your recurring billing stops immediately, and you retain paid access until the end of your active 30-day billing cycle.
          </p>
        </section>

        {/* 4. Request Process */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-text-primary">4. How to Request a Refund</h2>
          <p>To request a refund, please follow these steps:</p>
          <ol className="list-decimal pl-5 space-y-1 text-text-secondary">
            <li>Send an email to <strong>support@vaylo.ai</strong> from your registered account email address.</li>
            <li>Include your Payment UTR or Transaction Reference number.</li>
            <li>State the reason for your refund request.</li>
          </ol>
          <p className="mt-2 text-text-muted">
            Eligible refunds are processed within 3-5 business days back to your original payment method.
          </p>
        </section>

        {/* 5. Contact */}
        <section className="space-y-2 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text-primary">5. Support Contact</h2>
          <p>If you have any questions regarding refunds or billing, contact our support team:</p>
          <div className="flex items-center gap-1.5 font-medium text-indigo-400">
            <Mail className="w-4 h-4" /> support@vaylo.ai
          </div>
        </section>
      </div>

      <div className="pt-8 border-t border-border text-center text-xs text-text-muted">
        <p>© {new Date().getFullYear()} Vaylo AI. All rights reserved.</p>
      </div>
    </div>
  );
}
