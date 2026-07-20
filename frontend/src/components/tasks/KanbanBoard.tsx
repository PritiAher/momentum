import { useState } from "react";
import { Plus } from "lucide-react";
import TaskCard from "@/components/tasks/TaskCard";
import { useUpdateTask } from "@/hooks/useTasks";
import { TASK_STATUSES, TASK_STATUS_LABELS } from "@/lib/constants";
import type { Task } from "@/types";

export default function KanbanBoard({
  tasks,
  onEdit,
  onAddToColumn,
}: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onAddToColumn: (status: string) => void;
}) {
  const updateTask = useUpdateTask();
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("text/plain", task._id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData("text/plain");
    const task = tasks.find((t) => t._id === taskId);
    if (task && task.status !== status) {
      updateTask.mutate({ id: taskId, payload: { status: status as Task["status"] } });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {TASK_STATUSES.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverColumn(status);
            }}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => handleDrop(e, status)}
            className={`rounded-xl border border-dashed p-3 transition-colors ${
              dragOverColumn === status ? "border-accent bg-accent-muted" : "border-base-border-subtle"
            }`}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-ink">{TASK_STATUS_LABELS[status]}</span>
                <span className="rounded-full bg-base-surface-raised px-1.5 py-0.5 font-mono text-xs text-ink-faint">
                  {columnTasks.length}
                </span>
              </div>
              <button
                onClick={() => onAddToColumn(status)}
                className="rounded-md p-1 text-ink-faint hover:bg-base-surface-raised hover:text-ink"
                aria-label={`Add task to ${TASK_STATUS_LABELS[status]}`}
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="space-y-2">
              {columnTasks.map((task) => (
                <TaskCard key={task._id} task={task} onEdit={onEdit} draggable onDragStart={handleDragStart} />
              ))}
              {columnTasks.length === 0 && (
                <p className="px-1 py-3 text-center text-xs text-ink-faint">Drop tasks here</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
