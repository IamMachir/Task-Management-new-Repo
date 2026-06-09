"use client";
import React, { useId } from "react";
import { cn } from "./utils";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  indeterminate?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ checked, onChange, label, indeterminate = false, disabled = false, className }: CheckboxProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex items-center gap-2.5",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className
      )}
    >
      <div className="relative flex-shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          ref={(el) => {
            if (el) el.indeterminate = indeterminate;
          }}
          className="sr-only"
        />
        <div
          className={cn(
            "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
            checked || indeterminate
              ? "bg-indigo-500 border-indigo-500"
              : "bg-white border-slate-300 hover:border-indigo-400"
          )}
        >
          {indeterminate ? (
            <span className="block w-2 h-0.5 bg-white rounded-full" />
          ) : checked ? (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-slate-700 select-none">{label}</span>
      )}
    </label>
  );
}
