"use client";
import React from "react";
import { Button } from "./Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card";
import { cn } from "./utils";

export interface ReportItem {
  id: string;
  label: string;
  value: string | number;
  description?: string;
  status?: "positive" | "negative" | "neutral";
  trendLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ReportProps {
  title: string;
  subtitle?: string;
  summary?: string;
  items?: ReportItem[];
  actions?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

const STATUS_STYLES: Record<NonNullable<ReportItem["status"]>, string> = {
  positive: "bg-emerald-100 text-emerald-700",
  negative: "bg-red-100 text-red-700",
  neutral: "bg-slate-100 text-slate-700",
};

export function Report({
  title,
  subtitle,
  summary,
  items = [],
  actions,
  emptyMessage = "No report items available.",
  className,
}: ReportProps) {
  return (
    <Card className={cn("space-y-6", className)}>
      <CardHeader className="items-start gap-4">
        <div className="min-w-0 flex-1">
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </div>
        {actions ?? null}
      </CardHeader>

      {summary && <CardContent className="text-sm text-slate-500">{summary}</CardContent>}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8 text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                  {item.description && <p className="mt-2 text-sm text-slate-500">{item.description}</p>}
                </div>
                {item.status && (
                  <span className={cn("rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]", STATUS_STYLES[item.status])}>
                    {item.status}
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                {item.trendLabel ? <span className="text-xs text-slate-500">{item.trendLabel}</span> : <span className="text-xs text-slate-400">&nbsp;</span>}
                {item.onAction && item.actionLabel && (
                  <Button variant="outline" size="sm" onClick={item.onAction}>
                    {item.actionLabel}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
