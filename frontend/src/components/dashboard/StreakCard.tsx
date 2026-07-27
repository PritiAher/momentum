import { Flame } from "lucide-react";

export default function StreakCard({ current, longest }: { current: number; longest: number }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-ink-faint">
        <Flame size={15} className={current > 0 ? "text-warning" : ""} />
        <span className="text-xs font-medium uppercase tracking-wide">Current Streak</span>
      </div>
      <p className="mt-2 font-mono text-3xl font-semibold text-ink">
        {current} <span className="text-base font-normal text-ink-faint">day{current === 1 ? "" : "s"}</span>
      </p>
      <p className="mt-1 text-xs text-ink-faint">Longest: {longest} day{longest === 1 ? "" : "s"}</p>
    </div>
  );
}
