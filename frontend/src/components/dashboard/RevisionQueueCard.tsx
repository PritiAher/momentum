import { Link } from "react-router-dom";
import { RotateCcw, Check } from "lucide-react";
import { useCompleteRevision } from "@/hooks/useRevisions";
import type { RevisionEntry } from "@/types/tracker";

export default function RevisionQueueCard({ entries }: { entries: RevisionEntry[] }) {
  const completeRevision = useCompleteRevision();

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-ink-faint">
          <RotateCcw size={15} />
          <span className="text-xs font-medium uppercase tracking-wide">Today's Revisions</span>
        </div>
        {entries.length > 0 && (
          <Link to="/revisions" className="text-xs text-accent hover:text-accent-hover">
            View all
          </Link>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-ink-faint">Nothing due today.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {entries.map((entry) => (
            <div key={entry._id} className="flex items-center justify-between rounded-lg bg-base-surface-raised px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{entry.problem.problemName}</p>
                <p className="truncate text-xs text-ink-faint">{entry.problem.topic}</p>
              </div>
              <button
                onClick={() => completeRevision.mutate(entry._id)}
                disabled={completeRevision.isPending}
                className="ml-2 shrink-0 rounded-md p-1.5 text-ink-faint hover:bg-success-muted hover:text-success disabled:opacity-50"
                aria-label="Mark done"
              >
                <Check size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
