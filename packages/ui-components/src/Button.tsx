"use client";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-400 shadow-sm",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400",
        success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm",
        outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-400",
      },
      size: {
        sm: "text-xs px-3 py-1.5 h-7",
        md: "text-sm px-4 py-2 h-9",
        lg: "text-base px-6 py-2.5 h-11",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";
