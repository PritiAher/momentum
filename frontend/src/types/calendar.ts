export type CalendarEventType = "Class" | "StudyBlock" | "Exam" | "Assignment" | "PlacementEvent";

export interface Recurrence {
  frequency: "none" | "daily" | "weekly";
  daysOfWeek: number[];
  until: string | null;
}

export interface CalendarEvent {
  _id: string;
  title: string;
  type: CalendarEventType;
  color: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  recurrence: Recurrence;
  notes: string;
}

export interface EventOccurrence {
  _id: string;
  occurrenceId: string;
  title: string;
  type: CalendarEventType;
  color: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  notes: string;
  isRecurring: boolean;
  recurrence: Recurrence;
}
