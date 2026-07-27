import { TrendingUp } from "lucide-react";
import type { DashboardData } from "@/types/dashboard";

export default function OverallProgressCard({ progress }: { progress: DashboardData["overallProgress"] }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-ink-faint">
        <TrendingUp size={15} />
        <span className="text-xs font-medium uppercase tracking-wide">Weekly Progress</span>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <p className="font-mono text-2xl font-semibold text-ink">
          {progress.weeklyProblems}
          <span className="text-sm font-normal text-ink-faint"> / {progress.weeklyTarget}</span>
        </p>
        <p className="font-mono text-sm text-ink-muted">{progress.weeklyProgressPct}%</p>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-base-border">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${progress.weeklyProgressPct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-ink-faint">Target set in Settings — defaults to 20/week</p>
    </div>
  );
}
