"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, BellRing, Check, CheckCheck, ExternalLink, Loader2, CreditCard, MessageSquare, Sparkles, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getTypeIcon(type: string) {
  switch (type) {
    case "payment_approved":
      return <CreditCard className="w-4 h-4 text-emerald-400" />;
    case "payment_rejected":
      return <AlertCircle className="w-4 h-4 text-rose-400" />;
    case "payment_pending":
      return <CreditCard className="w-4 h-4 text-amber-400" />;
    case "feedback_replied":
    case "ticket_reply":
    case "ticket_updated":
    case "ticket_resolved":
      return <MessageSquare className="w-4 h-4 text-indigo-400" />;
    case "scan_complete":
      return <Sparkles className="w-4 h-4 text-amber-400" />;
    case "admin_announcement":
    case "admin_broadcast":
      return <Zap className="w-4 h-4 text-accent" />;
    default:
      return <Bell className="w-4 h-4 text-accent" />;
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.notifications || []);
      }
    } catch (e) {
      console.error("[NotificationsPage] fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkOneRead = async (id: string) => {
    const current = notifications.find((n) => n.id === id);
    if (!current || current.read) return;

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        fetchNotifications();
      }
    } catch (e) {
      console.error("[NotificationsPage] mark read error:", e);
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0 || markingAll) return;
    setMarkingAll(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (!res.ok) {
        fetchNotifications();
      }
    } catch (e) {
      console.error("[NotificationsPage] mark all read error:", e);
      fetchNotifications();
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
            <Bell className="w-7 h-7 text-accent" />
            Notifications
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Payment updates, scan results, and important account alerts.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="shrink-0 text-xs font-semibold gap-1.5"
          >
            {markingAll ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCheck className="w-3.5 h-3.5" />
            )}
            Mark all read
          </Button>
        )}
      </div>

      {!loading && unreadCount > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/5 border border-accent/20">
          <BellRing className="w-4 h-4 text-accent animate-pulse shrink-0" />
          <span className="text-sm font-semibold text-accent">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-2xl border border-border bg-surface animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-border/40 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-48 bg-border/40 rounded" />
                  <div className="h-2 w-full bg-border/40 rounded" />
                  <div className="h-2 w-2/3 bg-border/40 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-text-muted opacity-40" />
            </div>
            <p className="font-bold text-text-primary">No notifications yet</p>
            <p className="text-sm text-text-muted mt-1">
              Updates on your ATS scans, payments, and account activity will appear here.
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            const isUnread = !n.read;
            return (
              <div
                key={n.id}
                onClick={() => handleMarkOneRead(n.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleMarkOneRead(n.id);
                  }
                }}
                role={isUnread ? "button" : undefined}
                tabIndex={isUnread ? 0 : undefined}
                className={`group p-4 rounded-2xl border transition-all ${
                  isUnread
                    ? "bg-accent/5 border-accent/25 hover:bg-accent/10 cursor-pointer"
                    : "bg-surface border-border hover:bg-surface-elevated/50 opacity-80"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-elevated border border-border flex items-center justify-center shrink-0 mt-0.5">
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <p className={`font-bold text-sm truncate ${isUnread ? "text-text-primary" : "text-text-secondary"}`}>
                          {n.title}
                        </p>
                        {isUnread && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                      </div>
                      <span className="text-[11px] text-text-muted font-mono shrink-0 mt-0.5">
                        {formatTimestamp(n.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{n.body}</p>
                    <div className="flex items-center justify-between pt-1.5 gap-2">
                      <div>
                        {n.link && (
                          <Link
                            href={n.link}
                            className="text-[11px] font-bold text-accent hover:underline inline-flex items-center gap-1"
                          >
                            View details <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                      {isUnread && (
                        <button
                          onClick={() => handleMarkOneRead(n.id)}
                          className="text-[11px] text-text-muted hover:text-accent inline-flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Mark as read"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {!loading && notifications.length > 0 && (
        <p className="text-center text-[11px] text-text-muted pb-4">
          Showing the last {notifications.length} notification{notifications.length !== 1 ? "s" : ""}.
        </p>
      )}
    </div>
  );
}
