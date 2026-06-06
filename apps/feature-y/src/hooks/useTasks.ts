"use client";
import { useState, useCallback, useEffect } from "react";
import type { Task, Habit } from "@cbsd/utils";
import {
  generateId, loadFromStorage, saveToStorage,
  PERSONALFOCUS_KEYS, getTaskStatsByStatus,
  calculateCompletionPercentage, calculateProductivityScore,
  filterTasks, getTasksDueToday,
} from "@cbsd/utils";
import { MOCK_PERSONAL_TASKS, MOCK_HABITS } from "../data/mockData";

export function usePersonalTasks() {
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadFromStorage<Task[]>(PERSONALFOCUS_KEYS.TASKS, MOCK_PERSONAL_TASKS)
  );
  const [habits, setHabits] = useState<Habit[]>(() =>
    loadFromStorage<Habit[]>(PERSONALFOCUS_KEYS.HABITS, MOCK_HABITS)
  );

  useEffect(() => { saveToStorage(PERSONALFOCUS_KEYS.TASKS, tasks); }, [tasks]);
  useEffect(() => { saveToStorage(PERSONALFOCUS_KEYS.HABITS, habits); }, [habits]);

  const addTask = useCallback((data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const t: Task = { ...data, id: generateId("pt"), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setTasks((prev) => [t, ...prev]);
    return t;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTaskDone = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) =>
      t.id === id
        ? { ...t, status: t.status === "done" ? "todo" : "done", updatedAt: new Date().toISOString() }
        : t
    ));
  }, []);

  const toggleHabit = useCallback((habitId: string, date: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const existing = h.entries.find((e) => e.date === date);
        const entries = existing
          ? h.entries.map((e) => e.date === date ? { ...e, completed: !e.completed } : e)
          : [...h.entries, { date, completed: true }];
        const streak = entries.filter((e) => e.completed).length;
        return { ...h, entries, streak };
      })
    );
  }, []);

  const todayTasks = getTasksDueToday(tasks);
  const stats = getTaskStatsByStatus(tasks);
  const completion = calculateCompletionPercentage(tasks);
  const score = calculateProductivityScore(tasks);

  return {
    tasks, habits,
    addTask, updateTask, deleteTask, toggleTaskDone, toggleHabit,
    todayTasks, stats, completion, score,
    filterTasks: (opts: Parameters<typeof filterTasks>[1]) => filterTasks(tasks, opts),
  };
}
