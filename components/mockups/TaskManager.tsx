import { useState, useEffect } from "react"
import { TaskTag, type TaskTagProps } from "@/components/ui/task-tag"
import { NotificationToast, type ToastVariant } from "@/components/ui/notification-toast"
import { cn } from "@/lib/utils"

type TagColor = TaskTagProps["color"]

interface Tag {
  label: string
  color: TagColor
}

interface Task {
  id: number
  title: string
  done: boolean
  tags: Tag[]
  priority: "low" | "medium" | "high"
}

interface Toast {
  id: number
  message: string
  title: string
  variant: ToastVariant
}

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "Design new onboarding flow",
    done: false,
    priority: "high",
    tags: [
      { label: "Design", color: "purple" },
      { label: "Urgent", color: "red" },
    ],
  },
  {
    id: 2,
    title: "Fix authentication bug in login page",
    done: false,
    priority: "high",
    tags: [
      { label: "Bug", color: "red" },
      { label: "Backend", color: "blue" },
    ],
  },
  {
    id: 3,
    title: "Write unit tests for payment module",
    done: true,
    priority: "medium",
    tags: [
      { label: "Testing", color: "green" },
      { label: "Backend", color: "blue" },
    ],
  },
  {
    id: 4,
    title: "Update documentation for API endpoints",
    done: false,
    priority: "low",
    tags: [
      { label: "Docs", color: "yellow" },
      { label: "API", color: "orange" },
    ],
  },
  {
    id: 5,
    title: "Review and merge pending pull requests",
    done: true,
    priority: "medium",
    tags: [
      { label: "Review", color: "pink" },
    ],
  },
]

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  high:   "bg-red-100 text-red-600 border-red-200",
  medium: "bg-yellow-100 text-yellow-600 border-yellow-200",
  low:    "bg-green-100 text-green-600 border-green-200",
}

const AVAILABLE_TAGS: Tag[] = [
  { label: "Design",   color: "purple" },
  { label: "Bug",      color: "red" },
  { label: "Testing",  color: "green" },
  { label: "Backend",  color: "blue" },
  { label: "Docs",     color: "yellow" },
  { label: "API",      color: "orange" },
  { label: "Frontend", color: "pink" },
  { label: "Urgent",   color: "red" },
  { label: "Review",   color: "pink" },
]

let nextId = INITIAL_TASKS.length + 1
let toastId = 1

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "done">("all")
  const [newTitle, setNewTitle] = useState("")
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium")
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      addToast("Welcome back!", "You have active tasks waiting.", "info")
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  function addToast(title: string, message: string, variant: ToastVariant) {
    const id = toastId++
    setToasts(prev => [...prev, { id, title, message, variant }])
  }

  function dismissToast(id: number) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  function toggleTask(id: number) {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t
        const next = { ...t, done: !t.done }
        addToast(
          next.done ? "Task completed!" : "Task reopened",
          next.done ? `"${next.title}" marked as done.` : `"${next.title}" moved back to active.`,
          next.done ? "success" : "info",
        )
        return next
      }),
    )
  }

  function removeTagFromTask(taskId: number, tagLabel: string) {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, tags: t.tags.filter(tag => tag.label !== tagLabel) }
          : t,
      ),
    )
  }

  function deleteTask(id: number) {
    const task = tasks.find(t => t.id === id)
    setTasks(prev => prev.filter(t => t.id !== id))
    if (task) {
      addToast("Task deleted", `"${task.title}" was removed.`, "warning")
    }
  }

  function toggleSelectedTag(tag: Tag) {
    setSelectedTags(prev =>
      prev.some(t => t.label === tag.label)
        ? prev.filter(t => t.label !== tag.label)
        : [...prev, tag],
    )
  }

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    const task: Task = {
      id: nextId++,
      title: newTitle.trim(),
      done: false,
      priority: newPriority,
      tags: selectedTags,
    }
    setTasks(prev => [task, ...prev])
    addToast("Task created", `"${task.title}" was added.`, "success")
    setNewTitle("")
    setNewPriority("medium")
    setSelectedTags([])
    setShowAddForm(false)
  }

  const filtered = tasks.filter(t =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done,
  )

  const activeCount = tasks.filter(t => !t.done).length
  const doneCount = tasks.filter(t => t.done).length

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {activeCount} active · {doneCount} completed
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm(v => !v)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              showAddForm
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gray-900 text-white hover:bg-gray-700",
            )}
          >
            {showAddForm ? "Cancel" : "+ Add Task"}
          </button>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddTask}
            className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-sm"
          >
            <input
              type="text"
              placeholder="Task title..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              autoFocus
            />

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Priority:</span>
              {(["low", "medium", "high"] as Task["priority"][]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewPriority(p)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium border transition-all capitalize",
                    newPriority === p
                      ? PRIORITY_STYLES[p] + " ring-2 ring-offset-1 ring-gray-400"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <span className="text-xs text-gray-500 font-medium">Tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TAGS.map(tag => {
                  const active = selectedTags.some(t => t.label === tag.label)
                  return (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => toggleSelectedTag(tag)}
                      className={cn(
                        "transition-all",
                        active ? "ring-2 ring-offset-1 ring-gray-400 rounded-full" : "opacity-60 hover:opacity-100",
                      )}
                    >
                      <TaskTag label={tag.label} color={tag.color} />
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Add Task
              </button>
            </div>
          </form>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          {(["all", "active", "done"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all",
                filter === f
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No tasks here.
            </div>
          )}
          {filtered.map(task => (
            <div
              key={task.id}
              className={cn(
                "bg-white rounded-xl border p-4 transition-all hover:shadow-sm",
                task.done ? "border-gray-100 opacity-70" : "border-gray-200",
              )}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    "mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 transition-all flex items-center justify-center",
                    task.done
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300 hover:border-gray-500",
                  )}
                  aria-label={task.done ? "Mark incomplete" : "Mark complete"}
                >
                  {task.done && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Title */}
                  <p className={cn(
                    "text-sm font-medium leading-snug",
                    task.done ? "line-through text-gray-400" : "text-gray-800",
                  )}>
                    {task.title}
                  </p>

                  {/* Tags + Priority */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
                      PRIORITY_STYLES[task.priority],
                    )}>
                      {task.priority}
                    </span>
                    {task.tags.map(tag => (
                      <TaskTag
                        key={tag.label}
                        label={tag.label}
                        color={tag.color}
                        onRemove={() => removeTagFromTask(task.id, tag.label)}
                      />
                    ))}
                  </div>
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="shrink-0 p-1 rounded-md text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                  aria-label="Delete task"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M6 6.5v3M8 6.5v3M3 3.5l.7 7.5a.5.5 0 00.5.5h5.6a.5.5 0 00.5-.5l.7-7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Toast Stack */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 w-80">
          {toasts.map(toast => (
            <NotificationToast
              key={toast.id}
              title={toast.title}
              message={toast.message}
              variant={toast.variant}
              duration={4000}
              onDismiss={() => dismissToast(toast.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
