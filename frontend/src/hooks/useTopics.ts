import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { TopicProgress } from "@/types/topics";

export function useTopicProgress() {
  return useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const { data } = await api.get("/topics");
      return data.topics as TopicProgress[];
    },
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      targetProblems,
      weakAreas,
    }: {
      name: string;
      targetProblems?: number;
      weakAreas?: string;
    }) => {
      const { data } = await api.patch(`/topics/${encodeURIComponent(name)}`, {
        targetProblems,
        weakAreas,
      });
      return data.topic;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });
}
