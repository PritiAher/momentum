import { Pencil, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeleteTask } from "@/hooks/useTasks";
import type { Task } from "@/types";

const priorityDot: Record<string, string> = {
  High: "bg-danger",
  Medium: "bg-warning",
  Low: "bg-ink-faint",
};

export default function TaskCard({
  task,
  onEdit,
  draggable = false,
  onDragStart,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
}) {
  const deleteTask = useDeleteTask();
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "Done";

  return (
    <div
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, task)}
      className={cn("group card cursor-default p-3", draggable && "cursor-grab active:cursor-grabbing")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <span className={cn("mt-1 h-1.5 w-1.5 shrink-0 rounded-full", priorityDot[task.priority])} />
          <p className="text-sm font-medium text-ink">{task.title}</p>
        </div>
        <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(task)}
            className="rounded-md p-1 text-ink-faint hover:bg-base-surface-raised hover:text-ink"
            aria-label="Edit"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${task.title}"?`)) deleteTask.mutate(task._id);
            }}
            className="rounded-md p-1 text-ink-faint hover:bg-danger-muted hover:text-danger"
            aria-label="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 pl-3.5 text-xs text-ink-faint">
        <span>{task.category}</span>
        {task.deadline && (
          <>
            <span>·</span>
            <span className={cn(isOverdue && "font-medium text-danger")}>
              {new Date(task.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
            </span>
          </>
        )}
        {task.estimatedMinutes && (
          <>
            <span>·</span>
            <span className="flex items-center gap-0.5">
              <Clock size={10} /> {task.estimatedMinutes}m
            </span>
          </>
        )}
      </div>
    </div>
  );
}
