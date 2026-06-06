"use client";
import React from "react";
import { cn } from "./utils";

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label?: string };
  color?: "indigo" | "emerald" | "blue" | "amber" | "red" | "violet";
  className?: string;
}

const ICON_BG: Record<string, string> = {
  indigo: "bg-indigo-100 text-indigo-600",
  emerald: "bg-emerald-100 text-emerald-600",
  blue: "bg-blue-100 text-blue-600",
  amber: "bg-amber-100 text-amber-600",
  red: "bg-red-100 text-red-600",
  violet: "bg-violet-100 text-violet-600",
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "indigo",
  className,
}: StatsCardProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span className={cn("text-xs font-semibold", trend.value >= 0 ? "text-emerald-600" : "text-red-500")}>
                {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              {trend.label && <span className="text-xs text-slate-400">{trend.label}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", ICON_BG[color])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
