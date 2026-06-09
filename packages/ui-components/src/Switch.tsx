"use client";
import React, { useId } from "react";
import { cn } from "./utils";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function Switch({ checked, onChange, label, disabled = false, size = "md", className }: SwitchProps) {
  const id = useId();

  const trackSize = size === "sm"
    ? "w-8 h-4"
    : "w-11 h-6";

  const thumbSize = size === "sm"
    ? "w-3 h-3 top-0.5 left-0.5"
    : "w-4 h-4 top-1 left-1";

  const thumbTranslate = size === "sm"
    ? "translate-x-4"
    : "translate-x-5";

  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex items-center gap-2",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className
      )}
    >
      <div className={cn("relative inline-block flex-shrink-0", trackSize)}>
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={cn(
            "block rounded-full transition-colors duration-200",
            trackSize,
            checked ? "bg-indigo-500" : "bg-slate-200"
          )}
        />
        <div
          className={cn(
            "absolute bg-white rounded-full shadow transition-transform duration-200",
            thumbSize,
            checked && thumbTranslate
          )}
        />
      </div>
      {label && (
        <span className="text-sm font-medium text-slate-700 select-none">{label}</span>
      )}
    </label>
  );
}
