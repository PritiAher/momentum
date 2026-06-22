const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const atMidnight = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Expands a single CalendarEvent document into concrete occurrences that
 * fall within [rangeStart, rangeEnd]. Recurring events are stored once
 * (see CalendarEvent model) and expanded here rather than materialized as
 * many documents — editing "this class's time" stays a single-document
 * update instead of a bulk rewrite across every past/future instance.
 *
 * Each occurrence carries occurrenceId (stable per instance, used as the
 * frontend's render key) plus isRecurring so the UI can disable drag-to-
 * reschedule on recurring instances (moving a single instance would need
 * per-occurrence exception storage, which this model doesn't have yet).
 */
export const expandEventOccurrences = (event, rangeStart, rangeEnd) => {
  const durationMs = new Date(event.endTime) - new Date(event.startTime);
  const frequency = event.recurrence?.frequency || "none";

  const toOccurrence = (startTime) => ({
    _id: event._id,
    occurrenceId: `${event._id}_${startTime.toISOString().slice(0, 10)}`,
    title: event.title,
    type: event.type,
    color: event.color,
    startTime,
    endTime: new Date(startTime.getTime() + durationMs),
    allDay: event.allDay,
    notes: event.notes,
    isRecurring: frequency !== "none",
    recurrence: event.recurrence,
  });

  if (frequency === "none") {
    const start = new Date(event.startTime);
    return start >= rangeStart && start <= rangeEnd ? [toOccurrence(start)] : [];
  }

  const occurrences = [];
  const seriesUntil = event.recurrence?.until ? new Date(event.recurrence.until) : rangeEnd;
  const windowEnd = seriesUntil < rangeEnd ? seriesUntil : rangeEnd;
  const originalTimeOfDay = new Date(event.startTime);

  let cursor = atMidnight(rangeStart > event.startTime ? rangeStart : event.startTime);

  while (cursor <= windowEnd) {
    const matchesDay =
      frequency === "daily" ||
      (frequency === "weekly" && (event.recurrence.daysOfWeek || []).includes(cursor.getDay()));

    if (matchesDay) {
      const occurrenceStart = new Date(cursor);
      occurrenceStart.setHours(
        originalTimeOfDay.getHours(),
        originalTimeOfDay.getMinutes(),
        originalTimeOfDay.getSeconds(),
        0
      );
      if (occurrenceStart >= rangeStart && occurrenceStart <= rangeEnd) {
        occurrences.push(toOccurrence(occurrenceStart));
      }
    }
    cursor = new Date(cursor.getTime() + ONE_DAY_MS);
  }

  return occurrences;
};
