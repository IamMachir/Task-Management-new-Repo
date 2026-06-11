"use client";
import React from "react";
import { cn } from "./utils";

export interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export function PageLayout({
  children,
  header,
  sidebar,
  footer,
  showSidebar = true,
  className,
}: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {header && (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
          {header}
        </header>
      )}

      <div className="flex flex-1 overflow-hidden">
        {showSidebar && sidebar && (
          <aside className="hidden w-64 border-r border-slate-200 bg-white md:block overflow-y-auto">
            {sidebar}
          </aside>
        )}

        <main className={cn("flex-1 overflow-y-auto", className)}>
          {children}
        </main>
      </div>

      {footer && (
        <footer className="border-t border-slate-200 bg-white py-4">
          {footer}
        </footer>
      )}
    </div>
  );
}
