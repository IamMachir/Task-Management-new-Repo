"use client";
import React from "react";
import { cn } from "./utils";

export type BadgeVariant =
  | "primary" | "secondary" | "success" | "error"
  | "warning" | "info" | "ghost";
export type BadgeSize = "xs" | "sm" | "md" | "lg";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  primary:   "bg-indigo-100 text-indigo-700 border-indigo-200",
  secondary: "bg-slate-100 text-slate-600 border-slate-200",
  success:   "bg-emerald-100 text-emerald-700 border-emerald-200",
  error:     "bg-red-100 text-red-700 border-red-200",
  warning:   "bg-amber-100 text-amber-700 border-amber-200",
  info:      "bg-blue-100 text-blue-700 border-blue-200",
  ghost:     "bg-transparent text-slate-500 border-transparent",
};

const SIZE_STYLES: Record<BadgeSize, string> = {
  xs: "px-1.5 py-0.5 text-[10px] rounded",
  sm: "px-2 py-0.5 text-xs rounded-md",
  md: "px-2.5 py-1 text-xs rounded-lg",
  lg: "px-3 py-1.5 text-sm rounded-xl",
};

export function Badge({
  variant = "secondary",
  size = "sm",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold border",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className
      )}
    >
      {children}
    </span>
  );
}
