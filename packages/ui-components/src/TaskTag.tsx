"use client";
import * as React from "react";
import { cn } from "./utils";

export const TAG_COLOR_MAP = {
  red:    { bg: "bg-red-100",    text: "text-red-700",    border: "border-red-200" },
  orange: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
  green:  { bg: "bg-green-100",  text: "text-green-700",  border: "border-green-200" },
  blue:   { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-200" },
  purple: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  pink:   { bg: "bg-pink-100",   text: "text-pink-700",   border: "border-pink-200" },
  gray:   { bg: "bg-gray-100",   text: "text-gray-600",   border: "border-gray-200" },
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
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all",
        colors.bg,
        colors.text,
        colors.border,
        className,
      )}
      {...props}
    >
      {label || "General"}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-black/10 focus:outline-none"
          aria-label={`Remove tag ${label}`}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}
