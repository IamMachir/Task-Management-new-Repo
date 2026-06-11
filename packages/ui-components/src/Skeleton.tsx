"use client";
import React from "react";
import { cn } from "./utils";

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "h-4 w-full rounded bg-slate-200 animate-pulse" }: SkeletonProps) {
  return <div className={cn(className)} aria-hidden />;
}

export default Skeleton;
