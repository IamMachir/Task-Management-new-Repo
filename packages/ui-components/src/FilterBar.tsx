"use client";
import React from "react";
import { cn } from "./utils";
import { SearchInput } from "./SearchInput";

export type Priority = "high" | "medium" | "low";
export type Status = "todo" | "in-progress" | "done" | "cancelled";

export interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  selectedPriorities?: Priority[];
  onPriorityChange?: (priorities: Priority[]) => void;
  selectedStatuses?: Status[];
  onStatusChange?: (statuses: Status[]) => void;
  className?: string;
}

const PRIORITY_OPTS: Priority[] = ["high", "medium", "low"];
const STATUS_OPTS: Status[] = ["todo", "in-progress", "done", "cancelled"];

const PRIORITY_LABELS: Record<Priority, string> = { high: "High", medium: "Medium", low: "Low" };
const STATUS_LABELS: Record<Status, string> = {
  todo: "To Do", "in-progress": "In Progress", done: "Done", cancelled: "Cancelled",
};

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

export function FilterBar({
  search, onSearchChange,
  selectedPriorities = [], onPriorityChange,
  selectedStatuses = [], onStatusChange,
  className,
}: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <SearchInput value={search} onChange={onSearchChange} className="w-56" />

      {onPriorityChange && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium">Priority:</span>
          {PRIORITY_OPTS.map((p) => (
            <button
              key={p}
              onClick={() => onPriorityChange(toggle(selectedPriorities, p))}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                selectedPriorities.includes(p)
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
              )}
            >
              {PRIORITY_LABELS[p]}
            </button>
          ))}
        </div>
      )}

      {onStatusChange && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          {STATUS_OPTS.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(toggle(selectedStatuses, s))}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                selectedStatuses.includes(s)
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
              )}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      )}

      {(selectedPriorities.length > 0 || selectedStatuses.length > 0) && (
        <button
          onClick={() => { onPriorityChange?.([]); onStatusChange?.([]); }}
          className="text-xs text-red-500 hover:text-red-700 font-medium"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
