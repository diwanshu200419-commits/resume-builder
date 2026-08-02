"use client";

import { useState } from "react";
import { Bell, BellRing, CheckCircle2, Sparkles, X, Trash2, ExternalLink, Briefcase, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "job" | "ats" | "plan" | "interview";
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "🎯 New 95% Matching Role Found!",
    message: "OpenAI posted 'AI Systems Software Engineer' matching your PyTorch and LLM inference skill set.",
    timestamp: "10 mins ago",
    read: false,
    type: "job",
    link: "/applications",
  },
  {
    id: "notif-2",
    title: "⚡ ATS Scan Completed",
    message: "Your resume optimization for Senior Full Stack Engineer achieved a 96% ATS Compatibility Score.",
    timestamp: "1 hour ago",
    read: false,
    type: "ats",
    link: "/dashboard",
  },
  {
    id: "notif-3",
    title: "🎓 New FAANG Internship Alert",
    message: "Google STEP 2026/2027 Software Engineering Internship applications are now live.",
    timestamp: "3 hours ago",
    read: false,
    type: "job",
    link: "/applications",
  },
  {
    id: "notif-4",
    title: "💎 Lifetime Plan Active",
    message: "Your Career Pack subscription is active with zero monthly renewal fees.",
    timestamp: "1 day ago",
    read: true,
    type: "plan",
    link: "/settings",
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleSimulateNewAlert = () => {
    const newAlert: NotificationItem = {
      id: "notif-" + Date.now(),
      title: "🔔 Real-Time AI Job Alert",
      message: "Microsoft Research posted 'AI / ML Research Intern' ($55/hr) matching your resume profile.",
      timestamp: "Just now",
      read: false,
      type: "job",
      link: "/applications",
    };
    setNotifications((prev) => [newAlert, ...prev]);
  };

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
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

      {/* Dropdown Notification Panel */}
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
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-[11px] h-7 px-2 text-text-muted hover:text-text-primary">
                Mark read
              </Button>
              <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text-primary p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of Notifications */}
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-text-muted text-xs">
                <p>No new notifications right now.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border transition-all ${
                    n.read ? "bg-surface-elevated/40 border-border text-text-secondary opacity-75" : "bg-accent/5 border-accent/30 text-text-primary font-medium"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-xs text-text-primary">{n.title}</h4>
                    <span className="text-[10px] text-text-muted shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{n.message}</p>
                  {n.link && (
                    <a href={n.link} className="text-[11px] font-bold text-accent hover:underline mt-2 inline-flex items-center gap-1">
                      View details <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Controls */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handleSimulateNewAlert} className="text-[10px] h-7 gap-1 text-accent border-accent/30">
              <Sparkles className="w-3 h-3 text-accent" /> Test Real-Time Alert
            </Button>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-[10px] h-7 text-rose-400 hover:bg-rose-500/10">
                Clear all
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
