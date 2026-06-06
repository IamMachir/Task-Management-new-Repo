export type Priority = "high" | "medium" | "low";
export type Status = "todo" | "in-progress" | "done" | "cancelled";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: string;
  assigneeId?: string;
  projectId?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface HabitEntry {
  date: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  streak: number;
  entries: HabitEntry[];
  createdAt: string;
}

export interface FilterOptions {
  status?: Status[];
  priority?: Priority[];
  assigneeId?: string;
  projectId?: string;
  search?: string;
  dueBefore?: string;
  dueAfter?: string;
}
