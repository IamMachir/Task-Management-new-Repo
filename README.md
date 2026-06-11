# Task Management Dashboard — CBSD Monorepo

> **A full-featured Task Management system built with a shared component architecture, demonstrating the principles of Component-Based Software Development.**

---

## Assignment Information

| Field | Details |
|-------|---------|
| **Course** | SEng5306 — Component Based Software Development |
| **Institution** | Adama Science and Technology University |
| **Instructor** | Daniel Metiku Bekere |
| **Assignment Type** | Group Laboratory Project (10% Weighting) |
| **Submission** | May 2026 |
| **Repository** | https://github.com/IamMachir/Task-Management-new-Repo |

The assignment information defines the course context, deliverable deadline, and the repository used for version control. This helps reviewers understand that the repository is both a learning project and a collaborative course assignment.

---

## Group Members

| Name | Student ID | Role |
|------|-----------|------|
| Machir Tadesse Woldemariam | UGE/27638/14 | Repository Lead |
| Abenezer Tewodros | UGE/27816/14 | Contributor |
| Efa Mirkana | UGE/27834/14 | Contributor |
| Musbah Rida | UGE/27831/14 | Contributor |
| Samuel Girma | UGE/27830/14 | Contributor |

The group member list shows the team structure and roles used during development. Each member owns different aspects of the project, which is useful for tracking responsibility and collaboration in a course submission.

---

## What We Built

This project is a **Task Management Dashboard** built as a **Turborepo monorepo** — a single repository containing two fully functional web apps powered by one shared library of reusable components and utility functions.

The design goal is to separate core UI logic and helper code into shared packages, while keeping each app shell focused on its own page layout and task flow. This makes it easier to extend the system with new screens or shared features without duplicating code.

### The Two Apps

| App | Name | Port | Description |
|-----|------|------|-------------|
| `apps/feature-x` | **TeamFlow** | 3000 | Kanban board for team task management with drag & drop, project switching, team assignment, and statistics |
| `apps/feature-y` | **PersonalFocus** | 3001 | Personal productivity planner with daily task list, habit tracker, Pomodoro timer, and productivity stats |

Both applications are built on the same shared packages, so they can reuse identical UI components and helper logic while still offering distinct workflows.

### The Two Shared Packages

| Package | Name | Description |
|---------|------|-------------|
| `packages/ui-components` | `@cbsd/ui-components` | 27 reusable React components used by both apps |
| `packages/utils` | `@cbsd/utils` | 30+ shared utility functions and TypeScript type definitions |

Both packages are designed to be imported by the apps as workspace dependencies, so shared behavior stays consistent across TeamFlow and PersonalFocus. The apps themselves remain lightweight wrappers that compose UI and business logic from these shared packages.

---

## Features

The features below describe the main capabilities of each app and how they reflect real-world task management needs.

### TeamFlow (`apps/feature-x`) 🗂️

- **Kanban Board** — Drag & drop tasks between To Do / In Progress / Done columns
- **Team Assignment** — Assign tasks to team members with avatar display
- **Multi-Project Switcher** — Switch between projects via sidebar navigation
- **Search & Filter** — Real-time search across all tasks
- **Statistics View** — Project completion rates, team workload per member
- **Compact Mode** — Toggle dense/comfortable layout via Switch component
- **Persistent State** — All data saved to localStorage, survives page refresh

These TeamFlow features are built to demonstrate collaborative task management in a shared workspace style, while keeping the interface responsive and easy to scan.

### PersonalFocus (`apps/feature-y`) 📅

- **Today View** — Daily task list with weekly calendar overview
- **All Tasks Tab** — Full task list with priority-based sorting and search
- **Habit Tracker** — Daily habits with 7-day streak visualization
- **Pomodoro Timer** — 25-minute focus sessions with start/pause control
- **Statistics Dashboard** — Productivity score, completion charts, overdue counts
- **Persistent State** — All data saved to localStorage

