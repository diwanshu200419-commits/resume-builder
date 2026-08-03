"use client";

import { useEffect, useState } from "react";
import { Bell, X, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NotificationBar() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [closed, setClosed] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) setNotifications(data.notifications);
      })
      .catch(() => {});
  }, []);

  const visibleNotifications = notifications.filter(n => !closed.includes(n.id));

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="space-y-3">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border border-accent/20 bg-accent/5 overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 shrink-0">
              {notification.type === 'trend' ? (
                <Sparkles className="w-4 h-4 text-accent" />
              ) : (
                <Bell className="w-4 h-4 text-accent" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-text-primary leading-relaxed break-word-safe">
                {notification.message}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-accent/10 shrink-0">
            <Link href={notification.link} className="w-full sm:w-auto">
              <Button variant="ghost" size="sm" className="w-full sm:w-auto h-8 gap-1.5 text-xs text-accent hover:text-accent hover:bg-accent/10 font-bold">
                {notification.cta} <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
            <button
              onClick={() => setClosed([...closed, notification.id])}
              className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
