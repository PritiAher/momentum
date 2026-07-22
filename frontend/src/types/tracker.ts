export interface RevisionEntry {
  _id: string;
  stage: "tomorrow" | "7day" | "21day";
  scheduledFor: string;
  completed: boolean;
  problem: {
    _id: string;
    problemName: string;
    platform: string;
    difficulty: "Easy" | "Medium" | "Hard";
    topic: string;
    pattern: string;
    confidence: number;
    notebookPage: string;
  };
}

export interface ProblemStats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  avgConfidence: number;
  revisionCount: number;
  weeklyProblems: number;
  monthlyProblems: number;
  byTopic: { topic: string; count: number; avgConfidence: number }[];
  byPattern: { pattern: string; count: number }[];
}
