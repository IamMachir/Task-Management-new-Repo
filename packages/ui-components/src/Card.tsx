"use client";
import React from "react";
import { cn } from "./utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("rounded-3xl border border-slate-200 bg-white shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}
