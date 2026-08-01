"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Users, CreditCard, Sparkles, Loader2, Check, X, RefreshCw, ExternalLink, Clock } from "lucide-react";

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  plan: string;
  subscription_status: string | null;
  total_resume_downloads: number;
  expires_at?: string | null;
}

interface PaymentRequest {
  id: string;
  user_id: string;
  user_email: string;
  customer_name: string;
  customer_phone?: string;
  requested_plan: string;
  amount_claimed: number;
  utr_number: string;
  screenshot_url?: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setPaymentRequests(data.paymentRequests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifyRequest = async (requestId: string, userId: string, targetPlan: string, action: "approve" | "reject") => {
    setActionId(requestId || userId);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          requestId,
          plan: targetPlan,
          status: action,
          reason: rejectionReason,
        }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
      setRejectionReason("");
    }
  };

  const pendingRequests = paymentRequests.filter((r) => r.status === "pending");
  const filteredUsers = users.filter((u) => {
    return (
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalRevenue = users.reduce((acc, curr) => {
    const cost = curr.plan === "career_pack" ? 499 : curr.plan === "premium" ? 299 : curr.plan === "pro" ? 99 : 0;
    return acc + cost;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 space-y-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-accent animate-pulse" />
            Vaylo AI Administrator
          </h1>
          <p className="text-text-secondary mt-1">Manage user plan upgrades, UPI payment verification queue, and platform metrics.</p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm" className="gap-1 font-semibold">
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border bg-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center justify-between">
              Total Signups <Users className="w-4 h-4 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-text-primary">{users.length}</div>
            <p className="text-xs text-text-muted mt-1">All registered accounts</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center justify-between">
              Active Subs <CreditCard className="w-4 h-4 text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-400">
              {users.filter((u) => u.plan !== "free").length}
            </div>
            <p className="text-xs text-text-muted mt-1">Pro, Premium &amp; Career Pack users</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center justify-between">
              Pending Queue <Clock className="w-4 h-4 text-amber-400 animate-spin" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-amber-400">{pendingRequests.length}</div>
            <p className="text-xs text-text-muted mt-1">Awaiting manual UTR check</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center justify-between">
              Total Revenue <Sparkles className="w-4 h-4 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-text-primary">₹{totalRevenue}</div>
            <p className="text-xs text-text-muted mt-1">Platform earned worth</p>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 1: Pending Payment Verification Queue */}
      <Card className="border-amber-500/40 bg-surface shadow-lg">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" /> Pending UPI Payment Verification Queue ({pendingRequests.length})
              </CardTitle>
              <CardDescription>
                Verify user-provided UTR transaction reference numbers against your GPay/UPI bank app statement before approving plan unlock.
              </CardDescription>
            </div>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 font-extrabold">
              Manual Admin Review Required
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="p-8 text-center bg-surface-elevated/40 rounded-xl border border-border space-y-2">
              <Check className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-bold text-text-primary">Queue Clear!</p>
              <p className="text-xs text-text-muted">No pending UPI payment verification requests awaiting review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-elevated text-xs font-bold text-text-secondary uppercase border-b border-border">
                    <th className="p-4">User Email / Details</th>
                    <th className="p-4">Plan Requested</th>
                    <th className="p-4">Amount Claimed</th>
                    <th className="p-4">UTR Reference No.</th>
                    <th className="p-4">Submitted Date</th>
                    <th className="p-4 text-right">Verification Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {pendingRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-surface-elevated/50">
                      <td className="p-4">
                        <p className="font-bold text-text-primary">{req.customer_name || "Candidate"}</p>
                        <p className="text-xs font-mono text-indigo-400">{req.user_email}</p>
                        {req.customer_phone && <p className="text-[11px] text-text-muted">{req.customer_phone}</p>}
                      </td>

                      <td className="p-4">
                        <Badge className="font-extrabold bg-accent text-white uppercase text-xs">
                          {req.requested_plan}
                        </Badge>
                      </td>

                      <td className="p-4">
                        <span className="font-extrabold text-emerald-400 text-sm">₹{req.amount_claimed}</span>
                      </td>

                      <td className="p-4 font-mono font-bold text-amber-300 tracking-wider">
                        {req.utr_number}
                      </td>

                      <td className="p-4 text-xs text-text-muted">
                        {new Date(req.created_at).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>

                      <td className="p-4 text-right">
                        {actionId === req.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-accent ml-auto" />
                        ) : (
                          <div className="flex justify-end items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1"
                              onClick={() => handleVerifyRequest(req.id, req.user_id, req.requested_plan, "approve")}
                            >
                              <Check className="w-3.5 h-3.5" /> Approve &amp; Unlock
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-rose-500/40 text-rose-400 hover:bg-rose-500/10 font-bold text-xs gap-1"
                              onClick={() => handleVerifyRequest(req.id, req.user_id, req.requested_plan, "reject")}
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 2: User Subscriptions & Override List */}
      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-text-primary">All Platform User Accounts</CardTitle>
          <CardDescription>Manually inspect or upgrade any user tier across Free, Pro, Premium, and Career Pack.</CardDescription>
          <div className="mt-4 max-w-md">
            <Input
              placeholder="Search user email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-elevated border-border text-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-text-muted text-center py-8">No registered users found matching search description.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-elevated text-xs font-bold text-text-secondary uppercase border-b border-border">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Active Plan</th>
                    <th className="p-4">Expiration / Status</th>
                    <th className="p-4 text-right font-bold">Manual Plan Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-elevated/40">
                      <td className="p-4 font-bold text-text-primary">{u.full_name || "Candidate"}</td>
                      <td className="p-4 text-text-secondary font-mono text-xs">{u.email}</td>
                      <td className="p-4">
                        <Badge
                          className={
                            u.plan === "career_pack"
                              ? "bg-purple-600 text-white font-extrabold"
                              : u.plan === "premium"
                              ? "bg-emerald-500 text-white font-extrabold"
                              : u.plan === "pro"
                              ? "bg-indigo-600 text-white font-extrabold"
                              : "bg-surface-elevated text-text-muted border border-border"
                          }
                        >
                          {u.plan.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 text-xs text-text-muted font-medium">
                        {u.plan === "career_pack"
                          ? "Lifetime Access"
                          : u.expires_at
                          ? `Expires: ${new Date(u.expires_at).toLocaleDateString("en-IN")}`
                          : u.plan !== "free"
                          ? "Active 30-Day Plan"
                          : "Free Plan"}
                      </td>
                      <td className="p-4 text-right">
                        {actionId === u.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-accent ml-auto" />
                        ) : (
                          <div className="flex justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10 font-semibold h-8"
                              onClick={() => handleVerifyRequest("", u.id, "pro", "approve")}
                            >
                              + Pro
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 font-semibold h-8"
                              onClick={() => handleVerifyRequest("", u.id, "premium", "approve")}
                            >
                              + Premium
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs text-purple-400 border-purple-500/30 hover:bg-purple-500/10 font-semibold h-8"
                              onClick={() => handleVerifyRequest("", u.id, "career_pack", "approve")}
                            >
                              + Career Pack
                            </Button>
                            {u.plan !== "free" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs text-rose-400 hover:bg-rose-500/10 font-bold h-8"
                                onClick={() => handleVerifyRequest("", u.id, "free", "reject")}
                              >
                                Revoke
                              </Button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
