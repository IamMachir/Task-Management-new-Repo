# feature-y — PersonalFocus

> Personal productivity and daily planning dashboard

## Overview

**PersonalFocus** is a personal task management and habit tracking app. It combines a daily task planner, habit streak tracker, Pomodoro timer widget, and productivity statistics into a clean, focused interface.

This app **only handles routing, configuration, and assembly**. All UI components are imported from `@cbsd/ui-components` and all logic/utilities from `@cbsd/utils`.

---

## Features

| Feature | Description |
|---------|-------------|
| **Today View** | Shows tasks due today with a weekly calendar overview |
| **All Tasks** | Full task list with search and priority sorting |
| **Habit Tracker** | Daily habit check-ins with 7-day history and streak counting |
| **Pomodoro Widget** | 25-minute focus timer in the header |
| **Stats Dashboard** | Productivity score, completion rate, habit performance charts |
| **Priority Planning** | Tasks sorted by priority (high → medium → low) |
| **Persistence** | All data saved to `localStorage` between sessions |

---

## Architecture

```
apps/feature-y/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Next.js root layout + metadata
│   │   ├── page.tsx        # Main page — tab-based assembly of all views
│   │   └── globals.css     # Tailwind base + purple theme
│   ├── hooks/
│   │   └── useTasks.ts     # Task + habit state (uses @cbsd/utils)
│   └── data/
│       └── mockData.ts     # Seed tasks and habits
├── next.config.ts
├── tailwind.config.ts       # Purple/violet theme
└── package.json
```

### Shared Package Usage

```typescript
// UI Components from @cbsd/ui-components
import { StatsCard, TaskCard, TaskModal, ProgressBar,
         ProgressCircle, FilterBar, Button, EmptyState,
         ConfirmationDialog } from "@cbsd/ui-components";

// Utilities from @cbsd/utils
import { formatDate, isToday, getWeekDates, sortTasks,
         calculateCompletionPercentage, calculateProductivityScore,
         calculateHabitStreak, getTasksDueToday,
         loadFromStorage, saveToStorage } from "@cbsd/utils";
```

---

## Views / Tabs

| Tab | Content |
|-----|---------|
| **Today** | Productivity score ring, weekly calendar, today's tasks |
| **All Tasks** | Full searchable/sortable task list |
| **Habits** | Daily habit check-ins with streak visualization |
| **Stats** | Productivity score, priority breakdown, habit performance |

---

## Running

```bash
# From monorepo root
pnpm dev:feature-y

# Or directly
cd apps/feature-y
pnpm dev
```

Open http://localhost:3001

---

## Mock Data

The app ships with sample data in `src/data/mockData.ts`:
- 8 personal tasks (health, learning, family, planning)
- 4 habits (Meditation, Exercise, Reading, No Social Media) with 7-day history

All data persists to `localStorage` under the `personalfocus:*` namespace.
