"use client";

import { useState, useEffect, useMemo } from "react";
import {
  StatsCard, TaskModal, SearchInput,
  ProgressBar, ProgressCircle, Button, EmptyState, ConfirmationDialog,
  Checkbox, Card, CardHeader, CardTitle, CardContent, Badge, Alert, Accordion, Tooltip, Switch, Modal, cn,
  Label, Select, Separator, Pagination, Container, SkeletonGroup, TaskList
} from "@cbsd/ui-components";
import type { TaskFormData } from "@cbsd/ui-components";
import type { Task, Status } from "@cbsd/utils";
import {
  formatDate, isToday, getWeekDates, sortTasks, getPriorityConfig,
} from "@cbsd/utils";
import { usePersonalTasks } from "../hooks/useTasks";

type Tab = "today" | "tasks" | "habits" | "stats";

export default function PersonalFocusPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("today");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime] = useState(25 * 60);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [showHabits, setShowHabits] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(false); // For demoing skeleton
  const [sortOrder, setSortOrder] = useState("priority");
  const [currentPage, setCurrentPage] = useState(1);

  const { tasks, habits, addTask, updateTask, deleteTask, toggleTaskDone, toggleHabit, todayTasks, stats, completion, score } = usePersonalTasks();

  const { today, weekDates } = useMemo(() => {
    if (!isMounted) return { today: "", weekDates: [] };
    return {
      today: new Date().toISOString().split("T")[0],
      weekDates: getWeekDates()
    };
  }, [isMounted]);

  if (!isMounted) {
    return <div className="min-h-screen bg-white" />;
  }

  const filteredTasks = tasks.filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()));
  const sortedTasks = sortTasks(filteredTasks, "priority");

  function handleSubmit(data: TaskFormData) {
    const tags = data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const taskPayload = {
      title: data.title,
      description: data.description,
      priority: data.priority as Task["priority"],
      status: data.status as Status,
      dueDate: data.dueDate,
      assigneeId: data.assigneeId,
      projectId: data.projectId,
      tags,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskPayload);
    } else {
      addTask(taskPayload);
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-purple-100/50 sticky top-0 z-20 shadow-sm shadow-purple-500/5">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setAboutModalOpen(true)}>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold text-base">PF</span>
                </div>
                <div>
                  <h1 className="text-lg font-extrabold text-slate-900 group-hover:text-violet-600 transition-colors tracking-tight">PersonalFocus</h1>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formatDate(new Date(), "long")}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Mini Pomodoro */}
              <Tooltip content={pomodoroActive ? "Pause Timer" : "Start Focus Session"}>
                <div className="flex items-center gap-3 bg-slate-100/80 backdrop-blur-sm rounded-2xl px-4 py-2 ring-1 ring-slate-200/50">
                  <span className="text-sm font-mono font-black text-slate-700">{formatPomodoro(pomodoroTime)}</span>
                  <button
                    type="button"
                    onClick={() => setPomodoroActive(!pomodoroActive)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 ${pomodoroActive ? "bg-red-500 text-white shadow-red-200" : "bg-violet-600 text-white shadow-violet-200"}`}
                  >
                    {pomodoroActive ? "⏸" : "▶"}
                  </button>
                </div>
              </Tooltip>
              <Button onClick={() => { setEditingTask(null); setModalOpen(true); }} size="sm" variant="primary" className="rounded-xl shadow-lg shadow-violet-200">
                + Task
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 mt-4 p-1 bg-slate-100/50 rounded-xl w-fit">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  tab === t.id
                    ? "bg-white text-violet-700 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <Container size="lg" className="py-6 space-y-6">
        <Alert variant="success" title="Daily Tip" className="shadow-sm">
          Stay hydrated! Taking short breaks every 45 minutes improves focus and productivity.
        </Alert>

        {/* TODAY TAB */}
        {tab === "today" && (
          <div className="space-y-6">
            {/* Score + progress */}
            <div className="bg-white rounded-3xl border border-purple-100 p-8 shadow-xl shadow-purple-500/5 flex items-center gap-10">
              {isLoadingStats ? (
                <div className="flex items-center gap-10 w-full animate-pulse">
                  <div className="w-[100px] h-[100px] rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-5">
                    <div className="h-5 bg-slate-100 rounded-full w-full" />
                    <div className="h-5 bg-slate-100 rounded-full w-3/4" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-10 bg-slate-100 rounded-xl w-16 mx-auto" />
                    <div className="h-4 bg-slate-100 rounded-lg w-20 mx-auto" />
                  </div>
                </div>
              ) : (
                <>
                  <ProgressCircle
                    value={score}
                    size={100}
                    strokeWidth={10}
                    color="#8b5cf6"
                    label={<div className="text-center"><div className="text-2xl font-black text-slate-800">{score}</div><div className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">score</div></div>}
                    className="drop-shadow-sm"
                  />
                  <div className="flex-1 space-y-5">
                    <ProgressBar value={completion} label="Total Progress" color="indigo" size="md" className="drop-shadow-sm" />
                    <ProgressBar value={todayTasks.filter((t) => t.status === "done").length} max={Math.max(1, todayTasks.length)} label="Daily Target" color="emerald" size="md" className="drop-shadow-sm" />
                  </div>
                  <div className="text-center group/stats cursor-pointer p-4 rounded-2xl hover:bg-violet-50 transition-colors duration-200" onClick={() => { setIsLoadingStats(true); setTimeout(() => setIsLoadingStats(false), 2000); }}>
                    <div className="text-4xl font-black text-violet-600 group-hover:scale-110 transition-transform duration-200">{stats.done}</div>
                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mt-1">completed</div>
                  </div>
                </>
              )}
            </div>

            <Accordion title="How to improve your score?" className="bg-white">
              Your productivity score is calculated based on completed tasks, habit streaks, and meeting deadlines. 
              Complete high-priority tasks early in the day to get a bonus!
            </Accordion>

            {/* Week view */}
            <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xl shadow-purple-500/5">
              <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">This Week</h2>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-violet-500" title="Remaining" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500" title="Completed" />
                </div>
              </div>
              <div className="grid grid-cols-7 gap-3">
                {weekDates.map((d, i) => {
                  const dayStr = d.toISOString().split("T")[0];
                  const dayTasks = tasks.filter((t) => t.dueDate?.startsWith(dayStr));
                  const isCurrentDay = isToday(d);
                  return (
                    <div key={i} className={`text-center rounded-2xl p-3 cursor-pointer transition-all duration-200 group/day ${isCurrentDay ? "bg-violet-600 text-white shadow-lg shadow-violet-200 ring-4 ring-violet-50" : "hover:bg-violet-50 border border-transparent"}`}>
                      <div className={`text-[10px] font-black uppercase tracking-tighter ${isCurrentDay ? "text-violet-100" : "text-slate-400 group-hover/day:text-violet-400"}`}>{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]}</div>
                      <div className={`text-base font-black mt-1 ${isCurrentDay ? "text-white" : "text-slate-700 group-hover/day:text-violet-700"}`}>{d.getDate()}</div>
                      {dayTasks.length > 0 && (
                        <div className={`w-2 h-2 rounded-full mx-auto mt-2 ring-2 ${isCurrentDay ? "ring-violet-400" : "ring-white shadow-sm"} ${dayTasks.some((t) => t.status !== "done") ? "bg-violet-400" : "bg-emerald-400"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's tasks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Today's Focus</h2>
                <Badge variant="ghost" className="text-[10px] font-black text-violet-500 uppercase tracking-tighter bg-violet-50 px-3 py-1 rounded-full border-none">{todayTasks.length} Remaining</Badge>
              </div>
              {todayTasks.length === 0 ? (
                <div className="py-12 bg-white/40 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-100">
                  <EmptyState title="No tasks due today" description="You're free! Or add something to focus on." action={{ label: "Add Task", onClick: () => setModalOpen(true) }} />
                </div>
              ) : (
                <div className="space-y-3">
                  <TaskList
                    tasks={todayTasks.map(t => ({
                      ...t,
                      onEdit: () => { setEditingTask(t); setModalOpen(true); },
                      onDelete: () => setDeleteTarget(t.id)
                    }))}
                    onTaskClick={(id) => toggleTaskDone(id)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ALL TASKS TAB */}
        {tab === "tasks" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-purple-100 shadow-xl shadow-purple-500/5">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-1 max-w-sm">
                  <SearchInput value={search} onChange={setSearch} placeholder="Filter tasks..." className="bg-white/50 border-transparent focus:bg-white transition-all duration-200" />
                </div>
                <Separator orientation="vertical" className="h-10 bg-purple-100" />
                <div className="flex flex-col gap-0.5 min-w-[100px]">
                  <Label htmlFor="sort-select" className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Sort By</Label>
                  <Select
                    id="sort-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    options={[
                      { value: "priority", label: "Priority" },
                      { value: "title", label: "Title" },
                      { value: "dueDate", label: "Date" },
                    ]}
                    className="h-9 py-0 text-xs bg-white/50 border-transparent hover:bg-white transition-all duration-200 font-bold text-slate-700"
                  />
                </div>
              </div>
              <Button onClick={() => { setEditingTask(null); setModalOpen(true); }} size="sm" className="rounded-xl shadow-md shadow-violet-200">+ New Task</Button>
            </div>

            {isLoadingStats ? (
              <div className="space-y-4">
                <SkeletonGroup count={3} />
              </div>
            ) : sortedTasks.length === 0 ? (
              <div className="py-12 bg-white/40 backdrop-blur-sm rounded-3xl border-2 border-dashed border-purple-100">
                <EmptyState 
                  title="No matches found" 
                  description="Adjust your search or add a new focus item." 
                  action={{ label: "Create Task", onClick: () => setModalOpen(true) }} 
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2 px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Showing</span>
                    <Badge variant="secondary" size="xs" className="bg-violet-100 text-violet-700 border-transparent font-black">{sortedTasks.length}</Badge>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Items</span>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1.5 opacity-80">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Todo</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-80">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span className="text-[10px] font-black uppercase text-rose-500 tracking-tighter">Urgent</span>
                    </div>
                  </div>
                </div>
                <TaskList
                  tasks={sortedTasks.map(t => ({
                    ...t,
                    onEdit: () => { setEditingTask(t); setModalOpen(true); },
                    onDelete: () => setDeleteTarget(t.id)
                  }))}
                  onTaskClick={(id) => toggleTaskDone(id)}
                />
                <div className="pt-8 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={3}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* HABITS TAB */}
        {tab === "habits" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-purple-100 shadow-xl shadow-purple-500/5">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Daily Rituals</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">Build consistency every day</p>
              </div>
              <div className="flex items-center gap-3 bg-violet-50 px-4 py-2 rounded-2xl ring-1 ring-violet-100">
                <span className="text-[10px] text-violet-600 font-black uppercase tracking-widest">Visibility</span>
                <Switch checked={showHabits} onChange={setShowHabits} />
              </div>
            </div>

            {showHabits ? (
              <div className="grid grid-cols-1 gap-4">
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
                    <Card key={habit.id} className="bg-white/80 backdrop-blur-md border-purple-100 rounded-3xl shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10 transition-all duration-300 group/habit overflow-hidden">
                      <div className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${doneToday ? "bg-emerald-500 text-white rotate-12 scale-110 shadow-lg shadow-emerald-200" : "bg-slate-100 text-slate-400 group-hover/habit:bg-violet-100 group-hover/habit:text-violet-500"}`}>
                            <Checkbox
                              checked={doneToday}
                              onChange={() => toggleHabit(habit.id, today)}
                              size="lg"
                              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                            />
                            <span className="text-xl font-bold">{doneToday ? "✓" : habit.streak > 5 ? "🔥" : "⭐"}</span>
                          </div>
                          <div>
                            <h3 className={cn("text-base font-black text-slate-800 tracking-tight transition-all", doneToday && "line-through text-slate-300 opacity-60")}>{habit.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="ghost" size="xs" className="bg-amber-50 text-amber-600 border-none font-black px-2">{habit.streak} DAY STREAK</Badge>
                              {habit.description && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{habit.description}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex -space-x-1">
                          {last7.map((done, i) => (
                            <div 
                              key={i} 
                              className={`w-2 h-8 rounded-full transition-all duration-500 ${done ? "bg-emerald-400 translate-y-0" : "bg-slate-100 translate-y-2 opacity-50"}`} 
                              title={done ? "Completed" : "Missed"}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Last 7 days</span>
                        {last7.map((done, i) => (
                          <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${done ? "bg-violet-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                            {["S","M","T","W","T","F","S"][(new Date().getDay() - 6 + i + 7) % 7]}
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 bg-white/40 backdrop-blur-sm rounded-[40px] border-2 border-dashed border-purple-100 flex flex-col items-center text-center px-10">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 grayscale opacity-50">
                  <span className="text-4xl">🙈</span>
                </div>
                <h3 className="text-lg font-black text-slate-700 tracking-tight">Rituals are Hidden</h3>
                <p className="text-slate-400 text-xs font-medium mt-2 max-w-[240px]">Focus on your tasks or toggle rituals back on when you're ready.</p>
              </div>
            )}
          </div>
        )}

        {/* STATS TAB */}
        {tab === "stats" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-2 gap-6">
              <StatsCard title="Productivity Score" value={score} subtitle="Completion + Priority" color="violet"
                icon={<div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">🏆</div>}
                className="bg-white/80 backdrop-blur-md border-purple-100 rounded-[32px] shadow-xl shadow-purple-500/5"
              />
              <StatsCard title="Success Rate" value={`${completion}%`} subtitle={`${stats.done} of ${stats.total} tasks`} color="emerald"
                icon={<div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">✨</div>}
                className="bg-white/80 backdrop-blur-md border-emerald-100/50 rounded-[32px] shadow-xl shadow-emerald-500/5"
              />
              <StatsCard title="Consistency" value={habits.filter((h) => h.streak > 0).length} subtitle="Active daily streaks" color="amber"
                icon={<div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">🔥</div>}
                className="bg-white/80 backdrop-blur-md border-amber-100/50 rounded-[32px] shadow-xl shadow-amber-500/5"
              />
              <StatsCard title="Focus Debt" value={stats.overdue} subtitle="Overdue items" color="red"
                icon={<div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">⏳</div>}
                className="bg-white/80 backdrop-blur-md border-red-100/50 rounded-[32px] shadow-xl shadow-red-500/5"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/80 backdrop-blur-md border-purple-100 rounded-[32px] shadow-xl shadow-purple-500/5 overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-6 border-b border-purple-50">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Priority Mix</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {(["high", "medium", "low"] as const).map((p) => {
                      const cfg = getPriorityConfig(p);
                      const count = tasks.filter((t) => t.priority === p).length;
                      const pct = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
                      return (
                        <div key={p} className="group/pri">
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${p === "high" ? "text-rose-500" : p === "medium" ? "text-amber-500" : "text-emerald-500"}`}>{cfg.label}</span>
                            <span className="text-[10px] font-black text-slate-400">{count} items</span>
                          </div>
                          <div className="w-full bg-slate-100/50 rounded-full h-2.5 overflow-hidden ring-1 ring-slate-200/20">
                            <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: p === "high" ? "#f43f5e" : p === "medium" ? "#f59e0b" : "#10b981" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-md border-purple-100 rounded-[32px] shadow-xl shadow-purple-500/5 overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-6 border-b border-purple-50">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Ritual Health</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {habits.map((h) => {
                      const rate = h.entries.length > 0 ? Math.round((h.entries.filter((e) => e.completed).length / Math.max(h.entries.length, 7)) * 100) : 0;
                      return (
                        <div key={h.id} className="group/hab">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-700 group-hover/hab:text-violet-600 transition-colors">{h.name}</span>
                            <Badge variant="ghost" size="xs" className="text-[10px] font-black text-slate-400 border-none">{rate}%</Badge>
                          </div>
                          <ProgressBar value={rate} color="violet" showValue={false} size="sm" className="bg-slate-100/50" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Container>

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

      <Modal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        title="About PersonalFocus"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex justify-center py-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
              <span className="text-white font-bold text-3xl">PF</span>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-900">PersonalFocus v1.0</h2>
            <p className="text-sm text-slate-500">Your ultimate productivity companion.</p>
          </div>
          <Card variant="flat" padding="sm" className="mt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">New Features</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Badge variant="success" size="xs">NEW</Badge> Checkbox-based habit tracking
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Badge variant="success" size="xs">NEW</Badge> Generic Card containers
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Badge variant="success" size="xs">NEW</Badge> Reusable Modal system
              </li>
            </ul>
          </Card>
          <div className="pt-4 flex justify-center">
            <Button variant="secondary" onClick={() => setAboutModalOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
