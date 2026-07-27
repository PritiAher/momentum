import type { DashboardData } from "@/types/dashboard";

export default function QuickStatsCard({ stats }: { stats: DashboardData["quickStats"] }) {
  const items = [
    { label: "Total solved", value: stats.totalProblems },
    { label: "This week", value: stats.weeklyProblems },
    { label: "This month", value: stats.monthlyProblems },
    { label: "Pending tasks", value: stats.pendingTaskCount },
  ];

  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">Quick Stats</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label}>
            <p className="font-mono text-xl font-semibold text-ink">{item.value}</p>
            <p className="text-xs text-ink-faint">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
