"use client";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", {
  variants: {
    required: {
      true: "after:content-['*'] after:ml-0.5 after:text-red-500",
      false: "",
    },
  },
});

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(labelVariants({ required }), className)}
      {...props}
    />
  )
);
Label.displayName = "Label";
