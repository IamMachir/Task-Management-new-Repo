import * as React from "react"
import { cn } from "@/lib/utils"

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  red:    { bg: "bg-red-100",    text: "text-red-700",    border: "border-red-200" },
  orange: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
  green:  { bg: "bg-green-100",  text: "text-green-700",  border: "border-green-200" },
  blue:   { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-200" },
  purple: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  pink:   { bg: "bg-pink-100",   text: "text-pink-700",   border: "border-pink-200" },
  gray:   { bg: "bg-gray-100",   text: "text-gray-600",   border: "border-gray-200" },
}

export interface TaskTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string
  color?: keyof typeof COLOR_MAP
  onRemove?: () => void
}

function TaskTag({ label, color = "gray", onRemove, className, ...props }: TaskTagProps) {
  const colors = COLOR_MAP[color] ?? COLOR_MAP.gray

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
            e.stopPropagation()
            onRemove()
          }}
          className={cn(
            "ml-0.5 rounded-full p-0.5 transition-colors hover:bg-black/10 focus:outline-none",
          )}
          aria-label={`Remove tag ${label}`}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
            <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  )
}

export { TaskTag, COLOR_MAP }
