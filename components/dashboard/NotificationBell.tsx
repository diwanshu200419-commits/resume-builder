"use client";

import { useEffect, useState } from "react";
import { Bell, Check, CheckCheck, ExternalLink, Sparkles, AlertCircle, CreditCard, MessageSquare, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  link?: string | null;
  read_at?: string | null;
  created_at: string;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.notifications || []);
        setUnreadCount(json.unreadCount || 0);
      }
    } catch (e) {
      console.error("[NotificationBell] Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel(`user-notifications-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    })();
  }, []);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
    setUnreadCount(0);

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "payment_approved":
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case "payment_rejected":
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case "feedback_replied":
        return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      case "scan_complete":
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case "admin_announcement":
        return <Zap className="w-4 h-4 text-accent" />;
      default:
        return <Bell className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-surface shadow-2xl z-50 overflow-hidden animate-in zoom-in-95">
            <div className="p-3.5 border-b border-border flex items-center justify-between bg-surface-elevated">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-text-primary">Notifications</span>
                {unreadCount > 0 && (
                  <Badge className="bg-accent/20 text-accent border-accent/30 text-[10px] font-bold">
                    {unreadCount} Unread
                  </Badge>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] text-accent hover:underline font-semibold flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-border scrollbar-none">
              {loading ? (
                <div className="p-6 text-center text-xs text-text-muted">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-text-muted space-y-1">
                  <Bell className="w-8 h-8 mx-auto text-text-muted opacity-40 mb-2" />
                  <p className="font-bold text-text-primary">No notifications yet</p>
                  <p>Updates on your ATS scans and payments will appear here.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3.5 text-xs transition-colors hover:bg-surface-elevated/60 cursor-pointer ${
                      !n.read_at ? "bg-accent/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-surface-elevated border border-border shrink-0 mt-0.5">
                        {getTypeIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-bold text-xs truncate ${!n.read_at ? "text-text-primary" : "text-text-secondary"}`}>
                            {n.title}
                          </p>
                          {!n.read_at && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                        </div>
                        <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">{n.body}</p>
                        <div className="flex items-center justify-between pt-1 text-[10px] text-text-muted font-mono">
                          <span>{new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          {n.link && (
                            <Link href={n.link} className="text-accent hover:underline font-sans font-semibold flex items-center gap-0.5">
                              View details <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
