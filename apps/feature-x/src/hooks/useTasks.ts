"use client";
import { useState, useCallback, useEffect } from "react";
import type { Task, FilterOptions } from "@cbsd/utils";
import {
  filterTasks, sortTasks, groupTasksByStatus,
  getTaskStatsByStatus, generateId,
  loadFromStorage, saveToStorage, TEAMFLOW_KEYS,
} from "@cbsd/utils";
import { MOCK_TASKS } from "../data/mockData";

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadFromStorage<Task[]>(TEAMFLOW_KEYS.TASKS, MOCK_TASKS);
    setTasks(saved.length > 0 ? saved : MOCK_TASKS);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveToStorage(TEAMFLOW_KEYS.TASKS, tasks);
    }
  }, [tasks, hydrated]);

  const filtered = projectId ? tasks.filter((t) => t.projectId === projectId) : tasks;

  const addTask = useCallback((data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...data,
      id: generateId("task"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const moveTask = useCallback((id: string, status: Task["status"]) => {
    updateTask(id, { status });
  }, [updateTask]);

  const filterAndSort = useCallback(
    (opts: FilterOptions, sortBy: Parameters<typeof sortTasks>[1] = "priority") => {
      return sortTasks(filterTasks(filtered, opts), sortBy);
    },
    [filtered]
  );

  return {
    tasks: filtered,
    allTasks: tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    filterAndSort,
    stats: getTaskStatsByStatus(filtered),
    grouped: groupTasksByStatus(filtered),
  };
}
