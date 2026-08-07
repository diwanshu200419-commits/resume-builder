"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, CheckCircle2, AlertCircle, HelpCircle, ShieldCheck } from "lucide-react";

export default function CandidateSupportPage() {
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!message.trim()) {
      setError("Please enter your message or question.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setSuccess(true);
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Could not submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-accent" />
          Contact Vaylo AI Support &amp; Feedback
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Have a question about your ATS scan, payment verification, or feature request? Send a direct message to our founder and engineering team.
        </p>
      </div>

      <Card className="border-border bg-surface shadow-md">
        <CardHeader>
          <CardTitle className="text-base font-bold">Send Direct Message</CardTitle>
          <CardDescription className="text-xs">
            Our admin team reviews feedback daily and will reply directly in your dashboard or via email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="p-6 rounded-2xl bg-success/10 border border-success/20 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-success mx-auto" />
              <h3 className="text-base font-bold text-text-primary">Message Sent Successfully!</h3>
              <p className="text-xs text-text-secondary max-w-md mx-auto">
                Thank you for contacting us. Your message has been logged in our support inbox. Our team will review your account details and respond shortly.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSuccess(false)}
                className="text-xs border-border"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="category" className="text-xs font-bold">Topic Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl p-2.5 text-xs text-text-primary"
                >
                  <option value="general">General Inquiry</option>
                  <option value="billing">Billing &amp; Payment UTR Verification</option>
                  <option value="bug">Report a Bug / Technical Issue</option>
                  <option value="feature">Feature Request</option>
                  <option value="complaint">Complaint</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="message" className="text-xs font-bold">Your Message *</Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Describe your issue or feedback in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-surface-elevated border-border text-xs leading-relaxed"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-accent hover:bg-accent-hover text-white font-bold text-xs gap-2"
              >
                {loading ? "Sending..." : <><Send className="w-4 h-4" /> Submit Support Message</>}
              </Button>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Linked to your active account
                </span>
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> Response time: ~1-2 hours
                </span>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
