import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

const priorityDot: Record<string, string> = {
  High: "bg-danger",
  Medium: "bg-warning",
  Low: "bg-ink-faint",
};

/**
 * A simple month grid scoped to task deadlines. Deliberately NOT the shared
 * calendar component — Module 2 (Calendar) will handle classes, recurring
 * study blocks, exams etc. with its own drag-and-drop weekly/monthly views.
 * This one just answers "what's due when" for tasks.
 */
export default function TaskCalendarView({ tasks, onEdit }: { tasks: Task[]; onEdit: (task: Task) => void }) {
  const [cursor, setCursor] = useState(new Date());

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const tasksByDay: Record<number, Task[]> = {};
  tasks.forEach((t) => {
    if (!t.deadline) return;
    const d = new Date(t.deadline);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      tasksByDay[day] = tasksByDay[day] || [];
      tasksByDay[day].push(t);
    }
  });

  const cells = [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="rounded-md p-1.5 text-ink-faint hover:bg-base-surface-raised hover:text-ink"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-semibold text-ink">
          {cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
        <button
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="rounded-md p-1.5 text-ink-faint hover:bg-base-surface-raised hover:text-ink"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-ink-faint">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) =>
          day === null ? (
            <div key={`empty-${i}`} />
          ) : (
            <div
              key={day}
              className={cn(
                "min-h-[72px] rounded-lg border border-base-border-subtle p-1.5",
                isToday(day) && "border-accent"
              )}
            >
              <p className={cn("text-xs", isToday(day) ? "font-semibold text-accent" : "text-ink-faint")}>{day}</p>
              <div className="mt-1 space-y-0.5">
                {(tasksByDay[day] || []).slice(0, 3).map((t) => (
                  <button
                    key={t._id}
                    onClick={() => onEdit(t)}
                    className="flex w-full items-center gap-1 truncate rounded px-1 py-0.5 text-left text-[10px] text-ink-muted hover:bg-base-surface-raised"
                  >
                    <span className={cn("h-1 w-1 shrink-0 rounded-full", priorityDot[t.priority])} />
                    <span className="truncate">{t.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
