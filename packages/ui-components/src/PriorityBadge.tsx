"use client";
import React from "react";
import { cn } from "./utils";

export type Priority = "urgent" | "high" | "medium" | "low";

const CONFIG: Record<Priority, { label: string; className: string }> = {
  urgent: { label: "Urgent", className: "bg-red-500 text-white border border-red-600" },
  high: { label: "High", className: "bg-red-100 text-red-700 border border-red-200" },
  medium: { label: "Medium", className: "bg-yellow-100 text-yellow-700 border border-yellow-200" },
  low: { label: "Low", className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
};

export interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
  showDot?: boolean;
}

export function PriorityBadge({ priority, className, showDot = true }: PriorityBadgeProps) {
  const { label, className: cls } = CONFIG[priority];
  const dotColors: Record<Priority, string> = {
    urgent: "bg-red-600",
    high: "bg-red-500",
    medium: "bg-yellow-400",
    low: "bg-emerald-500",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium", cls, className)}>
      {showDot && <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[priority])} />}
      {label}
    </span>
  );
}
