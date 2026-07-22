import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useProblems, useProblemStats, type ProblemFilters } from "@/hooks/useProblems";
import AddProblemModal from "@/components/dsa-tracker/AddProblemModal";
import ProblemTable from "@/components/dsa-tracker/ProblemTable";
import TrackerStatsBar from "@/components/dsa-tracker/TrackerStatsBar";
import { TOPICS, DIFFICULTIES } from "@/lib/constants";
import type { Problem } from "@/types";

export default function DsaTracker() {
  const [filters, setFilters] = useState<ProblemFilters>({ sortBy: "date", order: "desc" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

  const { data, isLoading } = useProblems(filters);
  const { data: stats } = useProblemStats();

  // Global "n" shortcut to log a new problem from anywhere on this page —
  // the whole point of the tracker is that adding an entry is near-instant.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "n" && tag !== "INPUT" && tag !== "TEXTAREA" && !modalOpen) {
        e.preventDefault();
        setEditingProblem(null);
        setModalOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen]);

  const openAdd = () => {
    setEditingProblem(null);
    setModalOpen(true);
  };

  const openEdit = (problem: Problem) => {
    setEditingProblem(problem);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">DSA Tracker</h1>
          <p className="mt-1 text-sm text-ink-muted">Press <kbd className="rounded bg-base-surface-raised px-1.5 py-0.5 font-mono text-xs">n</kbd> to log a problem</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          <Plus size={15} /> Log problem
        </button>
      </div>

      <div className="mt-6">
        <TrackerStatsBar stats={stats} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={filters.q || ""}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value, page: 1 }))}
            placeholder="Search problems..."
            className="w-56 rounded-lg border border-base-border bg-base-surface py-1.5 pl-8 pr-3 text-sm text-ink outline-none focus:border-accent"
          />
        </div>

        <select
          value={filters.topic || ""}
          onChange={(e) => setFilters((f) => ({ ...f, topic: e.target.value, page: 1 }))}
          className="rounded-lg border border-base-border bg-base-surface px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent"
        >
          <option value="">All topics</option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={filters.difficulty || ""}
          onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value, page: 1 }))}
          className="rounded-lg border border-base-border bg-base-surface px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent"
        >
          <option value="">All difficulty</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={filters.revisionRequired || ""}
          onChange={(e) => setFilters((f) => ({ ...f, revisionRequired: e.target.value, page: 1 }))}
          className="rounded-lg border border-base-border bg-base-surface px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent"
        >
          <option value="">All</option>
          <option value="true">Needs revision</option>
          <option value="false">No revision</option>
        </select>

        <select
          value={`${filters.sortBy}-${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split("-");
            setFilters((f) => ({ ...f, sortBy, order: order as "asc" | "desc" }));
          }}
          className="ml-auto rounded-lg border border-base-border bg-base-surface px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent"
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="confidence-asc">Lowest confidence</option>
          <option value="timeTakenMinutes-desc">Most time taken</option>
        </select>
      </div>

      <div className="mt-4">
        <ProblemTable problems={data?.problems || []} isLoading={isLoading} onEdit={openEdit} />
      </div>

      <AddProblemModal open={modalOpen} onOpenChange={setModalOpen} editingProblem={editingProblem} />
    </div>
  );
}
