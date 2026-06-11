"use client";
import React from "react";
import { TaskCard, TaskCardProps } from "./TaskCard";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

export interface RecentTasksWidgetProps {
  tasks: TaskCardProps[];
  title?: string;
  maxItems?: number;
  onViewAll?: () => void;
  onTaskClick?: (taskId: string) => void;
  className?: string;
}

export function RecentTasksWidget({
  tasks,
  title = "Recent Tasks",
  maxItems = 5,
  onViewAll,
  onTaskClick,
  className,
}: RecentTasksWidgetProps) {
  const displayedTasks = tasks.slice(0, maxItems);

  return (
    <Card className={className}>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {tasks.length > maxItems && (
            <button
              onClick={onViewAll}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-200">
          {displayedTasks.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">
              No tasks yet
            </div>
          ) : (
            displayedTasks.map((task, index) => (
              <TaskCard
                key={task.id || index}
                {...task}
                onClick={() => onTaskClick?.(task.id as string)}
                className="border-0 border-b last:border-b-0 rounded-none p-4"
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
