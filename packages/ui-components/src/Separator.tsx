"use client";
import React from "react";
import { cn } from "./utils";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative: _decorative = true, ...props }, ref) => {
    const isDecorative = _decorative;

    return (
      <div
        ref={ref}
        role={isDecorative ? undefined : "separator"}
        aria-hidden={isDecorative ? true : undefined}
        aria-orientation={isDecorative ? undefined : orientation}
        className={cn(
          "shrink-0 bg-slate-200",
          orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
          className
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = "Separator";
