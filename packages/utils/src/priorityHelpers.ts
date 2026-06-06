import type { Priority } from "./types";

export interface PriorityConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  sortOrder: number;
  icon: string;
}

const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  high: {
    label: "High",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    sortOrder: 1,
    icon: "🔴",
  },
  medium: {
    label: "Medium",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    sortOrder: 2,
    icon: "🟡",
  },
  low: {
    label: "Low",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    sortOrder: 3,
    icon: "🟢",
  },
};

export function getPriorityConfig(priority: Priority): PriorityConfig {
  return PRIORITY_CONFIG[priority];
}

export function getPriorityLabel(priority: Priority): string {
  return PRIORITY_CONFIG[priority].label;
}

export function getPriorityColor(priority: Priority): string {
  return PRIORITY_CONFIG[priority].color;
}

export function getPriorityBgColor(priority: Priority): string {
  return PRIORITY_CONFIG[priority].bgColor;
}

export function getPrioritySortOrder(priority: Priority): number {
  return PRIORITY_CONFIG[priority].sortOrder;
}

export function sortByPriority<T extends { priority: Priority }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => getPrioritySortOrder(a.priority) - getPrioritySortOrder(b.priority)
  );
}

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];
