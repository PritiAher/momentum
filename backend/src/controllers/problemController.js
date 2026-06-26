import asyncHandler from "express-async-handler";
import Problem from "../models/Problem.js";
import RevisionQueue from "../models/RevisionQueue.js";
import { syncRevisionQueueForProblem } from "../utils/revisionScheduler.js";

// @desc    Create a new problem log entry
// @route   POST /api/problems
// @access  Private
export const createProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.create({ ...req.body, user: req.user._id });
  await syncRevisionQueueForProblem(problem);
  res.status(201).json({ success: true, problem });
});

// @desc    List problems with search / filter / sort / pagination
// @route   GET /api/problems
// @access  Private
// Query params: q, platform, topic, difficulty, pattern, confidence,
// revisionRequired, solved, from, to, sortBy, order, page, limit
export const getProblems = asyncHandler(async (req, res) => {
  const {
    q,
    platform,
    topic,
    difficulty,
    pattern,
    confidence,
    revisionRequired,
    solved,
    from,
    to,
    sortBy = "date",
    order = "desc",
    page = 1,
    limit = 50,
  } = req.query;

  const filter = { user: req.user._id };

  if (platform) filter.platform = platform;
  if (topic) filter.topic = topic;
  if (difficulty) filter.difficulty = difficulty;
  if (pattern) filter.pattern = pattern;
  if (confidence) filter.confidence = Number(confidence);
  if (revisionRequired !== undefined) filter.revisionRequired = revisionRequired === "true";
  if (solved !== undefined) filter.solved = solved === "true";
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }
  if (q) {
    // Regex fallback (not $text) so partial/substring matches work on short
    // queries like "lru" — $text requires whole-word matches which is too
    // strict for a quick-search box over problem names.
    filter.$or = [
      { problemName: { $regex: q, $options: "i" } },
      { pattern: { $regex: q, $options: "i" } },
      { problemNumber: { $regex: q, $options: "i" } },
    ];
  }

  const allowedSortFields = ["date", "confidence", "timeTakenMinutes", "createdAt"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "date";
  const sortOrder = order === "asc" ? 1 : -1;

  const pageNum = Math.max(1, Number(page));
  const pageSize = Math.min(200, Math.max(1, Number(limit)));

  const [problems, total] = await Promise.all([
    Problem.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize),
    Problem.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    problems,
    pagination: { page: pageNum, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
  });
});

// @desc    Get a single problem
// @route   GET /api/problems/:id
// @access  Private
export const getProblemById = asyncHandler(async (req, res) => {
  const problem = await Problem.findOne({ _id: req.params.id, user: req.user._id });
  if (!problem) {
    res.status(404);
    throw new Error("Problem not found");
  }
  res.status(200).json({ success: true, problem });
});

// @desc    Update a problem log entry
// @route   PUT /api/problems/:id
// @access  Private
export const updateProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findOne({ _id: req.params.id, user: req.user._id });
  if (!problem) {
    res.status(404);
    throw new Error("Problem not found");
  }

  Object.assign(problem, req.body);
  await problem.save();
  await syncRevisionQueueForProblem(problem);

  res.status(200).json({ success: true, problem });
});

// @desc    Delete a problem log entry
// @route   DELETE /api/problems/:id
// @access  Private
export const deleteProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!problem) {
    res.status(404);
    throw new Error("Problem not found");
  }
  // Clean up any queue entries tied to a now-deleted problem.
  await RevisionQueue.deleteMany({ problem: problem._id });

  res.status(200).json({ success: true, message: "Problem deleted" });
});

// @desc    Aggregated stats for the tracker header + topic progress cards
// @route   GET /api/problems/stats
// @access  Private
export const getProblemStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [byDifficulty, byTopic, byPattern, totals, weekly, monthly] = await Promise.all([
    Problem.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$difficulty", count: { $sum: 1 } } },
    ]),
    Problem.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$topic",
          count: { $sum: 1 },
          avgConfidence: { $avg: "$confidence" },
        },
      },
      { $sort: { count: -1 } },
    ]),
    Problem.aggregate([
      { $match: { user: userId, pattern: { $ne: "" } } },
      { $group: { _id: "$pattern", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Problem.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgConfidence: { $avg: "$confidence" },
          revisionCount: { $sum: { $cond: ["$revisionRequired", 1, 0] } },
        },
      },
    ]),
    Problem.countDocuments({ user: userId, date: { $gte: startOfWeek } }),
    Problem.countDocuments({ user: userId, date: { $gte: startOfMonth } }),
  ]);

  const difficultyMap = { Easy: 0, Medium: 0, Hard: 0 };
  byDifficulty.forEach((d) => (difficultyMap[d._id] = d.count));

  res.status(200).json({
    success: true,
    stats: {
      total: totals[0]?.total || 0,
      easy: difficultyMap.Easy,
      medium: difficultyMap.Medium,
      hard: difficultyMap.Hard,
      avgConfidence: totals[0]?.avgConfidence ? Number(totals[0].avgConfidence.toFixed(2)) : 0,
      revisionCount: totals[0]?.revisionCount || 0,
      weeklyProblems: weekly,
      monthlyProblems: monthly,
      byTopic: byTopic.map((t) => ({
        topic: t._id,
        count: t.count,
        avgConfidence: Number(t.avgConfidence.toFixed(2)),
      })),
      byPattern: byPattern.map((p) => ({ pattern: p._id, count: p.count })),
    },
  });
});

// @desc    Daily counts for the GitHub-style heatmap (Module 7, used here too)
// @route   GET /api/problems/heatmap
// @access  Private
export const getHeatmapData = asyncHandler(async (req, res) => {
  const daysBack = Math.min(400, Number(req.query.days) || 365);
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  since.setHours(0, 0, 0, 0);

  const data = await Problem.aggregate([
    { $match: { user: req.user._id, date: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    heatmap: data.map((d) => ({ date: d._id, count: d.count })),
  });
});
