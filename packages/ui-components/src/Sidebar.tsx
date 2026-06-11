"use client";
import React from "react";
import { cn } from "./utils";

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  href?: string;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  activeId?: string;
  onSelect?: (id: string) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Sidebar({ sections, activeId, onSelect, header, footer, className }: SidebarProps) {
  return (
    <aside className={cn("flex flex-col w-64 h-full bg-slate-900 text-white", className)}>
      {header && <div className="px-4 py-5 border-b border-slate-700/50">{header}</div>}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {sections.map((section, si) => (
          <div key={si}>
            {section.title && (
              <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onSelect?.(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      activeId === item.id
                        ? "bg-indigo-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge !== undefined && (
                    <span 
                      suppressHydrationWarning
                      className={cn("px-1.5 py-0.5 rounded-full text-[10px] font-black tracking-tighter", activeId === item.id ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400")}
                    >
                      {item.badge}
                    </span>
                  )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      {footer && <div className="px-4 py-4 border-t border-slate-700/50">{footer}</div>}
    </aside>
  );
}
