import Link from "next/link";
import { ShieldCheck, Mail, ArrowLeft, Lock, Database, Cpu } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Vaylo AI",
  description: "Privacy policy detailing data collection, AI processing, storage, and protection on Vaylo AI.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-text-primary">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="border-b border-border pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-text-muted">Effective Date: July 1, 2026 | Last Updated: August 2026</p>
      </div>

      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs leading-relaxed space-y-1">
        <p className="font-bold text-indigo-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-indigo-400" /> Data Privacy &amp; Protection Commitment:
        </p>
        <p>
          Your privacy is paramount. Vaylo AI stores your career records securely and uses AI models strictly to analyze and improve your job application materials. We do <strong>NOT</strong> sell your personal resume data to third-party advertisers.
        </p>
      </div>

      <div className="space-y-8 text-xs text-text-secondary leading-relaxed">
        {/* 1. Data Collected */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" /> 1. Information We Collect
          </h2>
          <p>
            To provide AI-driven resume optimization and interview evaluation services, Vaylo AI collects and processes the following information:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-text-secondary">
            <li><strong>Account Information:</strong> Your full name, email address, profile avatar, and login credentials managed via Supabase Authentication.</li>
            <li><strong>Career Materials:</strong> Uploaded resume content, text extracts, target job descriptions, work experience, and bullet points.</li>
            <li><strong>AI Inputs &amp; Outputs:</strong> Queries submitted to AI features, ATS match analysis results, cover letters, and STAR interview transcripts.</li>
            <li><strong>Payment Information:</strong> Payment reference numbers (UTR), plan type, transaction timestamp, and optional payment proof screenshots. Raw credit card numbers are never stored on Vaylo AI servers.</li>
            <li><strong>Usage Data:</strong> Log data including feature access timestamps, browser type, and diagnostic error reports.</li>
          </ul>
        </section>

        {/* 2. Purpose & Use of Data */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" /> 2. How We Use Your Information
          </h2>
          <p>We process your information for the following legitimate business purposes:</p>
          <ul className="list-disc pl-5 space-y-1 text-text-secondary">
            <li>Generating ATS compatibility scores, keyword match analysis, and resume improvement suggestions.</li>
            <li>Powering AI features including Cover Letter generation, STAR Voice interview practice, and Recruiter eye-screen simulations.</li>
            <li>Managing subscription plan entitlements, usage limits, and account access controls.</li>
            <li>Dispatching essential transactional notifications and payment updates.</li>
          </ul>
        </section>

        {/* 3. AI Processing */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" /> 3. AI Processing via Google AI Services
          </h2>
          <p>
            AI processing on Vaylo AI occurs through our securely configured Google AI (Gemini) service integration. Resume text and job description content sent to the AI service are used solely for generating application recommendations during your active session.
          </p>
        </section>

        {/* 4. Third-Party Processors */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-text-primary">4. Third-Party Service Providers</h2>
          <p>We rely on trusted third-party infrastructure providers to operate the platform securely:</p>
          <ul className="list-disc pl-5 space-y-1 text-text-secondary">
            <li><strong>Supabase:</strong> For cloud database hosting, user authentication, and secure encrypted file storage.</li>
            <li><strong>Google Cloud / Gemini AI:</strong> For automated language model inference and evidence matching.</li>
            <li><strong>UPI &amp; Razorpay Payment Networks:</strong> For secure payment transaction processing.</li>
          </ul>
        </section>

        {/* 5. Data Security */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-text-primary">5. Data Security Measures</h2>
          <p>
            Vaylo AI implements strict technical and organizational security measures, including 256-bit SSL encryption in transit, Supabase Row Level Security (RLS) policies, and server-side authorization guards to prevent unauthorized access to your resume records.
          </p>
        </section>

        {/* 6. Data Retention & Account Deletion */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-text-primary">6. Data Retention &amp; Account Deletion</h2>
          <p>
            We retain your career materials as long as your account remains active. You have the right to request full account and resume data deletion at any time by contacting support or selecting account deletion in Settings.
          </p>
        </section>

        {/* 7. User Rights */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-text-primary">7. Your Privacy Rights</h2>
          <p>
            Depending on your jurisdiction, you have the right to access, correct, download, or delete your personal data stored on Vaylo AI.
          </p>
        </section>

        {/* 8. Contact */}
        <section className="space-y-2 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text-primary">8. Privacy Contact Information</h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to exercise your data protection rights, please contact us:
          </p>
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
