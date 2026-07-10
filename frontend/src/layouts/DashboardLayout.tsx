import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import { useThemeSync } from "@/hooks/useThemeSync";

export default function DashboardLayout() {
  useThemeSync();

  return (
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
