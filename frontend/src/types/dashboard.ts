import type { RevisionEntry } from "@/types/tracker";
import type { Task } from "@/types";
import type { EventOccurrence } from "@/types/calendar";

export interface DashboardData {
  streak: { current: number; longest: number };
  quickStats: {
    totalProblems: number;
    weeklyProblems: number;
    monthlyProblems: number;
    pendingTaskCount: number;
    dueRevisionCount: number;
  };
  overallProgress: {
    weeklyProblems: number;
    weeklyTarget: number;
    weeklyProgressPct: number;
  };
  revisionQueue: RevisionEntry[];
  topTasks: Task[];
  todaysSchedule: EventOccurrence[];
}
