"use client";
import React from "react";
import { cn } from "./utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, id, ...props }, ref) => (
    <label className={cn("flex items-start gap-3 text-sm", className)} htmlFor={id}>
      <input
        id={id}
        ref={ref}
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        {...props}
      />
      <span className="flex flex-col">
        {label && <span className="font-medium text-slate-700">{label}</span>}
        {description && <span className="text-xs text-slate-500">{description}</span>}
      </span>
    </label>
  )
);
Checkbox.displayName = "Checkbox";
