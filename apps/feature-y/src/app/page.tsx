"use client";
import React, { useState } from "react";
import {
  StatsCard, TaskCard, TaskModal, FilterBar,
  ProgressBar, ProgressCircle, Button, EmptyState, ConfirmationDialog
} from "@cbsd/ui-components";
import type { TaskFormData } from "@cbsd/ui-components";
import type { Task, Status } from "@cbsd/utils";
import {
  formatDate, isToday, getWeekDates, sortTasks, getPriorityConfig,
} from "@cbsd/utils";
import { usePersonalTasks } from "../hooks/useTasks";

type Tab = "today" | "tasks" | "habits" | "stats";

export default function PersonalFocusPage() {
  const [tab, setTab] = useState<Tab>("today");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);

  const { tasks, habits, addTask, updateTask, deleteTask, toggleTaskDone, toggleHabit, todayTasks, stats, completion, score } = usePersonalTasks();

  const today = new Date().toISOString().split("T")[0];
  const weekDates = getWeekDates();

  const filteredTasks = tasks.filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()));
  const sortedTasks = sortTasks(filteredTasks, "priority");

  function handleSubmit(data: TaskFormData) {
    const tags = data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    if (editingTask) {
      updateTask(editingTask.id, { ...data, tags, status: data.status as Status });
    } else {
      addTask({ ...data, tags, status: data.status as Status });
    }
    setEditingTask(null);
  }

  function formatPomodoro(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "today", label: "Today", icon: "📅" },
    { id: "tasks", label: "All Tasks", icon: "✅" },
    { id: "habits", label: "Habits", icon: "🔥" },
    { id: "stats", label: "Stats", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PF</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">PersonalFocus</h1>
                  <p className="text-xs text-slate-400">{formatDate(new Date(), "long")}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Mini Pomodoro */}
              <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
                <span className="text-sm font-mono font-bold text-slate-700">{formatPomodoro(pomodoroTime)}</span>
                <button
                  onClick={() => setPomodoroActive(!pomodoroActive)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${pomodoroActive ? "bg-red-500 text-white" : "bg-violet-500 text-white"}`}
                >
                  {pomodoroActive ? "⏸" : "▶"}
                </button>
              </div>
              <Button onClick={() => { setEditingTask(null); setModalOpen(true); }} size="sm" variant="primary">
                + Task
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  tab === t.id
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6 space-y-6">

        {/* TODAY TAB */}
        {tab === "today" && (
          <div className="space-y-6">
            {/* Score + progress */}
            <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm flex items-center gap-8">
              <ProgressCircle
                value={score}
                size={88}
                strokeWidth={8}
                color="#7c3aed"
                label={<div className="text-center"><div className="text-lg font-bold text-slate-800">{score}</div><div className="text-xs text-slate-400">score</div></div>}
              />
              <div className="flex-1 space-y-3">
                <ProgressBar value={completion} label="Tasks done" color="indigo" />
                <ProgressBar value={todayTasks.filter((t) => t.status === "done").length} max={Math.max(1, todayTasks.length)} label="Today's tasks" color="indigo" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600">{stats.done}</div>
                <div className="text-xs text-slate-400">completed</div>
              </div>
            </div>

            {/* Week view */}
            <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-700 mb-3">This Week</h2>
              <div className="grid grid-cols-7 gap-2">
                {weekDates.map((d, i) => {
                  const dayStr = d.toISOString().split("T")[0];
                  const dayTasks = tasks.filter((t) => t.dueDate?.startsWith(dayStr));
                  const isCurrentDay = isToday(d);
                  return (
                    <div key={i} className={`text-center rounded-xl p-2 cursor-pointer transition-colors ${isCurrentDay ? "bg-violet-100 border-2 border-violet-400" : "hover:bg-slate-50 border border-transparent"}`}>
                      <div className="text-xs text-slate-400 font-medium">{["S","M","T","W","T","F","S"][d.getDay()]}</div>
                      <div className={`text-sm font-bold mt-0.5 ${isCurrentDay ? "text-violet-700" : "text-slate-700"}`}>{d.getDate()}</div>
                      {dayTasks.length > 0 && (
                        <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${dayTasks.some((t) => t.status !== "done") ? "bg-violet-500" : "bg-emerald-500"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's tasks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-700">Today's Focus ({todayTasks.length})</h2>
              </div>
              {todayTasks.length === 0 ? (
                <EmptyState title="No tasks due today" description="You're free! Or add something to focus on." action={{ label: "Add Task", onClick: () => setModalOpen(true) }} />
              ) : (
                <div className="space-y-2">
                  {todayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      {...task}
                      onClick={() => toggleTaskDone(task.id)}
                      onEdit={() => { setEditingTask(task); setModalOpen(true); }}
                      onDelete={() => setDeleteTarget(task.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ALL TASKS TAB */}
        {tab === "tasks" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FilterBar search={search} onSearchChange={setSearch} />
              <Button onClick={() => { setEditingTask(null); setModalOpen(true); }} size="sm">+ New Task</Button>
            </div>
            {sortedTasks.length === 0 ? (
              <EmptyState title="No tasks found" description="Try adjusting your search or add a new task." action={{ label: "Add Task", onClick: () => setModalOpen(true) }} />
            ) : (
              <div className="space-y-2">
                {sortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    {...task}
                    onClick={() => toggleTaskDone(task.id)}
                    onEdit={() => { setEditingTask(task); setModalOpen(true); }}
                    onDelete={() => setDeleteTarget(task.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* HABITS TAB */}
        {tab === "habits" && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-700">Daily Habits</h2>
            {habits.map((habit) => {
              const todayEntry = habit.entries.find((e) => e.date === today);
              const doneToday = todayEntry?.completed ?? false;
              const last7 = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                const ds = d.toISOString().split("T")[0];
                return habit.entries.find((e) => e.date === ds)?.completed ?? false;
              });
              return (
                <div key={habit.id} className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{habit.name}</h3>
                      {habit.description && <p className="text-xs text-slate-400 mt-0.5">{habit.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-lg font-bold text-violet-600">🔥 {habit.streak}</div>
                        <div className="text-xs text-slate-400">day streak</div>
                      </div>
                      <button
                        onClick={() => toggleHabit(habit.id, today)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                          doneToday ? "bg-emerald-500 text-white scale-105" : "bg-slate-100 text-slate-400 hover:bg-violet-100 hover:text-violet-600"
                        }`}
                      >
                        {doneToday ? "✓" : "○"}
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="text-xs text-slate-400 mr-1">Last 7 days</span>
                    {last7.map((done, i) => (
                      <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${done ? "bg-violet-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                        {["S","M","T","W","T","F","S"][(new Date().getDay() - 6 + i + 7) % 7]}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STATS TAB */}
        {tab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatsCard title="Productivity Score" value={score} subtitle="Based on completion + priority" color="violet"
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
              />
              <StatsCard title="Completed" value={`${stats.done}/${stats.total}`} subtitle={`${completion}% completion rate`} color="emerald"
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
              />
              <StatsCard title="Active Streaks" value={habits.filter((h) => h.streak > 0).length} subtitle={`Longest: ${Math.max(...habits.map((h) => h.streak))} days`} color="amber"
                icon={<span className="text-xl">🔥</span>}
              />
              <StatsCard title="Overdue" value={stats.overdue} color="red"
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
              />
            </div>

            <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-4">Tasks by Priority</h3>
              {(["high", "medium", "low"] as const).map((p) => {
                const cfg = getPriorityConfig(p);
                const count = tasks.filter((t) => t.priority === p).length;
                const pct = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
                return (
                  <div key={p} className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                      <span className="text-xs text-slate-400">{count} tasks</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: p === "high" ? "#ef4444" : p === "medium" ? "#f59e0b" : "#10b981" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-4">Habit Performance</h3>
              <div className="space-y-3">
                {habits.map((h) => {
                  const rate = h.entries.length > 0 ? Math.round((h.entries.filter((e) => e.completed).length / Math.max(h.entries.length, 7)) * 100) : 0;
                  return (
                    <div key={h.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-slate-700">{h.name}</span>
                        <span className="text-xs text-slate-400">{rate}%</span>
                      </div>
                      <ProgressBar value={rate} color="indigo" showValue={false} size="sm" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

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
          tags: editingTask.tags?.join(", "),
        } : {}}
      />

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Delete Task"
        description="This will permanently remove the task."
        confirmLabel="Delete"
        onConfirm={() => { if (deleteTarget) deleteTask(deleteTarget); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
