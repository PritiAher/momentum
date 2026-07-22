import { Check, BookOpen } from "lucide-react";
import { useTodayRevisions, useCompleteRevision } from "@/hooks/useRevisions";
import DifficultyBadge from "@/components/ui/DifficultyBadge";
import { ConfidenceDots } from "@/components/ui/Confidence";

const stageLabel: Record<string, string> = {
  tomorrow: "+1 day",
  "7day": "+7 days",
  "21day": "+21 days",
};

export default function Revisions() {
  const { data: entries, isLoading } = useTodayRevisions();
  const completeRevision = useCompleteRevision();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Revisions</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Auto-populated from problems with confidence ≤ 3 or flagged for revision.
      </p>

      <div className="mt-6 space-y-2">
        {isLoading && <div className="card p-10 text-center text-sm text-ink-faint">Loading...</div>}

        {!isLoading && entries?.length === 0 && (
          <div className="card flex flex-col items-center gap-2 p-12 text-center">
            <BookOpen size={20} className="text-ink-faint" />
            <p className="text-sm font-medium text-ink">Nothing due today</p>
            <p className="text-sm text-ink-faint">Revision entries appear here as they come due.</p>
          </div>
        )}

        {entries?.map((entry) => (
          <div key={entry._id} className="card flex items-center justify-between p-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-ink">{entry.problem.problemName}</span>
                <span className="rounded bg-base-surface-raised px-1.5 py-0.5 text-[10px] font-mono text-ink-faint">
                  {stageLabel[entry.stage]}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-ink-faint">
                <span>{entry.problem.topic}</span>
                <span>·</span>
                <span>{entry.problem.platform}</span>
                {entry.problem.notebookPage && (
                  <>
                    <span>·</span>
                    <span>Notebook pg. {entry.problem.notebookPage}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <DifficultyBadge difficulty={entry.problem.difficulty} />
              <ConfidenceDots value={entry.problem.confidence} />
              <button
                onClick={() => completeRevision.mutate(entry._id)}
                disabled={completeRevision.isPending}
                className="flex items-center gap-1.5 rounded-lg border border-base-border px-3 py-1.5 text-sm text-ink-muted transition-colors hover:border-success hover:bg-success-muted hover:text-success disabled:opacity-50"
              >
                <Check size={14} /> Done
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
