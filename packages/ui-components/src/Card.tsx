"use client";
import React from "react";
import { cn } from "./utils";

export type CardVariant = "default" | "outlined" | "elevated" | "ghost";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const VARIANT_STYLES: Record<CardVariant, string> = {
  default:  "bg-white border border-slate-100 shadow-sm",
  outlined: "bg-white border border-slate-200",
  elevated: "bg-white border border-slate-100 shadow-md",
  ghost:    "bg-slate-50 border border-transparent",
};

const PADDING_STYLES: Record<CardPadding, string> = {
  none: "",
  sm:   "p-4",
  md:   "p-6",
  lg:   "p-8",
};

export function Card({ variant = "default", padding = "md", children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl",
        VARIANT_STYLES[variant],
        PADDING_STYLES[padding],
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      {children}
    </div>
  );
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn("text-base font-bold text-slate-900", className)}>
      {children}
    </h3>
  );
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn("text-slate-600", className)}>
      {children}
    </div>
  );
}
