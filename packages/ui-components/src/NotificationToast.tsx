"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "./utils";

export type ToastVariant = "success" | "info" | "warning" | "error";

export interface NotificationToastProps {
  message: string;
  title?: string;
  variant?: ToastVariant;
  duration?: number;
  onDismiss?: () => void;
  className?: string;
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  { bar: string; iconBg: string; titleColor: string; icon: React.ReactNode }
> = {
  success: {
    bar: "bg-emerald-500",
    iconBg: "bg-emerald-100",
    titleColor: "text-emerald-700",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-emerald-600">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  info: {
    bar: "bg-blue-500",
    iconBg: "bg-blue-100",
    titleColor: "text-blue-700",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-blue-600">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M10 9v5M10 6.5v.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  warning: {
    bar: "bg-amber-500",
    iconBg: "bg-amber-100",
    titleColor: "text-amber-700",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-amber-600">
        <path d="M10 3L18 17H2L10 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M10 8v4M10 14v.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  error: {
    bar: "bg-red-500",
    iconBg: "bg-red-100",
    titleColor: "text-red-700",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-red-600">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
};

export function NotificationToast({
  message,
  title,
  variant = "info",
  duration = 4000,
  onDismiss,
  className,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (duration <= 0) return;
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.max(0, 100 - (elapsed / duration) * 100));
    }, 50);
    const hide = setTimeout(() => dismiss(), duration);
    return () => { clearTimeout(hide); clearInterval(tick); };
  }, [duration]);

  function dismiss() {
    setIsLeaving(true);
    setTimeout(() => { setIsVisible(false); onDismiss?.(); }, 350);
  }

  if (!isVisible && !isLeaving) return null;

  const cfg = VARIANT_CONFIG[variant];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "relative flex items-start gap-3 bg-white rounded-xl border border-slate-200 pl-4 pr-3 pt-3.5 pb-4",
        "shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-1 ring-black/5",
        "overflow-hidden transition-all duration-350 ease-out",
        isLeaving
          ? "opacity-0 translate-x-4 scale-95"
          : "opacity-100 translate-x-0 scale-100",
        className,
      )}
    >
      {/* Left accent bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-xl", cfg.bar)} />

      {/* Icon */}
      <div className={cn("shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5", cfg.iconBg)}>
        {cfg.icon}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className={cn("text-sm font-bold leading-tight mb-0.5", cfg.titleColor)}>{title}</p>
        )}
        <p className="text-sm text-slate-600 leading-snug">{message}</p>
      </div>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 mt-0.5 w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
        aria-label="Dismiss notification"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 rounded-b-xl overflow-hidden">
          <div
            className={cn("h-full rounded-b-xl transition-none", cfg.bar, "opacity-60")}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
