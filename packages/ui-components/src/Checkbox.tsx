"use client";
import React from "react";
import { cn } from "./utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  size?: "sm" | "md" | "lg";
  color?: "indigo" | "emerald" | "rose";
}

const SIZE_MAP = {
  sm: "w-3.5 h-3.5",
  md: "w-4.5 h-4.5",
  lg: "w-6 h-6",
};

const COLOR_MAP = {
  indigo: "text-indigo-600 focus:ring-indigo-500",
  emerald: "text-emerald-600 focus:ring-emerald-500",
  rose: "text-rose-600 focus:ring-rose-500",
};

export function Checkbox({
  label,
  size = "md",
  color = "indigo",
  className,
  id,
  ...props
}: CheckboxProps) {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <input
        type="checkbox"
        id={checkboxId}
        className={cn(
          "rounded border-slate-300 transition-colors cursor-pointer",
          SIZE_MAP[size],
          COLOR_MAP[color],
        )}
        {...props}
      />
      {label && (
        <label
          htmlFor={checkboxId}
          className={cn(
            "text-slate-700 font-medium cursor-pointer select-none",
            size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}