PersonalFocus is intentionally designed for individual productivity, with daily planning and habit tracking that complements the stronger team-oriented workflow in TeamFlow.

---

## Monorepo Structure

```
Task-Management-new-Repo/
│
├── apps/
│   ├── feature-x/                     ← TeamFlow (team Kanban dashboard)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx         ← Root HTML, fonts, metadata
│   │   │   │   ├── page.tsx           ← Main page (assembles shared components)
│   │   │   │   └── globals.css        ← Tailwind + custom styles
│   │   │   ├── hooks/
│   │   │   │   └── useTasks.ts        ← Task state management
│   │   │   └── data/
│   │   │       └── mockData.ts        ← Sample team, projects, tasks
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── feature-y/                     ← PersonalFocus (personal planner)
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx           ← Tab-based UI (Today/Tasks/Habits/Stats)
│       │   │   └── globals.css
│       │   ├── hooks/
│       │   │   └── useTasks.ts        ← Task + habit state management
│       │   └── data/
│       │       └── mockData.ts        ← Sample personal tasks and habits
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       └── package.json
│
├── packages/
│   ├── ui-components/                 ← Shared React component library
│   │   ├── src/
│   │   │   ├── index.ts               ← Single barrel export file
│   │   │   ├── utils.ts               ← cn() Tailwind class helper
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Alert.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Switch.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Accordion.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskModal.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── PriorityBadge.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── ProgressCircle.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── UserAvatar.tsx
│   │   │   ├── AvatarGroup.tsx
│   │   │   ├── Mane.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ConfirmationDialog.tsx
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── utils/                         ← Shared utility functions + TypeScript types
│       ├── src/
│       │   ├── index.ts               ← Single barrel export file
│       │   ├── types.ts               ← Task, Project, TeamMember, Habit, etc.
│       │   ├── dateUtils.ts
│       │   ├── idUtils.ts
│       │   ├── priorityHelpers.ts
│       │   ├── statusHelpers.ts
│       │   ├── taskFilters.ts
│       │   ├── storageHelpers.ts
│       │   ├── stringHelpers.ts
│       │   ├── validationHelpers.ts
│       │   └── statsHelpers.ts
│       ├── tsconfig.json
│       └── package.json
│
├── turbo.json                         ← Turborepo pipeline config
├── pnpm-workspace.yaml                ← Declares all workspace packages
├── package.json                       ← Root scripts
├── tsconfig.json                      ← Shared TypeScript base config
├── CONTRIBUTING.md                    ← Full contributor and onboarding guide
└── README.md
```

This structure enforces a clear boundary between app-specific pages and shared implementation details. Apps in `apps/` import UI and utilities from `packages/`, which improves reuse and keeps the codebase maintainable.

---

## Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Turborepo](https://turbo.build/) | 2.x | Monorepo build system with intelligent caching |
| [pnpm](https://pnpm.io/) | 9.x | Fast, disk-efficient package manager with workspace support |
| [Next.js](https://nextjs.org/) | 15.x | React framework (App Router) for both apps |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety across all packages |
| [Tailwind CSS](https://tailwindcss.com/) | 3.x | Utility-first CSS framework |
| [class-variance-authority](https://cva.style/) | 0.7.x | Variant-based component styling |
| [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/nicolo-ribaudo/tailwind-merge) | latest | Safe Tailwind class merging |

The stack was chosen to support a fast frontend developer experience: Turborepo for workspace orchestration, pnpm for efficient dependency management, Next.js for App Router structure, and Tailwind for consistent design without custom CSS frameworks.

---

## Component Library (`@cbsd/ui-components`)

All components are pure Tailwind CSS — no external UI framework dependencies.

The shared component library is intentionally built so that styling, spacing, and interaction patterns are reusable across both apps. New UI elements should be added here first, then exported through `@cbsd/ui-components` for use in app pages.

### Base Components

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `variant`, `size`, `loading`, `disabled` | Clickable button — primary, secondary, danger, ghost, outline variants |
| `Input` | `label`, `error`, `hint`, `leftIcon` | Text field with validation states |
| `Textarea` | `label`, `error`, `hint` | Multi-line text input |
| `Select` | `label`, `options[]`, `placeholder` | Dropdown selector |
| `Checkbox` | `checked`, `onChange`, `label`, `indeterminate` | Accessible checkbox |
| `Switch` | `checked`, `onChange`, `label`, `size` | Toggle on/off switch |

### Feedback & Display

| Component | Props | Description |
|-----------|-------|-------------|
| `Badge` | `variant`, `size` | Colored label — primary, secondary, success, error, warning, ghost |
| `Alert` | `variant`, `title`, `onDismiss` | Info/success/warning/error banner |
| `Skeleton` | `className`, `rounded` | Animated loading placeholder |
| `Tooltip` | `content`, `position` | Hover tooltip wrapping any element |

### Layout & Containers

| Component | Props | Description |
|-----------|-------|-------------|
| `Card` | `variant`, `padding` | Container card — default, outlined, elevated, ghost |
| `CardHeader` | `className` | Header section inside a Card |
| `CardTitle` | `className` | Title inside a CardHeader |
| `CardContent` | `className` | Content section inside a Card |
| `Modal` | `open`, `onClose`, `title`, `size` | Generic popup with backdrop + Esc to close |
| `Accordion` | `items[]`, `allowMultiple` | Collapsible expand/collapse sections |
| `Sidebar` | `sections[]`, `activeId`, `onSelect`, `header`, `footer` | Navigation sidebar |

### Task-Specific Components

| Component | Props | Description |
|-----------|-------|-------------|
| `TaskCard` | `title`, `priority`, `status`, `dueDate`, `assignee`, `tags` | Full task display card |
| `TaskModal` | `open`, `onClose`, `onSubmit`, `initialData` | Create/edit task form dialog |
| `KanbanColumn` | `status`, `tasks[]`, `onAddTask`, drag events | Drag & drop Kanban column |
| `PriorityBadge` | `priority` | "High" / "Medium" / "Low" colored badge |
| `StatusBadge` | `status` | "To Do" / "In Progress" / "Done" colored badge |
| `ProgressBar` | `value`, `max`, `label`, `color` | Linear progress indicator |
| `ProgressCircle` | `value`, `max`, `size`, `color` | Circular SVG progress ring |
| `StatsCard` | `title`, `value`, `subtitle`, `icon`, `trend` | Metric display card |
| `UserAvatar` | `name`, `src`, `size` | Avatar with color-hashed initials fallback |
| `AvatarGroup` | `users[]`, `max` | Stacked overlapping avatars |

### Utility Components

| Component | Props | Description |
|-----------|-------|-------------|
| `SearchInput` | `value`, `onChange`, `debounceMs` | Search box with debounce |
| `FilterBar` | `search`, priorities, statuses, callbacks | Combined search + filter UI |
| `EmptyState` | `title`, `description`, `icon`, `action` | Zero-state placeholder |
| `ConfirmationDialog` | `open`, `title`, `onConfirm`, `onCancel`, `variant` | Delete/action confirmation modal |

---

## Utility Library (`@cbsd/utils`)

Pure TypeScript functions — no React dependency.

The utility package is responsible for shared logic only: date formatting, ID generation, filters, storage helpers, and type definitions. It keeps business logic separate from presentation so both apps can reuse the same behavior consistently.

| Module | Key Exports |
|--------|------------|
| `types.ts` | `Task`, `Project`, `TeamMember`, `Habit`, `Priority`, `Status`, `FilterOptions` |
| `dateUtils.ts` | `formatDate`, `isOverdue`, `isToday`, `daysUntilDue`, `getWeekDates` |
| `idUtils.ts` | `generateId`, `generateShortId`, `generateSlug` |
| `priorityHelpers.ts` | `getPriorityConfig`, `sortByPriority`, `PRIORITY_OPTIONS` |
| `statusHelpers.ts` | `getStatusConfig`, `getStatusLabel`, `getStatusColor`, `KANBAN_COLUMNS` |
| `taskFilters.ts` | `filterTasks`, `sortTasks`, `groupTasksByStatus`, `getOverdueTasks`, `getTasksDueToday` |
| `storageHelpers.ts` | `loadFromStorage`, `saveToStorage`, `TEAMFLOW_KEYS`, `PERSONALFOCUS_KEYS` |
| `stringHelpers.ts` | `getInitials`, `truncate`, `capitalize`, `highlightMatch` |
| `validationHelpers.ts` | `validateTaskTitle`, `validateDueDate`, `isValidEmail` |
| `statsHelpers.ts` | `calculateCompletionPercentage`, `getTaskStatsByStatus`, `calculateProductivityScore`, `calculateHabitStreak` |

---

## Getting Started

This repo is managed as a monorepo, so most development tasks are run from the root folder. The root scripts coordinate builds and dev servers across both apps and shared packages.

### Prerequisites

- **Node.js** v18 or newer → https://nodejs.org
- **pnpm** → `npm install -g pnpm`
- **Git** → https://git-scm.com

These versions are chosen to match the monorepo tools and Next.js 15 compatibility. Using older Node or pnpm versions can lead to installation or runtime issues in this workspace.

### Installation

```bash
# Clone the repository
git clone https://github.com/IamMachir/Task-Management-new-Repo.git
cd Task-Management-new-Repo

# Install all dependencies for every app and package
pnpm install
```

### Running the Apps

```bash
# Start both apps at the same time
pnpm dev

# Or run individually
pnpm dev:feature-x    # TeamFlow only  → http://localhost:3000
pnpm dev:feature-y    # PersonalFocus only  → http://localhost:3001
```

### Build for Production

```bash
pnpm build
```

### Type Check

```bash
pnpm typecheck
```

---

## Component Usage Examples

### Using Badge

```tsx
import { Badge } from "@cbsd/ui-components";

<Badge variant="success" size="sm">Done</Badge>
<Badge variant="error" size="md">3 Overdue</Badge>
<Badge variant="primary">High Priority</Badge>
```

### Using Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@cbsd/ui-components";

<Card variant="default" padding="md">
  <CardHeader>
    <CardTitle>Team Workload</CardTitle>
  </CardHeader>
  <CardContent>
    <p>5 tasks in progress</p>
  </CardContent>
</Card>
```

### Using Switch

```tsx
import { Switch } from "@cbsd/ui-components";

const [isCompact, setIsCompact] = useState(false);

<Switch
  checked={isCompact}
  onChange={setIsCompact}
  label="Compact view"
/>
```

### Using Tooltip

Tooltips are best used for supplemental information that appears on hover or focus, rather than as the primary label for a control. Use them to clarify actions in dense UI patterns.

```tsx
import { Tooltip, Button } from "@cbsd/ui-components";

<Tooltip content="Create a new task" position="top">
  <Button>+ New Task</Button>
</Tooltip>
```

### Using Skeleton (loading state)

Skeletons help keep the interface feeling responsive by showing a placeholder layout while actual data is still loading. This prevents flicker and improves perceived performance.

```tsx
import { Skeleton } from "@cbsd/ui-components";

// While data is loading:
<div className="space-y-3">
  <Skeleton className="h-4 w-48" />
  <Skeleton className="h-8 w-24" />
  <Skeleton className="h-3 w-64" />
</div>
```

### Using utility functions

These utilities should be used for shared business logic and formatting, not UI rendering. Keep data transformation inside `@cbsd/utils` and visual rendering inside `@cbsd/ui-components`.

```tsx
import {
  filterTasks,
  formatDate,
  getStatusLabel,
  calculateCompletionPercentage,
} from "@cbsd/utils";
import type { Task } from "@cbsd/utils";

const overdueTasks = filterTasks(tasks, { isOverdue: true });
const label = getStatusLabel("in-progress"); // → "In Progress"
const pct = calculateCompletionPercentage(tasks); // → 67
const due = formatDate(task.dueDate, "relative"); // → "2d ago"
```

---

## Architecture Decisions

1. **Apps only assemble — packages contain all logic**
   Every reusable component and helper lives in `packages/`. App pages only import and arrange them. This enforces the CBSD principle of building software from pre-built components.

2. **`workspace:*` protocol for local packages**
   Apps declare `"@cbsd/ui-components": "workspace:*"` so pnpm always uses the local source — no publish step needed during development.

3. **`transpilePackages` in Next.js config**
   Both apps set `transpilePackages: ["@cbsd/ui-components", "@cbsd/utils"]` so Next.js compiles local TypeScript packages correctly without pre-building them.

4. **No external UI library dependency**
   All components are built with plain Tailwind CSS classes. This avoids version conflicts (e.g. `@radix-ui/react-badge` doesn't exist) and keeps the package lightweight.

5. **`"use client"` on all interactive components**
   Next.js App Router defaults to server components. Any component using `useState`, `useEffect`, or browser APIs must declare `"use client"` as its first line.

6. **localStorage for persistence — no backend needed**
   Data is seeded from `mockData.ts` on first load and persisted via `saveToStorage`/`loadFromStorage`. This keeps the demo fully self-contained.

---

## Development Workflow

### Adding a New Component

```bash
# 1. Create the component file
touch packages/ui-components/src/MyComponent.tsx

# 2. Export it from the barrel file
echo 'export { MyComponent } from "./MyComponent";' >> packages/ui-components/src/index.ts

# 3. Use it in any app
# import { MyComponent } from "@cbsd/ui-components";
```

### Adding a New Utility Function

```bash
# 1. Add the function to the appropriate module in packages/utils/src/
# 2. Export it from packages/utils/src/index.ts
# 3. Import anywhere: import { myFunction } from "@cbsd/utils"
```

See `CONTRIBUTING.md` for the full step-by-step guide with examples.

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|---------|
| `ERR_PNPM_FETCH_404` on install | A listed package doesn't exist on npm | Remove the bad package from `package.json` and re-run `pnpm install` |
| `useState` not working / "use client" error | Missing `"use client"` directive | Add `"use client";` as the very first line of the component file |
| Port 3000 already in use | Another process is running | Kill it: `npx kill-port 3000` |
| `turbo` not found | Node modules not installed | Run `pnpm install` from repo root |
| Changes not reflecting | Stale Turbo cache | Run `pnpm dev` (dev mode bypasses cache) |
| Type errors after adding a component | Missing export in `index.ts` | Export the component and its types from `packages/ui-components/src/index.ts` |

---

## Features Roadmap

- [ ] Task recurrence (daily / weekly / monthly)
- [ ] Task dependencies (blocking relationships)
- [ ] Time tracking per task
- [ ] Collaborative comments
- [ ] Calendar / timeline view
- [ ] User authentication
- [ ] Backend API + real database
- [ ] Mobile app (React Native / Expo)
- [ ] Export tasks to CSV

---

## Code Quality Standards

- ✅ TypeScript strict mode across all packages
- ✅ All components accept and forward `className` prop
- ✅ All interactive components declare `"use client"`
- ✅ All exported components have typed props interfaces
- ✅ No hardcoded data inside components — data passed via props
- ✅ `cn()` used for all conditional Tailwind class logic

---

## License

MIT

---

## Submission Statement

This repository represents collaborative work completed by all group members for the SEng5306 Component Based Software Development laboratory assignment. Each member has contributed components, utilities, and features to the shared monorepo, following the component-based architecture principles taught in the course.

**Submission Date:** May 2026
**Repository:** https://github.com/IamMachir/Task-Management-new-Repo
**Contributor Guide:** See [CONTRIBUTING.md](./CONTRIBUTING.md) for full onboarding instructions.
