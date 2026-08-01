"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert,
  Users,
  CreditCard,
  Sparkles,
  Loader2,
  Check,
  X,
  RefreshCw,
  Clock,
  Activity,
  TrendingUp,
  FlaskConical,
  Eye,
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  plan: string;
  role?: string | null;
  subscription_status: string | null;
  total_resume_downloads: number;
  analyses_used?: number;
  total_ats_checks?: number;
  expires_at?: string | null;
  last_seen_at?: string | null;
  created_at: string;
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
  reviewed_at?: string | null;
}

interface RevenueData {
  thisMonth: number;
  byPlan: Record<string, number>;
}

interface ActivityData {
  activeToday: number;
  active7d: number;
  active30d: number;
}

const PLAN_COLORS: Record<string, string> = {
  career_pack: "bg-purple-600 text-white",
  premium: "bg-emerald-600 text-white",
  pro: "bg-indigo-600 text-white",
  free: "bg-surface-elevated text-text-muted border border-border",
};

const TEST_PLAN_OPTIONS = [
  { value: "real", label: "My Real Plan (Admin)" },
  { value: "free", label: "🧪 Test as: Free" },
  { value: "pro", label: "🧪 Test as: Pro" },
  { value: "premium", label: "🧪 Test as: Premium" },
  { value: "career_pack", label: "🧪 Test as: Career Pack" },
];

