"use client";
import * as React from "react";
import { cn } from "./utils";

export const TAG_COLOR_MAP = {
  red:    { bg: "bg-red-500",    text: "text-white",        dot: "bg-red-200",    hover: "hover:bg-red-600" },
  orange: { bg: "bg-orange-500", text: "text-white",        dot: "bg-orange-200", hover: "hover:bg-orange-600" },
  yellow: { bg: "bg-yellow-400", text: "text-yellow-950",   dot: "bg-yellow-200", hover: "hover:bg-yellow-500" },
  green:  { bg: "bg-emerald-500",text: "text-white",        dot: "bg-emerald-200",hover: "hover:bg-emerald-600" },
  blue:   { bg: "bg-blue-500",   text: "text-white",        dot: "bg-blue-200",   hover: "hover:bg-blue-600" },
  purple: { bg: "bg-violet-600", text: "text-white",        dot: "bg-violet-200", hover: "hover:bg-violet-700" },
  pink:   { bg: "bg-pink-500",   text: "text-white",        dot: "bg-pink-200",   hover: "hover:bg-pink-600" },
  gray:   { bg: "bg-slate-500",  text: "text-white",        dot: "bg-slate-300",  hover: "hover:bg-slate-600" },
} as const;

export type TagColor = keyof typeof TAG_COLOR_MAP;

const TAG_COLORS = Object.keys(TAG_COLOR_MAP) as TagColor[];

/** Deterministic color from a tag label so the same tag always gets the same color. */
export function getTagColor(label: string): TagColor {
  const hash = label.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return TAG_COLORS[hash % TAG_COLORS.length];
}

export interface TaskTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  color?: TagColor;
  onRemove?: () => void;
}

export function TaskTag({ label, color, onRemove, className, ...props }: TaskTagProps) {
  const resolved = color ?? getTagColor(label);
  const colors = TAG_COLOR_MAP[resolved] ?? TAG_COLOR_MAP.gray;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        "shadow-sm select-none transition-colors",
        colors.bg,
        colors.text,
        onRemove && colors.hover,
        className,
      )}
      {...props}
    >
      {/* Dot indicator */}
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", colors.dot)} />
      {label || "General"}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full w-3.5 h-3.5 flex items-center justify-center transition-colors hover:bg-white/20 focus:outline-none"
          aria-label={`Remove tag ${label}`}
        >
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
            <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}
