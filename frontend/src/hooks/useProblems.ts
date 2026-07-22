import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Problem } from "@/types";
import type { ProblemStats } from "@/types/tracker";

export interface ProblemFilters {
  q?: string;
  platform?: string;
  topic?: string;
  difficulty?: string;
  confidence?: string;
  revisionRequired?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

const stripEmpty = (obj: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== ""));

export function useProblems(filters: ProblemFilters) {
  return useQuery({
    queryKey: ["problems", filters],
    queryFn: async () => {
      const { data } = await api.get("/problems", { params: stripEmpty(filters as Record<string, unknown>) });
      return data as { problems: Problem[]; pagination: { total: number; pages: number; page: number } };
    },
    placeholderData: (prev) => prev, // keep old rows visible while refetching on filter change
  });
}

export function useProblemStats() {
  return useQuery({
    queryKey: ["problems", "stats"],
    queryFn: async () => {
      const { data } = await api.get("/problems/stats");
      return data.stats as ProblemStats;
    },
  });
}

export function useCreateProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Problem>) => {
      const { data } = await api.post("/problems", payload);
      return data.problem as Problem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["revisions"] });
    },
  });
}

export function useUpdateProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Problem> }) => {
      const { data } = await api.put(`/problems/${id}`, payload);
      return data.problem as Problem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["revisions"] });
    },
  });
}

export function useDeleteProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/problems/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["revisions"] });
    },
  });
}