export default function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [revenue, setRevenue] = useState<RevenueData>({ thisMonth: 0, byPlan: {} });
  const [activity, setActivity] = useState<ActivityData>({ activeToday: 0, active7d: 0, active30d: 0 });
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"queue" | "users" | "revenue">("queue");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [testOverride, setTestOverride] = useState<string>("real");
  const [settingOverride, setSettingOverride] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.status === 403 || res.status === 401) {
        setUnauthorized(true);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setPaymentRequests(data.paymentRequests || []);
        if (data.revenue) setRevenue(data.revenue);
        if (data.activity) setActivity(data.activity);
      } else {
        setUnauthorized(true);
      }
    } catch (e) {
      console.error(e);
      setUnauthorized(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverride = async () => {
    try {
      const res = await fetch("/api/admin/test-plan-override");
      if (res.ok) {
        const d = await res.json();
        setTestOverride(d.override || "real");
      }
    } catch {}
  };

  useEffect(() => {
    fetchData();
    fetchOverride();
  }, []);

  const setTestPlan = async (plan: string) => {
    setSettingOverride(true);
    try {
      await fetch("/api/admin/test-plan-override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      setTestOverride(plan);
    } catch {}
    setSettingOverride(false);
  };

  const handleVerifyRequest = async (
    requestId: string,
    userId: string,
    targetPlan: string,
    action: "approve" | "reject"
  ) => {
    setActionId(requestId || userId);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, requestId, plan: targetPlan, status: action }),
      });
      if (res.ok) await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
    }
  };

  const pendingRequests = paymentRequests.filter((r) => r.status === "pending");

  // Filter users
  let filteredUsers = users;
  if (planFilter !== "all") {
    filteredUsers = filteredUsers.filter((u) => u.plan === planFilter);
  }
  if (activityFilter === "1d") {
    const cutoff = new Date(Date.now() - 86400000).toISOString();
    filteredUsers = filteredUsers.filter((u) => u.last_seen_at && u.last_seen_at >= cutoff);
  } else if (activityFilter === "7d") {
    const cutoff = new Date(Date.now() - 7 * 86400000).toISOString();
    filteredUsers = filteredUsers.filter((u) => u.last_seen_at && u.last_seen_at >= cutoff);
  } else if (activityFilter === "30d") {
    const cutoff = new Date(Date.now() - 30 * 86400000).toISOString();
    filteredUsers = filteredUsers.filter((u) => u.last_seen_at && u.last_seen_at >= cutoff);
  }
  if (search) {
    filteredUsers = filteredUsers.filter(
      (u) =>
        (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.full_name || "").toLowerCase().includes(search.toLowerCase())
    );
  }

  const planCounts = {
    all: users.length,
    free: users.filter((u) => u.plan === "free").length,
    pro: users.filter((u) => u.plan === "pro").length,
    premium: users.filter((u) => u.plan === "premium").length,
    career_pack: users.filter((u) => u.plan === "career_pack").length,
  };

  const userPayments = selectedUser
    ? paymentRequests.filter((r) => r.user_id === selectedUser.id)
    : [];

  if (unauthorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-danger/30 bg-surface shadow-xl text-center p-6">
          <CardHeader>
            <ShieldAlert className="w-12 h-12 text-danger mx-auto mb-2" />
            <CardTitle className="text-xl font-bold text-text-primary">Access Denied</CardTitle>
            <CardDescription className="text-xs text-text-secondary mt-1">
              Admin privileges required. Your account does not have permission to access the Vaylo AI Admin Panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button
              className="w-full bg-accent hover:bg-accent-hover text-white font-semibold"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 space-y-6 px-4 sm:px-6">
      {/* Test Mode Banner */}
      {testOverride && testOverride !== "real" && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-black text-xs font-bold text-center py-2 flex items-center justify-center gap-3">
          <FlaskConical className="w-4 h-4" />
          🧪 ADMIN TEST MODE ACTIVE — Viewing platform as:{" "}
          <span className="uppercase underline">{testOverride}</span> plan
          <Button
            size="sm"
            className="h-5 px-2 text-[10px] bg-black text-white hover:bg-gray-800 ml-2"
            onClick={() => setTestPlan("real")}
          >
            Exit Test Mode
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-accent" />
            Vaylo AI Admin Panel
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            UPI verification queue · user tracking · revenue analytics · plan test mode
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Admin Test Plan Switcher */}
          <div className="relative">
            <select
              value={testOverride}
              onChange={(e) => setTestPlan(e.target.value)}
              disabled={settingOverride}
              className="text-xs font-bold bg-surface-elevated border border-border rounded-lg px-3 py-2 text-text-primary cursor-pointer pr-8"
            >
              {TEST_PLAN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <FlaskConical className="w-3.5 h-3.5 absolute right-2 top-2.5 text-amber-400 pointer-events-none" />
          </div>
          <Button onClick={fetchData} variant="outline" size="sm" className="gap-1 font-semibold text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-surface">
          <CardContent className="pt-4 pb-3">
            <p className="text-[10px] font-bold uppercase text-text-muted flex items-center justify-between">
              Total Users <Users className="w-3.5 h-3.5 text-accent" />
            </p>
            <p className="text-3xl font-extrabold text-text-primary mt-1">{users.length}</p>
            <p className="text-[10px] text-text-muted mt-1">{planCounts.free} free · {planCounts.pro + planCounts.premium + planCounts.career_pack} paid</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-surface">
          <CardContent className="pt-4 pb-3">
            <p className="text-[10px] font-bold uppercase text-text-muted flex items-center justify-between">
              Pending Queue <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </p>
            <p className="text-3xl font-extrabold text-amber-400 mt-1">{pendingRequests.length}</p>
            <p className="text-[10px] text-text-muted mt-1">Awaiting UTR verification</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-surface">
          <CardContent className="pt-4 pb-3">
            <p className="text-[10px] font-bold uppercase text-text-muted flex items-center justify-between">
              Active 7 Days <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-1">{activity.active7d}</p>
            <p className="text-[10px] text-text-muted mt-1">{activity.activeToday} today · {activity.active30d} this month</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-surface">
          <CardContent className="pt-4 pb-3">
            <p className="text-[10px] font-bold uppercase text-text-muted flex items-center justify-between">
              Revenue This Month <TrendingUp className="w-3.5 h-3.5 text-accent" />
            </p>
            <p className="text-3xl font-extrabold text-text-primary mt-1">₹{revenue.thisMonth}</p>
            <p className="text-[10px] text-text-muted mt-1">From approved UPI payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-surface-elevated border border-border rounded-xl w-fit">
        {(["queue", "users", "revenue"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize ${
              activeTab === tab
                ? "bg-accent text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab === "queue" ? `Verification Queue (${pendingRequests.length})` : tab === "users" ? `All Users (${users.length})` : "Revenue"}
          </button>
        ))}
      </div>

      {/* TAB: Pending Payment Queue */}
      {activeTab === "queue" && (
        <Card className="border-amber-500/30 bg-surface">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-amber-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Pending UPI Payment Verification Queue
              </CardTitle>
              <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] font-bold">
                Manual Admin Review Required
              </Badge>
            </div>
            <CardDescription className="text-xs mt-1">
              Cross-check each UTR against your GPay / PhonePe transaction history before approving.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="p-8 text-center bg-surface-elevated/40 rounded-xl border border-border">
                <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="font-bold text-text-primary text-sm">Queue Clear</p>
                <p className="text-xs text-text-muted">No pending payment verification requests.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-elevated text-[10px] font-bold text-text-secondary uppercase border-b border-border">
                      <th className="p-3">Candidate</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">UTR Number</th>
                      <th className="p-3">Submitted</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pendingRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-surface-elevated/30 text-xs">
                        <td className="p-3">
                          <p className="font-bold text-text-primary">{req.customer_name || "Candidate"}</p>
                          <p className="font-mono text-indigo-400 text-[10px]">{req.user_email}</p>
                          {req.customer_phone && (
                            <p className="text-[10px] text-text-muted">{req.customer_phone}</p>
                          )}
                          {req.screenshot_url && (
                            <a
                              href={req.screenshot_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-accent underline mt-0.5 inline-block"
                            >
                              View Screenshot
                            </a>
                          )}
                        </td>
                        <td className="p-3">
                          <Badge className="bg-accent text-white uppercase text-[10px] font-extrabold">
                            {req.requested_plan}
                          </Badge>
                        </td>
                        <td className="p-3 font-extrabold text-emerald-400">₹{req.amount_claimed}</td>
                        <td className="p-3 font-mono font-bold text-amber-300 tracking-wider">{req.utr_number}</td>
                        <td className="p-3 text-text-muted">
                          {new Date(req.created_at).toLocaleString("en-IN", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="p-3 text-right">
                          {actionId === req.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-accent ml-auto" />
                          ) : (
                            <div className="flex justify-end gap-1.5">
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] h-7 px-2 gap-1"
                                onClick={() =>
                                  handleVerifyRequest(req.id, req.user_id, req.requested_plan, "approve")
                                }
                              >
                                <Check className="w-3 h-3" /> Approve &amp; Unlock
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-bold text-[10px] h-7 px-2 gap-1"
                                onClick={() =>
                                  handleVerifyRequest(req.id, req.user_id, req.requested_plan, "reject")
                                }
                              >
                                <X className="w-3 h-3" /> Reject
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
      )}

      {/* TAB: All Users */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <Input
              placeholder="Search email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-elevated border-border text-xs h-8 w-64"
            />
            {/* Plan filter */}
            <div className="flex gap-1">
              {(["all", "free", "pro", "premium", "career_pack"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlanFilter(p)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all uppercase ${
                    planFilter === p
                      ? "bg-accent text-white border-accent"
                      : "bg-surface-elevated text-text-muted border-border hover:text-text-primary"
                  }`}
                >
                  {p === "career_pack" ? "Career Pack" : p} ({planCounts[p as keyof typeof planCounts]})
                </button>
              ))}
            </div>
            {/* Activity filter */}
            <div className="flex gap-1 ml-auto">
              {[
                { v: "all", l: "All" },
                { v: "1d", l: "Active 24h" },
                { v: "7d", l: "Active 7d" },
                { v: "30d", l: "Active 30d" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setActivityFilter(opt.v)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all ${
                    activityFilter === opt.v
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-surface-elevated text-text-muted border-border hover:text-text-primary"
                  }`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          <Card className="border-border bg-surface">
            <CardContent className="pt-4">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 text-accent animate-spin" />
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-elevated text-[10px] font-bold text-text-secondary uppercase border-b border-border">
                        <th className="p-3">Name / Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Plan</th>
                        <th className="p-3">ATS Scans</th>
                        <th className="p-3">Signup Date</th>
                        <th className="p-3">Last Seen</th>
                        <th className="p-3">Expires At</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredUsers.map((u) => (
                        <>
                          <tr
                            key={u.id}
                            className="hover:bg-surface-elevated/30 text-xs cursor-pointer"
                            onClick={() => setSelectedUser(selectedUser?.id === u.id ? null : u)}
                          >
                            <td className="p-3">
                              <p className="font-bold text-text-primary">{u.full_name || "Candidate"}</p>
                              <p className="font-mono text-[10px] text-indigo-400">{u.email}</p>
                            </td>
                            <td className="p-3">
                              {u.role === "admin" ? (
                                <Badge className="bg-rose-600 text-white text-[10px] font-extrabold">ADMIN</Badge>
                              ) : (
                                <span className="text-text-muted text-[10px]">user</span>
                              )}
                            </td>
                            <td className="p-3">
                              <Badge className={`text-[10px] font-extrabold uppercase ${PLAN_COLORS[u.plan] || PLAN_COLORS.free}`}>
                                {u.plan}
                              </Badge>
                            </td>
                            <td className="p-3 font-bold text-text-primary">{u.analyses_used ?? "—"}</td>
                            <td className="p-3 text-text-muted">
                              {new Date(u.created_at).toLocaleDateString("en-IN")}
                            </td>
                            <td className="p-3 text-text-muted">
                              {u.last_seen_at
                                ? new Date(u.last_seen_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })
                                : <span className="text-[10px] text-text-muted/50">Never</span>}
                            </td>
                            <td className="p-3 text-text-muted">
                              {u.plan === "career_pack"
                                ? "Lifetime"
                                : u.expires_at
                                ? new Date(u.expires_at).toLocaleDateString("en-IN")
                                : u.plan !== "free"
                                ? "30-day plan"
                                : "—"}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-1">
                                <Eye className="w-3.5 h-3.5 text-text-muted cursor-pointer" />
                                {actionId === u.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                                ) : (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-[10px] text-indigo-400 border-indigo-500/30 h-6 px-1.5 font-bold"
                                      onClick={(e) => { e.stopPropagation(); handleVerifyRequest("", u.id, "pro", "approve"); }}
                                    >
                                      Pro
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-[10px] text-emerald-400 border-emerald-500/30 h-6 px-1.5 font-bold"
                                      onClick={(e) => { e.stopPropagation(); handleVerifyRequest("", u.id, "premium", "approve"); }}
                                    >
                                      Prem
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-[10px] text-purple-400 border-purple-500/30 h-6 px-1.5 font-bold"
                                      onClick={(e) => { e.stopPropagation(); handleVerifyRequest("", u.id, "career_pack", "approve"); }}
                                    >
                                      Career
                                    </Button>
                                    {u.plan !== "free" && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-[10px] text-rose-400 h-6 px-1.5 font-bold"
                                        onClick={(e) => { e.stopPropagation(); handleVerifyRequest("", u.id, "free", "reject"); }}
                                      >
                                        Revoke
                                      </Button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                          {/* Per-user drill-down */}
                          {selectedUser?.id === u.id && (
                            <tr key={`${u.id}-detail`}>
                              <td colSpan={8} className="px-4 pb-4 bg-surface-elevated/20">
                                <div className="border border-border rounded-xl p-4 space-y-3">
                                  <p className="text-xs font-bold text-text-primary">
                                    Payment History for {u.email}
                                  </p>
                                  {userPayments.length === 0 ? (
                                    <p className="text-[10px] text-text-muted">No payment requests found.</p>
                                  ) : (
                                    <table className="w-full text-[10px]">
                                      <thead>
                                        <tr className="text-text-muted font-bold uppercase border-b border-border">
                                          <th className="py-1 text-left">Plan</th>
                                          <th className="py-1 text-left">UTR</th>
                                          <th className="py-1 text-left">Amount</th>
                                          <th className="py-1 text-left">Status</th>
                                          <th className="py-1 text-left">Date</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {userPayments.map((r) => (
                                          <tr key={r.id} className="border-b border-border/50">
                                            <td className="py-1 uppercase font-bold text-text-primary">{r.requested_plan}</td>
                                            <td className="py-1 font-mono text-amber-400">{r.utr_number}</td>
                                            <td className="py-1 text-emerald-400 font-bold">₹{r.amount_claimed}</td>
                                            <td className="py-1">
                                              <span
                                                className={`font-bold uppercase ${
                                                  r.status === "approved"
                                                    ? "text-emerald-400"
                                                    : r.status === "rejected"
                                                    ? "text-rose-400"
                                                    : "text-amber-400"
                                                }`}
                                              >
                                                {r.status}
                                              </span>
                                            </td>
                                            <td className="py-1 text-text-muted">
                                              {new Date(r.created_at).toLocaleDateString("en-IN")}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB: Revenue */}
      {activeTab === "revenue" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-text-primary flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" /> Revenue This Month
              </CardTitle>
              <CardDescription className="text-xs">From approved UPI payment requests only</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-4xl font-extrabold text-text-primary">₹{revenue.thisMonth}</p>
              <div className="space-y-2">
                {[
                  { key: "pro", label: "Pro (₹99/mo)", color: "bg-indigo-500" },
                  { key: "premium", label: "Premium (₹299/mo)", color: "bg-emerald-500" },
                  { key: "career_pack", label: "Career Pack (₹499)", color: "bg-purple-500" },
                ].map((item) => {
                  const amount = (revenue.byPlan[item.key] || 0) + (revenue.byPlan[item.key.replace("_", "-")] || 0);
                  const pct = revenue.thisMonth > 0 ? (amount / revenue.thisMonth) * 100 : 0;
                  return (
                    <div key={item.key}>
                      <div className="flex justify-between text-[10px] text-text-muted mb-1">
                        <span className="font-semibold">{item.label}</span>
                        <span className="font-bold text-text-primary">₹{amount}</span>
                      </div>
                      <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" /> Plan Distribution
              </CardTitle>
              <CardDescription className="text-xs">Current active plan breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { plan: "career_pack", color: "bg-purple-500", label: "Career Pack" },
                { plan: "premium", color: "bg-emerald-500", label: "Premium" },
                { plan: "pro", color: "bg-indigo-500", label: "Pro" },
                { plan: "free", color: "bg-surface-elevated border border-border", label: "Free" },
              ].map((item) => {
                const count = planCounts[item.plan as keyof typeof planCounts] || 0;
                const pct = users.length > 0 ? (count / users.length) * 100 : 0;
                return (
                  <div key={item.plan}>
                    <div className="flex justify-between text-[10px] text-text-muted mb-1">
                      <span className="font-semibold">{item.label}</span>
                      <span className="font-bold text-text-primary">{count} users ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* All Approved Payments */}
          <Card className="border-border bg-surface md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-text-primary">All Approved & Rejected Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-elevated text-[10px] font-bold text-text-secondary uppercase border-b border-border">
                      <th className="p-3">User Email</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3">UTR</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Submitted</th>
                      <th className="p-3">Reviewed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paymentRequests
                      .filter((r) => r.status !== "pending")
                      .map((req) => (
                        <tr key={req.id} className="text-xs hover:bg-surface-elevated/30">
                          <td className="p-3 font-mono text-indigo-400 text-[10px]">{req.user_email}</td>
                          <td className="p-3 uppercase font-extrabold text-text-primary">{req.requested_plan}</td>
                          <td className="p-3 font-mono font-bold text-amber-300">{req.utr_number}</td>
                          <td className="p-3 font-extrabold text-emerald-400">₹{req.amount_claimed}</td>
                          <td className="p-3">
                            <span
                              className={`font-bold uppercase text-[10px] ${
                                req.status === "approved"
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="p-3 text-text-muted">
                            {new Date(req.created_at).toLocaleDateString("en-IN")}
                          </td>
                          <td className="p-3 text-text-muted">
                            {req.reviewed_at
                              ? new Date(req.reviewed_at).toLocaleDateString("en-IN")
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    {paymentRequests.filter((r) => r.status !== "pending").length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-text-muted text-xs">
                          No completed payment records yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
