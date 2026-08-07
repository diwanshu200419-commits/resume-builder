"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, BellRing, CheckCircle2, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export interface NotificationItem {
  id: string;
  user_id?: string;
  title: string;
  message: string | null;
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
  return date.toLocaleDateString();
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const supabaseRef = useRef(createClient());
  const channelRef = useRef<any>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    const supabase = supabaseRef.current;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) {
      setNotifications(data as NotificationItem[]);
    }
    setLoading(false);
  };

  const handleMarkAllRead = async () => {
    const supabase = supabaseRef.current;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkOneRead = async (id: string) => {
    const supabase = supabaseRef.current;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAll = async () => {
    const supabase = supabaseRef.current;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const supabase = supabaseRef.current;
      await fetchNotifications();

      if (!mounted) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel("notifications-changes")
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
    };

    init();

    return () => {
      mounted = false;
      const supabase = supabaseRef.current;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-surface border border-border hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-all"
        aria-label="Open In-App Notifications"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5 text-accent animate-pulse" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-surface shadow-2xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-accent" />
              <h3 className="font-bold text-text-primary text-sm">In-App Notifications</h3>
              {unreadCount > 0 && (
                <Badge className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-bold">
                  {unreadCount} New
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-[11px] h-7 px-2 text-text-muted hover:text-text-primary"
              >
                Mark read
              </Button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-text-primary p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {loading ? (
              <>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="p-3 rounded-xl border border-border bg-surface-elevated/40 animate-pulse">
                    <div className="flex items-start justify-between gap-2">
                      <div className="h-3 w-32 bg-border/60 rounded" />
                      <div className="h-2 w-12 bg-border/60 rounded shrink-0" />
                    </div>
                    <div className="h-2 w-full bg-border/60 rounded mt-2" />
                    <div className="h-2 w-3/4 bg-border/60 rounded mt-1.5" />
                  </div>
                ))}
              </>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-text-muted text-xs">
                <p>No notifications yet.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border transition-all ${
                    n.read
                      ? "bg-surface-elevated/40 border-border text-text-secondary opacity-75"
                      : "bg-accent/5 border-accent/30 text-text-primary"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-xs text-text-primary">{n.title}</h4>
                    <span className="text-[10px] text-text-muted shrink-0">
                      {formatTimestamp(n.created_at)}
                    </span>
                  </div>
                  {n.message && (
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">{n.message}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      {n.link && (
                        <a
                          href={n.link}
                          className="text-[11px] font-bold text-accent hover:underline inline-flex items-center gap-1"
                        >
                          View details <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    {!n.read && (
                      <button
                        onClick={() => handleMarkOneRead(n.id)}
                        className="text-[10px] text-text-muted hover:text-accent inline-flex items-center gap-1 shrink-0"
                        aria-label="Mark as read"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <Link
              href="/dashboard"
              className="text-[11px] h-7 px-3 inline-flex items-center justify-center rounded-md border border-border bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-all"
            >
              View all
            </Link>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-[10px] h-7 text-rose-400 hover:bg-rose-500/10"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
