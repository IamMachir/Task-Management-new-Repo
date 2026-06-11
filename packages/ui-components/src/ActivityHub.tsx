"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./Table";
import { UserAvatar } from "./UserAvatar";
import { Badge } from "./Badge";
import { Tabs } from "./Tabs";
import { TaskAssignmentCard } from "./TaskAssignmentCard";
import { AnalyticsCard } from "./AnalyticsCard";
import { RecentTasksWidget } from "./RecentTasksWidget";
import { TaskCommentSection } from "./TaskCommentSection";
import type { Comment as TaskComment } from "./TaskCommentSection";
import { Switch } from "./Switch";
import { TaskModal, TaskFormData, Status, Priority } from "./TaskModal";
import { cn } from "./utils";
import { Report } from "./Report";
import type { ReportItem } from "./Report";

// --- Types ---

interface Activity {
  id: string;
  title: string;
  updatedAt?: string;
  status: Status;
  priority?: Priority;
  assigneeId?: string;
}

interface Member {
  id: string;
  name: string;
  avatar?: string;
}

export interface ActivityHubProps {
  tasks?: Activity[];
  members?: Member[];
  currentUser?: Member;
  className?: string;
}

// --- Internal Components ---

/**
 * ActivityTable handles the rendering of the recent activity list
 */
