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
      });
  }, []);

  const visibleNotifications = notifications.filter(n => !closed.includes(n.id));

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="space-y-3">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className="relative flex items-center justify-between gap-4 p-4 rounded-xl border border-accent/20 bg-accent/5 overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex p-2 rounded-lg bg-accent/10">
              {notification.type === 'trend' ? (
                <Sparkles className="w-4 h-4 text-accent" />
              ) : (
                <Bell className="w-4 h-4 text-accent" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{notification.message}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={notification.link}>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-accent hover:text-accent hover:bg-accent/10">
                {notification.cta} <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
            <button
              onClick={() => setClosed([...closed, notification.id])}
              className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
