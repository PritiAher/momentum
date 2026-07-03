import asyncHandler from "express-async-handler";
import Problem from "../models/Problem.js";
import Task from "../models/Task.js";
import RevisionQueue from "../models/RevisionQueue.js";
import Settings from "../models/Settings.js";
import CalendarEvent from "../models/CalendarEvent.js";
import { computeStreak } from "../utils/streakCalculator.js";
import { expandEventOccurrences } from "../utils/occurrenceExpander.js";

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const priorityWeight = { High: 0, Medium: 1, Low: 2 };

// @desc    Single aggregated payload for the Dashboard homepage
// @route   GET /api/dashboard
// @access  Private
export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const [
    distinctProblemDates,
    totalProblems,
    weeklyProblems,
    monthlyProblems,
    revisionEntries,
    pendingTasksRaw,
    pendingTaskCount,
    settings,
    todaysEventCandidates,
  ] = await Promise.all([
    Problem.aggregate([
      { $match: { user: userId } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } } },
      { $sort: { _id: -1 } },
    ]),
    Problem.countDocuments({ user: userId }),
    Problem.countDocuments({ user: userId, date: { $gte: startOfWeek } }),
    Problem.countDocuments({ user: userId, date: { $gte: startOfMonth } }),
    RevisionQueue.find({
      user: userId,
      completed: false,
      scheduledFor: { $lte: endOfDay(now) },
    })
      .sort({ scheduledFor: 1 })
      .limit(5)
      .populate("problem", "problemName platform difficulty topic confidence"),
    // Fetch a slightly larger pending set so we can rank by priority + deadline
    // in JS rather than needing a compound Mongo sort expression for priority enum order.
    Task.find({ user: userId, status: { $ne: "Done" } })
      .sort({ deadline: 1 })
      .limit(20),
    Task.countDocuments({ user: userId, status: { $ne: "Done" } }),
    Settings.findOne({ user: userId }),
    CalendarEvent.find({
      user: userId,
      startTime: { $lte: todayEnd },
      $or: [
        { "recurrence.frequency": "none" },
        { "recurrence.until": null },
        { "recurrence.until": { $gte: todayStart } },
      ],
    }),
  ]);

  const { currentStreak, longestStreak } = computeStreak(distinctProblemDates.map((d) => d._id));

  const topTasks = [...pendingTasksRaw]
    .sort((a, b) => {
      const pw = priorityWeight[a.priority] - priorityWeight[b.priority];
      if (pw !== 0) return pw;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    })
    .slice(0, 3);

  const todaysSchedule = todaysEventCandidates
    .flatMap((event) => expandEventOccurrences(event, todayStart, todayEnd))
    .sort((a, b) => a.startTime - b.startTime);

  const weeklyTarget = settings?.weeklyDsaTarget ?? 20;
  const weeklyProgressPct = weeklyTarget > 0 ? Math.min(100, Math.round((weeklyProblems / weeklyTarget) * 100)) : 0;

  res.status(200).json({
    success: true,
    dashboard: {
      greeting: {
        date: now.toISOString(),
      },
      streak: { current: currentStreak, longest: longestStreak },
      quickStats: {
        totalProblems,
        weeklyProblems,
        monthlyProblems,
        pendingTaskCount,
        dueRevisionCount: revisionEntries.length,
      },
      overallProgress: {
        weeklyProblems,
        weeklyTarget,
        weeklyProgressPct,
      },
      revisionQueue: revisionEntries,
      topTasks,
      todaysSchedule,
    },
  });
});
