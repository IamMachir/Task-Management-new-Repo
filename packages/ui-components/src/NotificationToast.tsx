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

const VARIANT_STYLES: Record<ToastVariant, { container: string; icon: React.ReactNode }> = {
  success: {
    container: "bg-green-50 border-green-200 text-green-800",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-green-500 shrink-0">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-blue-500 shrink-0">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 text-yellow-800",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-yellow-500 shrink-0">
        <path d="M8 2L14 13H2L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 6v3M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-red-500 shrink-0">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (duration <= 0) return;
    const hideTimer = setTimeout(() => dismiss(), duration);
    return () => clearTimeout(hideTimer);
  }, [duration]);

  function dismiss() {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 300);
  }

  if (!isVisible && !isLeaving) return null;

  const styles = VARIANT_STYLES[variant];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 shadow-md text-sm transition-all duration-300",
        styles.container,
        isLeaving
          ? "opacity-0 translate-y-2 scale-95"
          : "opacity-100 translate-y-0 scale-100",
        className,
      )}
    >
      {styles.icon}
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold leading-none mb-1">{title}</p>}
        <p className="leading-snug">{message}</p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity focus:outline-none"
        aria-label="Dismiss notification"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
