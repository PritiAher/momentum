import { useAuthStore } from "@/store/authStore";
import { useDashboard } from "@/hooks/useDashboard";
import StreakCard from "@/components/dashboard/StreakCard";
import QuickStatsCard from "@/components/dashboard/QuickStatsCard";
import OverallProgressCard from "@/components/dashboard/OverallProgressCard";
import RevisionQueueCard from "@/components/dashboard/RevisionQueueCard";
import TopTasksCard from "@/components/dashboard/TopTasksCard";
import TodaysScheduleCard from "@/components/dashboard/TodaysScheduleCard";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useDashboard();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <p className="font-mono text-xs text-ink-faint">
        {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-ink">
        {greeting}, {user?.name?.split(" ")[0]}
      </h1>

      {isLoading || !data ? (
        <div className="mt-8 card p-10 text-center text-sm text-ink-faint">Loading dashboard...</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StreakCard current={data.streak.current} longest={data.streak.longest} />
          <QuickStatsCard stats={data.quickStats} />
          <OverallProgressCard progress={data.overallProgress} />
          <RevisionQueueCard entries={data.revisionQueue} />
          <TopTasksCard tasks={data.topTasks} />
          <TodaysScheduleCard events={data.todaysSchedule} />
        </div>
      )}
    </div>
  );
}
