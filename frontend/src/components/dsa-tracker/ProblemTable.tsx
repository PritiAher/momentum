import { Pencil, Trash2, ExternalLink } from "lucide-react";
import DifficultyBadge from "@/components/ui/DifficultyBadge";
import { ConfidenceDots } from "@/components/ui/Confidence";
import { useDeleteProblem } from "@/hooks/useProblems";
import type { Problem } from "@/types";

export default function ProblemTable({
  problems,
  isLoading,
  onEdit,
}: {
  problems: Problem[];
  isLoading: boolean;
  onEdit: (problem: Problem) => void;
}) {
  const deleteProblem = useDeleteProblem();

  if (isLoading) {
    return <div className="card p-10 text-center text-sm text-ink-faint">Loading...</div>;
  }

  if (problems.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-sm font-medium text-ink">No problems match these filters</p>
        <p className="mt-1 text-sm text-ink-faint">Log one with the button above, or clear a filter.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-base-border text-left text-xs text-ink-faint">
            <th className="px-4 py-2.5 font-medium">Problem</th>
            <th className="px-4 py-2.5 font-medium">Topic</th>
            <th className="px-4 py-2.5 font-medium">Difficulty</th>
            <th className="px-4 py-2.5 font-medium">Confidence</th>
            <th className="px-4 py-2.5 font-medium">Date</th>
            <th className="px-4 py-2.5 font-medium">Time</th>
            <th className="px-4 py-2.5 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p) => (
            <tr key={p._id} className="border-b border-base-border-subtle last:border-0 hover:bg-base-surface-raised">
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-ink">{p.problemName}</span>
                  {p.revisionRequired && (
                    <span className="rounded bg-warning-muted px-1.5 py-0.5 text-[10px] font-medium text-warning">
                      Revise
                    </span>
                  )}
                </div>
                <p className="mt-0.5 font-mono text-xs text-ink-faint">
                  {p.platform}
                  {p.problemNumber && ` #${p.problemNumber}`}
                  {p.pattern && ` · ${p.pattern}`}
                </p>
              </td>
              <td className="px-4 py-2.5 text-ink-muted">{p.topic}</td>
              <td className="px-4 py-2.5">
                <DifficultyBadge difficulty={p.difficulty} />
              </td>
              <td className="px-4 py-2.5">
                <ConfidenceDots value={p.confidence} />
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-ink-muted">
                {new Date(p.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-ink-muted">
                {p.timeTakenMinutes ? `${p.timeTakenMinutes}m` : "—"}
              </td>
              <td className="px-4 py-2.5">
                <div className="flex items-center justify-end gap-1">
                  {p.notebookPage && (
                    <span title={`Notebook pg. ${p.notebookPage}`} className="text-ink-faint">
                      <ExternalLink size={13} />
                    </span>
                  )}
                  <button
                    onClick={() => onEdit(p)}
                    className="rounded-md p-1.5 text-ink-faint hover:bg-base-surface hover:text-ink"
                    aria-label="Edit"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${p.problemName}"?`)) deleteProblem.mutate(p._id);
                    }}
                    className="rounded-md p-1.5 text-ink-faint hover:bg-danger-muted hover:text-danger"
                    aria-label="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
