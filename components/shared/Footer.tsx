import Link from "next/link";
import { ShieldCheck, Mail, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface text-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="text-xl font-extrabold text-text-primary flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-accent" />
              Vaylo<span className="text-accent">AI</span>
            </Link>
            <p className="text-text-secondary text-xs leading-relaxed">
              Your AI Career Copilot — Beat ATS filters, practice STAR interviews, negotiate higher pay, and launch candidate portfolio sites.
            </p>
            <div className="text-xs text-text-muted flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-accent" /> support@vaylo.ai
            </div>
          </div>

          {/* Core Products */}
          <div>
            <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider mb-3">AI Platform</h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li><Link href="/analyze" className="hover:text-accent transition-colors">ATS Resume Scanner</Link></li>
              <li><Link href="/builder" className="hover:text-accent transition-colors">AI Resume Builder</Link></li>
              <li><Link href="/job-match" className="hover:text-accent transition-colors">AI Job Matcher</Link></li>
              <li><Link href="/salary-calculator" className="hover:text-accent transition-colors">Salary Negotiator</Link></li>
              <li><Link href="/portfolio" className="hover:text-accent transition-colors">AI Portfolio Builder</Link></li>
              <li><Link href="/translate" className="hover:text-accent transition-colors">Resume Translator</Link></li>
            </ul>
          </div>

          {/* Company & Resources */}
          <div>
            <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li><Link href="/#features" className="hover:text-accent transition-colors">Features Overview</Link></li>
              <li><Link href="/pricing" className="hover:text-accent transition-colors">Pricing Plans</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About Vaylo AI</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">Career Blog</Link></li>
              <li><Link href="/free-ats-checker" className="hover:text-accent transition-colors">Free ATS Checker</Link></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider mb-3">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-accent transition-colors">Refund & Cancellation</Link></li>
            </ul>
            <div className="mt-4 p-2.5 rounded-lg bg-surface-elevated border border-border text-[11px] text-text-muted flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>256-bit SSL Encrypted Payments & Data Protection</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-4">
          <p>© {new Date().getFullYear()} Vaylo AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/refund" className="hover:underline">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
