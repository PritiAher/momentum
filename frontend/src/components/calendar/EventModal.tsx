import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { X, Trash2 } from "lucide-react";
import { EVENT_TYPES, EVENT_TYPE_LABELS, EVENT_TYPE_COLORS, WEEKDAY_LABELS } from "@/lib/constants";
import { useCreateCalendarEvent, useUpdateCalendarEvent, useDeleteCalendarEvent } from "@/hooks/useCalendarEvents";
import { cn } from "@/lib/utils";
import type { CalendarEvent, EventOccurrence } from "@/types/calendar";

interface FormValues {
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
}

const toLocalTime = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const emptyDefaults = (prefillDate?: Date, prefillHour?: number): FormValues => {
  const d = prefillDate || new Date();
  const hour = prefillHour ?? 9;
  return {
    title: "",
    type: "StudyBlock",
    date: d.toISOString().slice(0, 10),
    startTime: `${String(hour).padStart(2, "0")}:00`,
    endTime: `${String(hour + 1).padStart(2, "0")}:00`,
    notes: "",
  };
};

export default function EventModal({
  open,
  onOpenChange,
  editingOccurrence,
  prefillDate,
  prefillHour,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingOccurrence?: EventOccurrence | null;
  prefillDate?: Date;
  prefillHour?: number;
}) {
  const createEvent = useCreateCalendarEvent();
  const updateEvent = useUpdateCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();

  const [frequency, setFrequency] = useState<"none" | "daily" | "weekly">("none");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [until, setUntil] = useState("");

  const { register, handleSubmit, reset, setFocus } = useForm<FormValues>({
    defaultValues: emptyDefaults(),
  });

  useEffect(() => {
    if (!open) return;
    if (editingOccurrence) {
      const start = new Date(editingOccurrence.startTime);
      reset({
        title: editingOccurrence.title,
        type: editingOccurrence.type,
        date: start.toISOString().slice(0, 10),
        startTime: toLocalTime(editingOccurrence.startTime),
        endTime: toLocalTime(editingOccurrence.endTime),
        notes: editingOccurrence.notes,
      });
      setFrequency(editingOccurrence.recurrence?.frequency || "none");
      setDaysOfWeek(editingOccurrence.recurrence?.daysOfWeek || []);
      setUntil(editingOccurrence.recurrence?.until ? editingOccurrence.recurrence.until.slice(0, 10) : "");
    } else {
      reset(emptyDefaults(prefillDate, prefillHour));
      setFrequency("none");
      setDaysOfWeek([]);
      setUntil("");
    }
    setTimeout(() => setFocus("title"), 50);
  }, [open, editingOccurrence, prefillDate, prefillHour, reset, setFocus]);

  const toggleDay = (day: number) => {
    setDaysOfWeek((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()));
  };

  const onSubmit = async (values: FormValues) => {
    const startTime = new Date(`${values.date}T${values.startTime}:00`);
    const endTime = new Date(`${values.date}T${values.endTime}:00`);

    const payload: Partial<CalendarEvent> = {
      title: values.title,
      type: values.type as CalendarEvent["type"],
      color: EVENT_TYPE_COLORS[values.type],
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      allDay: false,
      notes: values.notes,
      recurrence: {
        frequency,
        daysOfWeek: frequency === "weekly" ? daysOfWeek : [],
        until: frequency !== "none" && until ? new Date(until).toISOString() : null,
      },
    };

    if (editingOccurrence) {
      await updateEvent.mutateAsync({ id: editingOccurrence._id, payload });
    } else {
      await createEvent.mutateAsync(payload);
    }
    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!editingOccurrence) return;
    const label = editingOccurrence.isRecurring ? "this entire series" : "this event";
    if (confirm(`Delete ${label}?`)) {
      await deleteEvent.mutateAsync(editingOccurrence._id);
      onOpenChange(false);
    }
  };

  const submitting = createEvent.isPending || updateEvent.isPending;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 animate-slide-up rounded-xl border border-base-border bg-base-surface p-5 shadow-card-hover">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-sm font-semibold text-ink">
              {editingOccurrence ? "Edit event" : "New event"}
            </Dialog.Title>
            <Dialog.Close className="rounded-md p-1 text-ink-faint hover:bg-base-surface-raised hover:text-ink">
              <X size={16} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              {...register("title", { required: true })}
              placeholder="Event title"
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />

            <select
              {...register("type")}
              className="w-full rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {EVENT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-3 gap-2">
              <input
                {...register("date")}
                type="date"
                className="rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
              />
              <input
                {...register("startTime")}
                type="time"
                className="rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
              />
              <input
                {...register("endTime")}
                type="time"
                className="rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Repeats</label>
              <div className="flex gap-1.5">
                {(["none", "daily", "weekly"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequency(f)}
                    className={cn(
                      "flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition-colors",
                      frequency === f
                        ? "border-accent bg-accent-muted text-accent"
                        : "border-base-border text-ink-muted hover:border-ink-faint"
                    )}
                  >
                    {f === "none" ? "Doesn't repeat" : f}
                  </button>
                ))}
              </div>
            </div>

            {frequency === "weekly" && (
              <div className="flex gap-1">
                {WEEKDAY_LABELS.map((label, day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "flex h-8 flex-1 items-center justify-center rounded-lg border text-xs font-medium transition-colors",
                      daysOfWeek.includes(day)
                        ? "border-accent bg-accent-muted text-accent"
                        : "border-base-border text-ink-muted hover:border-ink-faint"
                    )}
                  >
                    {label[0]}
                  </button>
                ))}
              </div>
            )}

            {frequency !== "none" && (
              <div>
                <label className="mb-1 block text-xs text-ink-faint">Repeat until (optional)</label>
                <input
                  type="date"
                  value={until}
                  onChange={(e) => setUntil(e.target.value)}
                  className="w-full rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
                />
              </div>
            )}

            <textarea
              {...register("notes")}
              placeholder="Notes (optional)"
              rows={2}
              className="w-full resize-none rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />

            <div className="flex items-center justify-between pt-1">
              {editingOccurrence ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger-muted"
                >
                  <Trash2 size={14} /> Delete
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Dialog.Close className="rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-base-surface-raised">
                  Cancel
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingOccurrence ? "Save changes" : "Create event"}
                </button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
