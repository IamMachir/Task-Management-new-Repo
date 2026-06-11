"use client";
import React from "react";
import { cn } from "./utils";

export interface AnalyticsCardProps {
  title: string;
  value: string | number;
  label?: string;
  change?: number;
  changeLabel?: string;
  chart?: React.ReactNode;
  icon?: React.ReactNode;
  color?: "indigo" | "emerald" | "blue" | "amber" | "red";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AnalyticsCard({
  title,
  value,
  label,
  change,
  changeLabel,
  chart,
  icon,
  size = "md",
  className,
}: AnalyticsCardProps) {
  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow",
        sizeClasses[size],
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {title}
          </p>
          <p className={cn("font-bold text-slate-900 mt-1", textSizes[size])}>
            {value}
          </p>
        </div>
        {icon && (
          <div className="flex-shrink-0 text-slate-400">
            {icon}
          </div>
        )}
      </div>

      {(label || change) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-slate-500">{label}</span>}
          {change !== undefined && (
            <span
              className={cn(
                "font-semibold",
                change >= 0 ? "text-emerald-600" : "text-red-600"
              )}
            >
              {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
              {changeLabel && <span className="ml-1 text-slate-500">{changeLabel}</span>}
            </span>
          )}
        </div>
      )}

      {chart && <div className="mt-3">{chart}</div>}
    </div>
  );
}
