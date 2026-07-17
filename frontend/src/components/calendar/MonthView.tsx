import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { WEEKDAY_LABELS } from "@/lib/constants";
import type { EventOccurrence } from "@/types/calendar";

export default function MonthView({
  cursor,
  onCursorChange,
  occurrences,
  isLoading,
  onEdit,
  onDayClick,
}: {
  cursor: Date;
  onCursorChange: (date: Date) => void;
  occurrences: EventOccurrence[];
  isLoading: boolean;
  onEdit: (occurrence: EventOccurrence) => void;
  onDayClick: (date: Date) => void;
}) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const occurrencesByDay: Record<number, EventOccurrence[]> = {};
  occurrences.forEach((o) => {
    const d = new Date(o.startTime);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      occurrencesByDay[day] = occurrencesByDay[day] || [];
      occurrencesByDay[day].push(o);
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
          onClick={() => onCursorChange(new Date(year, month - 1, 1))}
          className="rounded-md p-1.5 text-ink-faint hover:bg-base-surface-raised hover:text-ink"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-semibold text-ink">
          {cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
        <button
          onClick={() => onCursorChange(new Date(year, month + 1, 1))}
          className="rounded-md p-1.5 text-ink-faint hover:bg-base-surface-raised hover:text-ink"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-sm text-ink-faint">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-ink-faint">
            {WEEKDAY_LABELS.map((d) => (
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
                  onClick={() => onDayClick(new Date(year, month, day))}
                  className={cn(
                    "min-h-[88px] cursor-pointer rounded-lg border border-base-border-subtle p-1.5 transition-colors hover:border-ink-faint",
                    isToday(day) && "border-accent"
                  )}
                >
                  <p className={cn("text-xs", isToday(day) ? "font-semibold text-accent" : "text-ink-faint")}>{day}</p>
                  <div className="mt-1 space-y-0.5">
                    {(occurrencesByDay[day] || []).slice(0, 3).map((o) => (
                      <button
                        key={o.occurrenceId}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(o);
                        }}
                        className="flex w-full items-center gap-1 truncate rounded px-1 py-0.5 text-left text-[10px] text-white"
                        style={{ backgroundColor: o.color }}
                      >
                        <span className="truncate">{o.title}</span>
                      </button>
                    ))}
                    {(occurrencesByDay[day]?.length || 0) > 3 && (
                      <p className="px-1 text-[10px] text-ink-faint">+{occurrencesByDay[day].length - 3} more</p>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
