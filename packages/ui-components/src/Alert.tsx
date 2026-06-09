"use client";
import React from "react";
import { cn } from "./utils";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
}

const STYLES: Record<AlertVariant, { wrap: string; icon: string; title: string }> = {
  info:    { wrap: "bg-blue-50 border-blue-200 text-blue-800",    icon: "ℹ️",  title: "text-blue-900" },
  success: { wrap: "bg-emerald-50 border-emerald-200 text-emerald-800", icon: "✅", title: "text-emerald-900" },
  warning: { wrap: "bg-amber-50 border-amber-200 text-amber-800",  icon: "⚠️",  title: "text-amber-900" },
  error:   { wrap: "bg-red-50 border-red-200 text-red-800",        icon: "❌",  title: "text-red-900" },
};

export function Alert({ variant = "info", title, children, className, onDismiss }: AlertProps) {
  const s = STYLES[variant];
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-xl border px-4 py-3 text-sm",
        s.wrap,
        className
      )}
    >
      <span className="text-base flex-shrink-0 mt-0.5">{s.icon}</span>
      <div className="flex-1 min-w-0">
        {title && <p className={cn("font-bold mb-0.5", s.title)}>{title}</p>}
        <div>{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity text-xs font-bold"
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  );
}
