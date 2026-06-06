"use client";
import React, { useState, useEffect } from "react";
import { cn } from "./utils";
import { Button } from "./Button";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Select } from "./Select";

export type Priority = "high" | "medium" | "low";
export type Status = "todo" | "in-progress" | "done" | "cancelled";

export interface TaskFormData {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: string;
  assigneeId?: string;
  projectId?: string;
  tags?: string;
}

export interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Partial<TaskFormData>;
  title?: string;
  projectOptions?: { value: string; label: string }[];
  assigneeOptions?: { value: string; label: string }[];
}

const DEFAULT: TaskFormData = {
  title: "", description: "", priority: "medium", status: "todo",
  dueDate: "", assigneeId: "", projectId: "", tags: "",
};

export function TaskModal({
  open, onClose, onSubmit, initialData, title = "New Task",
  projectOptions = [], assigneeOptions = [],
}: TaskModalProps) {
  const [form, setForm] = useState<TaskFormData>({ ...DEFAULT, ...initialData });
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  useEffect(() => {
    if (open) setForm({ ...DEFAULT, ...initialData });
  }, [open, initialData]);

  function set(key: keyof TaskFormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = "Title is required";
    else if (form.title.trim().length < 2) errs.title = "Title must be at least 2 characters";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Task Title *"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Enter task title..."
            error={errors.title}
            autoFocus
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Add a description..."
            rows={3}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Priority"
              value={form.priority}
              onChange={(e) => set("priority", e.target.value)}
              options={[
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" },
              ]}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              options={[
                { value: "todo", label: "To Do" },
                { value: "in-progress", label: "In Progress" },
                { value: "done", label: "Done" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          </div>
          <Input
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={(e) => set("dueDate", e.target.value)}
          />
          {assigneeOptions.length > 0 && (
            <Select
              label="Assignee"
              value={form.assigneeId ?? ""}
              onChange={(e) => set("assigneeId", e.target.value)}
              options={assigneeOptions}
              placeholder="Select assignee..."
            />
          )}
          {projectOptions.length > 0 && (
            <Select
              label="Project"
              value={form.projectId ?? ""}
              onChange={(e) => set("projectId", e.target.value)}
              options={projectOptions}
              placeholder="Select project..."
            />
          )}
          <Input
            label="Tags"
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="design, frontend, urgent (comma-separated)"
            hint="Separate multiple tags with commas"
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Save Task</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
