import * as React from "react";
import { cn } from "./utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, size = "md", className }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  const sizeClass = size === "sm" ? "max-w-xl" : size === "lg" ? "max-w-4xl" : "max-w-2xl";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200",
          sizeClass,
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            {title ? <h2 id="modal-title" className="text-lg font-semibold text-slate-900">{title}</h2> : null}
            {description ? <p id="modal-description" className="mt-1 text-sm text-slate-500">{description}</p> : null}
          </div>
          <button
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            type="button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
