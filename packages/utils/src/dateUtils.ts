/**
 * Format a date string or Date object into a readable format
 */
export function formatDate(date: string | Date, format: "short" | "long" | "relative" = "short"): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "Invalid date";

  if (format === "relative") {
    return getRelativeTime(d);
  }

  if (format === "long") {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Returns a relative time string (e.g., "2 days ago", "in 3 hours")
 */
export function getRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (Math.abs(diffSeconds) < 60) return "just now";
  if (Math.abs(diffMinutes) < 60) {
    return diffMinutes > 0 ? `in ${diffMinutes}m` : `${Math.abs(diffMinutes)}m ago`;
  }
  if (Math.abs(diffHours) < 24) {
    return diffHours > 0 ? `in ${diffHours}h` : `${Math.abs(diffHours)}h ago`;
  }
  if (Math.abs(diffDays) < 7) {
    return diffDays > 0 ? `in ${diffDays}d` : `${Math.abs(diffDays)}d ago`;
  }
  return formatDate(d, "short");
}

/**
 * Check if a date is in the past (overdue)
 */
export function isOverdue(date: string | Date): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return d < new Date();
}

/**
 * Get the number of days until a due date (negative if overdue)
 */
export function daysUntilDue(date: string | Date): number {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Format a date as YYYY-MM-DD for input[type=date]
 */
export function toInputDateString(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}

/**
 * Check if two dates are on the same calendar day
 */
export function isSameDay(a: string | Date, b: string | Date): boolean {
  const da = typeof a === "string" ? new Date(a) : a;
  const db = typeof b === "string" ? new Date(b) : b;
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

/**
 * Get an array of dates for a given week containing the provided date
 */
export function getWeekDates(date: Date = new Date()): Date[] {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

/**
 * Check if a date is today
 */
export function isToday(date: string | Date): boolean {
  return isSameDay(date, new Date());
}
