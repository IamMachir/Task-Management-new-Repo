"use client";
import React from "react";
import { cn } from "./utils";
import type { TaskCardProps } from "./TaskCard";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "./EmptyState";

import type { Status } from "./StatusBadge";

const COLUMN_STYLES: Record<Status, { header: string; dot: string; label: string }> = {
  todo: { header: "border-slate-200", dot: "bg-slate-400", label: "To Do" },
  "in-progress": { header: "border-blue-200", dot: "bg-blue-500", label: "In Progress" },
  done: { header: "border-emerald-200", dot: "bg-emerald-500", label: "Done" },
  cancelled: { header: "border-rose-200", dot: "bg-rose-500", label: "Cancelled" },
};

export interface KanbanColumnProps {
  status: Status;
  title?: string;
  tasks: TaskCardProps[];
  onAddTask?: () => void;
  onDragOver?: (e: React.DragEvent, status: Status) => void;
  onDrop?: (e: React.DragEvent, status: Status) => void;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  draggingId?: string | null;
  className?: string;
}

export function KanbanColumn({
  status,
  title,
  tasks,
  onAddTask,
  onDragOver,
  onDrop,
  onDragStart,
  onEditTask,
  onDeleteTask,
  draggingId,
  className,
}: KanbanColumnProps) {
  const { header, dot, label } = COLUMN_STYLES[status];

  return (
    <div
      className={cn(
        "flex flex-col min-h-[500px] w-80 flex-shrink-0 bg-slate-50 rounded-2xl border-2 transition-colors",
        header,
        className
      )}
      onDragOver={(e) => { e.preventDefault(); onDragOver?.(e, status); }}
      onDrop={(e) => onDrop?.(e, status)}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className={cn("w-2.5 h-2.5 rounded-full", dot)} />
          <h3 className="text-sm font-bold text-slate-700">{title ?? label}</h3>
          <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-500 text-xs font-semibold rounded-full">
            {tasks.length}
          </span>
        </div>
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 transition-colors"
            title="Add task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks"
            description="Drop tasks here or click + to add"
            className="py-10"
          />
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart?.(e, task.id)}
              className="cursor-grab active:cursor-grabbing"
            >
              <TaskCard
                {...task}
                isDragging={draggingId === task.id}
                onEdit={onEditTask ? () => onEditTask(task.id) : undefined}
                onDelete={onDeleteTask ? () => onDeleteTask(task.id) : undefined}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
