"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Plus,
  Clock,
  ChevronRight,
  User,
  Headphones,
  RefreshCw,
  Tag,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_user_id: string | null;
  sender_type: "user" | "admin";
  sender_name: string;
  message: string;
  created_at: string;
}

interface SupportTicket {
  id: string;
  ticket_ref: string;
  subject: string;
  category: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high" | "urgent";
  plan?: string;
  payment_reference?: string | null;
  created_at: string;
  updated_at: string;
  messages?: SupportMessage[];
}

const CATEGORY_LABELS: Record<string, string> = {
  payment_issue: "Payment / Billing Issue",
  account_issue: "Account & Profile Issue",
  ats_resume: "ATS Scanner & Resume Builder",
  feature_problem: "Feature Problem / Bug",
  refund_request: "Refund Request",
  bug_report: "Bug Report",
  other: "Other General Inquiry",
};

const STATUS_COLORS: Record<string, string> = {
  open: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  in_progress: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30",
  resolved: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  closed: "bg-slate-800 text-slate-400 border border-slate-700",
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold",
  high: "bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold",
  normal: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  low: "bg-slate-800 text-slate-400 border border-slate-700",
};

export default function CustomerSupportPage() {
  const searchParams = useSearchParams();
  const highlightTicketId = searchParams.get("ticket");

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // New Ticket Form State
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("payment_issue");
  const [paymentReference, setPaymentReference] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdTicketRef, setCreatedTicketRef] = useState<string | null>(null);

  // Reply Thread State
  const [replyMessage, setReplyMessage] = useState("");
  const [replying, setReplying] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/support/tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);

        if (highlightTicketId && data.tickets?.length) {
          const match = data.tickets.find((t: SupportTicket) => t.id === highlightTicketId);
          if (match) fetchTicketDetail(match.id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDetail = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedTicket(data.ticket);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!subject.trim()) {
      setFormError("Please enter a subject for your support request.");
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setFormError("Please provide a detailed description of your issue (at least 10 characters).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          category,
          message: message.trim(),
          paymentReference: paymentReference.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create support ticket");

      setCreatedTicketRef(data.ticket.ticket_ref);
      setSubject("");
      setMessage("");
      setPaymentReference("");
      fetchTickets();
    } catch (err: any) {
      setFormError(err.message || "Could not submit support ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    setReplying(true);
    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage.trim() }),
      });
      if (res.ok) {
        setReplyMessage("");
        fetchTicketDetail(selectedTicket.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReplying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 text-text-primary">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2 tracking-tight">
            <Headphones className="w-7 h-7 text-indigo-400" />
            Vaylo AI Help &amp; Customer Support
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Have a question about payment verification, ATS scans, or refunds? Submit a ticket and our team will review your request.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setShowNewTicketForm(!showNewTicketForm);
              setCreatedTicketRef(null);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" /> New Support Ticket
          </Button>
          <Button variant="outline" size="sm" onClick={fetchTickets} disabled={loading} className="text-xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* SLA Banner */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 flex items-center justify-between shadow-sm">
        <span className="flex items-center gap-2 font-medium">
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Our team will review your request and respond directly in your dashboard support thread.</span>
        </span>
        <span className="text-[11px] font-mono text-emerald-400 font-bold hidden sm:inline">
          Status: Active Support Queue
        </span>
      </div>

      {/* New Ticket Submission Form Drawer / Card */}
      {showNewTicketForm && (
        <Card className="border-indigo-500/40 bg-surface shadow-2xl animate-in zoom-in-95">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-lg font-bold flex items-center justify-between text-white">
              <span>Create Customer Support Ticket</span>
              <Badge className="bg-indigo-500/20 text-indigo-300 text-xs">Direct Admin Route</Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Fill in your issue details below. Your ticket reference number will be generated immediately.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {createdTicketRef ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Support Request Received!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your ticket <span className="font-mono text-emerald-400 font-bold">#{createdTicketRef}</span> has been logged. Our team will review your account details.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCreatedTicketRef(null);
                      setShowNewTicketForm(false);
                    }}
                    className="text-xs"
                  >
                    View My Support Tickets
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="category" className="text-xs font-bold">Category *</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="payment_issue">Payment / Billing UTR Issue</option>
                      <option value="refund_request">Refund Request</option>
                      <option value="account_issue">Account &amp; Profile Issue</option>
                      <option value="ats_resume">ATS Scanner &amp; Resume Builder</option>
                      <option value="feature_problem">Feature Problem / Bug</option>
                      <option value="bug_report">Bug Report</option>
                      <option value="other">Other General Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="payRef" className="text-xs font-bold">UTR / Payment ID (Optional)</Label>
                    <Input
                      id="payRef"
                      placeholder="e.g. 421098765432 or UTR number"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      className="bg-slate-900 border-slate-800 text-xs font-mono text-amber-300 placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="subject" className="text-xs font-bold">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Brief summary of your question or issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-slate-900 border-slate-800 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="message" className="text-xs font-bold">Detailed Message / Description *</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Provide details about your query..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-slate-900 border-slate-800 text-xs leading-relaxed"
                  />
                </div>

                {category === "refund_request" && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 leading-normal space-y-1">
                    <p className="font-bold flex items-center gap-1 text-amber-400">
                      <CreditCard className="w-3.5 h-3.5" /> Refund Policy Reference:
                    </p>
                    <p>
                      Refund eligibility is evaluated in accordance with our <Link href="/refund" target="_blank" className="underline font-bold text-amber-200">Refund Policy</Link>. Our team will check your account usage and payment records.
                    </p>
                  </div>
                )}

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewTicketForm(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 gap-2"
                  >
                    {submitting ? "Submitting..." : <><Send className="w-4 h-4" /> Send to VayloAI Support</>}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Grid: Ticket List + Selected Conversation Thread View */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6">
        {/* Left Column: Tickets List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" /> My Support Requests ({tickets.length})
          </h2>

          {loading ? (
            <Card className="border-slate-800 bg-slate-900 p-8 text-center text-xs text-slate-400">
              Loading support tickets...
            </Card>
          ) : tickets.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900 p-8 text-center space-y-3">
              <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">You don&apos;t have any support tickets yet.</p>
              <Button
                size="sm"
                onClick={() => setShowNewTicketForm(true)}
                className="bg-indigo-600 text-white text-xs font-bold"
              >
                Create Your First Ticket
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <Card
                    key={t.id}
                    onClick={() => fetchTicketDetail(t.id)}
                    className={`border transition-all cursor-pointer hover:border-indigo-500/50 ${
                      isSelected
                        ? "bg-indigo-950/30 border-indigo-500/60 shadow-lg"
                        : "bg-slate-900/90 border-slate-800"
                    }`}
                  >
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[11px] font-bold text-indigo-400">#{t.ticket_ref}</span>
                        <div className="flex gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${STATUS_COLORS[t.status] || STATUS_COLORS.open}`}>
                            {t.status.replace("_", " ")}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${PRIORITY_COLORS[t.priority] || PRIORITY_COLORS.normal}`}>
                            {t.priority}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xs font-bold text-white line-clamp-1">{t.subject}</h3>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                        <span>{CATEGORY_LABELS[t.category] || t.category}</span>
                        <span className="font-mono">{new Date(t.created_at).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Active Ticket Thread View */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" /> Conversation Thread
          </h2>

          {!selectedTicket ? (
            <Card className="border-slate-800 bg-slate-900/60 p-12 text-center text-xs text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <p>Select a support ticket on the left to read conversation messages and reply.</p>
            </Card>
          ) : (
            <Card className="border-slate-800 bg-slate-900/90 shadow-xl flex flex-col justify-between min-h-[420px]">
              <CardHeader className="pb-3 border-b border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-400">#{selectedTicket.ticket_ref}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_COLORS[selectedTicket.status] || STATUS_COLORS.open}`}>
                        {selectedTicket.status.toUpperCase()}
                      </span>
                    </div>
                    <CardTitle className="text-sm font-bold text-white">{selectedTicket.subject}</CardTitle>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    Created: {new Date(selectedTicket.created_at).toLocaleDateString()}
                  </span>
                </div>

                {selectedTicket.payment_reference && (
                  <div className="mt-2 text-[11px] font-mono text-amber-300 bg-slate-950 p-2 rounded-lg border border-slate-800">
                    Payment Ref / UTR: {selectedTicket.payment_reference}
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-4 flex-1 space-y-4 overflow-y-auto max-h-[380px]">
                {/* Thread Messages */}
                {(!selectedTicket.messages || selectedTicket.messages.length === 0) ? (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <p className="text-xs text-white font-semibold">{selectedTicket.message}</p>
                    <span className="text-[10px] text-slate-500 font-mono">Original Support Request</span>
                  </div>
                ) : (
                  selectedTicket.messages.map((m) => {
                    const isAdminMsg = m.sender_type === "admin";
                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-xl border space-y-1.5 ${
                          isAdminMsg
                            ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-100 ml-4"
                            : "bg-slate-950 border-slate-800 text-slate-200 mr-4"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className={`font-bold flex items-center gap-1 ${isAdminMsg ? "text-indigo-400" : "text-slate-300"}`}>
                            {isAdminMsg ? <Headphones className="w-3 h-3 text-indigo-400" /> : <User className="w-3 h-3 text-slate-400" />}
                            {m.sender_name}
                          </span>
                          <span className="text-slate-500 font-mono">{new Date(m.created_at).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{m.message}</p>
                      </div>
                    );
                  })
                )}
              </CardContent>

              {/* Reply Box */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/80 rounded-b-xl">
                <form onSubmit={handlePostReply} className="space-y-3">
                  <Textarea
                    rows={3}
                    placeholder="Write a response to the support team..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="bg-slate-900 border-slate-800 text-xs text-white leading-relaxed"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={replying || !replyMessage.trim()}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-9 px-5 gap-1.5"
                    >
                      {replying ? "Sending..." : <><Send className="w-3.5 h-3.5" /> Send Reply</>}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
