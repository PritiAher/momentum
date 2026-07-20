import { useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

const priorityColor: Record<string, string> = {
  High: "text-danger bg-danger-muted",
  Medium: "text-warning bg-warning-muted",
  Low: "text-ink-faint bg-base-surface-raised",
};

export default function TaskListView({ tasks, onEdit }: { tasks: Task[]; onEdit: (task: Task) => void }) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  if (tasks.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-sm font-medium text-ink">No tasks match these filters</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-base-border text-left text-xs text-ink-faint">
            <th className="w-8 px-4 py-2.5"></th>
            <th className="px-4 py-2.5 font-medium">Task</th>
            <th className="px-4 py-2.5 font-medium">Category</th>
            <th className="px-4 py-2.5 font-medium">Priority</th>
            <th className="px-4 py-2.5 font-medium">Deadline</th>
            <th className="px-4 py-2.5 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "Done";
            return (
              <tr key={task._id} className="border-b border-base-border-subtle last:border-0 hover:bg-base-surface-raised">
                <td className="px-4 py-2.5">
                  <input
                    type="checkbox"
                    checked={task.status === "Done"}
                    onChange={(e) =>
                      updateTask.mutate({ id: task._id, payload: { status: e.target.checked ? "Done" : "Todo" } })
                    }
                    className="accent-accent"
                  />
                </td>
                <td className={cn("px-4 py-2.5 font-medium text-ink", task.status === "Done" && "text-ink-faint line-through")}>
                  {task.title}
                </td>
                <td className="px-4 py-2.5 text-ink-muted">{task.category}</td>
                <td className="px-4 py-2.5">
                  <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", priorityColor[task.priority])}>
                    {task.priority}
                  </span>
                </td>
                <td className={cn("px-4 py-2.5 font-mono text-xs", isOverdue ? "font-medium text-danger" : "text-ink-muted")}>
                  {task.deadline
                    ? new Date(task.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
                    : "—"}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(task)}
                      className="rounded-md p-1.5 text-ink-faint hover:bg-base-surface hover:text-ink"
                      aria-label="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${task.title}"?`)) deleteTask.mutate(task._id);
                      }}
                      className="rounded-md p-1.5 text-ink-faint hover:bg-danger-muted hover:text-danger"
                      aria-label="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