const ActivityTable = ({ activities, memberMap, onTaskClick }: { 
  activities: Activity[];
  memberMap: Record<string, Member>;
  onTaskClick: (id: string) => void;
}) => (
  <div className="overflow-hidden border-t border-slate-50">
    <Table>
      <TableHeader className="bg-slate-50/30">
        <TableRow className="hover:bg-transparent border-none">
          <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-4">Team Member</TableHead>
          <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-4">Action</TableHead>
          <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-4">Status</TableHead>
          <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-4">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.length > 0 ? (
          activities.map((t) => (
            <TableRow 
              key={t.id} 
              className="group hover:bg-slate-50/80 transition-all cursor-pointer border-slate-50"
              onClick={() => onTaskClick(t.id)}
            >
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <UserAvatar name={t.assigneeId ? memberMap[t.assigneeId]?.name || "User" : "User"} size="sm" className="ring-2 ring-white shadow-sm" />
                  <span className="font-bold text-xs text-slate-700 group-hover:text-indigo-600 transition-colors">
                    {t.assigneeId ? memberMap[t.assigneeId]?.name || "User" : "User"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Updated Task</span>
                  <span className="text-xs font-semibold text-slate-600 truncate max-w-[200px]">{t.title}</span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Badge 
                  variant={t.status === "done" ? "success" : t.status === "cancelled" ? "ghost" : "primary"} 
                  size="xs" 
                  className="rounded-lg font-bold uppercase px-2 py-0.5"
                >
                  {t.status}
                </Badge>
              </TableCell>
              <TableCell className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {t.updatedAt ? new Date(t.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-12">
              <div className="flex flex-col items-center gap-2 opacity-40">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">No recent activity</span>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

/**
 * QuickActions provides the right-side control panel
 */
const QuickActions = ({ onNewTask, realTimeUpdates, onToggleUpdates, onExport }: { 
  onNewTask: () => void, 
  realTimeUpdates: boolean,
  onToggleUpdates: (v: boolean) => void,
  onExport: () => void,
}) => (
  <Card className="bg-slate-900 border-none rounded-[2rem] shadow-2xl shadow-slate-900/20 overflow-hidden relative group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
    <CardHeader className="pb-2 pt-6 px-6">
      <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Command Center</CardTitle>
    </CardHeader>
    <CardContent className="p-6 space-y-3 relative z-10">
      <button 
        onClick={onNewTask}
        className="w-full flex items-center justify-between p-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
      >
        <div className="flex flex-col items-start">
          <span className="text-xs font-black uppercase tracking-tight">Create Task</span>
          <span className="text-[10px] opacity-80 font-medium">New assignment</span>
        </div>
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-xl font-light">+</div>
      </button>
      
      <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-200">Live Updates</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Real-time sync</span>
        </div>
        <Switch checked={realTimeUpdates} onChange={onToggleUpdates} />
      </div>

      <button 
        onClick={onExport}
        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all group/btn border border-white/5"
      >
        <span className="text-xs font-bold">Export Activity</span>
        <span className="text-slate-500 group-hover/btn:translate-x-1 transition-transform">→</span>
      </button>
    </CardContent>
  </Card>
);

// --- Main Component ---

export function ActivityHub({ 
  tasks = [], 
  members = [], 
  currentUser, 
  className 
}: ActivityHubProps) {
  // State
  const [activeTab, setActiveTab] = useState("all");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Activity | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  // Handlers
  const handleSaveTask = (data: TaskFormData) => {
    console.log("ActivityHub: Saving task data", data);
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskAction = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsTaskModalOpen(true);
    }
  };

  const handleNewTaskAction = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  // Memos
  const memberMap = useMemo(() => {
    const map: Record<string, Member> = {};
    members.forEach(m => { map[m.id] = m; });
    return map;
  }, [members]);

  const [activityComments, setActivityComments] = useState<TaskComment[]>([{
    id: "c1",
    author: currentUser ?? { id: "system", name: "System" },
    content: "Welcome to the new Activity Hub! Start by creating a task or checking the latest team updates.",
    createdAt: new Date().toISOString(),
  }]);

  const handleAddComment = (taskId: string, content: string) => {
    const author = currentUser ?? { id: "system", name: "System" };
    setActivityComments((comments) => [
      ...comments,
      {
        id: `c-${Date.now()}`,
        author,
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const handleEditComment = (taskId: string, commentId: string, content: string) => {
    setActivityComments((comments) =>
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, content, updatedAt: new Date().toISOString() } : comment
      )
    );
  };

  const handleDeleteComment = (taskId: string, commentId: string) => {
    setActivityComments((comments) => comments.filter((comment) => comment.id !== commentId));
  };

  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExportOpen = () => setShowExportModal(true);
  const handleExportClose = () => setShowExportModal(false);

  function buildReportItems(): ReportItem[] {
    return (tasks || []).slice(0, 20).map((t) => ({
      id: t.id,
      label: t.title,
      value: String(t.status),
      description: t.updatedAt ? `Updated ${new Date(t.updatedAt).toLocaleString()}` : undefined,
      status: (t.status === "done" ? "positive" : t.status === "cancelled" ? "negative" : "neutral") as ReportItem["status"],
      trendLabel: t.priority ? `Priority: ${t.priority}` : undefined,
    } as ReportItem));
  }

  function downloadPDF() {
    const escapePDF = (text: string) =>
      text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

    const reportLines: string[] = [
      "Activity Export",
      "================",
      `Generated: ${new Date().toLocaleString()}`,
      "",
    ];

    tasks.forEach((task, index) => {
      reportLines.push(`${index + 1}. ${task.title}`);
      reportLines.push(`   Status: ${task.status}`);
      if (task.priority) reportLines.push(`   Priority: ${task.priority}`);
      if (task.assigneeId) reportLines.push(`   Assigned to: ${memberMap[task.assigneeId]?.name || task.assigneeId}`);
      if (task.updatedAt) reportLines.push(`   Updated: ${new Date(task.updatedAt).toLocaleString()}`);
      reportLines.push("");
    });

    const content = reportLines.map((line) => `(${escapePDF(line)}) Tj T*`).join("\n");
    const pdfStream = `BT /F1 12 Tf 50 750 Td\n${content}\nET`;
    const encoder = new TextEncoder();
    const streamBytes = encoder.encode(pdfStream);

    const objects = [
      `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
      `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`,
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n`,
      `4 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${pdfStream}\nendstream\nendobj\n`,
      `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`,
    ];

    const objectsText = objects.join("");
    let offset = 0;
    const offsets = objects.map((obj) => {
      const currentOffset = offset;
      offset += encoder.encode(obj).length;
      return currentOffset;
    });

    const xrefHeader = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    const xrefBody = offsets
      .map((objOffset) => `${String(objOffset).padStart(10, "0")} 00000 n \n`)
      .join("");
    const xrefStart = encoder.encode(objectsText).length;
    const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    const pdfData = encoder.encode(`${objectsText}${xrefHeader}${xrefBody}${trailer}`);
    const blob = new Blob([pdfData], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "activity-export.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const filteredActivity = useMemo(() => {
    let result = [...tasks];
    if (activeTab === "tasks") result = result.filter(t => t.status !== "done");
    if (activeTab === "comments") return [];
    return result.slice(0, 5);
  }, [tasks, activeTab]);

  return (
    <div className={cn("space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Activity & Comments */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Recent Activity Card */}
          <Card padding="none" className="bg-white/90 backdrop-blur-xl border-slate-200/50 shadow-2xl shadow-slate-200/40 overflow-hidden rounded-[2rem]">
            <CardHeader className="flex flex-row items-center justify-between p-8">
              <div>
                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Activity Feed</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn("w-1.5 h-1.5 rounded-full", realTimeUpdates ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    {realTimeUpdates ? "Live Updates Enabled" : "Updates Paused"}
                  </p>
                </div>
              </div>
              <Tabs
                activeId={activeTab}
                onChange={setActiveTab}
                items={[
                  { id: "all", label: "Overview" },
                  { id: "tasks", label: "Tasks" },
                  { id: "comments", label: "Chat" },
                ]}
              />
            </CardHeader>
            
            <ActivityTable 
              activities={filteredActivity} 
              memberMap={memberMap} 
              onTaskClick={handleTaskAction} 
            />
          </Card>

          {/* Middle Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TaskAssignmentCard
              taskId="T-101"
              taskTitle="Infrastructure Upgrade"
              assignees={members.slice(0, 2)}
              priority="urgent"
              dueDate={new Date().toISOString()}
              status="In Progress"
              className="shadow-xl shadow-slate-200/40 rounded-[2rem] border-slate-100"
            />
            <AnalyticsCard
              title="Team Velocity"
              value="84%"
              change={8}
              changeLabel="increase"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
              className="shadow-xl shadow-slate-200/40 rounded-[2rem] border-slate-100"
            />
          </div>

          {/* Comment Section */}
          <Card padding="md" className="bg-slate-50/50 border-slate-200/60 shadow-inner rounded-[2.5rem]">
            <TaskCommentSection
              taskId="global-feed"
              comments={activityComments}
              currentUser={currentUser}
              onAddComment={handleAddComment}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
            />
          </Card>
        </div>

        {/* Right Column: Widgets & Actions */}
        <div className="lg:col-span-4 space-y-8">
          <RecentTasksWidget
            tasks={tasks.slice(0, 6).map(t => ({
              id: t.id,
              title: t.title,
              status: t.status,
              priority: t.priority || "medium",
              updatedAt: t.updatedAt || new Date().toISOString()
            }))}
            onTaskClick={handleTaskAction}
            className="shadow-2xl shadow-slate-200/40 rounded-[2rem] border-slate-100"
          />
          
          <QuickActions 
            onNewTask={handleNewTaskAction}
            realTimeUpdates={realTimeUpdates}
            onToggleUpdates={setRealTimeUpdates}
            onExport={handleExportOpen}
          />
        </div>
      </div>

      {/* Task Creation/Editing Modal */}
      <TaskModal
        open={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleSaveTask}
        initialData={selectedTask || undefined}
        title={selectedTask ? "Update Task Details" : "Create New Task"}
        assigneeOptions={members.map(m => ({ value: m.id, label: m.name }))}
      />

      {/* Export Modal */}
      <Modal isOpen={showExportModal} onClose={handleExportClose} title="Export Activity" description="Export recent activity as a PDF file and preview a quick report">
        <div className="space-y-4">
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={downloadPDF}>Download PDF</Button>
            <Button variant="secondary" size="sm" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(tasks || [])); }}>Copy JSON</Button>
          </div>
          <Report title="Recent Activity" subtitle="Quick export preview" items={buildReportItems()} />
        </div>
      </Modal>
    </div>
  );
}