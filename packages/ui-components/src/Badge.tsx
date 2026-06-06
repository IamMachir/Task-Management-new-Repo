"use client";
import React from "react";
import { cn } from "./utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "outline" | "ghost";
  size?: "xs" | "sm" | "md";
  rounded?: "full" | "md";
}

const VARIANT_MAP = {
  primary: "bg-indigo-100 text-indigo-700 border-indigo-200",
  secondary: "bg-slate-100 text-slate-700 border-slate-200",
  success: "bg-emerald-100 text-emerald-700 border-emerald-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  error: "bg-red-100 text-red-700 border-red-200",
  outline: "bg-transparent text-slate-600 border-slate-200 border",
  ghost: "bg-transparent text-slate-500 border-transparent",
};

const SIZE_MAP = {
  xs: "px-1.5 py-0.5 text-[10px]",
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export function Badge({
  children,
  variant = "secondary",
  size = "sm",
  rounded = "full",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border",
        rounded === "full" ? "rounded-full" : "rounded-md",
        VARIANT_MAP[variant],
        SIZE_MAP[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
