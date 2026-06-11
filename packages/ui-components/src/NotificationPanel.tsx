"use client";
import React, { useState } from "react";
import { cn } from "./utils";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onDismiss?: (notificationId: string) => void;
  onActionClick?: (notificationId: string) => void;
  maxVisible?: number;
  className?: string;
}

const typeColors = {
  info: "bg-blue-100 text-blue-800",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-800",
};

const typeIcons = {
  info: "ℹ️",
  success: "✓",
  warning: "⚠️",
  error: "✕",
};

export function NotificationPanel({
  notifications,
  onMarkAsRead,
  onDismiss,
  onActionClick,
  maxVisible = 5,
  className,
}: NotificationPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const displayedNotifications = notifications.slice(0, maxVisible);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className={className}>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="error" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-slate-500">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
            {displayedNotifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "p-3 cursor-pointer transition-colors hover:bg-slate-50",
                  !notif.read && "bg-slate-50"
                )}
                onClick={() => {
                  setExpandedId(expandedId === notif.id ? null : notif.id);
                  if (!notif.read) {
                    onMarkAsRead?.(notif.id);
                  }
                }}
              >
                <div className="flex gap-3">
                  <div
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm",
                      typeColors[notif.type]
                    )}
                  >
                    {typeIcons[notif.type]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-slate-900">
                        {notif.title}
                      </h4>
                      <span className="text-xs text-slate-500 flex-shrink-0">
                        {formatTime(notif.timestamp)}
                      </span>
                    </div>
                    {expandedId === notif.id && (
                      <div className="mt-2 text-sm text-slate-600">
                        <p className="mb-2">{notif.message}</p>
                        <div className="flex gap-2">
                          {notif.actionLabel && (
                            <Button
                              size="sm"
                              onClick={() => onActionClick?.(notif.id)}
                            >
                              {notif.actionLabel}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDismiss?.(notif.id)}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {!notif.read && (
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-600 mt-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
