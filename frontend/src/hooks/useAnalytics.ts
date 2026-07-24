import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { AnalyticsData } from "@/types/analytics";

export function useAnalytics(days: number) {
  return useQuery({
    queryKey: ["analytics", days],
    queryFn: async () => {
      const { data } = await api.get("/analytics", { params: { days } });
      return data.analytics as AnalyticsData;
    },
  });
}
