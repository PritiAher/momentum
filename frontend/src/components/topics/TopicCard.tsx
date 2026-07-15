import { useState } from "react";
import { Pencil, AlertTriangle } from "lucide-react";
import { ConfidenceDots } from "@/components/ui/Confidence";
import { useUpdateTopic } from "@/hooks/useTopics";
import type { TopicProgress } from "@/types/topics";

export default function TopicCard({ data }: { data: TopicProgress }) {
  const [editing, setEditing] = useState(false);
  const [target, setTarget] = useState(data.target);
  const [weakAreas, setWeakAreas] = useState(data.weakAreas);
  const updateTopic = useUpdateTopic();

  const save = async () => {
    await updateTopic.mutateAsync({ name: data.topic, targetProblems: target, weakAreas });
    setEditing(false);
  };

  const cancel = () => {
    setTarget(data.target);
    setWeakAreas(data.weakAreas);
    setEditing(false);
  };

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-ink">{data.topic}</h3>
          {data.isWeak && (
            <span title="Average confidence is 3 or below">
              <AlertTriangle size={13} className="text-warning" />
            </span>
          )}
        </div>
        <button
          onClick={() => setEditing((e) => !e)}
          className="rounded-md p-1 text-ink-faint hover:bg-base-surface-raised hover:text-ink"
          aria-label="Edit target and notes"
        >
          <Pencil size={13} />
        </button>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <p className="font-mono text-sm text-ink-muted">
          {data.solved} <span className="text-ink-faint">/ {data.target}</span>
        </p>
        <p className="font-mono text-xs text-ink-faint">{data.completionPct}%</p>
      </div>

      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-base-border">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${data.completionPct}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <ConfidenceDots value={Math.round(data.avgConfidence) || 0} />
        <span className="font-mono text-xs text-ink-faint">avg {data.avgConfidence || "—"}</span>
      </div>

      {!editing && data.weakAreas && (
        <p className="mt-3 rounded-md bg-base-surface-raised px-2.5 py-1.5 text-xs text-ink-muted">
          {data.weakAreas}
        </p>
      )}

      {editing && (
        <div className="mt-3 space-y-2 border-t border-base-border pt-3">
          <div>
            <label className="mb-1 block text-xs text-ink-faint">Target problems</label>
            <input
              type="number"
              min={0}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-full rounded-lg border border-base-border bg-base px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-faint">Weak areas note</label>
            <textarea
              value={weakAreas}
              onChange={(e) => setWeakAreas(e.target.value)}
              rows={2}
              placeholder="e.g. struggle with DP on trees"
              className="w-full resize-none rounded-lg border border-base-border bg-base px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={cancel} className="rounded-lg px-3 py-1.5 text-xs text-ink-muted hover:bg-base-surface-raised">
              Cancel
            </button>
            <button
              onClick={save}
              disabled={updateTopic.isPending}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-50"
            >
              {updateTopic.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
