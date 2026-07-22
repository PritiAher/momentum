import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { RevisionEntry } from "@/types/tracker";

export function useTodayRevisions() {
  return useQuery({
    queryKey: ["revisions", "today"],
    queryFn: async () => {
      const { data } = await api.get("/revisions/today");
      return data.entries as RevisionEntry[];
    },
  });
}

export function useCompleteRevision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/revisions/${id}/complete`);
      return data.entry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revisions"] });
    },
  });
}
