"use client";
import React from "react";
import { cn } from "./utils";

export interface TooltipProps {
  content: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function Tooltip({ content, className, children }: TooltipProps) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden -translate-x-1/2 rounded-xl bg-slate-900 px-3 py-2 text-xs text-white shadow-lg transition-opacity duration-150 group-hover:block">
        {content}
      </span>
    </span>
  );
}
