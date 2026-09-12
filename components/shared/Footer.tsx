'use client';

import { useState } from 'react';
import Link from "next/link";
import { ShieldCheck, Mail, Sparkles, MessageSquare } from "lucide-react";
import { FeedbackModal } from "@/components/shared/FeedbackModal";

export function Footer() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <footer className="border-t border-border bg-surface text-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="text-xl font-extrabold text-text-primary flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-accent" />
              Vaylo<span className="text-accent">AI</span>
            </Link>
            <p className="text-text-secondary text-xs leading-relaxed">
              Your AI Career Copilot — Beat ATS filters, practice STAR interviews, negotiate higher pay, and build candidate portfolio sites.
            </p>
            <div className="text-xs text-text-muted flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-accent" /> support@vayloai.online
            </div>
          </div>

          {/* ATS & Resume Tools */}
          <div>
            <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider mb-3">ATS & Resume Tools</h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li><Link href="/free-ats-resume-checker" className="hover:text-accent transition-colors font-medium text-accent">Free ATS Resume Checker</Link></li>
              <li><Link href="/ats-resume-checker" className="hover:text-accent transition-colors">ATS Resume Scanner</Link></li>
              <li><Link href="/ats-score-checker" className="hover:text-accent transition-colors">ATS Score Checker</Link></li>
              <li><Link href="/ai-resume-checker" className="hover:text-accent transition-colors">AI Resume Checker</Link></li>
              <li><Link href="/resume-optimizer" className="hover:text-accent transition-colors">Resume Optimizer</Link></li>
              <li><Link href="/ai-resume-builder" className="hover:text-accent transition-colors">AI Resume Builder</Link></li>
              <li><Link href="/cover-letter-generator" className="hover:text-accent transition-colors">Cover Letter Generator</Link></li>
            </ul>
          </div>

          {/* Role-Specific Resume Guides */}
          <div className="md:col-span-2 grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider mb-3">Resume by Role</h4>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li><Link href="/resume/software-engineer" className="hover:text-accent transition-colors">Software Engineer</Link></li>
                <li><Link href="/resume/frontend-developer" className="hover:text-accent transition-colors">Frontend Developer</Link></li>
                <li><Link href="/resume/backend-developer" className="hover:text-accent transition-colors">Backend Developer</Link></li>
                <li><Link href="/resume/full-stack-developer" className="hover:text-accent transition-colors">Full-Stack Developer</Link></li>
                <li><Link href="/resume/ai-engineer" className="hover:text-accent transition-colors">AI Engineer</Link></li>
                <li><Link href="/resume/data-analyst" className="hover:text-accent transition-colors">Data Analyst</Link></li>
                <li><Link href="/resume/data-scientist" className="hover:text-accent transition-colors">Data Scientist</Link></li>
                <li><Link href="/resume/machine-learning-engineer" className="hover:text-accent transition-colors">ML Engineer</Link></li>
                <li><Link href="/resume/devops-engineer" className="hover:text-accent transition-colors">DevOps Engineer</Link></li>
                <li><Link href="/resume/cloud-architect" className="hover:text-accent transition-colors">Cloud Architect</Link></li>
                <li><Link href="/resume/qa-automation-engineer" className="hover:text-accent transition-colors">QA / Automation</Link></li>
                <li><Link href="/resume/cybersecurity-analyst" className="hover:text-accent transition-colors">Cybersecurity Analyst</Link></li>
                <li><Link href="/resume/product-manager" className="hover:text-accent transition-colors">Product Manager</Link></li>
                <li><Link href="/resume/web-developer" className="hover:text-accent transition-colors">Web Developer</Link></li>
                <li><Link href="/resume/digital-marketer" className="hover:text-accent transition-colors">Digital Marketer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider mb-3">Resume by Degree</h4>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li><Link href="/resume/fresher" className="hover:text-accent transition-colors">Fresher / Student</Link></li>
                <li><Link href="/resume/btech" className="hover:text-accent transition-colors">B.Tech CSE Resume</Link></li>
                <li><Link href="/resume/bca" className="hover:text-accent transition-colors">BCA Resume</Link></li>
                <li><Link href="/resume/mca" className="hover:text-accent transition-colors">MCA Resume</Link></li>
              </ul>
              <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider mb-3 mt-5">Resume by Country</h4>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li><Link href="/resume/usa" className="hover:text-accent transition-colors">USA Tech Resume</Link></li>
                <li><Link href="/resume/germany" className="hover:text-accent transition-colors">Germany Resume</Link></li>
              </ul>
            </div>
          </div>

          {/* Resources & Guides */}
          <div>
            <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider mb-3">Career Resources</h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li><Link href="/blog" className="hover:text-accent transition-colors font-medium text-accent">Career Blog Hub</Link></li>
              <li><Link href="/blog/case-study-fresher-to-sde-ats-transformation" className="hover:text-accent transition-colors">Case Study: Fresher SDE-1</Link></li>
              <li><Link href="/blog/step-by-step-guide-100-point-ats-analyzer" className="hover:text-accent transition-colors">100-Point ATS Guide</Link></li>
              <li><Link href="/blog/how-to-optimize-resume-for-ats-india" className="hover:text-accent transition-colors">ATS Playbook India</Link></li>
              <li><Link href="/blog/what-is-an-ats-resume" className="hover:text-accent transition-colors">What is an ATS Resume?</Link></li>
              <li><Link href="/blog/how-to-check-ats-score" className="hover:text-accent transition-colors">How to Check ATS Score</Link></li>
              <li><Link href="/pricing" className="hover:text-accent transition-colors">Pricing Plans (₹0 - ₹499)</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About VayloAI</Link></li>
              <li>
                <button
                  onClick={() => setFeedbackOpen(true)}
                  className="hover:text-accent transition-colors text-left flex items-center gap-1 text-accent font-medium"
                >
                  <MessageSquare className="w-3 h-3" /> Report an Issue / Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div>
            <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider mb-3">Legal & Security</h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-accent transition-colors">Refund & Cancellation</Link></li>
              <li>
                <button
                  onClick={() => setFeedbackOpen(true)}
                  className="hover:text-accent transition-colors text-left text-text-muted"
                >
                  Contact Support
                </button>
              </li>
            </ul>
            <div className="mt-4 p-2.5 rounded-lg bg-surface-elevated border border-border text-[11px] text-text-muted flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>TLS Encrypted Checkout · Secure Gateway by Razorpay</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-4">
          <p>© {new Date().getFullYear()} VayloAI. All rights reserved.</p>
          <div className="flex gap-4 items-center">
            <button onClick={() => setFeedbackOpen(true)} className="hover:underline text-accent">
              Feedback & Support
            </button>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/refund" className="hover:underline">Refunds</Link>
            <Link href="/sitemap.xml" className="hover:underline">Sitemap</Link>
          </div>
        </div>
      </div>

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        isAuthenticated={false}
      />
    </footer>
  );
}
