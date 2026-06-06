"use client";
import React from "react";
import { cn } from "./utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "bordered" | "flat" | "glass";
  hoverable?: boolean;
}

const PADDING_MAP = {
  none: "p-0",
  sm: "p-3",
  md: "p-6",
  lg: "p-8",
};

const VARIANT_MAP = {
  default: "bg-white shadow-sm border border-slate-200",
  bordered: "bg-transparent border border-slate-200",
  flat: "bg-slate-50 border-transparent",
  glass: "bg-white/70 backdrop-blur-md border border-white/20",
};

export function Card({
  children,
  padding = "md",
  variant = "default",
  hoverable = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-200",
        PADDING_MAP[padding],
        VARIANT_MAP[variant],
        hoverable && "hover:shadow-md hover:translate-y-[-2px] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-4 flex items-center justify-between", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-lg font-bold text-slate-900", className)}>{children}</h3>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-sm text-slate-600", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mt-6 pt-4 border-t border-slate-100", className)}>{children}</div>;
}
