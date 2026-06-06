# Task Management Dashboard — CBSD Monorepo

> **Course:** Component Based Software Development (SEng5306)  
> **Instructor:** [@daniel-mitiku](https://github.com/daniel-mitiku)  
> **Student:** [@IamMachir](https://github.com/IamMachir)

A full-featured **Task Management Dashboard** built as a Turborepo monorepo, demonstrating component-based software development principles: reusable packages, shared utilities, and feature assembly.

---

## Monorepo Structure

```
cbsd-task-management-monorepo/
├── apps/
│   ├── feature-x/          # TeamFlow — Kanban team task management (port 3000)
│   └── feature-y/          # PersonalFocus — Personal daily planner (port 3001)
├── packages/
│   ├── ui-components/      # Reusable React UI components (Shadcn/ui style)
│   └── utils/              # Shared utility functions and TypeScript types
├── turbo.json              # Turborepo pipeline config
├── pnpm-workspace.yaml     # pnpm workspace declaration
├── package.json            # Root scripts and dev tooling
└── README.md
```

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Turborepo](https://turbo.build/) | Monorepo build system with caching |
| [pnpm](https://pnpm.io/) | Fast, disk-efficient package manager |
| [Next.js 15](https://nextjs.org/) | React framework (App Router) for both apps |
| [TypeScript 5](https://www.typescriptlang.org/) | Type safety across all packages |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Shadcn/ui](https://ui.shadcn.com/) | Component design system |
| [Lucide React](https://lucide.dev/) | Icon library |

---

## Packages

### `packages/ui-components` — Reusable UI Library

All UI building blocks consumed by both feature apps. No app-specific logic.

| Component | Description |
|-----------|-------------|
| `Button` | Variant-aware button (primary, secondary, danger, ghost, outline) |
| `Input` | Labeled input with validation states |
| `Textarea` | Multi-line text input |
| `Select` | Dropdown selector with options |
| `TaskCard` | Full task display with priority, status, due date, assignee |
| `TaskModal` | Create/edit task form dialog |
| `KanbanColumn` | Drag-and-drop kanban column |
| `PriorityBadge` | Color-coded priority indicator |
| `StatusBadge` | Task status indicator |
| `ProgressBar` | Linear progress indicator |
| `ProgressCircle` | Circular SVG progress ring |
| `StatsCard` | Metric display card with trend |
| `UserAvatar` | Avatar with initials fallback + color hashing |
| `AvatarGroup` | Stacked avatar display |
| `SearchInput` | Search box with debounce support |
| `FilterBar` | Combined search + priority/status filters |
| `Sidebar` | Navigation sidebar with sections |
| `EmptyState` | Empty/zero-state placeholder |
| `ConfirmationDialog` | Modal confirmation dialog |

### `packages/utils` — Shared Utility Library

Pure TypeScript functions and types used across all apps.

| Module | Exports |
|--------|---------|
| `types.ts` | `Task`, `Project`, `TeamMember`, `Habit`, `FilterOptions`, `Priority`, `Status` |
| `dateUtils.ts` | `formatDate`, `getRelativeTime`, `isOverdue`, `daysUntilDue`, `isSameDay`, `isToday`, `getWeekDates` |
| `idUtils.ts` | `generateId`, `generateShortId`, `generateSlug` |
| `priorityHelpers.ts` | `getPriorityConfig`, `getPriorityColor`, `sortByPriority`, `PRIORITY_OPTIONS` |
| `statusHelpers.ts` | `getStatusConfig`, `getStatusLabel`, `isCompleted`, `KANBAN_COLUMNS` |
| `taskFilters.ts` | `filterTasks`, `sortTasks`, `groupTasksByStatus`, `getOverdueTasks`, `getTasksDueToday` |
| `storageHelpers.ts` | `saveToStorage`, `loadFromStorage`, `TEAMFLOW_KEYS`, `PERSONALFOCUS_KEYS` |
| `stringHelpers.ts` | `capitalize`, `truncate`, `getInitials`, `toTitleCase`, `highlightMatch` |
| `validationHelpers.ts` | `validateTaskTitle`, `validateDueDate`, `isValidEmail`, `isValidUrl` |
| `statsHelpers.ts` | `calculateCompletionPercentage`, `getTaskStatsByStatus`, `calculateHabitStreak`, `calculateProductivityScore` |

---

## Feature Apps

### `apps/feature-x` — TeamFlow (port 3000)

A **Kanban-style team task management** dashboard.

**Features:**
- Drag & drop tasks between To Do / In Progress / Done columns
- Team member assignment with avatar display
- Multi-project switcher
- Real-time search and filter
- Statistics dashboard (completion rates, team workload by member, project progress)
- Persistent state via localStorage

### `apps/feature-y` — PersonalFocus (port 3001)

A **personal productivity and daily planning** dashboard.

**Features:**
- Today view with weekly calendar overview
- Task management with priority-based sorting
- Pomodoro timer widget
- Daily habit tracker with 7-day streak visualization
- Productivity score and statistics dashboard
- Persistent state via localStorage

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 9

```bash
npm install -g pnpm
```

### Installation

```bash
# Clone the repo
git clone https://github.com/IamMachir/Task-Management-new-Repo.git
cd Task-Management-new-Repo

# Install all dependencies
pnpm install
```

### Development

```bash
# Run both apps simultaneously
pnpm dev

# Run only TeamFlow (feature-x)
pnpm dev:feature-x

# Run only PersonalFocus (feature-y)
pnpm dev:feature-y
```

Then open:
- **TeamFlow:** http://localhost:3000
- **PersonalFocus:** http://localhost:3001

### Build

```bash
pnpm build
```

### Type Check

```bash
pnpm typecheck
```

---

## Architecture Decisions

1. **Shared packages as the single source of truth** — All UI components and utility functions live in `packages/`. Apps only assemble them.
2. **TypeScript everywhere** — Strict mode enabled across all packages ensures type safety at package boundaries.
3. **Workspace protocol** — `@cbsd/ui-components: "workspace:*"` ensures apps always use the local package, not a published version.
4. **`next.config.ts` transpilePackages** — Both apps use `transpilePackages: ["@cbsd/ui-components", "@cbsd/utils"]` so Next.js compiles local workspace packages correctly.
5. **Mock data + localStorage** — No backend required. Data is seeded from mock data and persisted to `localStorage` for a realistic demo experience.

---

## Adding New Components

1. Create `packages/ui-components/src/MyComponent.tsx`
2. Export it from `packages/ui-components/src/index.ts`
3. Import in any app: `import { MyComponent } from "@cbsd/ui-components"`

## Adding New Utilities

1. Create `packages/utils/src/myUtils.ts`
2. Export from `packages/utils/src/index.ts`
3. Import in any app: `import { myFunction } from "@cbsd/utils"`

---

## License

MIT
