"use client";
import React from "react";
import { cn } from "./utils";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import { UserAvatar } from "./UserAvatar";
import { TaskTag, getTagColor } from "./TaskTag";
import type { Priority, Status } from "./PriorityBadge";

export interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: string;
  assignee?: { name: string; src?: string };
  tags?: string[];
  progress?: number;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isDragging?: boolean;
  className?: string;
}

export function TaskCard({
  title,
  description,
  priority,
  status,
  dueDate,
  assignee,
  tags,
  progress,
  onClick,
  onEdit,
  onDelete,
  isDragging,
  className,
}: TaskCardProps) {
  const isOverdue = dueDate && new Date(dueDate) < new Date() && status !== "done";
  const dueFmt = dueDate
    ? new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-100 p-4 shadow-sm cursor-pointer group",
        "hover:shadow-md hover:border-indigo-100 transition-all duration-150",
        isDragging && "rotate-1 shadow-xl border-indigo-300 scale-105",
        status === "done" && "opacity-70",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className={cn("text-sm font-semibold text-slate-800 leading-snug flex-1", status === "done" && "line-through text-slate-400")}>
          {title}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              title="Edit"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"
              title="Delete"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {description && (
        <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">{description}</p>
      )}

      {typeof progress === "number" && (
        <div className="mt-2.5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400">Progress</span>
            <span className="text-xs font-medium text-slate-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <TaskTag key={tag} label={tag} color={getTagColor(tag)} />
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <PriorityBadge priority={priority} />
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-2">
          {dueFmt && (
            <span className={cn("text-xs font-medium", isOverdue ? "text-red-600" : "text-slate-400")}>
              {isOverdue ? "⚠ " : "📅 "}{dueFmt}
            </span>
          )}
          {assignee && <UserAvatar name={assignee.name} src={assignee.src} size="sm" showTooltip />}
        </div>
      </div>
    </div>
  );
}
