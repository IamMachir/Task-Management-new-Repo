"use client";
import React, { useState } from "react";
import { cn } from "./utils";
import { KanbanColumn, KanbanColumnProps } from "./KanbanColumn";

type Status = "todo" | "in-progress" | "done" | "cancelled";

export interface KanbanBoardColumn extends KanbanColumnProps {
  id: Status;
}

export interface KanbanBoardProps {
  columns: KanbanBoardColumn[];
  onDragEnd?: (sourceColumn: Status, targetColumn: Status, taskId: string) => void;
  className?: string;
}

export function KanbanBoard({
  columns,
  onDragEnd,
  className,
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<{
    taskId: string;
    sourceColumn: Status;
  } | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string, columnId: Status) => {
    setDraggedTask({ taskId, sourceColumn: columnId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: Status) => {
    e.preventDefault();
    if (draggedTask && draggedTask.sourceColumn !== targetColumnId) {
      onDragEnd?.(draggedTask.sourceColumn, targetColumnId, draggedTask.taskId);
    }
    setDraggedTask(null);
  };

  return (
    <div className={cn("flex gap-4 overflow-x-auto pb-4", className)}>
      {columns.map((column) => (
        <div
          key={column.id}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
          className="flex-shrink-0 w-96"
        >
          <KanbanColumn
            {...column}
            onDragStart={(e, taskId) => {
              handleDragStart(e, taskId, column.id);
            }}
          />
        </div>
      ))}
    </div>
  );
}
