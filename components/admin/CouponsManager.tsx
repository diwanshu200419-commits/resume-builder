"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tag,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  Copy,
  Check,
  Trash2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
} from "lucide-react";
import type { DBCoupon, CouponRedemptionRecord } from "@/lib/coupons";

export function CouponsManager() {
  const [coupons, setCoupons] = useState<DBCoupon[]>([]);
  const [redemptions, setRedemptions] = useState<CouponRedemptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [showCreate, setShowCreate] = useState(false);
  const [formCode, setFormCode] = useState("");
  const [formPlan, setFormPlan] = useState<string>("all");
  const [formType, setFormType] = useState<"percent" | "fixed" | "free_months">("percent");
  const [formValue, setFormValue] = useState<number>(20);
  const [formDuration, setFormDuration] = useState<number>(1);
  const [formMax, setFormMax] = useState<number>(100);
  const [formExpiry, setFormExpiry] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchCoupons = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (res.ok) {
        setCoupons(data.coupons || []);
        setRedemptions(data.redemptions || []);
      }
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const generateRandomCode = () => {
    const prefix = formType === "free_months" ? "FREE" : "VAYLO";
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    setFormCode(`${prefix}${rand}`);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formCode.trim()) {
      setFormError("Please provide a coupon code.");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formCode.trim().toUpperCase(),
          plan: formPlan,
          discount_type: formType,
          discount_value: Number(formValue),
          duration_months: Number(formDuration),
          max_redemptions: Number(formMax),
          expires_at: formExpiry ? new Date(formExpiry).toISOString() : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create coupon.");

      setFormSuccess(data.message || "Coupon created successfully!");
      setFormCode("");
      setShowCreate(false);
      fetchCoupons();
    } catch (err: any) {
      setFormError(err.message || "Something went wrong.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? { ...c, is_active: !currentStatus } : c))
        );
      }
    } catch (err) {
      console.error("Failed to toggle coupon status:", err);
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon ${code}?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete coupon:", err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const totalRedemptions = coupons.reduce((acc, c) => acc + (c.times_redeemed || 0), 0);
  const activeCount = coupons.filter((c) => c.is_active).length;

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-surface">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase">Active Coupons</p>
              <h3 className="text-2xl font-bold text-text-primary mt-1">{activeCount} / {coupons.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <Tag className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase">Total Redemptions</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">{totalRedemptions}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase">Recent Uses Logged</p>
              <h3 className="text-2xl font-bold text-blue-400 mt-1">{redemptions.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Actions Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-text-primary">Admin Coupon Management</h2>
          <p className="text-xs text-text-muted">Create, toggle, and audit promo codes and free trial vouchers.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCoupons}
            disabled={refreshing}
            className="border-border text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setShowCreate(!showCreate)}
            className="bg-accent hover:bg-accent-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{showCreate ? "Close Form" : "Create Coupon"}</span>
          </Button>
        </div>
      </div>

      {/* Create Coupon Drawer / Card */}
      {showCreate && (
        <Card className="border-accent/40 bg-surface shadow-xl animate-in fade-in slide-in-from-top-4">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-text-primary">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Create New Promotional Coupon</span>
            </CardTitle>
            <CardDescription className="text-xs text-text-muted">
              Configure code name, target plan, discount percentage/fixed value, and redemption limits.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Code */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                    Coupon Code *
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. EARLYBIRD50"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                      className="font-mono text-sm tracking-wider uppercase bg-background border-border"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateRandomCode}
                      className="shrink-0 text-xs border-border"
                      title="Generate random coupon code"
                    >
                      🎲
                    </Button>
                  </div>
                </div>

                {/* Target Plan */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                    Target Plan Tier
                  </label>
                  <select
                    value={formPlan}
                    onChange={(e) => setFormPlan(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-lg bg-background border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="all">All Plans (Universal)</option>
                    <option value="pro">Pro Plan Only</option>
                    <option value="premium">Premium Plan Only</option>
                    <option value="career_pack">Career Pack Only</option>
                  </select>
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => {
                      const t = e.target.value as any;
                      setFormType(t);
                      if (t === "free_months") setFormValue(1);
                      else if (t === "percent") setFormValue(20);
                      else if (t === "fixed") setFormValue(50);
                    }}
                    className="w-full h-10 px-3 py-2 rounded-lg bg-background border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="percent">Percentage Off (%)</option>
                    <option value="fixed">Fixed Discount (₹ Flat)</option>
                    <option value="free_months">Free Access Months (100% Free)</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                    {formType === "percent"
                      ? "Percentage Off (%)"
                      : formType === "fixed"
                      ? "Discount Amount (₹)"
                      : "Free Duration (Months)"}
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={formType === "percent" ? 100 : 50000}
                    value={formValue}
                    onChange={(e) => setFormValue(Number(e.target.value))}
                    className="bg-background border-border"
                    required
                  />
                </div>

                {/* Duration Months */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                    Billing Cycles
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="bg-background border-border"
                    placeholder="1 month"
                  />
                </div>

                {/* Max Redemptions */}
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                    Max Redemptions
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={100000}
                    value={formMax}
                    onChange={(e) => setFormMax(Number(e.target.value))}
                    className="bg-background border-border"
                  />
                </div>

                {/* Expiration Date */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                    Expiry Date (Optional)
                  </label>
                  <Input
                    type="datetime-local"
                    value={formExpiry}
                    onChange={(e) => setFormExpiry(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreate(false)}
                  className="border-border text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={creating}
                  className="bg-accent hover:bg-accent-hover text-white text-xs font-bold"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save & Activate Coupon"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Coupons Table */}
      <Card className="border-border bg-surface">
        <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-text-primary">Configured Coupons</CardTitle>
            <CardDescription className="text-xs text-text-muted">
              Active promotional discount codes available for user redemption.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {coupons.length} Total
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-text-muted text-xs flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
              <span>Loading coupons registry...</span>
            </div>
          ) : coupons.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-xs">
              No coupons found. Click "Create Coupon" above to add your first promotion.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-elevated/50 text-text-muted font-semibold uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Plan Scope</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Usage (Redeemed / Max)</th>
                    <th className="py-3 px-4">Expiry</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {coupons.map((c) => {
                    const isExpired = c.expires_at && new Date(c.expires_at).getTime() < Date.now();
                    const isDepleted = c.times_redeemed >= c.max_redemptions;
                    const percent = Math.min(100, Math.round(((c.times_redeemed || 0) / c.max_redemptions) * 100));

                    return (
                      <tr key={c.id} className="hover:bg-surface-elevated/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-text-primary text-sm tracking-wider">
                              {c.code}
                            </span>
                            <button
                              onClick={() => copyToClipboard(c.code)}
                              className="text-text-muted hover:text-accent p-1 rounded"
                              title="Copy code"
                            >
                              {copiedCode === c.code ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-[11px] font-semibold uppercase">
                            {c.plan}
                          </Badge>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-accent">
                            {c.discount_type === "percent" && `${c.discount_value}% OFF`}
                            {c.discount_type === "fixed" && `₹${c.discount_value} FLAT OFF`}
                            {c.discount_type === "free_months" && `${c.discount_value} MO FREE`}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="space-y-1 w-36">
                            <div className="flex justify-between text-[11px] font-semibold text-text-muted">
                              <span>{c.times_redeemed || 0}</span>
                              <span>{c.max_redemptions} max</span>
                            </div>
                            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-border/50">
                              <div
                                className={`h-full ${percent >= 100 ? "bg-rose-500" : percent > 75 ? "bg-amber-400" : "bg-emerald-400"}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-text-muted">
                          {c.expires_at ? (
                            <span className={isExpired ? "text-rose-400 font-semibold" : ""}>
                              {new Date(c.expires_at).toLocaleDateString()}
                              {isExpired && " (Expired)"}
                            </span>
                          ) : (
                            <span className="text-text-muted/60">Never</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleActive(c.id, c.is_active)}
                            className="flex items-center gap-1.5 focus:outline-none"
                            title={c.is_active ? "Click to deactivate" : "Click to activate"}
                          >
                            {c.is_active && !isExpired && !isDepleted ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <ToggleRight className="w-3.5 h-3.5" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-500/15 text-zinc-400 border border-zinc-500/30">
                                <ToggleLeft className="w-3.5 h-3.5" /> Inactive
                              </span>
                            )}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCoupon(c.id, c.code)}
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 h-auto rounded-lg"
                            title="Delete coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Redemptions Audit Log */}
      <Card className="border-border bg-surface">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-base font-bold text-text-primary flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-secondary" />
            <span>Redemption Audit Log</span>
          </CardTitle>
          <CardDescription className="text-xs text-text-muted">
            Live record of user coupon redemptions to prevent double usage.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {redemptions.length === 0 ? (
            <div className="p-6 text-center text-text-muted text-xs">
              No redemptions logged yet.
            </div>
          ) : (
            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-elevated/50 text-text-muted font-semibold uppercase tracking-wider sticky top-0 border-b border-border">
                  <tr>
                    <th className="py-2.5 px-4">User</th>
                    <th className="py-2.5 px-4">Plan</th>
                    <th className="py-2.5 px-4">Discount Applied</th>
                    <th className="py-2.5 px-4">Redeemed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {redemptions.map((r) => (
                    <tr key={r.id} className="hover:bg-surface-elevated/20">
                      <td className="py-2.5 px-4 font-mono text-text-primary">
                        {r.user_email || r.user_id.slice(0, 12)}
                      </td>
                      <td className="py-2.5 px-4">
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {r.plan}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-4 font-bold text-emerald-400">
                        ₹{r.discount_applied}
                      </td>
                      <td className="py-2.5 px-4 text-text-muted">
                        {new Date(r.redeemed_at).toLocaleString()}
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
