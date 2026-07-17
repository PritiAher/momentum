import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { CalendarEvent, EventOccurrence } from "@/types/calendar";

export function useCalendarEvents(from: Date, to: Date) {
  const fromISO = from.toISOString();
  const toISO = to.toISOString();

  return useQuery({
    queryKey: ["calendar-events", fromISO, toISO],
    queryFn: async () => {
      const { data } = await api.get("/calendar-events", { params: { from: fromISO, to: toISO } });
      return data.occurrences as EventOccurrence[];
    },
  });
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<CalendarEvent>) => {
      const { data } = await api.post("/calendar-events", payload);
      return data.event as CalendarEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CalendarEvent> }) => {
      const { data } = await api.put(`/calendar-events/${id}`, payload);
      return data.event as CalendarEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/calendar-events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
