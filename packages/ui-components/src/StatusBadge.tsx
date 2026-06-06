"use client";
import React from "react";
import { cn } from "./utils";

export type Status = "todo" | "in-progress" | "done" | "cancelled";

const CONFIG: Record<Status, { label: string; className: string; dot: string }> = {
  todo: { label: "To Do", className: "bg-slate-100 text-slate-600 border border-slate-200", dot: "bg-slate-400" },
  "in-progress": { label: "In Progress", className: "bg-blue-100 text-blue-700 border border-blue-200", dot: "bg-blue-500" },
  done: { label: "Done", className: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-500 border border-gray-200", dot: "bg-gray-400" },
};

export interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, className: cls, dot } = CONFIG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium", cls, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}
