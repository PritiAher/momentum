import { useTopicProgress } from "@/hooks/useTopics";
import TopicCard from "@/components/topics/TopicCard";

export default function TopicProgressPage() {
  const { data: topics, isLoading } = useTopicProgress();

  const weakCount = topics?.filter((t) => t.isWeak).length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Topic Progress</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Solved counts update automatically from the DSA Tracker. Targets and notes are yours to set.
          </p>
        </div>
        {weakCount > 0 && (
          <span className="rounded-lg bg-warning-muted px-3 py-1.5 text-xs font-medium text-warning">
            {weakCount} weak area{weakCount === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="mt-8 card p-10 text-center text-sm text-ink-faint">Loading...</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {topics?.map((t) => (
            <TopicCard key={t.topic} data={t} />
          ))}
        </div>
      )}
    </div>
  );
}
