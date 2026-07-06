import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types";

const styles: Record<Difficulty, string> = {
  Easy: "text-difficulty-easy bg-difficulty-easy/10",
  Medium: "text-difficulty-medium bg-difficulty-medium/10",
  Hard: "text-difficulty-hard bg-difficulty-hard/10",
};

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", styles[difficulty])}>
      {difficulty}
    </span>
  );
}
