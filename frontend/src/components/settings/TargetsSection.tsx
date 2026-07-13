import { useEffect, useState } from "react";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";

export default function TargetsSection() {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const [daily, setDaily] = useState(3);
  const [weekly, setWeekly] = useState(20);

  useEffect(() => {
    if (settings) {
      setDaily(settings.dailyDsaTarget);
      setWeekly(settings.weeklyDsaTarget);
    }
  }, [settings]);

  const save = () => {
    updateSettings.mutate({ dailyDsaTarget: daily, weeklyDsaTarget: weekly });
  };

  const dirty = settings && (daily !== settings.dailyDsaTarget || weekly !== settings.weeklyDsaTarget);

  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold text-ink">DSA Targets</h2>
      <p className="mt-1 text-xs text-ink-faint">
        Drives the Dashboard's weekly progress bar and can inform future daily goals.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">Daily target</label>
          <input
            type="number"
            min={0}
            value={daily}
            onChange={(e) => setDaily(Number(e.target.value))}
            className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">Weekly target</label>
          <input
            type="number"
            min={0}
            value={weekly}
            onChange={(e) => setWeekly(Number(e.target.value))}
            className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
      </div>

      {dirty && (
        <button
          onClick={save}
          disabled={updateSettings.isPending}
          className="mt-3 rounded-lg bg-accent px-3.5 py-1.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {updateSettings.isPending ? "Saving..." : "Save targets"}
        </button>
      )}
    </div>
  );
}
