"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Users, CreditCard, Sparkles, Loader2, Check, X, RefreshCw } from "lucide-react";

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  plan: string;
  subscription_status: string | null;
  total_resume_downloads: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState([] as UserProfile[]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState(null as string | null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users"); // We will create this helper API
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdatePlan = async (userId: string, targetPlan: string, action: "approve" | "reject") => {
    setActionId(userId);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan: targetPlan, status: action }),
      });
      if (res.ok) {
        await fetchUsers();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    return (
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const pendingUsers = users.filter((u) => {
    return u.subscription_status === "pending" || u.plan === "pending";
  });

  const totalRevenue = users.reduce((acc, curr) => {
    const cost = curr.plan === "pro" ? 99 : curr.plan === "premium" ? 299 : 0;
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
          <p className="text-text-secondary mt-1">Manage user plan upgrades, payments verification, and platform usage metrics.</p>
        </div>
        <Button onClick={fetchUsers} variant="outline" size="sm" className="gap-1">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center justify-between">
              Active Subs <CreditCard className="w-4 h-4 text-success" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-success">
              {users.filter((u) => u.plan !== "free").length}
            </div>
            <p className="text-xs text-text-muted mt-1">Pro &amp; Premium tier users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center justify-between">
              Pending Approvals <ShieldAlert className="w-4 h-4 text-warning" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-warning">{pendingUsers.length}</div>
            <p className="text-xs text-text-muted mt-1">Awaiting UPI payment check</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center justify-between">
              Total Revenue <Sparkles className="w-4 h-4 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-text-primary">₹{totalRevenue}</div>
            <p className="text-xs text-text-muted mt-1">Estimated platform worth</p>
          </CardContent>
        </Card>
      </div>

      {/* Manual Verification Overrides */}
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>User Subscriptions &amp; Verifications Override</CardTitle>
            <CardDescription>Manually upgrade user tiers or confirm dynamic checks.</CardDescription>
            <div className="mt-4 max-w-md">
              <Input
                placeholder="Search user email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-text-muted text-center py-8">No registered users found matching description.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-elevated text-xs font-bold text-text-secondary uppercase border-b border-border">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Downloads</th>
                      <th className="p-4">Current Plan</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-surface-elevated/40">
                        <td className="p-4 font-semibold text-text-primary">{u.full_name || "Unnamed"}</td>
                        <td className="p-4 text-text-secondary">{u.email}</td>
                        <td className="p-4 text-text-secondary">{u.total_resume_downloads || 0}</td>
                        <td className="p-4">
                          <Badge
                            variant={
                              u.plan === "premium"
                                ? "success"
                                : u.plan === "pro"
                                ? "default"
                                : "outline"
                            }
                          >
                            {u.plan.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          {actionId === u.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-accent" />
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-success border-success/30 hover:bg-success/5"
                                onClick={() => handleUpdatePlan(u.id, "pro", "approve")}
                              >
                                Upgrade Pro
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-accent border-accent/30 hover:bg-accent/5"
                                onClick={() => handleUpdatePlan(u.id, "premium", "approve")}
                              >
                                Upgrade Prem
                              </Button>
                              {u.plan !== "free" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-danger hover:bg-danger/5"
                                  onClick={() => handleUpdatePlan(u.id, "free", "reject")}
                                >
                                  Reset
                                </Button>
                              )}
                            </>
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
    </div>
  );
}
