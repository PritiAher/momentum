import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import ActivityHeatmap from "@/components/analytics/ActivityHeatmap";
import WeeklyTrendChart from "@/components/analytics/WeeklyTrendChart";
import DistributionBarChart from "@/components/analytics/DistributionBarChart";
import DifficultyPieChart from "@/components/analytics/DifficultyPieChart";
import TrendLineChart from "@/components/analytics/TrendLineChart";
import { cn } from "@/lib/utils";

const RANGE_OPTIONS = [
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
  { label: "180d", value: 180 },
  { label: "365d", value: 365 },
];

const shortDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

export default function Analytics() {
  const [days, setDays] = useState(180);
  const { data, isLoading } = useAnalytics(days);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Analytics</h1>
        <div className="flex rounded-lg border border-base-border bg-base-surface p-0.5">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                days === opt.value ? "bg-accent-muted text-accent" : "text-ink-muted hover:text-ink"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !data ? (
        <div className="mt-8 card p-10 text-center text-sm text-ink-faint">Loading analytics...</div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="card p-5">
            <p className="mb-3 text-sm font-medium text-ink">Activity Heatmap</p>
            <ActivityHeatmap data={data.heatmap} />
          </div>

          <div className="card p-5">
            <p className="mb-3 text-sm font-medium text-ink">Problems Solved — Weekly, with 7-day Rolling Average</p>
            <WeeklyTrendChart weeklyTrend={data.weeklyTrend} rollingAverage={data.rollingAverage} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="card p-5">
              <p className="mb-3 text-sm font-medium text-ink">Difficulty Distribution</p>
              <DifficultyPieChart distribution={data.difficultyDistribution} />
            </div>
            <div className="card p-5">
              <p className="mb-3 text-sm font-medium text-ink">Confidence Trend</p>
              <TrendLineChart
                data={data.confidenceTrend}
                xKey="date"
                yKey="avgConfidence"
                color="#7C6FF0"
                formatX={shortDate}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="card p-5">
              <p className="mb-3 text-sm font-medium text-ink">Topic Distribution</p>
              <DistributionBarChart
                data={data.topicDistribution.slice(0, 10).map((t) => ({ topic: t.topic, count: t.count }))}
                labelKey="topic"
              />
            </div>
            <div className="card p-5">
              <p className="mb-3 text-sm font-medium text-ink">Pattern Distribution</p>
              <DistributionBarChart
                data={data.patternDistribution.map((p) => ({ pattern: p.pattern, count: p.count }))}
                labelKey="pattern"
              />
            </div>
          </div>

          <div className="card p-5">
            <p className="mb-3 text-sm font-medium text-ink">Time Spent per Day (minutes)</p>
            <TrendLineChart
              data={data.timeSpentTrend}
              xKey="date"
              yKey="totalMinutes"
              color="#F5A623"
              formatX={shortDate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
