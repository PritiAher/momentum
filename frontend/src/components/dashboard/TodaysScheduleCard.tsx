import { CalendarClock } from "lucide-react";
import type { EventOccurrence } from "@/types/calendar";

export default function TodaysScheduleCard({ events }: { events: EventOccurrence[] }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-ink-faint">
        <CalendarClock size={15} />
        <span className="text-xs font-medium uppercase tracking-wide">Today's Schedule</span>
      </div>

      {events.length === 0 ? (
        <p className="mt-4 text-sm text-ink-faint">Nothing on the calendar today.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {events.map((e) => (
            <div key={e.occurrenceId} className="flex items-center gap-2 rounded-lg bg-base-surface-raised px-3 py-2">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: e.color }} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{e.title}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-ink-faint">
                {new Date(e.startTime).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
