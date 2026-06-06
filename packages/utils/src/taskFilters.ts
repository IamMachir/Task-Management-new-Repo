import type { Task, FilterOptions, Priority, Status } from "./types";

/**
 * Filter tasks by multiple criteria
 */
export function filterTasks(tasks: Task[], filters: FilterOptions): Task[] {
  return tasks.filter((task) => {
    if (filters.status?.length && !filters.status.includes(task.status)) return false;
    if (filters.priority?.length && !filters.priority.includes(task.priority)) return false;
    if (filters.assigneeId && task.assigneeId !== filters.assigneeId) return false;
    if (filters.projectId && task.projectId !== filters.projectId) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(q);
      const matchesDesc = task.description?.toLowerCase().includes(q) ?? false;
      const matchesTags = task.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
      if (!matchesTitle && !matchesDesc && !matchesTags) return false;
    }
    if (filters.dueBefore && task.dueDate) {
      if (new Date(task.dueDate) > new Date(filters.dueBefore)) return false;
    }
    if (filters.dueAfter && task.dueDate) {
      if (new Date(task.dueDate) < new Date(filters.dueAfter)) return false;
    }
    return true;
  });
}

/**
 * Sort tasks by a field
 */
export function sortTasks(
  tasks: Task[],
  by: "priority" | "dueDate" | "createdAt" | "title" | "status",
  dir: "asc" | "desc" = "asc"
): Task[] {
  const PRIORITY_ORDER: Record<Priority, number> = { high: 1, medium: 2, low: 3 };
  const STATUS_ORDER: Record<Status, number> = {
    "in-progress": 1,
    todo: 2,
    done: 3,
    cancelled: 4,
  };

  return [...tasks].sort((a, b) => {
    let result = 0;
    if (by === "priority") {
      result = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    } else if (by === "status") {
      result = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    } else if (by === "dueDate") {
      if (!a.dueDate && !b.dueDate) result = 0;
      else if (!a.dueDate) result = 1;
      else if (!b.dueDate) result = -1;
      else result = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (by === "createdAt") {
      result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (by === "title") {
      result = a.title.localeCompare(b.title);
    }
    return dir === "asc" ? result : -result;
  });
}

/**
 * Group tasks by status
 */
export function groupTasksByStatus(tasks: Task[]): Record<Status, Task[]> {
  return tasks.reduce(
    (acc, task) => {
      acc[task.status].push(task);
      return acc;
    },
    { todo: [], "in-progress": [], done: [], cancelled: [] } as Record<Status, Task[]>
  );
}

/**
 * Group tasks by project
 */
export function groupTasksByProject(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce(
    (acc, task) => {
      const key = task.projectId ?? "unassigned";
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    },
    {} as Record<string, Task[]>
  );
}

/**
 * Get tasks due today
 */
export function getTasksDueToday(tasks: Task[]): Task[] {
  const today = new Date().toDateString();
  return tasks.filter((t) => t.dueDate && new Date(t.dueDate).toDateString() === today);
}

/**
 * Get overdue tasks
 */
export function getOverdueTasks(tasks: Task[]): Task[] {
  const now = new Date();
  return tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "done" && t.status !== "cancelled"
  );
}
