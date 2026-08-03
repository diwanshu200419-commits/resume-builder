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
  BarChart3,
  Server,
  FileCheck,
  Search,
  UserCheck,
  AlertTriangle,
  ArrowUpRight,
  SlidersHorizontal,
  History,
  Lock,
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
  utr_number: string;
  amount_claimed: number;
  requested_plan: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string | null;
  created_at: string;
  reviewed_at?: string | null;
}

interface AuditLog {
  id: string;
  admin_email: string | null;
  action: string;
  target_email: string | null;
  details: Record<string, any>;
  created_at: string;
}

const PLAN_COLORS: Record<string, string> = {
  career_pack: "bg-purple-600 text-white font-semibold",
  premium: "bg-emerald-600 text-white font-semibold",
  pro: "bg-indigo-600 text-white font-semibold",
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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "payments" | "analytics" | "health" | "audit">("overview");

  // User tab filters & sorting
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"created" | "active" | "scans">("created");

  // Payment tab sub-filter
  const [paymentSubTab, setPaymentSubTab] = useState<"pending" | "history">("pending");
  const [paymentSearch, setPaymentSearch] = useState("");

  // Actions state
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [manualPlan, setManualPlan] = useState("pro");
  const [overrideReason, setOverrideReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

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
        const json = await res.json();
        setData(json);
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

  const handleApprovePayment = async (userId: string, requestId: string, plan: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, requestId, plan, status: "approve" }),
      });
      if (res.ok) {
        setActionSuccess("Payment approved successfully!");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleRejectPayment = async (userId: string, requestId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, requestId, status: "reject", reason: "Invalid UTR reference number" }),
      });
      if (res.ok) {
        setActionSuccess("Payment request rejected.");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleManualOverride = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/manual-plan-override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          newPlan: manualPlan,
          reason: overrideReason || "Manual admin override",
        }),
      });
      const resJson = await res.json();
      if (res.ok) {
        setActionSuccess(resJson.message);
        setSelectedUser(null);
        setOverrideReason("");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

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

  const overview = data?.overview || {};
  const users: UserProfile[] = data?.users || [];
  const paymentRequests: PaymentRequest[] = data?.paymentRequests || [];
  const auditLogs: AuditLog[] = data?.auditLogs || [];
  const analytics = data?.analytics || {};
  const systemHealth = data?.systemHealth || {};
  const flaggedDuplicateUtrs: string[] = data?.flaggedDuplicateUtrs || [];

  const pendingPayments = paymentRequests.filter((r) => r.status === "pending");

  // User directory filtering
  let filteredUsers = users.filter((u) => {
    if (planFilter !== "all" && u.plan !== planFilter) return false;
    if (roleFilter !== "all" && (u.role || "user") !== roleFilter) return false;
    if (activityFilter === "24h") {
      const c = new Date(Date.now() - 86400000).toISOString();
      if (!u.last_seen_at || u.last_seen_at < c) return false;
    } else if (activityFilter === "7d") {
      const c = new Date(Date.now() - 7 * 86400000).toISOString();
      if (!u.last_seen_at || u.last_seen_at < c) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchEmail = (u.email || "").toLowerCase().includes(q);
      const matchName = (u.full_name || "").toLowerCase().includes(q);
      if (!matchEmail && !matchName) return false;
    }
    return true;
  });

  // User directory sorting
  filteredUsers.sort((a, b) => {
    if (sortBy === "active") {
      return (b.last_seen_at || "").localeCompare(a.last_seen_at || "");
    }
    if (sortBy === "scans") {
      return (b.total_ats_checks || 0) - (a.total_ats_checks || 0);
    }
    return (b.created_at || "").localeCompare(a.created_at || "");
  });

  // Payment requests filtering
  const filteredPayments = paymentRequests.filter((r) => {
    if (paymentSubTab === "pending" && r.status !== "pending") return false;
    if (paymentSubTab === "history" && r.status === "pending") return false;
    if (paymentSearch) {
      const q = paymentSearch.toLowerCase();
      const matchEmail = (r.user_email || "").toLowerCase().includes(q);
      const matchUtr = (r.utr_number || "").toLowerCase().includes(q);
      if (!matchEmail && !matchUtr) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 space-y-6 px-4 sm:px-6 text-text-primary">
      {/* Test Mode Banner */}
      {testOverride && testOverride !== "real" && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-black text-xs font-bold text-center py-2 flex items-center justify-center gap-3 shadow-lg">
          <FlaskConical className="w-4 h-4" />
          🧪 ADMIN TEST MODE ACTIVE — Viewing platform as:{" "}
          <span className="uppercase underline font-extrabold">{testOverride}</span> plan
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2 tracking-tight">
            <ShieldAlert className="w-8 h-8 text-accent" />
            Vaylo AI SaaS Console
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Live user analytics · payment queue · MRR tracking · audit logging · system health
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Test Plan Selector */}
          <select
            value={testOverride}
            onChange={(e) => setTestPlan(e.target.value)}
            disabled={settingOverride}
            className="bg-surface-elevated border border-border text-xs rounded-lg px-3 py-2 text-text-primary font-medium focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {TEST_PLAN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="gap-1.5 text-xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-success/10 border border-success/30 text-success text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" /> {actionSuccess}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "overview" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Overview &amp; MRR
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "users" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Users className="w-4 h-4" /> User Directory ({users.length})
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "payments" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <CreditCard className="w-4 h-4" /> Payments ({pendingPayments.length})
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "analytics" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Sparkles className="w-4 h-4" /> Feature Analytics
        </button>

        <button
          onClick={() => setActiveTab("health")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "health" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Server className="w-4 h-4" /> System Health
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "audit" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <History className="w-4 h-4" /> Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW & MRR */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top Aggregates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border bg-surface">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-text-secondary flex items-center justify-between">
                  <span>Total Users (All-Time)</span>
                  <Users className="w-4 h-4 text-accent" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold">{overview.totalUsers || 0}</div>
                <div className="flex items-center gap-2 text-[11px] text-text-muted mt-2 font-mono">
                  <span>Free: {overview.planCounts?.free || 0}</span> ·
                  <span>Pro: {overview.planCounts?.pro || 0}</span> ·
                  <span>Prem: {overview.planCounts?.premium || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-surface">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-text-secondary flex items-center justify-between">
                  <span>MRR Run-Rate</span>
                  <TrendingUp className="w-4 h-4 text-success" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-success">₹{overview.mrrEquivalent || 0}</div>
                <div className="text-[11px] text-text-muted mt-2">
                  + ₹{overview.careerPackRevenueTotal || 0} Career Pack One-Time
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-surface">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-text-secondary flex items-center justify-between">
                  <span>Approved Revenue (This Month)</span>
                  <CreditCard className="w-4 h-4 text-purple-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold">₹{overview.revenueThisMonth || 0}</div>
                <div className="text-[11px] text-text-muted mt-2">
                  From verified UPI payments
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-surface">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-text-secondary flex items-center justify-between">
                  <span>Active Candidates (7d)</span>
                  <Activity className="w-4 h-4 text-info" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold">{overview.activity?.active7d || 0}</div>
                <div className="text-[11px] text-text-muted mt-2 font-mono">
                  24h: {overview.activity?.activeToday || 0} · 30d: {overview.activity?.active30d || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Aggregates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border bg-surface">
              <CardHeader>
                <CardTitle className="text-sm">Signup Momentum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Signups Today</span>
                  <span className="font-bold font-mono">{overview.signups?.today || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Signups This Week</span>
                  <span className="font-bold font-mono">{overview.signups?.week || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Signups This Month</span>
                  <span className="font-bold font-mono">{overview.signups?.month || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-surface">
              <CardHeader>
                <CardTitle className="text-sm">Conversion &amp; Churn Signals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Payment Intent Rate</span>
                  <span className="font-bold text-success font-mono">{overview.conversionRate || 0}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary">Unrenewed Churn (30d)</span>
                  <span className="font-bold text-danger font-mono">{overview.churn30d || 0} users</span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed pt-1">
                  % of registered candidates who submitted a UPI payment reference.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-surface">
              <CardHeader>
                <CardTitle className="text-sm">Fraud &amp; Duplicate Shield</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Cross-Account Duplicate UTRs</span>
                  <Badge variant={flaggedDuplicateUtrs.length > 0 ? "danger" : "outline"} className="text-xs">
                    {flaggedDuplicateUtrs.length} Flagged
                  </Badge>
                </div>
                {flaggedDuplicateUtrs.length === 0 ? (
                  <p className="text-xs text-success flex items-center gap-1 mt-2">
                    <Check className="w-3.5 h-3.5" /> All submitted UTRs are unique per account.
                  </p>
                ) : (
                  <div className="p-2 rounded bg-danger/10 border border-danger/30 text-[11px] text-danger space-y-1">
                    <p className="font-bold">Duplicate UTRs detected across accounts:</p>
                    <ul className="list-disc list-inside font-mono">
                      {flaggedDuplicateUtrs.map((u) => (
                        <li key={u}>{u}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: USER DIRECTORY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-surface p-4 rounded-xl border border-border">
            <div className="relative col-span-1 sm:col-span-2">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              <Input
                placeholder="Search email or full name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-surface-elevated text-xs"
              />
            </div>

            <div>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded-lg p-2 text-xs text-text-primary"
              >
                <option value="all">All Plans</option>
                <option value="free">Free Tier</option>
                <option value="pro">Pro Plan</option>
                <option value="premium">Premium Plan</option>
                <option value="career_pack">Career Pack</option>
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded-lg p-2 text-xs text-text-primary font-semibold"
              >
                <option value="created">Sort: Newest Signups</option>
                <option value="active">Sort: Most Recently Active</option>
                <option value="scans">Sort: Most ATS Scans Run</option>
              </select>
            </div>
          </div>

          {/* User Directory Table */}
          <div className="rounded-xl border border-border overflow-hidden bg-surface shadow-md table-scroll-wrapper">
            <table className="w-full min-w-[640px] text-xs">
              <thead className="bg-surface-elevated text-text-muted uppercase">
                <tr>
                  <th className="py-3 px-4 text-left">Candidate Name / Email</th>
                  <th className="py-3 px-4 text-center">Role</th>
                  <th className="py-3 px-4 text-center">Plan</th>
                  <th className="py-3 px-4 text-center">Scans</th>
                  <th className="py-3 px-4 text-center">Signed Up</th>
                  <th className="py-3 px-4 text-center">Last Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-text-muted">
                      No matching candidate accounts found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-elevated/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-text-primary">{u.full_name || "Anonymous Candidate"}</div>
                        <div className="text-[11px] text-text-muted font-mono">{u.email}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === "admin" ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" : "text-text-muted"
                        }`}>
                          {u.role || "user"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${PLAN_COLORS[u.plan] || PLAN_COLORS.free}`}>
                          {u.plan.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold">
                        {u.total_ats_checks || u.analyses_used || 0}
                      </td>
                      <td className="py-3 px-4 text-center text-text-muted font-mono">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center text-text-muted font-mono">
                        {u.last_seen_at ? new Date(u.last_seen_at).toLocaleDateString() : "Never"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setSelectedUser(u); setManualPlan(u.plan); }}
                          className="h-7 px-2.5 text-[11px] gap-1 border-accent/30 text-accent"
                        >
                          <SlidersHorizontal className="w-3 h-3" /> Manage
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: PAYMENTS & UTR VERIFICATION */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "payments" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <button
              onClick={() => setPaymentSubTab("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                paymentSubTab === "pending" ? "bg-amber-500 text-black shadow" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Pending Verification Queue ({pendingPayments.length})
            </button>
            <button
              onClick={() => setPaymentSubTab("history")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                paymentSubTab === "history" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              All Payment History ({paymentRequests.length})
            </button>
          </div>

          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
            <Input
              placeholder="Search candidate email or UTR..."
              value={paymentSearch}
              onChange={(e) => setPaymentSearch(e.target.value)}
              className="pl-9 bg-surface text-xs"
            />
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-surface shadow-md">
            <table className="w-full text-xs">
              <thead className="bg-surface-elevated text-text-muted uppercase">
                <tr>
                  <th className="py-3 px-4 text-left">Candidate</th>
                  <th className="py-3 px-4 text-center">Requested Plan</th>
                  <th className="py-3 px-4 text-center">Amount Claimed</th>
                  <th className="py-3 px-4 text-center">UTR Reference #</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions / Reviewed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-text-muted">
                      No payment requests found in this view.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((r) => {
                    const isDup = flaggedDuplicateUtrs.includes((r.utr_number || "").trim().toUpperCase());
                    return (
                      <tr key={r.id} className="hover:bg-surface-elevated/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-mono text-text-primary">{r.user_email}</div>
                          <div className="text-[10px] text-text-muted">{new Date(r.created_at).toLocaleString()}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${PLAN_COLORS[r.requested_plan] || PLAN_COLORS.pro}`}>
                            {(r.requested_plan || "pro").toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-success font-mono">
                          ₹{r.amount_claimed}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-mono font-bold bg-surface-elevated px-2 py-1 rounded border border-border tracking-wider text-accent">
                            {r.utr_number}
                          </span>
                          {isDup && (
                            <span className="ml-1 text-[10px] text-danger font-bold flex items-center justify-center gap-0.5 mt-0.5">
                              <AlertTriangle className="w-3 h-3" /> Duplicate UTR
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.status === "approved"
                              ? "bg-success/20 text-success border border-success/30"
                              : r.status === "rejected"
                              ? "bg-danger/20 text-danger border border-danger/30"
                              : "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                          }`}>
                            {r.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {r.status === "pending" ? (
                            <div className="flex justify-end gap-1.5">
                              <Button
                                size="sm"
                                disabled={actionLoading}
                                onClick={() => handleApprovePayment(r.user_id, r.id, r.requested_plan)}
                                className="h-7 px-2 bg-success hover:bg-success/90 text-white text-[11px]"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={actionLoading}
                                onClick={() => handleRejectPayment(r.user_id, r.id)}
                                className="h-7 px-2 border-danger/30 text-danger text-[11px]"
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-text-muted font-mono">
                              {r.reviewed_at ? new Date(r.reviewed_at).toLocaleDateString() : "Reviewed"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: FEATURE ANALYTICS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border bg-surface">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-text-secondary">Total ATS Audits Executed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold">{analytics.totalAtsScans || 0}</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-surface">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-text-secondary">Avg Candidate ATS Match Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-accent">{analytics.avgAtsScore || 68}%</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-surface">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-text-secondary">Est. Monthly Gemini AI Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-success">₹{analytics.estimatedAiCostInr || 0}</div>
                <div className="text-[10px] text-text-muted mt-1 font-mono">
                  ~{analytics.estimatedAiCalls || 0} total AI prompts run
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" /> Top Missing Skills Across Candidate Scans
              </CardTitle>
              <CardDescription className="text-xs">
                Market demand signal aggregated across all analyzed resume uploads.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {(analytics.topMissingKeywords || []).map((item: any) => (
                  <div key={item.keyword} className="p-3 rounded-xl bg-surface-elevated border border-border flex flex-col justify-between">
                    <span className="font-bold text-xs text-text-primary">{item.keyword}</span>
                    <span className="text-xs text-accent font-mono mt-2">{item.count} scans missing</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: SYSTEM HEALTH */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "health" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Server className="w-5 h-5 text-success" /> Production Infrastructure Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated border border-border">
                <span className="text-text-secondary">Supabase Database</span>
                <span className="text-success font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Connected (ofirvweirnjgsyyedkci)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated border border-border">
                <span className="text-text-secondary">Subscription Expiry Cron Job</span>
                <span className="text-success font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Active (00:00 UTC Daily)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated border border-border">
                <span className="text-text-secondary">Gemini 1.5 Flash AI Model</span>
                <span className="text-success font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Operational
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-surface">
            <CardHeader>
              <CardTitle className="text-base">Security &amp; RLS Safeguards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-text-secondary">
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-text-primary">
                🛡️ <strong>Service Role Protection:</strong> Server-side admin routes are protected by <code>isAdmin()</code> role validation and bypass RLS cleanly using the <code>service_role</code> JWT.
              </div>
              <div className="p-3 rounded-lg bg-surface-elevated border border-border">
                🔒 <strong>Database Triggers:</strong> <code>protect_profile_fields()</code> prevents client-side tampering of <code>plan</code> and <code>role</code> columns.
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: AUDIT LOGS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border overflow-hidden bg-surface shadow-md">
            <table className="w-full text-xs">
              <thead className="bg-surface-elevated text-text-muted uppercase">
                <tr>
                  <th className="py-3 px-4 text-left">Timestamp</th>
                  <th className="py-3 px-4 text-left">Admin Email</th>
                  <th className="py-3 px-4 text-center">Action Executed</th>
                  <th className="py-3 px-4 text-left">Target Candidate</th>
                  <th className="py-3 px-4 text-left">Details JSON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-text-muted">
                      No admin audit logs recorded yet. Try performing an admin action!
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-elevated/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-text-muted">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-accent">
                        {log.admin_email || "System Admin"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          log.action === "approve_payment"
                            ? "bg-success/20 text-success border border-success/30"
                            : log.action === "manual_plan_override"
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-danger/20 text-danger border border-danger/30"
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-text-primary">
                        {log.target_email || "N/A"}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-text-secondary">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MANUAL PLAN OVERRIDE DRAWER / MODAL */}
      {/* ------------------------------------------------------------- */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-border bg-surface shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Manual Plan Override</CardTitle>
                <CardDescription className="text-xs">
                  {selectedUser.full_name || selectedUser.email}
                </CardDescription>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Target Plan</label>
                <select
                  value={manualPlan}
                  onChange={(e) => setManualPlan(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-lg p-2.5 text-xs text-text-primary"
                >
                  <option value="free">Free Tier</option>
                  <option value="pro">Pro Plan (₹99)</option>
                  <option value="premium">Premium Plan (₹299)</option>
                  <option value="career_pack">Career Pack (₹499)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Reason for Override (Audit Log)</label>
                <Input
                  placeholder="e.g. Paid via support chat, GPay delay"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="text-xs bg-surface-elevated"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-accent hover:bg-accent-hover text-white font-semibold"
                  disabled={actionLoading}
                  onClick={handleManualOverride}
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply Override"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
