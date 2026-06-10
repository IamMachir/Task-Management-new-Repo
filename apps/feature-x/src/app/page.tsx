"use client";
import React, { useState, useCallback } from "react";
import {
  KanbanColumn, TaskModal, StatsCard, FilterBar,
  Sidebar, EmptyState, ConfirmationDialog, UserAvatar, Button,
  Card, CardHeader, CardTitle, Badge, Alert, Tooltip, Switch, Skeleton,
  NotificationToast,
} from "@cbsd/ui-components";
import type { TaskFormData, ToastVariant } from "@cbsd/ui-components";
import type { Task, Status } from "@cbsd/utils";
import {
  filterTasks, getStatusLabel, formatDate, calculateCompletionPercentage,
  TEAMFLOW_KEYS, loadFromStorage, saveToStorage, generateId,
} from "@cbsd/utils";
import { useTasks } from "../hooks/useTasks";
import { MOCK_PROJECTS, MOCK_MEMBERS } from "../data/mockData";

const KANBAN_STATUSES: Status[] = ["todo", "in-progress", "done"];

interface ToastItem {
  id: string;
  message: string;
  title?: string;
  variant: ToastVariant;
}

export default function TeamFlowPage() {
  const [activeProject, setActiveProject] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<Status>("todo");
  const [search, setSearch] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [view, setView] = useState<"kanban" | "stats">("kanban");
  const [isCompact, setIsCompact] = useState(false);
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const projectId = activeProject === "all" ? undefined : activeProject;
  const { tasks, addTask, updateTask, deleteTask, moveTask, stats, grouped } = useTasks(projectId);

  const filtered = filterTasks(tasks, { search: search || undefined });

  const filteredGrouped = {
    todo: filtered.filter((t) => t.status === "todo"),
    "in-progress": filtered.filter((t) => t.status === "in-progress"),
    done: filtered.filter((t) => t.status === "done"),
    cancelled: filtered.filter((t) => t.status === "cancelled"),
  };

  const getMember = (id?: string) => MOCK_MEMBERS.find((m) => m.id === id);
  const getProject = (id?: string) => MOCK_PROJECTS.find((p) => p.id === id);

  function showToast(message: string, variant: ToastVariant = "info", title?: string) {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant, title }]);
  }

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function handleSubmit(data: TaskFormData) {
    const tags = data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    if (editingTask) {
      updateTask(editingTask.id, { ...data, tags, status: data.status as Status });
      showToast("Task updated successfully.", "success", "Task Updated");
    } else {
      addTask({ ...data, tags, status: data.status as Status });
      showToast(`"${data.title}" added to ${getStatusLabel(data.status as Status)}.`, "success", "Task Created");
    }
    setEditingTask(null);
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function handleAddInColumn(status: Status) {
    setDefaultStatus(status);
    setEditingTask(null);
    setModalOpen(true);
  }

  function handleDragStart(e: React.DragEvent, taskId: string) {
    e.dataTransfer.setData("taskId", taskId);
    setDraggingId(taskId);
  }

  function handleDrop(e: React.DragEvent, status: Status) {
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      moveTask(taskId, status);
      showToast(`Task moved to ${getStatusLabel(status)}.`, "info");
    }
    setDraggingId(null);
  }

  const sidebarSections = [
    {
      items: [
        {
          id: "all",
          label: "All Projects",
          icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/></svg>,
          badge: tasks.length,
        },
        ...MOCK_PROJECTS.map((p) => ({
          id: p.id,
          label: p.name,
          icon: <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />,
          badge: tasks.filter((t) => t.projectId === p.id).length,
        })),
      ],
    },
    {
      title: "Views",
      items: [
        { id: "v:kanban", label: "Kanban Board", icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg> },
        { id: "v:stats", label: "Statistics", icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg> },
      ],
    },
  ];

  const activeProjectData = getProject(projectId);
  const completionPct = calculateCompletionPercentage(tasks);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        sections={sidebarSections}
        activeId={activeProject}
        onSelect={(id) => {
          if (id.startsWith("v:")) {
            setView(id === "v:stats" ? "stats" : "kanban");
          } else {
            setActiveProject(id);
          }
        }}
        header={
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <span className="font-bold text-white text-base">TeamFlow</span>
            </div>
            <p className="text-xs text-slate-400">Team Task Management</p>
          </div>
        }
        footer={
          <div className="flex items-center gap-2">
            <UserAvatar name="Dawit Bekele" size="sm" />
            <div>
              <p className="text-xs font-medium text-slate-300">Dawit Bekele</p>
              <p className="text-xs text-slate-500">Engineering Lead</p>
            </div>
          </div>
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {activeProjectData ? activeProjectData.name : "All Projects"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">{tasks.length} tasks · {completionPct}% complete</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs text-slate-500 font-medium">Compact</span>
              <Switch checked={isCompact} onChange={setIsCompact} />
            </div>
            <FilterBar
              search={search}
              onSearchChange={setSearch}
            />
            <Tooltip content="Create a new task in this project">
              <Button onClick={() => { setEditingTask(null); setModalOpen(true); }} size="md">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Task
              </Button>
            </Tooltip>
          </div>
        </header>

        {/* Stats strip */}
        <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-6 flex-shrink-0">
          {[
            { label: "Total", value: stats.total, color: "primary" },
            { label: "To Do", value: stats.todo, color: "secondary" },
            { label: "In Progress", value: stats.inProgress, color: "primary" },
            { label: "Done", value: stats.done, color: "success" },
            { label: "Overdue", value: stats.overdue, color: "error" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Badge variant={color as any} size="md" className="font-bold">{value}</Badge>
              <span className="text-xs text-slate-400 font-medium">{label}</span>
            </div>
          ))}
          <div className="ml-auto flex-1 max-w-48">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span>Overall Progress</span><span>{completionPct}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${completionPct}%` }} />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">
          {showWelcomeAlert && (
            <Alert
              variant="info"
              title="Welcome to TeamFlow!"
              className="mb-6"
            >
              <div className="flex justify-between items-center w-full">
                <span>Manage your team's tasks efficiently with our new Kanban board.</span>
                <button onClick={() => setShowWelcomeAlert(false)} className="text-xs font-bold underline">Dismiss</button>
              </div>
            </Alert>
          )}

          {view === "stats" ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard title="Total Tasks" value={stats.total} subtitle="across all projects" color="indigo"
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
                />
                <StatsCard title="In Progress" value={stats.inProgress} color="blue"
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
                />
                {/* Demo Skeleton */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <StatsCard title="Overdue" value={stats.overdue} color="red"
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card variant="default" padding="md">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold text-slate-700">Tasks by Project</CardTitle>
                  </CardHeader>
                  <div className="space-y-4">
                    {MOCK_PROJECTS.map((p) => {
                      const ptasks = tasks.filter((t) => t.projectId === p.id);
                      const pct = ptasks.length > 0 ? Math.round((ptasks.filter((t) => t.status === "done").length / ptasks.length) * 100) : 0;
                      return (
                        <div key={p.id}>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-bold text-slate-700">{p.name}</span>
                            <Badge variant="ghost" size="xs" className="text-slate-400">{ptasks.length} tasks · {pct}%</Badge>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: p.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card variant="default" padding="md">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold text-slate-700">Team Workload</CardTitle>
                  </CardHeader>
                  <div className="space-y-4">
                    {MOCK_MEMBERS.map((m) => {
                      const mtasks = tasks.filter((t) => t.assigneeId === m.id);
                      const workload = Math.min(100, (mtasks.length / Math.max(1, tasks.length / MOCK_MEMBERS.length)) * 50);
                      return (
                        <div key={m.id} className="flex items-center gap-4">
                          <UserAvatar name={m.name} size="md" />
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-xs font-bold text-slate-700">{m.name}</span>
                              <Badge variant="secondary" size="xs">{mtasks.length} tasks</Badge>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${workload}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </>
          ) : (
           <div className="flex gap-6 h-full min-h-[500px]">
              {KANBAN_STATUSES.map((status) => (
                <KanbanColumn
                  key={status}
                  title={getStatusLabel(status)}
                  status={status}
                  tasks={filteredGrouped[status]}
                  onDrop={handleDrop}
                  onDragStart={handleDragStart}
                  onAddTask={() => handleAddInColumn(status)}
                  onEditTask={handleEdit}
                  onDeleteTask={setDeleteTarget}
                  draggingId={draggingId}
                  className={isCompact ? "scale-95 origin-top transition-transform" : ""}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSubmit={handleSubmit}
        title={editingTask ? "Edit Task" : "New Task"}
        initialData={editingTask ? {
          title: editingTask.title,
          description: editingTask.description,
          priority: editingTask.priority,
          status: editingTask.status,
          dueDate: editingTask.dueDate,
          assigneeId: editingTask.assigneeId,
          projectId: editingTask.projectId,
          tags: editingTask.tags?.join(", "),
        } : { status: defaultStatus }}
        projectOptions={MOCK_PROJECTS.map((p) => ({ value: p.id, label: p.name }))}
        assigneeOptions={MOCK_MEMBERS.map((m) => ({ value: m.id, label: m.name }))}
      />

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Delete Task"
        description="This action cannot be undone. The task will be permanently removed."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteTarget) {
            deleteTask(deleteTarget);
            showToast("Task deleted.", "error", "Deleted");
          }
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <NotificationToast
              message={toast.message}
              title={toast.title}
              variant={toast.variant}
              onDismiss={() => dismissToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
