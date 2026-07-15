import type { Topic } from "@/types";

export interface TopicProgress {
  topic: Topic;
  solved: number;
  total: number;
  target: number;
  avgConfidence: number;
  completionPct: number;
  weakAreas: string;
  isWeak: boolean;
}
