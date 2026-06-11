"use client";
import React from "react";
import { cn } from "./utils";
import { TaskCard, TaskCardProps } from "./TaskCard";
import { EmptyState } from "./EmptyState";

export interface TaskListProps {
  tasks: TaskCardProps[];
  onTaskClick?: (taskId: string) => void;
  onTaskEdit?: (taskId: string) => void;
  onTaskDelete?: (taskId: string) => void;
  layout?: "list" | "grid";
  loading?: boolean;
  className?: string;
  emptyMessage?: string;
}

export function TaskList({
  tasks,
  onTaskClick,
  layout = "list",
  loading = false,
  className,
  emptyMessage = "No tasks found",
}: TaskListProps) {
  if (loading) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 bg-slate-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div
      className={cn(
        layout === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-3",
        className
      )}
    >
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          {...task}
          onClick={() => onTaskClick?.(task.id as string)}
          className={cn(
            "hover:ring-2 hover:ring-violet-500/20 hover:border-violet-200 transition-all duration-300",
            "w-full text-left"
          )}
        />
      ))}
    </div>
  );
}
