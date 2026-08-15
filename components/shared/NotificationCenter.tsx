"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, BellRing, CheckCircle2, ExternalLink, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

function formatTimestamp(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const supabaseRef = useRef(createClient());
  const channelRef = useRef<any>(null);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) {
        setNotifications([]);
        return;
      }

      const json = await res.json();
      setNotifications(json.notifications || []);
    } catch (error) {
      console.error("[NotificationCenter] Fetch error:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const supabase = supabaseRef.current;

    async function subscribeToUserNotifications() {
      await fetchNotifications();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted || !user) return;

      const channel = supabase
        .channel(`user-notifications-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchNotifications();
          }
        )
        .subscribe();

      channelRef.current = channel;
    }

    subscribeToUserNotifications();

    return () => {
      mounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchNotifications]);

  const markOneRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
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
    } catch (error) {
      console.error("[NotificationCenter] Mark read error:", error);
      fetchNotifications();
    }
  };

  const markAllRead = async () => {
    if (unreadCount === 0) return;

    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );

    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });

      if (!res.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("[NotificationCenter] Mark all read error:", error);
      fetchNotifications();
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="relative p-2 rounded-xl bg-surface border border-border hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-all"
        aria-label="Open notifications"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5 text-accent animate-pulse" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-surface shadow-2xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-text-primary text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-bold">
                    {unreadCount} New
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllRead}
                    className="text-[11px] h-7 px-2 text-text-muted hover:text-text-primary"
                  >
                    Mark read
                  </Button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-text-muted hover:text-text-primary p-1"
                  aria-label="Close notifications"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {loading ? (
                [0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl border border-border bg-surface-elevated/40 animate-pulse"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="h-3 w-32 bg-border/60 rounded" />
                      <div className="h-2 w-12 bg-border/60 rounded shrink-0" />
                    </div>
                    <div className="h-2 w-full bg-border/60 rounded mt-2" />
                    <div className="h-2 w-3/4 bg-border/60 rounded mt-1.5" />
                  </div>
                ))
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center text-text-muted text-xs">
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((notification) => {
                  const isUnread = !notification.read;
                  return (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isUnread
                          ? "bg-accent/5 border-accent/30 text-text-primary"
                          : "bg-surface-elevated/40 border-border text-text-secondary opacity-80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs text-text-primary">{notification.title}</h4>
                        <span className="text-[10px] text-text-muted shrink-0">
                          {formatTimestamp(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed line-clamp-2">
                        {notification.body}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          {notification.link && (
                            <Link
                              href={notification.link}
                              className="text-[11px] font-bold text-accent hover:underline inline-flex items-center gap-1"
                            >
                              View details <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                        {isUnread && (
                          <button
                            onClick={() => markOneRead(notification.id)}
                            className="text-[10px] text-text-muted hover:text-accent inline-flex items-center gap-1 shrink-0"
                            aria-label="Mark notification as read"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-end">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-[11px] h-7 px-3 inline-flex items-center justify-center rounded-md border border-border bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-all"
              >
                View all
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
