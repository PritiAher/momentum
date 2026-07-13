import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Settings {
  theme: "dark" | "light";
  accentColor: string;
  dailyDsaTarget: number;
  weeklyDsaTarget: number;
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await api.get("/settings");
      return data.settings as Settings;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Settings>) => {
      const { data } = await api.put("/settings", payload);
      return data.settings as Settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (payload: { name?: string; email?: string }) => {
      const { data } = await api.put("/auth/profile", payload);
      return data.user;
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: { currentPassword: string; newPassword: string }) => {
      const { data } = await api.put("/auth/password", payload);
      return data;
    },
  });
}

export function useExportData() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get("/settings/export");
      return data;
    },
  });
}

export function useImportData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { data: unknown }) => {
      const { data } = await api.post("/settings/import", payload);
      return data.imported;
    },
    onSuccess: () => {
      // A restore can touch nearly every collection in the app, so
      // invalidate broadly rather than trying to enumerate each key.
      queryClient.invalidateQueries();
    },
  });
}
