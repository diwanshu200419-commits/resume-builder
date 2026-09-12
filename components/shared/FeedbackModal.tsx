'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Bug,
  CreditCard,
  Sparkles,
  HelpCircle,
  Smile,
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string | null;
  userName?: string | null;
  isAuthenticated?: boolean;
}

export function FeedbackModal({
  isOpen,
  onClose,
  userEmail,
  userName,
  isAuthenticated = false,
}: FeedbackModalProps) {
  const [category, setCategory] = useState<'general' | 'bug' | 'billing' | 'feature' | 'complaint'>('general');
  const [message, setMessage] = useState('');
  const [name, setName] = useState(userName || '');
  const [email, setEmail] = useState(userEmail || '');
  const [noReplyNeeded, setNoReplyNeeded] = useState(false);
  const [websiteHp, setWebsiteHp] = useState(''); // Honeypot field for bot detection

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Feature Flag: Check if modal is globally enabled
  if (process.env.NEXT_PUBLIC_ENABLE_FEEDBACK_MODAL === 'false') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          message: message.trim(),
          name: !isAuthenticated ? name.trim() : undefined,
          email: !isAuthenticated && !noReplyNeeded ? email.trim() : undefined,
          website_hp: websiteHp,
          noReplyNeeded,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit feedback.');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMessage('');
        onClose();
      }, 2200);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'general', label: 'General Feedback', icon: Smile, color: 'text-blue-400' },
    { id: 'bug', label: 'Report a Bug', icon: Bug, color: 'text-rose-400' },
    { id: 'billing', label: 'Payment / Billing', icon: CreditCard, color: 'text-amber-400' },
    { id: 'feature', label: 'Feature Request', icon: Sparkles, color: 'text-purple-400' },
    { id: 'complaint', label: 'Issue / Complaint', icon: HelpCircle, color: 'text-rose-400' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <Card className="w-full max-w-lg border-accent/40 bg-surface shadow-2xl animate-in zoom-in-95 overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-text-primary">
              <MessageSquare className="w-4 h-4 text-accent" />
              <span>{isAuthenticated ? 'Send Feedback to Founders' : 'Contact Us & Send Feedback'}</span>
            </CardTitle>
            <CardDescription className="text-xs text-text-muted">
              {isAuthenticated
                ? 'Your feedback goes directly to our engineering and founder inbox.'
                : 'Have a question, complaint, or bug report? Let us know below.'}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1.5 h-auto text-text-muted hover:text-text-primary rounded-lg"
            aria-label="Close feedback modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="pt-4">
          {success ? (
            <div className="p-8 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary">Feedback Received!</h3>
              <p className="text-xs text-text-secondary max-w-xs mx-auto">
                Thank you for helping us improve VayloAI. Our team will review this promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Honeypot hidden input for bot protection */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_hp">Leave empty</label>
                <input
                  type="text"
                  id="website_hp"
                  name="website_hp"
                  value={websiteHp}
                  onChange={(e) => setWebsiteHp(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Category Pills */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Select Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as any)}
                        className={`flex items-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition-all text-left ${
                          isSelected
                            ? 'bg-accent/15 border-accent text-accent font-semibold shadow-sm'
                            : 'bg-surface-elevated border-border/80 text-text-secondary hover:border-text-muted hover:text-text-primary'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-accent' : cat.color}`} />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Anonymous Visitor Fields */}
              {!isAuthenticated && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border/40">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                      Your Name (Optional)
                    </label>
                    <Input
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-xs bg-background border-border h-9"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                      Email Address {!noReplyNeeded && '*'}
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={noReplyNeeded}
                      className="text-xs bg-background border-border h-9"
                      required={!noReplyNeeded}
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="noReplyCheck"
                      checked={noReplyNeeded}
                      onChange={(e) => setNoReplyNeeded(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-border text-accent focus:ring-accent"
                    />
                    <label htmlFor="noReplyCheck" className="text-[11px] text-text-muted cursor-pointer select-none">
                      I want to remain anonymous (no email reply expected)
                    </label>
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Your Message *
                </label>
                <Textarea
                  rows={4}
                  placeholder={
                    category === 'bug'
                      ? 'Describe what happened, the page URL, and steps to reproduce...'
                      : category === 'billing'
                      ? 'Describe your payment issue or mention your Razorpay transaction ID / UTR...'
                      : 'Share your thoughts, suggestions, or complaints...'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="text-xs bg-background border-border leading-relaxed"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-[11px] text-text-muted">
                  {isAuthenticated ? `Sending as: ${userEmail || userName}` : 'Private & Secure'}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    className="text-xs border-border h-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={loading || !message.trim()}
                    className="bg-accent hover:bg-accent-hover text-white text-xs font-bold h-8 gap-1.5"
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Submit Feedback</span>
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
