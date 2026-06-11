"use client";

import { cn } from "./utils";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (v: boolean) => void;
  className?: string;
}

export function Switch({ checked = false, onChange, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Toggle switch"
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative inline-flex h-6 w-10 items-center rounded-full transition-colors",
        checked ? "bg-indigo-500" : "bg-slate-200",
        className
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-4" : "translate-x-1"
        )}
      />
    </button>
  );
}

export default Switch;
