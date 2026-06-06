import type { Status } from "./types";

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

const STATUS_CONFIG: Record<Status, StatusConfig> = {
  todo: {
    label: "To Do",
    color: "text-slate-700",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-200",
    icon: "⬜",
  },
  "in-progress": {
    label: "In Progress",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: "🔵",
  },
  done: {
    label: "Done",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: "✅",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
    icon: "❌",
  },
};

export function getStatusConfig(status: Status): StatusConfig {
  return STATUS_CONFIG[status];
}

export function getStatusLabel(status: Status): string {
  return STATUS_CONFIG[status].label;
}

export function getStatusColor(status: Status): string {
  return STATUS_CONFIG[status].color;
}

export function getStatusBgColor(status: Status): string {
  return STATUS_CONFIG[status].bgColor;
}

export function isCompleted(status: Status): boolean {
  return status === "done";
}

export function isActive(status: Status): boolean {
  return status === "todo" || status === "in-progress";
}

export const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Cancelled" },
];

export const KANBAN_COLUMNS: Status[] = ["todo", "in-progress", "done"];
