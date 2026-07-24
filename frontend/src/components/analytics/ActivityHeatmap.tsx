import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * Doubles as the "Streak History" visual — a GitHub-style contribution
 * graph already shows exactly what a streak history chart would (runs of
 * consecutive active days), so a second, separate chart for the same
 * underlying data would be redundant rather than additive.
 */
export default function ActivityHeatmap({ data }: { data: { date: string; count: number }[] }) {
  const maxCount = Math.max(1, ...data.map((d) => d.count));

  const colorFor = (count: number) => {
    if (count === 0) return "bg-base-border-subtle";
    const intensity = count / maxCount;
    if (intensity > 0.75) return "bg-accent";
    if (intensity > 0.5) return "bg-accent/70";
    if (intensity > 0.25) return "bg-accent/40";
    return "bg-accent/20";
  };

  // Group into weeks (columns), Sunday-start, matching the rest of the app.
  const weeks = useMemo(() => {
    if (data.length === 0) return [];
    const first = new Date(`${data[0].date}T00:00:00.000Z`);
    const leadingBlanks = first.getUTCDay();
    const cells: ({ date: string; count: number } | null)[] = [
      ...Array(leadingBlanks).fill(null),
      ...data,
    ];
    const result: ({ date: string; count: number } | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      result.push(cells.slice(i, i + 7));
    }
    return result;
  }, [data]);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((cell, di) =>
              cell ? (
                <div
                  key={di}
                  title={`${cell.date}: ${cell.count} problem${cell.count === 1 ? "" : "s"}`}
                  className={cn("h-2.5 w-2.5 rounded-[2px]", colorFor(cell.count))}
                />
              ) : (
                <div key={di} className="h-2.5 w-2.5" />
              )
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-ink-faint">
        <span>Less</span>
        <div className="h-2.5 w-2.5 rounded-[2px] bg-base-border-subtle" />
        <div className="h-2.5 w-2.5 rounded-[2px] bg-accent/20" />
        <div className="h-2.5 w-2.5 rounded-[2px] bg-accent/40" />
        <div className="h-2.5 w-2.5 rounded-[2px] bg-accent/70" />
        <div className="h-2.5 w-2.5 rounded-[2px] bg-accent" />
        <span>More</span>
      </div>
    </div>
  );
}
