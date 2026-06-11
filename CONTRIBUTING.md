# Contributor Guide — Task Management Dashboard Monorepo

> **Course:** Component Based Software Development (SEng5306)  
> **Instructor:** [@daniel-mitiku](https://github.com/daniel-mitiku)  
> **Repo:** https://github.com/IamMachir/Task-Management-new-Repo

This guide is written for someone who is **new to this project** and wants to add UI components or integrate them into the apps. Read it fully before touching any code.

---

## Table of Contents

1. [What is this project?](#1-what-is-this-project)
2. [How the monorepo is organized](#2-how-the-monorepo-is-organized)
3. [The golden rule](#3-the-golden-rule)
4. [Set up your local environment](#4-set-up-your-local-environment)
5. [Understand the shared packages](#5-understand-the-shared-packages)
6. [How to add a new UI component](#6-how-to-add-a-new-ui-component)
7. [How to add a new utility function](#7-how-to-add-a-new-utility-function)
8. [How to use components in the apps](#8-how-to-use-components-in-the-apps)
9. [Component design rules](#9-component-design-rules)
10. [TypeScript rules](#10-typescript-rules)
11. [File naming conventions](#11-file-naming-conventions)
12. [Quick reference: what already exists](#12-quick-reference-what-already-exists)
13. [Common mistakes to avoid](#13-common-mistakes-to-avoid)
14. [Step-by-step example: adding a new component end to end](#14-step-by-step-example-adding-a-new-component-end-to-end)

---

## 1. What is this project?

This is a **Task Management Dashboard** built as a **monorepo** — a single Git repository that contains multiple related projects (apps and packages) all living together.

Think of it like this:

```
One repository
  ├── Shared building blocks  (packages/)  ← built ONCE, used everywhere
  └── Apps that use them      (apps/)      ← just assemble the blocks
```

There are two user-facing apps:

| App | What it does | Port |
|-----|-------------|------|
| **TeamFlow** (`apps/feature-x`) | Kanban board for managing team tasks — drag & drop columns, assign tasks to teammates, switch between projects, view statistics | 3000 |
| **PersonalFocus** (`apps/feature-y`) | Personal productivity planner — daily task list, habit tracker with streaks, Pomodoro timer, productivity stats | 3001 |

Both apps are **Next.js 15** apps (React, runs in the browser). They do NOT have a backend or a database — all data lives in the browser's `localStorage`.

---

## 2. How the monorepo is organized

```
Task-Management-new-Repo/
│
├── apps/                          ← The two runnable web applications
│   ├── feature-x/                 ← TeamFlow (Kanban team dashboard)
│   │   ├── src/
│   │   │   ├── app/               ← Next.js App Router pages
│   │   │   │   ├── layout.tsx     ← Root HTML shell, font, metadata
│   │   │   │   ├── page.tsx       ← Main page (the whole UI lives here)
│   │   │   │   └── globals.css    ← Tailwind imports + custom styles
│   │   │   ├── hooks/
│   │   │   │   └── useTasks.ts    ← State management (add/edit/delete tasks)
│   │   │   └── data/
│   │   │       └── mockData.ts    ← Sample tasks, projects, team members
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── feature-y/                 ← PersonalFocus (personal planner)
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx       ← Tab-based UI: Today / Tasks / Habits / Stats
│       │   │   └── globals.css
│       │   ├── hooks/
│       │   │   └── useTasks.ts    ← Task + habit state management
│       │   └── data/
│       │       └── mockData.ts    ← Sample personal tasks and habits
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       └── package.json
│
├── packages/                      ← Shared code used by both apps
│   │
│   ├── ui-components/             ← ALL reusable React components
│   │   ├── src/
│   │   │   ├── index.ts           ← THE barrel file — exports everything
│   │   │   ├── utils.ts           ← cn() helper (Tailwind class merger)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   └── ... (15 more components)
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── utils/                     ← ALL shared utility functions + types
│       ├── src/
│       │   ├── index.ts           ← THE barrel file — exports everything
│       │   ├── types.ts           ← Task, Project, TeamMember, etc.
│       │   ├── dateUtils.ts
│       │   ├── priorityHelpers.ts
│       │   └── ... (8 more modules)
│       ├── tsconfig.json
│       └── package.json
│
├── turbo.json                     ← Turborepo config (build/dev pipeline)
├── pnpm-workspace.yaml            ← Tells pnpm these folders are all one workspace
├── package.json                   ← Root scripts: pnpm dev, pnpm build, etc.
├── tsconfig.json                  ← Shared TypeScript base config
└── README.md
```

---

## 3. The golden rule

> **Apps only assemble. Packages contain all logic and components.**

This is the core rule of the project — enforced by the course assignment.

✅ **Correct:**
```tsx
// Inside apps/feature-x/src/app/page.tsx
import { TaskCard, KanbanColumn, Button } from "@cbsd/ui-components";
import { filterTasks, formatDate } from "@cbsd/utils";
```

❌ **Wrong — never do this in an app:**
```tsx
// Inside apps/feature-x/src/app/page.tsx
// Building a component directly in the app
function TaskCard({ title }) {
  return <div className="...">{title}</div>;  // ← should be in packages/ui-components
}
```

If you're building a reusable piece of UI → it goes in `packages/ui-components`.  
If you're writing a helper function → it goes in `packages/utils`.  
If you're assembling those pieces into a page → it goes in an app.

---

## 4. Set up your local environment

### Prerequisites

You need these installed:
- **Node.js** version 18 or newer — https://nodejs.org
- **pnpm** package manager — run: `npm install -g pnpm`
- **Git** — https://git-scm.com
- A code editor — **VS Code** is recommended

### First-time setup

```bash
# 1. Clone the repo
git clone https://github.com/IamMachir/Task-Management-new-Repo.git

# 2. Enter the project folder
cd Task-Management-new-Repo

# 3. Install ALL dependencies for every app and package in one command
pnpm install

# 4. Start both apps at the same time
pnpm dev
```

Now open your browser:
- http://localhost:3000 → TeamFlow
- http://localhost:3001 → PersonalFocus

To run only one app:
```bash
pnpm dev:feature-x   # TeamFlow only
pnpm dev:feature-y   # PersonalFocus only
```

### What `pnpm install` does

Because of `pnpm-workspace.yaml`, running `pnpm install` from the root installs dependencies for ALL packages and apps at once. You never need to `cd` into a subfolder and run `npm install` separately.

---

## 5. Understand the shared packages

### `@cbsd/ui-components`

This is the React component library. Every component is a `.tsx` file exported from `src/index.ts`.

**How apps import from it:**
```tsx
import { Button, TaskCard, StatsCard } from "@cbsd/ui-components";
```

The package name `@cbsd/ui-components` is defined in `packages/ui-components/package.json`:
```json
{ "name": "@cbsd/ui-components" }
```

The apps reference it as a **workspace dependency** in their own `package.json`:
```json
{
  "dependencies": {
    "@cbsd/ui-components": "workspace:*"
  }
}
```

`workspace:*` means "use the local copy from this monorepo, always up to date."

**The `cn()` helper** — every component uses this for combining Tailwind classes:
```tsx
import { cn } from "./utils";
// cn("base-class", condition && "extra-class", className)
```

### `@cbsd/utils`

This is the utility library. It has NO React — just pure TypeScript functions and type definitions.

**How apps import from it:**
```tsx
import { formatDate, filterTasks, generateId } from "@cbsd/utils";
import type { Task, Priority, Status } from "@cbsd/utils";
```

### The barrel file pattern

Both packages use an `index.ts` as the single export point:

```
packages/ui-components/src/Button.tsx      ← component lives here
packages/ui-components/src/index.ts        ← re-exports Button
```

```ts
// src/index.ts
export { Button } from "./Button";
export type { ButtonProps } from "./Button";
```

This means callers always import from `@cbsd/ui-components`, never from `@cbsd/ui-components/src/Button`.

---

## 6. How to add a new UI component

Let's say you want to add a `Tooltip` component. Follow these steps exactly:

### Step 1 — Create the component file

Create `packages/ui-components/src/Tooltip.tsx`:

```tsx
"use client";
import React, { useState } from "react";
import { cn } from "./utils";

export interface TooltipProps {
  content: string;           // the tooltip text
  children: React.ReactNode; // the element it wraps
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = "top",
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1",
    left: "right-full top-1/2 -translate-y-1/2 mr-1",
    right: "left-full top-1/2 -translate-y-1/2 ml-1",
  };

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-xs text-white bg-slate-800 rounded whitespace-nowrap pointer-events-none",
            positionClasses[position]
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
```

### Step 2 — Export it from the barrel file

Open `packages/ui-components/src/index.ts` and add these two lines:

```ts
export { Tooltip } from "./Tooltip";
export type { TooltipProps } from "./Tooltip";
```

That's it for the package. Now any app can use it.

### Step 3 — Use it in an app

```tsx
// In apps/feature-x/src/app/page.tsx
import { Tooltip } from "@cbsd/ui-components";

// Inside your JSX:
<Tooltip content="Click to edit this task" position="top">
  <button>Edit</button>
</Tooltip>
```

### Step 4 — Test it

```bash
pnpm dev:feature-x   # check it looks right at localhost:3000
```

---

## 7. How to add a new utility function

Let's say you want to add a function that colors overdue tasks red.

### Step 1 — Find the right file, or create a new one

Utility functions are organized by category:

| File | What belongs there |
|------|--------------------|
| `dateUtils.ts` | Anything with dates and times |
| `priorityHelpers.ts` | High/medium/low priority logic |
| `statusHelpers.ts` | Todo/in-progress/done logic |
| `taskFilters.ts` | Filtering, sorting, grouping tasks |
| `storageHelpers.ts` | Reading/writing localStorage |
| `stringHelpers.ts` | Text manipulation |
| `validationHelpers.ts` | Form validation checks |
| `statsHelpers.ts` | Calculations (% complete, scores) |
| `types.ts` | TypeScript type definitions only |

If you need a brand new category, create a new file like `colorHelpers.ts`.

### Step 2 — Write the function

Add to `packages/utils/src/dateUtils.ts`:

```ts
/**
 * Return a CSS color class based on how overdue a task is
 */
export function getOverdueColor(dueDate: string): string {
  const daysLeft = Math.ceil(
    (new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (daysLeft < 0) return "text-red-600";   // overdue
  if (daysLeft <= 2) return "text-orange-500"; // due soon
  return "text-slate-500";                    // fine
}
```

### Step 3 — Export it from the barrel file

Open `packages/utils/src/index.ts` and add:

```ts
export { getOverdueColor } from "./dateUtils"; // add to the existing dateUtils line
```

If you created a new file like `colorHelpers.ts`:
```ts
export * from "./colorHelpers";
```

### Step 4 — Use it in an app or component

```tsx
import { getOverdueColor } from "@cbsd/utils";

<span className={getOverdueColor(task.dueDate)}>
  {task.dueDate}
</span>
```

---

## 8. How to use components in the apps

Both apps live in `apps/feature-x` and `apps/feature-y`. Their structure is simple:

```
src/
├── app/
│   ├── layout.tsx   ← Don't touch this unless adding fonts/metadata
│   ├── page.tsx     ← The main page — this is where you assemble things
│   └── globals.css  ← CSS resets and Tailwind imports
├── hooks/
│   └── useTasks.ts  ← State management (add/update/delete)
└── data/
    └── mockData.ts  ← Sample data loaded on first run
```

### Adding a new section to an existing page

Open `apps/feature-x/src/app/page.tsx`. The page uses a simple view toggle between `"kanban"` and `"stats"`. To add a new view (e.g. a "list view"):

1. Add your view to the state: `const [view, setView] = useState<"kanban" | "stats" | "list">("kanban")`
2. Add a button in the header to switch to it
3. Add a conditional block at the bottom:

```tsx
{view === "list" && (
  <div className="flex-1 overflow-y-auto p-6">
    {/* Import and use components here */}
    {tasks.map((task) => (
      <TaskCard key={task.id} {...task} />
    ))}
  </div>
)}
```

### Adding a new tab to PersonalFocus

Open `apps/feature-y/src/app/page.tsx`. The page uses a `tab` state and a `TABS` array. To add a new tab:

```tsx
// 1. Add to the Tab type
type Tab = "today" | "tasks" | "habits" | "stats" | "goals"; // add "goals"

// 2. Add to the TABS array
const TABS = [
  ...existing tabs...,
  { id: "goals", label: "Goals", icon: "🎯" },
];

// 3. Add the content block
{tab === "goals" && (
  <div className="space-y-4">
    {/* your new content */}
  </div>
)}
```

---

## 9. Component design rules

Follow these rules when building any component for `packages/ui-components`:

### Rule 1 — Always use `"use client";` at the top
```tsx
"use client";
import React from "react";
```
This is required because Next.js App Router defaults to server components, but interactive React components need to be client components.

### Rule 2 — Always accept a `className` prop
```tsx
export interface MyComponentProps {
  className?: string;  // always include this
}
// Then use it with cn():
<div className={cn("base-styles", className)}>
```
This lets the caller override or extend styles.

### Rule 3 — Use `cn()` for all className logic
```tsx
import { cn } from "./utils";

// Good:
<div className={cn("base", isActive && "active", className)}>

// Bad:
<div className={`base ${isActive ? "active" : ""} ${className}`}>
```

### Rule 4 — Use `React.forwardRef` for form elements
```tsx
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn("...", className)} {...props} />
  )
);
Input.displayName = "Input";
```

### Rule 5 — No hardcoded data in components
Components should accept data as props. Never hardcode text, colors based on business logic, or sample values inside a component.

```tsx
// Bad — hardcoded team names
function TeamList() {
  return <ul><li>Alice</li><li>Bob</li></ul>;
}

// Good — accepts data as props
function TeamList({ members }: { members: { name: string }[] }) {
  return <ul>{members.map(m => <li key={m.name}>{m.name}</li>)}</ul>;
}
```

### Rule 6 — No imports from `@cbsd/utils` inside ui-components
The `ui-components` package should NOT depend on `@cbsd/utils`. Keep types local (or minimal inline types) in the component file. This prevents circular dependencies.

```tsx
// Bad — inside packages/ui-components/src/TaskCard.tsx:
import { formatDate } from "@cbsd/utils";  // ❌ don't do this

// Good — duplicate the tiny helper locally, or accept formatted strings as props:
const formattedDate = dueDate
  ? new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  : null;
```

---

## 10. TypeScript rules

### Always type your props
```tsx
// Good
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  loading?: boolean;
}

// Bad
function Button({ variant, loading, ...props }: any) { ... }
```

### Use string literal unions for limited options
```ts
// Good
type Priority = "high" | "medium" | "low";
type Status = "todo" | "in-progress" | "done" | "cancelled";

// Bad
type Priority = string;
```

### Export your prop types
Every component should export its props interface so apps can use it:
```tsx
export interface CardProps { ... }
export function Card(props: CardProps) { ... }
```

### Import types with `type`
```ts
import type { Task, Priority } from "@cbsd/utils";
```

---

## 11. File naming conventions

| What | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `TaskCard.tsx`, `KanbanColumn.tsx` |
| Utility files | camelCase | `dateUtils.ts`, `taskFilters.ts` |
| Hooks | camelCase, starts with `use` | `useTasks.ts`, `useLocalStorage.ts` |
| Pages (Next.js) | lowercase | `page.tsx`, `layout.tsx` |
| Mock data | camelCase | `mockData.ts` |
| Config files | camelCase | `tailwind.config.ts` |

---

## 12. Quick reference: what already exists

This section is your fast look-up for the shared building blocks already available in the repo. Use these components and utilities instead of re-creating the same behavior in an app.

### Components in `@cbsd/ui-components`

These components are the reusable UI primitives for both TeamFlow and PersonalFocus. Each component is exported from `packages/ui-components/src/index.ts`, so apps should import from `@cbsd/ui-components` and never from a deep path.

Use these components when you need:
- consistent buttons, input controls, modals, badges, and form elements
- task cards and task editing UIs that match the existing dashboard style
- layout building blocks like cards, sidebars, and tables
- modals, dialogs, and empty-state patterns that already follow the app design

If a component is not listed here, add it to `packages/ui-components` first and then export it from `src/index.ts`.

| Component | Props summary | Use case |
|-----------|---------------|---------|
| `Button` | `variant`, `size`, `loading`, `disabled`, `type` | Any clickable button with consistent styling |
| `Input` | `label`, `error`, `hint`, `leftIcon`, `value`, `onChange` | Text fields with built-in labels and validation support |
| `Textarea` | `label`, `error`, `hint`, `value`, `onChange` | Multi-line text input for comments or descriptions |
| `Select` | `label`, `options[]`, `placeholder`, `value`, `onChange` | Dropdown selector for controlled option input |
| `TaskCard` | `title`, `priority`, `status`, `dueDate`, `assignee`, `tags` | Display a single task summary in lists and boards |
| `TaskModal` | `open`, `onClose`, `onSubmit`, `initialData`, `assigneeOptions` | Create/edit task form dialog with reusable fields |
| `KanbanColumn` | `status`, `tasks[]`, `onAddTask`, drag events | Drag & drop column for kanban board sections |
| `PriorityBadge` | `priority` | Color-coded badge for task priority levels |
| `StatusBadge` | `status` | Color-coded badge for task status labels |
| `ProgressBar` | `value`, `max`, `label`, `color` | Linear progress visualization for goals and stats |
| `ProgressCircle` | `value`, `max`, `size`, `color`, `label` | Circular progress ring for dashboard metrics |
| `StatsCard` | `title`, `value`, `subtitle`, `icon`, `trend` | Metric card for dashboard overview panels |
| `UserAvatar` | `name`, `src`, `size` | Avatar with initials fallback and image support |
| `AvatarGroup` | `users[]`, `max` | Stacked avatar group for team member previews |
| `SearchInput` | `value`, `onChange`, `debounceMs`, `placeholder` | Search field with debounce to reduce frequent updates |
| `FilterBar` | `search`, `priorities`, `statuses`, `onSearchChange`, `onFilterChange` | Combined search + filter control panel |
| `Sidebar` | `sections[]`, `activeId`, `onSelect`, `header`, `footer` | Navigation sidebar for apps and project selection |
| `EmptyState` | `title`, `description`, `icon`, `action` | Placeholder UI for empty lists or no-data screens |
| `ConfirmationDialog` | `open`, `title`, `description`, `onConfirm`, `onCancel`, `variant` | Confirm modal for destructive or important actions |

#### How to choose the right component
- use `Button` for any clickable action and prefer `variant="primary"` for the main call to action and `variant="ghost"` for secondary links
- use `Input`, `Textarea`, and `Select` for form controls so styling and validation appearance stay consistent
- use `TaskCard` for task listings and `TaskModal` for add/edit task dialogs instead of rebuilding form markup
- use `StatusBadge` and `PriorityBadge` for status/priority labels so the color language stays the same across screens
- use layout components like `Card`, `Sidebar`, and `StatsCard` for page structure rather than custom panels

### Utilities in `@cbsd/utils`

The utilities package contains pure helper functions and shared types that support both apps. It does not contain React components or JSX. Use these helpers for logic, formatting, filtering, and storage.

Common patterns:
- put date-related helpers in `dateUtils.ts`
- put priority and status helpers in `priorityHelpers.ts` / `statusHelpers.ts`
- put task filtering and grouping logic in `taskFilters.ts`
- put persistence helpers in `storageHelpers.ts`
- keep type definitions in `types.ts`

| Function | File | What it does |
|----------|------|-------------|
| `formatDate(date, format)` | `dateUtils` | Formats dates as "Jan 5, 2025" or relative "2d ago" |
| `isOverdue(date)` | `dateUtils` | Returns `true` if date is in the past |
| `daysUntilDue(date)` | `dateUtils` | Number of days left (negative = overdue) |
| `isToday(date)` | `dateUtils` | Returns `true` if a date is today |
| `getWeekDates()` | `dateUtils` | Array of 7 Date objects for the current week |
| `generateId(prefix?)` | `idUtils` | Creates a unique ID like `task-abc123` |
| `getPriorityConfig(priority)` | `priorityHelpers` | Returns `{ label, color, bgColor, sortOrder }` for UI display |
| `sortByPriority(items)` | `priorityHelpers` | Sorts array by priority (high first) |
| `getStatusConfig(status)` | `statusHelpers` | Returns `{ label, color, bgColor }` for status display |
| `filterTasks(tasks, options)` | `taskFilters` | Filter by status, priority, search, dates |
| `sortTasks(tasks, by, dir)` | `taskFilters` | Sort by priority, dueDate, createdAt, title |
| `groupTasksByStatus(tasks)` | `taskFilters` | Returns grouped tasks by status for dashboard views |
| `getTasksDueToday(tasks)` | `taskFilters` | Returns tasks due today |
| `getOverdueTasks(tasks)` | `taskFilters` | Returns unfinished overdue tasks |
| `loadFromStorage(key, defaultValue)` | `storageHelpers` | Read from localStorage safely with fallback |
| `saveToStorage(key, data)` | `storageHelpers` | Write to localStorage safely |
| `TEAMFLOW_KEYS` | `storageHelpers` | Storage key constants specific to TeamFlow |
| `PERSONALFOCUS_KEYS` | `storageHelpers` | Storage key constants specific to PersonalFocus |
| `getInitials(name)` | `stringHelpers` | "John Doe" → "JD" for avatar fallback |
| `truncate(str, maxLen)` | `stringHelpers` | Shortens text and appends "..." if too long |
| `validateTaskTitle(title)` | `validationHelpers` | Returns an error string or `null` for task title validation |
| `calculateCompletionPercentage(tasks)` | `statsHelpers` | Calculates project completion rate as a percentage |
| `getTaskStatsByStatus(tasks)` | `statsHelpers` | Returns counts for todo, inProgress, done, and overdue |
| `calculateProductivityScore(tasks)` | `statsHelpers` | Returns a normalized productivity score based on task completion |
| `calculateHabitStreak(habit)` | `statsHelpers` | Number of consecutive days a habit has been completed |

#### Best practices for utilities
- import only the helpers you need, e.g. `import { formatDate } from "@cbsd/utils"`
- keep utilities pure: they should not read browser APIs directly unless they are explicitly storage helpers
- avoid putting UI formatting helpers in utilities unless they are generic enough for both apps
- if a helper is only used by one app and not shared, prefer adding it to the app rather than to `@cbsd/utils`

---

| Mistake | Why it's wrong | Fix |
|---------|---------------|-----|
| Building a component inside `apps/` | Breaks the course architecture rule | Move it to `packages/ui-components/src/` |
| Forgetting to export from `index.ts` | Component won't be importable | Always add export to barrel file |
| Installing a package only in root | Won't be available to the app that needs it | Run `pnpm add <package> --filter feature-x` |
| Using `@radix-ui/react-badge` | This package does not exist on npm | Don't add it — build badges with Tailwind |
| Importing between apps | `feature-x` must NOT import from `feature-y` | Extract the shared code to `packages/` |
| Adding `@cbsd/utils` as dep of `ui-components` | Creates a dependency loop | Keep utils-like logic inline in components |
| Not running `pnpm install` after changing `package.json` | New deps won't be available | Always run `pnpm install` from root after |
| Using `require()` or relative `../../` imports across packages | Breaks when packages move | Always use the package name `@cbsd/ui-components` |

---

## 14. Step-by-step example: adding a new component end to end

Let's walk through adding a **`NotificationBanner`** component (a dismissible alert bar) and using it in both apps.

### Part A — Create the component

**File:** `packages/ui-components/src/NotificationBanner.tsx`

```tsx
"use client";
import React, { useState } from "react";
import { cn } from "./utils";

export type BannerVariant = "info" | "success" | "warning" | "error";

export interface NotificationBannerProps {
  message: string;
  variant?: BannerVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const STYLES: Record<BannerVariant, string> = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  error: "bg-red-50 border-red-200 text-red-800",
};

export function NotificationBanner({
  message,
  variant = "info",
  dismissible = true,
  onDismiss,
  className,
}: NotificationBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  function handleDismiss() {
    setVisible(false);
    onDismiss?.();
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm font-medium",
        STYLES[variant],
        className
      )}
      role="alert"
    >
      <span>{message}</span>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
```

### Part B — Export it

Open `packages/ui-components/src/index.ts` and add:

```ts
export { NotificationBanner } from "./NotificationBanner";
export type { NotificationBannerProps, BannerVariant } from "./NotificationBanner";
```

### Part C — Use it in TeamFlow

Open `apps/feature-x/src/app/page.tsx`:

```tsx
// Add to imports at the top:
import { NotificationBanner, /* ...existing */ } from "@cbsd/ui-components";

// Add inside the JSX, e.g. below the stats strip:
{stats.overdue > 0 && (
  <NotificationBanner
    variant="warning"
    message={`⚠ You have ${stats.overdue} overdue task${stats.overdue > 1 ? "s" : ""}. Review them in the Kanban board.`}
    className="mx-6 mt-3"
  />
)}
```

### Part D — Use it in PersonalFocus

Open `apps/feature-y/src/app/page.tsx`:

```tsx
import { NotificationBanner, /* ...existing */ } from "@cbsd/ui-components";

// Add near the top of the Today tab content:
{tab === "today" && (
  <div className="space-y-6">
    {stats.overdue > 0 && (
      <NotificationBanner
        variant="error"
        message={`You have ${stats.overdue} overdue task${stats.overdue > 1 ? "s" : ""}!`}
      />
    )}
    {/* rest of today content */}
  </div>
)}
```

### Part E — Verify

```bash
pnpm dev
```

Check both http://localhost:3000 and http://localhost:3001. If you have overdue tasks (tasks with past due dates), the banner will show.

---

## Summary checklist for adding a component

```
□ Created  packages/ui-components/src/MyComponent.tsx
□ Added "use client"; at the top
□ Exported component AND its props type from index.ts
□ Used cn() for all className logic
□ Accepted className as a prop
□ Imported and used it in the app with: import { MyComponent } from "@cbsd/ui-components"
□ Ran pnpm dev to test visually
```

## Summary checklist for adding a utility

```
□ Added function to the correct file in packages/utils/src/
□ Added export to packages/utils/src/index.ts
□ Wrote a JSDoc comment explaining what it does
□ Imported and used it: import { myFunction } from "@cbsd/utils"
```

---

*Questions? Open an issue on the repo or tag [@daniel-mitiku](https://github.com/daniel-mitiku) in a comment.*
