import asyncHandler from "express-async-handler";
import Problem from "../models/Problem.js";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const isoWeekKey = (dateStr) => {
  // Buckets a YYYY-MM-DD string into "the Sunday that starts its week",
  // matching how the rest of the app (Dashboard, Tracker stats) already
  // defines a week — keeps "weekly" consistent across every screen.
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d.toISOString().slice(0, 10);
};

const monthKey = (dateStr) => dateStr.slice(0, 7); // "YYYY-MM"

// @desc    Aggregated analytics payload: heatmap, trends, distributions, rolling average
// @route   GET /api/analytics?days=180
// @access  Private
export const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const daysBack = Math.min(400, Number(req.query.days) || 180);
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  since.setHours(0, 0, 0, 0);

  const [dailyRaw, difficultyAgg, topicAgg, patternAgg] = await Promise.all([
    // One row per calendar day with an entry: count, avg confidence, total minutes.
    // Everything else (weekly/monthly trend, rolling average, confidence
    // trend) is derived from this single pass in JS below, rather than
    // running four more slightly-different Mongo aggregations.
    Problem.aggregate([
      { $match: { user: userId, date: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
          avgConfidence: { $avg: "$confidence" },
          totalMinutes: { $sum: { $ifNull: ["$timeTakenMinutes", 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Problem.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$difficulty", count: { $sum: 1 } } },
    ]),
    Problem.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$topic", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Problem.aggregate([
      { $match: { user: userId, pattern: { $ne: "" } } },
      { $group: { _id: "$pattern", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 12 },
    ]),
  ]);

  // --- Fill gaps so charts don't show misleading straight lines across
  // days with zero activity (Mongo simply omits days with no problems). ---
  const byDate = Object.fromEntries(dailyRaw.map((d) => [d._id, d]));
  const allDays = [];
  for (let i = 0; i < daysBack; i++) {
    const d = new Date(since.getTime() + i * ONE_DAY_MS);
    allDays.push(d.toISOString().slice(0, 10));
  }

  const dailyTrend = allDays.map((dateStr) => {
    const entry = byDate[dateStr];
    return {
      date: dateStr,
      count: entry?.count || 0,
      avgConfidence: entry?.avgConfidence ? Number(entry.avgConfidence.toFixed(2)) : null,
      totalMinutes: entry?.totalMinutes || 0,
    };
  });

  // 7-day rolling average of problems solved, smooths day-to-day noise so
  // the trend line reflects pace rather than "did I log today or not".
  const rollingAverage = dailyTrend.map((_, i) => {
    const windowStart = Math.max(0, i - 6);
    const window = dailyTrend.slice(windowStart, i + 1);
    const avg = window.reduce((sum, d) => sum + d.count, 0) / window.length;
    return { date: dailyTrend[i].date, rollingAvg: Number(avg.toFixed(2)) };
  });

  const weeklyBuckets = {};
  const monthlyBuckets = {};
  dailyTrend.forEach((d) => {
    const wk = isoWeekKey(d.date);
    weeklyBuckets[wk] = (weeklyBuckets[wk] || 0) + d.count;
    const mk = monthKey(d.date);
    monthlyBuckets[mk] = (monthlyBuckets[mk] || 0) + d.count;
  });
  const weeklyTrend = Object.entries(weeklyBuckets)
    .map(([weekStart, count]) => ({ weekStart, count }))
    .sort((a, b) => (a.weekStart > b.weekStart ? 1 : -1));
  const monthlyTrend = Object.entries(monthlyBuckets)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => (a.month > b.month ? 1 : -1));

  // Confidence trend only makes sense on days you actually logged something.
  const confidenceTrend = dailyTrend.filter((d) => d.avgConfidence !== null).map((d) => ({
    date: d.date,
    avgConfidence: d.avgConfidence,
  }));

  const difficultyMap = { Easy: 0, Medium: 0, Hard: 0 };
  difficultyAgg.forEach((d) => (difficultyMap[d._id] = d.count));

  res.status(200).json({
    success: true,
    analytics: {
      heatmap: dailyTrend.map((d) => ({ date: d.date, count: d.count })),
      dailyTrend,
      weeklyTrend,
      monthlyTrend,
      rollingAverage,
      confidenceTrend,
      timeSpentTrend: dailyTrend.map((d) => ({ date: d.date, totalMinutes: d.totalMinutes })),
      difficultyDistribution: difficultyMap,
      topicDistribution: topicAgg.map((t) => ({ topic: t._id, count: t.count })),
      patternDistribution: patternAgg.map((p) => ({ pattern: p._id, count: p.count })),
    },
  });
});
