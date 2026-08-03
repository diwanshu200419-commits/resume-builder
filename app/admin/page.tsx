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
  BarChart3,
  Server,
  Search,
  AlertTriangle,
  SlidersHorizontal,
  History,
  AlertCircle,
  RotateCcw,
  Calendar,
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
  metadata?: Record<string, any>;
  created_at: string;
}

interface SystemError {
  id: string;
  service: string;
  route: string;
  error_code: string;
  safe_message: string;
  created_at: string;
}

const PLAN_COLORS: Record<string, string> = {
  career_pack: "bg-purple-600 text-white font-semibold",
  premium: "bg-emerald-600 text-white font-semibold",
  pro: "bg-indigo-600 text-white font-semibold",
  free: "bg-surface-elevated text-text-muted border border-border",
};

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "payments" | "analytics" | "health" | "audit" | "errors"
  >("overview");

  // User directory filters & pagination
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"created" | "active" | "scans">("created");

  // Payment tab sub-filter
  const [paymentSubTab, setPaymentSubTab] = useState<"pending" | "history">("pending");
  const [paymentSearch, setPaymentSearch] = useState("");

  // Drawer / Action State
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [actionType, setActionType] = useState<"change_plan" | "extend" | "expire" | "reset_usage">("change_plan");
  const [manualPlan, setManualPlan] = useState("pro");
  const [overrideReason, setOverrideReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set("search", search);
      if (planFilter !== "all") queryParams.set("plan", planFilter);
      if (roleFilter !== "all") queryParams.set("role", roleFilter);
      queryParams.set("sortBy", sortBy);

      const res = await fetch(`/api/admin/users?${queryParams.toString()}`);
      if (res.status === 403 || res.status === 401) {
        setUnauthorized(true);
        return;
      }
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastUpdated(new Date().toLocaleTimeString());
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

  useEffect(() => {
    fetchData();
  }, [planFilter, roleFilter, sortBy]);

  const handleApprovePayment = async (userId: string, requestId: string, plan: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, requestId, plan, status: "approve" }),
      });
      if (res.ok) {
        setActionSuccess("Payment approved & user plan activated successfully!");
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

  const handleAdminUserAction = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/manual-plan-override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          actionType,
          newPlan: manualPlan,
          reason: overrideReason || `Admin action: ${actionType}`,
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
  const systemErrors: SystemError[] = data?.systemErrors || [];
  const flaggedDuplicateUtrs: string[] = data?.flaggedDuplicateUtrs || [];

  const pendingPayments = paymentRequests.filter((r) => r.status === "pending");

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
    <div className="max-w-7xl mx-auto py-6 sm:py-10 space-y-6 px-4 sm:px-6 text-text-primary min-w-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold flex items-center gap-2 tracking-tight">
            <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8 text-accent shrink-0" />
            Vaylo AI SaaS Founder Console
          </h1>
          <p className="text-text-secondary mt-1 text-xs sm:text-sm">
            Live Production Data · Zero Mock Analytics · Verified Billing &amp; AI Costs
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[10px] sm:text-xs text-text-muted font-mono">
              Last updated: {lastUpdated}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="gap-1.5 text-xs font-bold">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-success/10 border border-success/30 text-success text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-success" /> {actionSuccess}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === "overview" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Overview &amp; MRR
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === "users" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Users className="w-4 h-4" /> User Directory ({overview.totalUsers || users.length})
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === "payments" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <CreditCard className="w-4 h-4" /> Payments ({pendingPayments.length})
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === "analytics" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Sparkles className="w-4 h-4" /> Feature &amp; AI Cost
        </button>

        <button
          onClick={() => setActiveTab("health")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === "health" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Server className="w-4 h-4" /> System Health
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === "audit" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <History className="w-4 h-4" /> Audit Logs ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveTab("errors")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === "errors" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <AlertCircle className="w-4 h-4" /> System Errors ({systemErrors.length})
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: REAL OVERVIEW & MRR */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top Real Financial Aggregates */}
          {/* Top Real Financial Aggregates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border bg-surface shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-text-secondary flex items-center justify-between">
                  <span>Total Users (Real Database)</span>
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

            <Card className="border-border bg-surface shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-text-secondary flex items-center justify-between">
                  <span>MRR (Active Recurring Only)</span>
                  <TrendingUp className="w-4 h-4 text-success" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-success">
                  ₹{overview.mrrEquivalent || 0}
                </div>
                <p className="text-[10px] text-text-muted mt-2">
                  Pro (₹99) &amp; Premium (₹299) active recurring ONLY.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-surface shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-text-secondary flex items-center justify-between">
                  <span>Lifetime One-Time Revenue</span>
                  <CreditCard className="w-4 h-4 text-purple-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-purple-400">
                  ₹{overview.careerPackRevenueTotal || 0}
                </div>
                <p className="text-[10px] text-text-muted mt-2">
                  {overview.planCounts?.career_pack || 0} Lifetime Career Pack purchases (₹499).
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-surface shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-text-secondary flex items-center justify-between">
                  <span>Verified Revenue (This Month)</span>
                  <Activity className="w-4 h-4 text-sky-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-sky-400">
                  ₹{overview.revenueThisMonth || 0}
                </div>
                <p className="text-[10px] text-text-muted mt-2 font-mono">
                  Lifetime Total: ₹{overview.lifetimeVerifiedRevenue || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Career Pack Profitability Signal */}
          <Card className="border-border bg-surface shadow-sm border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-text-primary flex items-center justify-between">
                <span>CAREER PACK ECONOMICS &amp; PROFITABILITY</span>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
                  Lifetime Revenue vs AI Cost
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Lifetime Revenue</span>
                  <p className="text-xl font-extrabold text-amber-400 mt-0.5">
                    ₹{overview.careerPackRevenueTotal || 0}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Career Pack AI Cost (This Month)</span>
                  <p className="text-xl font-extrabold text-emerald-400 mt-0.5">
                    ₹{analytics.aiUsage?.estimatedCostThisMonthInr || 0}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Avg AI Cost / User</span>
                  <p className="text-xl font-extrabold text-indigo-400 mt-0.5">
                    ₹{overview.planCounts?.career_pack ? (Number(analytics.aiUsage?.estimatedCostTotalInr || 0) / overview.planCounts.career_pack).toFixed(2) : "0.00"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Revenue-to-AI-Cost Ratio</span>
                  <p className="text-xl font-extrabold text-sky-400 mt-0.5">
                    {analytics.aiUsage?.estimatedCostTotalInr > 0
                      ? `${(overview.careerPackRevenueTotal / Number(analytics.aiUsage.estimatedCostTotalInr)).toFixed(1)}x`
                      : "High Margin"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Momentum Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border bg-surface shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" /> Signup Momentum (Real Database)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs py-2 border-b border-border">
                  <span className="text-text-secondary font-medium">New Signups Today (24h)</span>
                  <span className="font-bold text-text-primary font-mono">{overview.signups?.today || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2 border-b border-border">
                  <span className="text-text-secondary font-medium">New Signups This Week (7d)</span>
                  <span className="font-bold text-text-primary font-mono">{overview.signups?.week || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2 border-b border-border">
                  <span className="text-text-secondary font-medium">New Signups This Month (30d)</span>
                  <span className="font-bold text-text-primary font-mono">{overview.signups?.month || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2">
                  <span className="text-text-secondary font-medium">Free → Paid Conversion Rate</span>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-bold">
                    {overview.conversionRate || 0}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-surface shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" /> Active Candidate Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs py-2 border-b border-border">
                  <span className="text-text-secondary font-medium">DAU (Active Last 24 Hours)</span>
                  <span className="font-bold text-emerald-400 font-mono">{overview.activity?.activeToday || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2 border-b border-border">
                  <span className="text-text-secondary font-medium">WAU (Active Last 7 Days)</span>
                  <span className="font-bold text-indigo-400 font-mono">{overview.activity?.active7d || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2 border-b border-border">
                  <span className="text-text-secondary font-medium">MAU (Active Last 30 Days)</span>
                  <span className="font-bold text-purple-400 font-mono">{overview.activity?.active30d || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2">
                  <span className="text-text-secondary font-medium">Pending Verification Queue</span>
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs font-bold">
                    {overview.paymentStats?.pending || 0} Pending
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: REAL USER DIRECTORY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 rounded-xl border border-border">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search candidate email or full name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-surface-elevated text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="bg-surface-elevated border border-border text-xs rounded-lg px-3 py-2 font-medium"
              >
                <option value="all">All Plans</option>
                <option value="free">Free Tier</option>
                <option value="pro">Pro Plan</option>
                <option value="premium">Premium Plan</option>
                <option value="career_pack">Career Pack</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-surface-elevated border border-border text-xs rounded-lg px-3 py-2 font-medium"
              >
                <option value="all">All Roles</option>
                <option value="user">User Candidates</option>
                <option value="admin">Admins</option>
              </select>

              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-surface-elevated border border-border text-xs rounded-lg px-3 py-2 font-medium"
              >
                <option value="created">Sort: Newest Signups</option>
                <option value="active">Sort: Last Active</option>
                <option value="scans">Sort: Most ATS Scans</option>
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
                  <th className="py-3 px-4 text-center font-mono">Total Scans</th>
                  <th className="py-3 px-4 text-center font-mono">Signed Up</th>
                  <th className="py-3 px-4 text-center font-mono">Last Active</th>
                  <th className="py-3 px-4 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-text-muted">
                      No candidate profiles found matching current filters.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
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
                      <td className="py-3 px-4 text-center font-mono font-bold text-accent">
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
                          className="h-7 px-2.5 text-[11px] gap-1 border-accent/30 text-accent font-bold"
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
      {/* TAB 3: PAYMENTS & VERIFICATION */}
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

          <div className="rounded-xl border border-border overflow-hidden bg-surface shadow-md table-scroll-wrapper">
            <table className="w-full min-w-[640px] text-xs">
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
                      No payment requests recorded in this view.
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
                                className="h-7 px-2 bg-success hover:bg-success/90 text-white text-[11px] font-bold"
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
      {/* TAB 4: REAL FEATURE & AI COST ANALYTICS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-border bg-surface shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-text-secondary">Total ATS Resume Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-accent">{analytics.totalAtsScans || 0}</div>
                <p className="text-[11px] text-text-muted mt-1">Average ATS Score: {analytics.avgAtsScore || 0}%</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-surface shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-text-secondary">Logged AI Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-indigo-400">
                  {analytics.aiUsage?.totalRequests || 0}
                </div>
                <p className="text-[11px] text-text-muted mt-1">
                  Tokens Processed: {(analytics.aiUsage?.totalTokens || 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-surface shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-text-secondary">Estimated Gemini AI Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-emerald-400">
                  ₹{analytics.aiUsage?.estimatedCostTotalInr || 0}
                </div>
                <p className="text-[11px] text-text-muted mt-1">
                  This Month: ₹{analytics.aiUsage?.estimatedCostThisMonthInr || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-surface shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Top Missing Skills Aggregation (Real Scans)</CardTitle>
            </CardHeader>
            <CardContent>
              {(!analytics.topMissingKeywords || analytics.topMissingKeywords.length === 0) ? (
                <p className="text-xs text-text-muted py-4">No scan data aggregated yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {analytics.topMissingKeywords.map((item: any) => (
                    <div key={item.keyword} className="p-3 rounded-xl bg-surface-elevated border border-border text-center space-y-1">
                      <p className="text-xs font-bold text-text-primary truncate">{item.keyword}</p>
                      <Badge className="bg-accent/20 text-accent border-accent/30 text-[10px] font-bold">
                        {item.count} Scans
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: SYSTEM HEALTH */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "health" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-border bg-surface shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-text-secondary">Database Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  {systemHealth.databaseStatus || "Healthy"}
                </div>
                <p className="text-[11px] text-text-muted mt-2 font-mono">
                  Checked: {systemHealth.lastCheckedAt}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-surface shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-text-secondary">AI Service Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  {systemHealth.aiServiceStatus || "Operational"}
                </div>
                <p className="text-[11px] text-text-muted mt-2 font-mono">
                  Checked: {systemHealth.lastCheckedAt}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: AUDIT LOGS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border overflow-hidden bg-surface shadow-md table-scroll-wrapper">
            <table className="w-full min-w-[640px] text-xs">
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
                      No administrative actions recorded yet.
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
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent/20 text-accent border border-accent/30">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-text-primary">
                        {log.target_email || "N/A"}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-text-secondary break-word-safe">
                        {JSON.stringify(log.details || log.metadata || {})}
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
      {/* TAB 7: SYSTEM ERRORS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "errors" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border overflow-hidden bg-surface shadow-md table-scroll-wrapper">
            <table className="w-full min-w-[640px] text-xs">
              <thead className="bg-surface-elevated text-text-muted uppercase">
                <tr>
                  <th className="py-3 px-4 text-left">Timestamp</th>
                  <th className="py-3 px-4 text-left">Service / Route</th>
                  <th className="py-3 px-4 text-center">Error Code</th>
                  <th className="py-3 px-4 text-left">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {systemErrors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-text-muted">
                      No application errors recorded in this period.
                    </td>
                  </tr>
                ) : (
                  systemErrors.map((err) => (
                    <tr key={err.id} className="hover:bg-surface-elevated/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-text-muted">
                        {new Date(err.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-text-primary">
                        {err.service} ({err.route})
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-[10px]">
                          {err.error_code}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-text-secondary break-word-safe">
                        {err.safe_message}
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
      {/* USER MANAGEMENT DRAWER / MODAL */}
      {/* ------------------------------------------------------------- */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-lg w-full border-border bg-surface shadow-2xl animate-in zoom-in-95">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
              <div>
                <CardTitle className="text-base font-bold text-text-primary">User Management Drawer</CardTitle>
                <CardDescription className="text-xs text-text-muted">
                  {selectedUser.full_name || "Anonymous Candidate"} ({selectedUser.email})
                </CardDescription>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-text-muted hover:text-text-primary p-1">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-surface-elevated p-3 rounded-xl border border-border">
                <div>
                  <span className="text-[10px] text-text-muted font-semibold uppercase">User ID</span>
                  <p className="font-mono text-[11px] text-text-primary truncate">{selectedUser.id}</p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Current Plan</span>
                  <p className="font-bold text-accent">{selectedUser.plan.toUpperCase()}</p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Signed Up</span>
                  <p className="font-mono text-text-primary">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Last Active</span>
                  <p className="font-mono text-text-primary">
                    {selectedUser.last_seen_at ? new Date(selectedUser.last_seen_at).toLocaleDateString() : "Never"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold block">Select Action</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActionType("change_plan")}
                    className={`p-2 rounded-lg text-xs font-semibold border text-left ${
                      actionType === "change_plan" ? "bg-accent/20 border-accent text-accent" : "border-border text-text-secondary"
                    }`}
                  >
                    Change Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType("extend")}
                    className={`p-2 rounded-lg text-xs font-semibold border text-left ${
                      actionType === "extend" ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "border-border text-text-secondary"
                    }`}
                  >
                    Extend 30 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType("expire")}
                    className={`p-2 rounded-lg text-xs font-semibold border text-left ${
                      actionType === "expire" ? "bg-rose-500/20 border-rose-500 text-rose-400" : "border-border text-text-secondary"
                    }`}
                  >
                    Expire Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType("reset_usage")}
                    className={`p-2 rounded-lg text-xs font-semibold border text-left ${
                      actionType === "reset_usage" ? "bg-amber-500/20 border-amber-500 text-amber-400" : "border-border text-text-secondary"
                    }`}
                  >
                    Reset Usage Count
                  </button>
                </div>
              </div>

              {actionType === "change_plan" && (
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
              )}

              <div>
                <label className="text-xs font-semibold block mb-1">Reason for Action (Audit Log)</label>
                <Input
                  placeholder="e.g. Paid via support chat, extended trial"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="text-xs bg-surface-elevated"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedUser(null)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-accent hover:bg-accent-hover text-white font-bold"
                  disabled={actionLoading}
                  onClick={handleAdminUserAction}
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Action"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
