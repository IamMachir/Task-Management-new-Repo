import type { Task, Habit } from "./types";

/**
 * Calculate the completion percentage of a task list
 */
export function calculateCompletionPercentage(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === "done").length;
  return Math.round((done / tasks.length) * 100);
}

/**
 * Get task count breakdown by status
 */
export function getTaskStatsByStatus(tasks: Task[]) {
  return {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    cancelled: tasks.filter((t) => t.status === "cancelled").length,
    overdue: tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done" && t.status !== "cancelled"
    ).length,
  };
}

/**
 * Get task count breakdown by priority
 */
export function getTaskStatsByPriority(tasks: Task[]) {
  return {
    high: tasks.filter((t) => t.priority === "high").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    low: tasks.filter((t) => t.priority === "low").length,
  };
}

/**
 * Calculate the current streak for a habit
 */
export function calculateHabitStreak(habit: Habit): number {
  const sorted = [...habit.entries]
    .filter((e) => e.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sorted.length === 0) return 0;

  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  for (const entry of sorted) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    const diff = Math.round((current.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 1) break;
    streak++;
    current = entryDate;
  }

  return streak;
}

/**
 * Get weekly completion data for charts
 */
export function getWeeklyCompletionData(tasks: Task[]): { day: string; completed: number }[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  return days.map((day, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - now.getDay() + i);
    const dateStr = date.toDateString();
    const completed = tasks.filter(
      (t) => t.status === "done" && t.updatedAt && new Date(t.updatedAt).toDateString() === dateStr
    ).length;
    return { day, completed };
  });
}

/**
 * Calculate productivity score (0-100) based on completed vs total tasks
 */
export function calculateProductivityScore(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const completionRate = calculateCompletionPercentage(tasks);
  const highPriorityDone = tasks.filter(
    (t) => t.priority === "high" && t.status === "done"
  ).length;
  const highPriorityTotal = tasks.filter((t) => t.priority === "high").length;
  const priorityBonus = highPriorityTotal > 0 ? (highPriorityDone / highPriorityTotal) * 20 : 0;
  return Math.min(100, Math.round(completionRate * 0.8 + priorityBonus));
}
