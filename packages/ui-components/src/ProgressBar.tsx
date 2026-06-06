"use client";
import React from "react";
import { cn } from "./utils";

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "indigo" | "emerald" | "blue" | "amber" | "red";
  className?: string;
}

const COLOR_MAP = {
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  amber: "bg-amber-400",
  red: "bg-red-500",
};

const SIZE_MAP = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  size = "md",
  color = "indigo",
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-slate-600 font-medium">{label}</span>}
          {showValue && <span className="text-xs text-slate-500 font-semibold">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={cn("w-full bg-slate-100 rounded-full overflow-hidden", SIZE_MAP[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", COLOR_MAP[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export interface ProgressCircleProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: React.ReactNode;
  className?: string;
}

export function ProgressCircle({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  color = "#6366f1",
  label,
  className,
}: ProgressCircleProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          {label}
        </div>
      )}
    </div>
  );
}
