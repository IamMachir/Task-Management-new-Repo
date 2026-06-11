"use client";
import React from "react";
import { cn } from "./utils";
import { UserAvatar } from "./UserAvatar";
import { Badge } from "./Badge";

export interface TaskAssignmentCardProps {
  taskId: string;
  taskTitle: string;
  assignees: Array<{ id: string; name: string; avatar?: string }>;
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  status?: string;
  onAssigneeClick?: (userId: string) => void;
  className?: string;
}

export function TaskAssignmentCard({
  taskId,
  taskTitle,
  assignees,
  priority = "medium",
  dueDate,
  status,
  onAssigneeClick,
  className,
}: TaskAssignmentCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-slate-900 text-sm line-clamp-2">
            {taskTitle}
          </h4>
          <p className="text-xs text-slate-500 mt-1">Task ID: {taskId}</p>
        </div>
        <Badge variant={priority === "urgent" ? "error" : "secondary"} className="flex-shrink-0">
          {priority}
        </Badge>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex -space-x-2">
          {assignees.slice(0, 3).map((assignee) => (
            <button
              key={assignee.id}
              onClick={() => onAssigneeClick?.(assignee.id)}
              className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
              title={assignee.name}
            >
              <UserAvatar
                name={assignee.name}
                src={assignee.avatar}
                size="sm"
              />
            </button>
          ))}
          {assignees.length > 3 && (
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
              +{assignees.length - 3}
            </div>
          )}
        </div>
        {status && (
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
            {status}
          </span>
        )}
      </div>

      {dueDate && (
        <p className="text-xs text-slate-500">Due: {new Date(dueDate).toLocaleDateString()}</p>
      )}
    </div>
  );
}
