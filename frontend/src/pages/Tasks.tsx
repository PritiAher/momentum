import { useState } from "react";
import { Plus, List, Kanban, CalendarDays } from "lucide-react";
import { useTasks, type TaskFilters } from "@/hooks/useTasks";
import TaskModal from "@/components/tasks/TaskModal";
import TaskListView from "@/components/tasks/TaskListView";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import TaskCalendarView from "@/components/tasks/TaskCalendarView";
import { TASK_CATEGORIES, TASK_PRIORITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

type ViewMode = "list" | "kanban" | "calendar";

export default function Tasks() {
  const [view, setView] = useState<ViewMode>("kanban");
  const [filters, setFilters] = useState<TaskFilters>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<string | undefined>(undefined);

  const { data: tasks, isLoading } = useTasks(filters);

  const openAdd = (status?: string) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setDefaultStatus(undefined);
    setModalOpen(true);
  };

  const viewTabs: { key: ViewMode; label: string; icon: typeof List }[] = [
    { key: "kanban", label: "Kanban", icon: Kanban },
    { key: "list", label: "List", icon: List },
    { key: "calendar", label: "Calendar", icon: CalendarDays },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Tasks</h1>
        <button
          onClick={() => openAdd()}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          <Plus size={15} /> New task
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-base-border bg-base-surface p-0.5">
          {viewTabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                view === key ? "bg-accent-muted text-accent" : "text-ink-muted hover:text-ink"
              )}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <select
          value={filters.category || ""}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          className="rounded-lg border border-base-border bg-base-surface px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent"
        >
          <option value="">All categories</option>
          {TASK_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.priority || ""}
          onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
          className="rounded-lg border border-base-border bg-base-surface px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent"
        >
          <option value="">All priority</option>
          {TASK_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        {isLoading || !tasks ? (
          <div className="card p-10 text-center text-sm text-ink-faint">Loading...</div>
        ) : view === "list" ? (
          <TaskListView tasks={tasks} onEdit={openEdit} />
        ) : view === "kanban" ? (
          <KanbanBoard tasks={tasks} onEdit={openEdit} onAddToColumn={openAdd} />
        ) : (
          <TaskCalendarView tasks={tasks} onEdit={openEdit} />
        )}
      </div>

      <TaskModal open={modalOpen} onOpenChange={setModalOpen} editingTask={editingTask} defaultStatus={defaultStatus} />
    </div>
  );
}
