import type { Task, Habit } from "@cbsd/utils";
import { generateId } from "@cbsd/utils";

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function pastDay(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export const MOCK_PERSONAL_TASKS: Task[] = [
  {
    id: generateId("pt"),
    title: "Morning workout",
    description: "30 min cardio + stretching",
    priority: "high",
    status: "done",
    dueDate: daysFromNow(0),
    tags: ["health", "fitness"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId("pt"),
    title: "Read 20 pages of Deep Work",
    description: "Focus on the chapter about deep vs shallow work",
    priority: "medium",
    status: "in-progress",
    dueDate: daysFromNow(0),
    tags: ["learning", "books"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId("pt"),
    title: "Review weekly goals",
    description: "Check progress on quarterly objectives",
    priority: "high",
    status: "todo",
    dueDate: daysFromNow(1),
    tags: ["planning"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId("pt"),
    title: "Learn TypeScript generics",
    description: "Complete the TypeScript handbook chapter on generics",
    priority: "medium",
    status: "todo",
    dueDate: daysFromNow(2),
    tags: ["coding", "learning"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId("pt"),
    title: "Meal prep for the week",
    description: "Prepare 5 healthy lunches and dinners",
    priority: "medium",
    status: "todo",
    dueDate: daysFromNow(1),
    tags: ["health"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId("pt"),
    title: "Update portfolio website",
    description: "Add recent projects and update skills section",
    priority: "low",
    status: "todo",
    dueDate: daysFromNow(7),
    tags: ["career", "coding"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId("pt"),
    title: "Call parents",
    description: "Weekly family check-in",
    priority: "high",
    status: "done",
    dueDate: daysFromNow(0),
    tags: ["family"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId("pt"),
    title: "Journal / reflect on the day",
    priority: "low",
    status: "todo",
    dueDate: daysFromNow(0),
    tags: ["mindfulness"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_HABITS: Habit[] = [
  {
    id: generateId("h"),
    name: "Morning Meditation",
    description: "10 minutes mindfulness",
    streak: 5,
    entries: [
      { date: pastDay(0), completed: true },
      { date: pastDay(1), completed: true },
      { date: pastDay(2), completed: true },
      { date: pastDay(3), completed: true },
      { date: pastDay(4), completed: true },
      { date: pastDay(5), completed: false },
      { date: pastDay(6), completed: true },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId("h"),
    name: "Daily Exercise",
    description: "At least 30 minutes",
    streak: 3,
    entries: [
      { date: pastDay(0), completed: true },
      { date: pastDay(1), completed: true },
      { date: pastDay(2), completed: true },
      { date: pastDay(3), completed: false },
      { date: pastDay(4), completed: true },
      { date: pastDay(5), completed: true },
      { date: pastDay(6), completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId("h"),
    name: "Read 20 Pages",
    description: "Any book counts",
    streak: 7,
    entries: Array.from({ length: 7 }, (_, i) => ({ date: pastDay(i), completed: true })),
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId("h"),
    name: "No Social Media Before 10AM",
    description: "Protect morning focus",
    streak: 2,
    entries: [
      { date: pastDay(0), completed: true },
      { date: pastDay(1), completed: true },
      { date: pastDay(2), completed: false },
      { date: pastDay(3), completed: true },
      { date: pastDay(4), completed: false },
      { date: pastDay(5), completed: true },
      { date: pastDay(6), completed: true },
    ],
    createdAt: new Date().toISOString(),
  },
];
