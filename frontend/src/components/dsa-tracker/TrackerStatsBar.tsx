import type { ProblemStats } from "@/types/tracker";

export default function TrackerStatsBar({ stats }: { stats: ProblemStats | undefined }) {
  const cards = [
    { label: "Total", value: stats?.total ?? "—" },
    { label: "Easy", value: stats?.easy ?? "—", color: "text-difficulty-easy" },
    { label: "Medium", value: stats?.medium ?? "—", color: "text-difficulty-medium" },
    { label: "Hard", value: stats?.hard ?? "—", color: "text-difficulty-hard" },
    { label: "This week", value: stats?.weeklyProblems ?? "—" },
    { label: "This month", value: stats?.monthlyProblems ?? "—" },
    { label: "Avg confidence", value: stats?.avgConfidence ?? "—" },
    { label: "In revision", value: stats?.revisionCount ?? "—", color: "text-warning" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 lg:grid-cols-8">
      {cards.map((c) => (
        <div key={c.label} className="card p-3">
          <p className={`font-mono text-lg font-semibold ${c.color || "text-ink"}`}>{c.value}</p>
          <p className="mt-0.5 text-xs text-ink-faint">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
