import { ListChecks } from "lucide-react";
import type { Task } from "@/types";

const priorityColor: Record<string, string> = {
  High: "text-danger",
  Medium: "text-warning",
  Low: "text-ink-faint",
};

export default function TopTasksCard({ tasks }: { tasks: Task[] }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-ink-faint">
        <ListChecks size={15} />
        <span className="text-xs font-medium uppercase tracking-wide">Today's Top Tasks</span>
      </div>

      {tasks.length === 0 ? (
        <div className="mt-4">
          <p className="text-sm text-ink-faint">No pending tasks yet.</p>
          <p className="mt-1 text-xs text-ink-faint">Task Manager (Module 3) lands in a later phase.</p>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {tasks.map((task) => (
            <div key={task._id} className="flex items-center justify-between rounded-lg bg-base-surface-raised px-3 py-2">
              <p className="truncate text-sm font-medium text-ink">{task.title}</p>
              <span className={`shrink-0 text-xs font-medium ${priorityColor[task.priority]}`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
