import { useState } from "react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateCalendarEvent } from "@/hooks/useCalendarEvents";
import { WEEKDAY_LABELS } from "@/lib/constants";
import type { EventOccurrence } from "@/types/calendar";

const START_HOUR = 6;
const END_HOUR = 23; // exclusive
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

const startOfWeek = (date: Date) => {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
};

export default function WeekView({
  cursor,
  onCursorChange,
  occurrences,
  isLoading,
  onEdit,
  onSlotClick,
}: {
  cursor: Date;
  onCursorChange: (date: Date) => void;
  occurrences: EventOccurrence[];
  isLoading: boolean;
  onEdit: (occurrence: EventOccurrence) => void;
  onSlotClick: (date: Date, hour: number) => void;
}) {
  const updateEvent = useUpdateCalendarEvent();
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  const weekStart = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const today = new Date();

  const eventsForDay = (day: Date) => occurrences.filter((o) => isSameDay(new Date(o.startTime), day));

  const handleDragStart = (e: React.DragEvent, occurrence: EventOccurrence) => {
    if (occurrence.isRecurring) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", occurrence._id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, day: Date, hour: number) => {
    e.preventDefault();
    setDragOverSlot(null);
    const eventId = e.dataTransfer.getData("text/plain");
    const occurrence = occurrences.find((o) => o._id === eventId);
    if (!occurrence) return;

    const oldStart = new Date(occurrence.startTime);
    const durationMs = new Date(occurrence.endTime).getTime() - oldStart.getTime();
    const newStart = new Date(day);
    newStart.setHours(hour, oldStart.getMinutes(), 0, 0);
    const newEnd = new Date(newStart.getTime() + durationMs);

    updateEvent.mutate({
      id: occurrence._id,
      payload: { startTime: newStart.toISOString(), endTime: newEnd.toISOString() },
    });
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-base-border px-4 py-3">
        <button
          onClick={() =>
            onCursorChange(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() - 7))
          }
          className="rounded-md p-1.5 text-ink-faint hover:bg-base-surface-raised hover:text-ink"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-semibold text-ink">
          {weekStart.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} –{" "}
          {days[6].toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </p>
        <button
          onClick={() =>
            onCursorChange(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 7))
          }
          className="rounded-md p-1.5 text-ink-faint hover:bg-base-surface-raised hover:text-ink"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-sm text-ink-faint">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid min-w-[720px] grid-cols-[52px_repeat(7,1fr)]">
            <div />
            {days.map((day) => (
              <div key={day.toISOString()} className="border-b border-l border-base-border-subtle px-2 py-2 text-center">
                <p className="text-xs text-ink-faint">{WEEKDAY_LABELS[day.getDay()]}</p>
                <p className={cn("text-sm font-medium", isSameDay(day, today) ? "text-accent" : "text-ink")}>
                  {day.getDate()}
                </p>
              </div>
            ))}

            {HOURS.map((hour) => (
              <div key={`row-${hour}`} className="contents">
                <div className="border-b border-base-border-subtle px-1.5 py-2 text-right text-[10px] text-ink-faint">
                  {hour % 12 === 0 ? 12 : hour % 12}
                  {hour < 12 ? "am" : "pm"}
                </div>
                {days.map((day) => {
                  const slotKey = `${day.toISOString()}-${hour}`;
                  const slotEvents = eventsForDay(day).filter((o) => new Date(o.startTime).getHours() === hour);
                  return (
                    <div
                      key={slotKey}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverSlot(slotKey);
                      }}
                      onDragLeave={() => setDragOverSlot(null)}
                      onDrop={(e) => handleDrop(e, day, hour)}
                      onClick={() => onSlotClick(day, hour)}
                      className={cn(
                        "min-h-[44px] cursor-pointer border-b border-l border-base-border-subtle p-0.5 transition-colors hover:bg-base-surface-raised",
                        dragOverSlot === slotKey && "bg-accent-muted"
                      )}
                    >
                      {slotEvents.map((occurrence) => (
                        <button
                          key={occurrence.occurrenceId}
                          draggable={!occurrence.isRecurring}
                          onDragStart={(e) => handleDragStart(e, occurrence)}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(occurrence);
                          }}
                          title={occurrence.isRecurring ? "Recurring — edit the series to move it" : "Drag to reschedule"}
                          className={cn(
                            "flex w-full items-center gap-1 rounded-md px-1.5 py-1 text-left text-[10px] font-medium text-white",
                            !occurrence.isRecurring && "cursor-grab active:cursor-grabbing"
                          )}
                          style={{ backgroundColor: occurrence.color }}
                        >
                          {occurrence.isRecurring && <Lock size={9} className="shrink-0" />}
                          <span className="truncate">{occurrence.title}</span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
