"use client";

import { Fragment, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  MessageSquare,
  Trash2,
  Bell,
  Radio,
  Send,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  plan: string | null;
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
  user_email: string | null;
  utr_number: string | null;
  amount_claimed: number | null;
  requested_plan: string | null;
  status: string | null;
  rejection_reason?: string | null;
  created_at: string;
  reviewed_at?: string | null;
}

interface AuditLog {
  id: string;
  admin_email: string | null;
  action: string | null;
  target_email: string | null;
  details: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: string;
}

interface SystemError {
  id: string;
  service: string | null;
  route: string | null;
  error_code: string | null;
  safe_message: string | null;
  created_at: string;
}

const PLAN_COLORS: Record<string, string> = {
  career_pack: "bg-purple-600 text-white font-semibold",
  premium: "bg-emerald-600 text-white font-semibold",
  pro: "bg-indigo-600 text-white font-semibold",
  free: "bg-surface-elevated text-text-muted border border-border",
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

function safeText(value: unknown, fallback = "N/A"): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function normalizePlan(plan: string | null | undefined, fallback = "free"): string {
  const normalized = safeText(plan, fallback).toLowerCase().replace("-", "_");
  return PLAN_COLORS[normalized] ? normalized : fallback;
}

function planLabel(plan: string | null | undefined, fallback = "free"): string {
  return normalizePlan(plan, fallback).toUpperCase();
}

function statusKey(status: unknown): string {
  return safeText(status, "").toLowerCase();
}

function upperLabel(value: unknown, fallback = "UNKNOWN"): string {
  return safeText(value, fallback).toUpperCase();
}

function formatDate(value: string | null | undefined, fallback = "N/A"): string {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toLocaleDateString();
}

function formatDateTime(value: string | null | undefined, fallback = "N/A"): string {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toLocaleString();
}

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "notifications" | "payments" | "feedback" | "analytics" | "health" | "audit" | "errors"
  >("overview");

  // User directory filters & pagination
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"created" | "active" | "scans">("created");

  // Payment tab sub-filter
  const [paymentSubTab, setPaymentSubTab] = useState<"pending" | "history">("pending");
  const [paymentSearch, setPaymentSearch] = useState("");

  // Feedback tab filters
  const [feedbackCategory, setFeedbackCategory] = useState("all");
  const [feedbackStatus, setFeedbackStatus] = useState("all");
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [replyingFeedbackId, setReplyingFeedbackId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState("");

  // Drawer / Action State
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [actionType, setActionType] = useState<"change_plan" | "extend" | "expire" | "reset_usage" | "delete_user">("change_plan");
  const [manualPlan, setManualPlan] = useState("pro");
  const [overrideReason, setOverrideReason] = useState("");
  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [realtimeNotification, setRealtimeNotification] = useState<string | null>(null);

  // Admin notification sender
  const [notificationTarget, setNotificationTarget] = useState<"specific" | "all">("specific");
  const [notificationRecipient, setNotificationRecipient] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const [notificationSending, setNotificationSending] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);

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

    // Supabase Realtime Push Subscriptions on payment_requests, user_feedback, profiles
    const supabase = createClient();
    const channel = supabase
      .channel("admin-realtime-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "payment_requests" },
        (payload: any) => {
          setRealtimeNotification("🔔 NEW UPI PAYMENT SUBMITTED BY CANDIDATE!");
          fetchData();
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user_feedback" },
        (payload: any) => {
          setRealtimeNotification("🔔 NEW USER SUPPORT/FEEDBACK MESSAGE RECEIVED!");
          fetchData();
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          confirmEmail: confirmDeleteEmail.trim(),
          reason: overrideReason || "Admin 2-Step Confirmed Account Deletion",
        }),
      });
      const resJson = await res.json();
      if (res.ok) {
        setActionSuccess(resJson.message);
        setSelectedUser(null);
        setConfirmDeleteEmail("");
        setOverrideReason("");
        fetchData();
      } else {
        alert(resJson.error || "Failed to delete user account.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const handleReplyFeedback = async (feedbackId: string) => {
    if (!adminReplyText.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/feedback/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackId,
          adminResponse: adminReplyText.trim(),
          newStatus: "resolved",
        }),
      });
      const resJson = await res.json();
      if (res.ok) {
        setActionSuccess("Feedback response sent & status marked resolved!");
        setReplyingFeedbackId(null);
        setAdminReplyText("");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const resolveNotificationUserId = () => {
    const value = notificationRecipient.trim();
    if (!value) return null;
    if (UUID_RE.test(value)) return value;

    const matchedUser = ((data?.users || []) as UserProfile[]).find(
      (user) => (user.email || "").toLowerCase() === value.toLowerCase()
    );

    return matchedUser?.id || null;
  };

  const handleSendNotification = async () => {
    setNotificationError(null);

    const title = notificationTitle.trim();
    const body = notificationBody.trim();
    const userId = notificationTarget === "all" ? "all" : resolveNotificationUserId();

    if (!title || !body) {
      setNotificationError("Title and body are required.");
      return;
    }

    if (!userId) {
      setNotificationError("Enter a valid user UUID or an email visible in the current user directory.");
      return;
    }

    setNotificationSending(true);
    try {
      const res = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, body }),
      });
      const resJson = await res.json();

      if (!res.ok) {
        setNotificationError(resJson.error || "Failed to send notification.");
        return;
      }

      const count = Number(resJson.createdCount || 0);
      setActionSuccess(`Notification sent to ${count} user${count === 1 ? "" : "s"}.`);
      setNotificationTitle("");
      setNotificationBody("");
      if (notificationTarget === "specific") {
        setNotificationRecipient("");
      }
    } catch (error: any) {
      setNotificationError(error?.message || "Failed to send notification.");
    } finally {
      setNotificationSending(false);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleAdminUserAction = async () => {
    if (!selectedUser) return;
    if (actionType === "delete_user") {
      return handleDeleteUser();
    }

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
  const users = safeArray<UserProfile>(data?.users);
  const paymentRequests = safeArray<PaymentRequest>(data?.paymentRequests);
  const auditLogs = safeArray<AuditLog>(data?.auditLogs);
  const analytics = data?.analytics || {};
  const systemHealth = data?.systemHealth || {};
  const systemErrors = safeArray<SystemError>(data?.systemErrors);
  const flaggedDuplicateUtrs = safeArray<string>(data?.flaggedDuplicateUtrs);
  const userFeedback = safeArray<any>(data?.userFeedback);
  const topMissingKeywords = safeArray<any>(analytics.topMissingKeywords);

  const pendingPayments = paymentRequests.filter((r) => statusKey(r.status) === "pending");
  const openFeedbackCount = userFeedback.filter((f) => statusKey(f.status) === "open").length;

  const filteredPayments = paymentRequests.filter((r) => {
    const status = statusKey(r.status);
    if (paymentSubTab === "pending" && status !== "pending") return false;
    if (paymentSubTab === "history" && status === "pending") return false;
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

        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5 py-1 px-2.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Realtime Push Active
          </Badge>

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

      {realtimeNotification && (
        <div className="p-3.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top">
          <span className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400 animate-bounce" /> {realtimeNotification}
          </span>
          <button onClick={() => setRealtimeNotification(null)} className="text-text-muted hover:text-text-primary text-xs">
            Dismiss
          </button>
        </div>
      )}

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-success/10 border border-success/30 text-success text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-success" /> {actionSuccess}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-1 border-b border-border pb-2 text-xs font-bold">
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
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === "notifications" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Bell className="w-4 h-4" /> Notifications
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
          onClick={() => setActiveTab("feedback")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
            activeTab === "feedback" ? "bg-accent text-white shadow" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Feedback Inbox ({openFeedbackCount})
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
                  users.map((u) => {
                    const userPlan = normalizePlan(u.plan);
                    return (
                    <tr key={u.id || u.email || userPlan} className="hover:bg-surface-elevated/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-text-primary">{u.full_name || "Anonymous Candidate"}</div>
                        <div className="text-[11px] text-text-muted font-mono">{u.email || "No email"}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === "admin" ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" : "text-text-muted"
                        }`}>
                          {u.role || "user"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${PLAN_COLORS[userPlan] || PLAN_COLORS.free}`}>
                          {planLabel(userPlan)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-accent">
                        {u.total_ats_checks || u.analyses_used || 0}
                      </td>
                      <td className="py-3 px-4 text-center text-text-muted font-mono">
                        {formatDate(u.created_at)}
                      </td>
                      <td className="py-3 px-4 text-center text-text-muted font-mono">
                        {formatDate(u.last_seen_at, "Never")}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setSelectedUser(u); setManualPlan(userPlan); }}
                          className="h-7 px-2.5 text-[11px] gap-1 border-accent/30 text-accent font-bold"
                        >
                          <SlidersHorizontal className="w-3 h-3" /> Manage
                        </Button>
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
      {/* TAB 3: SEND NOTIFICATIONS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "notifications" && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4">
          <Card className="border-border bg-surface shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Send className="w-4 h-4 text-accent" />
                Send Notification
              </CardTitle>
              <CardDescription className="text-xs">
                One candidate or all users.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="notification-target" className="text-xs font-bold text-text-primary">
                    Target
                  </label>
                  <select
                    id="notification-target"
                    value={notificationTarget}
                    onChange={(event) => setNotificationTarget(event.target.value as "specific" | "all")}
                    className="flex h-10 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <option value="specific">Specific user</option>
                    <option value="all">All users</option>
                  </select>
                </div>

                {notificationTarget === "specific" && (
                  <div className="space-y-2">
                    <label htmlFor="notification-recipient" className="text-xs font-bold text-text-primary">
                      User email or ID
                    </label>
                    <Input
                      id="notification-recipient"
                      list="notification-recipient-options"
                      value={notificationRecipient}
                      onChange={(event) => setNotificationRecipient(event.target.value)}
                      placeholder="candidate@example.com or UUID"
                      className="bg-surface-elevated text-xs"
                    />
                    <datalist id="notification-recipient-options">
                      {users.map((user) => (
                        <Fragment key={user.id || user.email || "unknown-user"}>
                          <option
                            value={user.id}
                            label={`${user.email || "No email"} - ${user.full_name || "Anonymous"}`}
                          />
                          {user.email ? (
                            <option
                              value={user.email}
                              label={`${user.id} - ${user.full_name || "Anonymous"}`}
                            />
                          ) : null}
                        </Fragment>
                      ))}
                    </datalist>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="notification-title" className="text-xs font-bold text-text-primary">
                  Title
                </label>
                <Input
                  id="notification-title"
                  value={notificationTitle}
                  onChange={(event) => setNotificationTitle(event.target.value)}
                  placeholder="Notification title"
                  className="bg-surface-elevated text-xs"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="notification-body" className="text-xs font-bold text-text-primary">
                  Body
                </label>
                <Textarea
                  id="notification-body"
                  value={notificationBody}
                  onChange={(event) => setNotificationBody(event.target.value)}
                  placeholder="Write the notification body..."
                  className="bg-surface-elevated text-xs min-h-32"
                />
              </div>

              {notificationError && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs font-semibold">
                  {notificationError}
                </div>
              )}

              <Button
                onClick={handleSendNotification}
                disabled={notificationSending || !notificationTitle.trim() || !notificationBody.trim()}
                className="bg-accent hover:bg-accent-hover text-white font-bold text-xs gap-2"
              >
                {notificationSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {notificationSending ? "Sending..." : "Send Notification"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-surface shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Bell className="w-4 h-4 text-accent" />
                Delivery
              </CardTitle>
              <CardDescription className="text-xs">
                {notificationTarget === "all" ? "Broadcast" : "Specific user"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-text-secondary">
              <div className="p-3 rounded-lg bg-surface-elevated border border-border">
                <p className="font-bold text-text-primary">Loaded users</p>
                <p className="mt-1 font-mono">{users.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-elevated border border-border">
                <p className="font-bold text-text-primary">Target</p>
                <p className="mt-1 font-mono">{notificationTarget === "all" ? "all" : notificationRecipient || "not selected"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: PAYMENTS & VERIFICATION */}
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

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Verify that the actual UPI transaction has been received in your bank/UPI app before approving.</span>
            </span>
            <span className="font-mono text-[10px] text-amber-400 font-bold uppercase bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
              Payee VPA: jattshiv32@okaxis
            </span>
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
                    const requestedPlan = normalizePlan(r.requested_plan, "pro");
                    const paymentStatus = statusKey(r.status);
                    return (
                      <tr key={r.id || `${r.user_id}-${r.utr_number || "payment"}`} className="hover:bg-surface-elevated/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-mono text-text-primary">{r.user_email || "No email"}</div>
                          <div className="text-[10px] text-text-muted">{formatDateTime(r.created_at)}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${PLAN_COLORS[requestedPlan] || PLAN_COLORS.pro}`}>
                            {planLabel(requestedPlan, "pro")}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-success font-mono">
                          ₹{r.amount_claimed}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-mono font-bold bg-surface-elevated px-2 py-1 rounded border border-border tracking-wider text-accent">
                            {r.utr_number || "N/A"}
                          </span>
                          {isDup && (
                            <span className="ml-1 text-[10px] text-danger font-bold flex items-center justify-center gap-0.5 mt-0.5">
                              <AlertTriangle className="w-3 h-3" /> Duplicate UTR
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            paymentStatus === "approved"
                              ? "bg-success/20 text-success border border-success/30"
                              : paymentStatus === "rejected"
                              ? "bg-danger/20 text-danger border border-danger/30"
                              : "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                          }`}>
                            {upperLabel(paymentStatus)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {paymentStatus === "pending" ? (
                            <div className="flex justify-end gap-1.5">
                              <Button
                                size="sm"
                                disabled={actionLoading}
                                onClick={() => handleApprovePayment(r.user_id, r.id, requestedPlan)}
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
                              {formatDate(r.reviewed_at, "Reviewed")}
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
      {/* TAB: USER FEEDBACK & SUPPORT COMPLAINTS INBOX */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "feedback" && (
        <div className="space-y-4">
          {/* Support Ticket Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-surface border border-border text-center">
              <span className="text-[10px] text-text-muted font-semibold uppercase">Total Tickets</span>
              <p className="text-xl font-extrabold text-white mt-0.5 font-mono">{userFeedback.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
              <span className="text-[10px] text-amber-400 font-semibold uppercase">New / Open</span>
              <p className="text-xl font-extrabold text-amber-400 mt-0.5 font-mono">
                {openFeedbackCount}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-center">
              <span className="text-[10px] text-indigo-300 font-semibold uppercase">In Progress</span>
              <p className="text-xl font-extrabold text-indigo-400 mt-0.5 font-mono">
                {userFeedback.filter((f: any) => statusKey(f.status) === "in_progress").length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center">
              <span className="text-[10px] text-rose-400 font-semibold uppercase">Urgent / High</span>
              <p className="text-xl font-extrabold text-rose-400 mt-0.5 font-mono">
                {userFeedback.filter((f: any) => ["billing", "complaint", "payment_issue", "refund_request"].includes(statusKey(f.category))).length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-emerald-400 font-semibold uppercase">Resolved</span>
              <p className="text-xl font-extrabold text-emerald-400 mt-0.5 font-mono">
                {userFeedback.filter((f: any) => ["resolved", "closed"].includes(statusKey(f.status))).length}
              </p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 rounded-xl border border-border">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search ticket ref, candidate email, subject, or UTR..."
                value={feedbackSearch}
                onChange={(e) => setFeedbackSearch(e.target.value)}
                className="pl-9 bg-surface-elevated text-xs font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={feedbackStatus}
                onChange={(e) => setFeedbackStatus(e.target.value)}
                className="bg-surface-elevated border border-border text-xs rounded-lg px-3 py-2 font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value)}
                className="bg-surface-elevated border border-border text-xs rounded-lg px-3 py-2 font-medium"
              >
                <option value="all">All Categories</option>
                <option value="payment_issue">Payment / Billing Issue</option>
                <option value="refund_request">Refund Request</option>
                <option value="account_issue">Account Issue</option>
                <option value="ats_resume">ATS Scanner &amp; Resume</option>
                <option value="bug">Bugs / Technical</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          {/* Support Ticket Cards */}
          <div className="space-y-3">
            {userFeedback
              .filter((item) => {
                if (feedbackStatus !== "all" && statusKey(item.status) !== feedbackStatus) return false;
                if (feedbackCategory !== "all" && statusKey(item.category) !== feedbackCategory) return false;
                if (feedbackSearch) {
                  const q = feedbackSearch.toLowerCase();
                  const matchEmail = (item.user_email || "").toLowerCase().includes(q);
                  const matchMsg = (item.message || "").toLowerCase().includes(q);
                  const matchSubject = (item.subject || "").toLowerCase().includes(q);
                  if (!matchEmail && !matchMsg && !matchSubject) return false;
                }
                return true;
              })
              .map((item) => {
                const feedbackId = safeText(item.id, "");
                const feedbackStatusKey = statusKey(item.status);
                const feedbackCategoryKey = statusKey(item.category);
                const linkedUser = users.find((u) => u.id === item.user_id || u.email === item.user_email);
                const linkedUserPlan = linkedUser ? normalizePlan(linkedUser.plan) : "free";
                const isPaymentRelated = feedbackCategoryKey === "billing" || feedbackCategoryKey === "payment_issue" || feedbackCategoryKey === "refund_request";
                const userPayment = isPaymentRelated ? paymentRequests.find((r) => r.user_id === item.user_id || r.user_email === item.user_email) : null;

                return (
                  <Card key={feedbackId || `${item.user_email || "ticket"}-${item.created_at || "unknown"}`} className="border-border bg-surface shadow-sm hover:border-indigo-500/40 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-indigo-400">
                              #{item.ticket_ref || `VAY-${(feedbackId || "00000").slice(0, 5).toUpperCase()}`}
                            </span>
                            <span className="font-bold text-text-primary text-xs">{item.user_email || "No email"}</span>
                            {linkedUser && (
                              <Badge className={`text-[10px] ${PLAN_COLORS[linkedUserPlan] || PLAN_COLORS.free}`}>
                                {planLabel(linkedUserPlan)}
                              </Badge>
                            )}
                            <Badge className="bg-surface-elevated border-border text-[10px] uppercase font-mono">
                              {feedbackCategoryKey || "general"}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-text-muted font-mono">
                            Submitted: {formatDateTime(item.created_at)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={`text-[10px] font-bold ${
                            feedbackStatusKey === "resolved" || feedbackStatusKey === "closed"
                              ? "bg-success/20 text-success border border-success/30"
                              : feedbackStatusKey === "in_progress"
                              ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}>
                            {upperLabel(feedbackStatusKey, "OPEN")}
                          </Badge>
                          {linkedUser && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => { setSelectedUser(linkedUser); setManualPlan(linkedUserPlan); }}
                              className="h-7 px-2 text-[11px] border-accent/30 text-accent font-bold"
                            >
                              User Context
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Payment Context Box for Payment Complaints / Refund Requests */}
                      {userPayment && (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-1 text-amber-300">
                          <p className="font-bold text-amber-400 flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4" /> Linked Payment Record:
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-1">
                            <div>Status: <strong className="text-white uppercase">{statusKey(userPayment.status) || "unknown"}</strong></div>
                            <div>Claimed: <strong className="text-emerald-400">₹{userPayment.amount_claimed}</strong></div>
                            <div>UTR: <strong className="text-amber-200">{userPayment.utr_number || "N/A"}</strong></div>
                            <div>Plan: <strong className="text-indigo-300">{planLabel(userPayment.requested_plan, "pro")}</strong></div>
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-text-secondary bg-surface-elevated p-3 rounded-xl border border-border leading-relaxed whitespace-pre-wrap">
                        {item.message}
                      </p>

                      {item.admin_response ? (
                        <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 space-y-1 text-xs">
                          <div className="flex items-center justify-between text-[10px] text-accent font-bold">
                            <span>Admin Reply</span>
                            <span>{formatDateTime(item.responded_at, "")}</span>
                          </div>
                          <p className="text-text-primary leading-relaxed">{item.admin_response}</p>
                        </div>
                      ) : replyingFeedbackId === feedbackId ? (
                        <div className="space-y-2 pt-2 border-t border-border">
                          <Textarea
                            rows={3}
                            placeholder="Write admin reply to candidate..."
                            value={adminReplyText}
                            onChange={(e) => setAdminReplyText(e.target.value)}
                            className="text-xs bg-surface-elevated"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => { setReplyingFeedbackId(null); setAdminReplyText(""); }}
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              disabled={actionLoading}
                              onClick={() => handleReplyFeedback(feedbackId)}
                              className="bg-accent hover:bg-accent-hover text-white text-xs font-bold gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" /> Send &amp; Resolve Ticket
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setReplyingFeedbackId(feedbackId); setAdminReplyText(""); }}
                          className="h-7 text-xs border-accent/30 text-accent font-bold gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Reply to Candidate Ticket
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
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
              {topMissingKeywords.length === 0 ? (
                <p className="text-xs text-text-muted py-4">No scan data aggregated yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {topMissingKeywords.map((item: any) => (
                    <div key={safeText(item.keyword, "keyword")} className="p-3 rounded-xl bg-surface-elevated border border-border text-center space-y-1">
                      <p className="text-xs font-bold text-text-primary truncate">{safeText(item.keyword, "Unknown")}</p>
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
                  Checked: {formatDateTime(systemHealth.lastCheckedAt)}
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
                  Checked: {formatDateTime(systemHealth.lastCheckedAt)}
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
                        {formatDateTime(log.created_at)}
                      </td>
                      <td className="py-3 px-4 font-bold text-accent">
                        {log.admin_email || "System Admin"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent/20 text-accent border border-accent/30">
                          {safeText(log.action, "UNKNOWN_ACTION")}
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
                        {formatDateTime(err.created_at)}
                      </td>
                      <td className="py-3 px-4 font-bold text-text-primary">
                        {safeText(err.service, "Unknown")} ({safeText(err.route, "N/A")})
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-[10px]">
                          {safeText(err.error_code, "UNKNOWN")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-text-secondary break-word-safe">
                        {safeText(err.safe_message, "No message")}
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
                  <p className="font-bold text-accent">{planLabel(selectedUser.plan)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Signed Up</span>
                  <p className="font-mono text-text-primary">{formatDate(selectedUser.created_at)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Last Active</span>
                  <p className="font-mono text-text-primary">
                    {formatDate(selectedUser.last_seen_at, "Never")}
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
                  <button
                    type="button"
                    onClick={() => setActionType("delete_user")}
                    className={`p-2 rounded-lg text-xs font-semibold border text-left col-span-2 ${
                      actionType === "delete_user" ? "bg-rose-600 border-rose-500 text-white font-bold" : "border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                    }`}
                  >
                    🗑️ Permanently Delete Account (2-Step)
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

              {actionType === "delete_user" && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                  <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wide">⚠️ 2-Step Confirmation Required</p>
                  <p className="text-xs text-text-secondary">
                    This action will permanently delete auth credentials, profile, stored resumes, analysis scans, and feedback messages. Financial transaction records will be anonymized to preserve GST/tax audit logs.
                  </p>
                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-bold text-text-primary block">
                      Type candidate email (<span className="font-mono text-rose-400">{selectedUser.email}</span>) to confirm:
                    </label>
                    <Input
                      placeholder={selectedUser.email || ""}
                      value={confirmDeleteEmail}
                      onChange={(e) => setConfirmDeleteEmail(e.target.value)}
                      className="text-xs bg-surface-elevated font-mono border-rose-500/30"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold block mb-1">Reason for Action (Audit Log)</label>
                <Input
                  placeholder="e.g. User requested deletion, test cleanup"
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
                  className={`flex-1 font-bold ${
                    actionType === "delete_user"
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : "bg-accent hover:bg-accent-hover text-white"
                  }`}
                  disabled={
                    actionLoading ||
                    (actionType === "delete_user" &&
                      confirmDeleteEmail.trim().toLowerCase() !== (selectedUser.email || "").trim().toLowerCase())
                  }
                  onClick={handleAdminUserAction}
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : actionType === "delete_user" ? (
                    "Confirm Permanent Deletion"
                  ) : (
                    "Confirm Action"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
