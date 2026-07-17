import { useMemo, useState } from "react";
import { Plus, CalendarRange, Calendar as CalendarIcon } from "lucide-react";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import WeekView from "@/components/calendar/WeekView";
import MonthView from "@/components/calendar/MonthView";
import EventModal from "@/components/calendar/EventModal";
import EventTypeLegend from "@/components/calendar/EventTypeLegend";
import { cn } from "@/lib/utils";
import type { EventOccurrence } from "@/types/calendar";

type ViewMode = "week" | "month";

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>("week");
  const [cursor, setCursor] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOccurrence, setEditingOccurrence] = useState<EventOccurrence | null>(null);
  const [prefill, setPrefill] = useState<{ date?: Date; hour?: number }>({});

  // Fetch a padded range around the cursor so both views can reuse one
  // query as you navigate — a week view only ever needs its own 7 days,
  // but padding to a month avoids an extra round trip on every arrow click.
  const { rangeStart, rangeEnd } = useMemo(() => {
    const start = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
    const end = new Date(cursor.getFullYear(), cursor.getMonth() + 2, 0, 23, 59, 59);
    return { rangeStart: start, rangeEnd: end };
  }, [cursor.getFullYear(), cursor.getMonth()]);

  const { data: occurrences, isLoading } = useCalendarEvents(rangeStart, rangeEnd);

  const openAdd = (date?: Date, hour?: number) => {
    setEditingOccurrence(null);
    setPrefill({ date, hour });
    setModalOpen(true);
  };

  const openEdit = (occurrence: EventOccurrence) => {
    setEditingOccurrence(occurrence);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Calendar</h1>
        <button
          onClick={() => openAdd()}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          <Plus size={15} /> New event
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg border border-base-border bg-base-surface p-0.5">
          <button
            onClick={() => setView("week")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
              view === "week" ? "bg-accent-muted text-accent" : "text-ink-muted hover:text-ink"
            )}
          >
            <CalendarRange size={14} /> Week
          </button>
          <button
            onClick={() => setView("month")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
              view === "month" ? "bg-accent-muted text-accent" : "text-ink-muted hover:text-ink"
            )}
          >
            <CalendarIcon size={14} /> Month
          </button>
        </div>
        <EventTypeLegend />
      </div>

      <div className="mt-4">
        {view === "week" ? (
          <WeekView
            cursor={cursor}
            onCursorChange={setCursor}
            occurrences={occurrences || []}
            isLoading={isLoading}
            onEdit={openEdit}
            onSlotClick={(date, hour) => openAdd(date, hour)}
          />
        ) : (
          <MonthView
            cursor={cursor}
            onCursorChange={setCursor}
            occurrences={occurrences || []}
            isLoading={isLoading}
            onEdit={openEdit}
            onDayClick={(date) => openAdd(date, 9)}
          />
        )}
      </div>

      <EventModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingOccurrence={editingOccurrence}
        prefillDate={prefill.date}
        prefillHour={prefill.hour}
      />
    </div>
  );
}
