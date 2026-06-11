"use client";

import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "./utils";

export interface SkeletonLoaderProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const SkeletonLoader = forwardRef<HTMLDivElement, SkeletonLoaderProps>(
  ({ className, width = "w-full", height = "h-4", circle = false, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "animate-pulse rounded-md bg-slate-200",
        circle && "rounded-full",
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  )
);
SkeletonLoader.displayName = "SkeletonLoader";

export function SkeletonGroup({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLoader key={i} />
      ))}
    </div>
  );
}
