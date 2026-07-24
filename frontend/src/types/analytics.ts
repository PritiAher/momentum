export interface DailyTrendPoint {
  date: string;
  count: number;
  avgConfidence: number | null;
  totalMinutes: number;
}

export interface AnalyticsData {
  heatmap: { date: string; count: number }[];
  dailyTrend: DailyTrendPoint[];
  weeklyTrend: { weekStart: string; count: number }[];
  monthlyTrend: { month: string; count: number }[];
  rollingAverage: { date: string; rollingAvg: number }[];
  confidenceTrend: { date: string; avgConfidence: number }[];
  timeSpentTrend: { date: string; totalMinutes: number }[];
  difficultyDistribution: { Easy: number; Medium: number; Hard: number };
  topicDistribution: { topic: string; count: number }[];
  patternDistribution: { pattern: string; count: number }[];
}
