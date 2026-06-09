"use client";
import React from "react";
import { cn } from "./utils";

export interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

export function Skeleton({ className, rounded = "md" }: SkeletonProps) {
  const roundedMap = {
    sm:   "rounded",
    md:   "rounded-md",
    lg:   "rounded-xl",
    full: "rounded-full",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-slate-200",
        roundedMap[rounded],
        className
      )}
    />
  );
}
