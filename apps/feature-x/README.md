# feature-x — TeamFlow

> Kanban-style team task management dashboard

## Overview

**TeamFlow** is a collaborative task management application built for teams. It provides a visual Kanban board experience with drag-and-drop task management, team assignments, multi-project support, and a statistics overview.

This app **only handles routing, configuration, and assembly**. All UI components are imported from `@cbsd/ui-components` and all logic/utilities from `@cbsd/utils`.

---

## Features

| Feature | Description |
|---------|-------------|
| **Kanban Board** | Three columns: To Do, In Progress, Done with drag & drop |
| **Drag & Drop** | Move tasks between columns by dragging |
| **Team Assignment** | Assign tasks to team members with avatar display |
| **Multi-Project** | Switch between projects using the sidebar |
| **Search & Filter** | Real-time search across task titles and descriptions |
| **Statistics** | Per-project completion rates, team workload visualization |
| **CRUD** | Create, edit, delete tasks with a full-featured modal form |
| **Persistence** | All data saved to `localStorage` between sessions |

---

## Architecture

```
apps/feature-x/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Next.js root layout + metadata
│   │   ├── page.tsx        # Main page — assembles all components
│   │   └── globals.css     # Tailwind base + custom scrollbar
│   ├── hooks/
│   │   └── useTasks.ts     # Task state management (uses @cbsd/utils)
│   └── data/
│       └── mockData.ts     # Seed data for projects, members, tasks
├── next.config.ts           # transpilePackages for workspace packages
├── tailwind.config.ts       # Tailwind with ui-components path included
└── package.json
```

### Shared Package Usage

```typescript
// UI Components from @cbsd/ui-components
import { KanbanColumn, TaskCard, TaskModal, StatsCard,
         FilterBar, Sidebar, ConfirmationDialog } from "@cbsd/ui-components";

// Utilities from @cbsd/utils
import { filterTasks, groupTasksByStatus, getTaskStatsByStatus,
         calculateCompletionPercentage, generateId,
         loadFromStorage, saveToStorage } from "@cbsd/utils";
```

---

## Running

```bash
# From monorepo root
pnpm dev:feature-x

# Or directly
cd apps/feature-x
pnpm dev
```

Open http://localhost:3000

---

## Mock Data

The app ships with sample data in `src/data/mockData.ts`:
- 5 team members (Alex, Sarah, Marcus, Priya, Jordan)
- 3 projects (Website Redesign, Mobile App, API Integration)
- 9 tasks across all projects with varying priorities and statuses

All data persists to `localStorage` under the `teamflow:*` namespace.
