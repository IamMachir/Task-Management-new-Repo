"use client";
import React from "react";
import { cn } from "./utils";
import { Button } from "./Button";

export interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", variant === "danger" ? "bg-red-100" : "bg-indigo-100")}>
          {variant === "danger" ? (
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-slate-500">{description}</p>}
        <div className="mt-5 flex gap-3 justify-end">
          <Button variant="secondary" size="sm" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={variant} size="sm" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
