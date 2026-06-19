import asyncHandler from "express-async-handler";
import Problem from "../models/Problem.js";
import Topic from "../models/Topic.js";

export const ALL_TOPICS = [
  "Arrays",
  "Binary Search",
  "Strings",
  "Hashing",
  "Two Pointers",
  "Sliding Window",
  "Linked List",
  "Stack",
  "Queue",
  "Heap",
  "Trees",
  "BST",
  "Graphs",
  "Greedy",
  "Backtracking",
  "Trie",
  "Dynamic Programming",
  "Segment Tree",
  "Bit Manipulation",
  "Math",
];

const DEFAULT_TARGET = 30;

// @desc    Progress for all 20 topics — solved counts + confidence come live
//          from Problem, target + weak-areas notes come from the (optional)
//          Topic doc. A topic with no Topic doc yet still shows up with
//          DEFAULT_TARGET so the frontend never has to special-case "unset".
// @route   GET /api/topics
// @access  Private
export const getTopicProgress = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [problemAgg, topicDocs] = await Promise.all([
    Problem.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$topic",
          total: { $sum: 1 },
          solved: { $sum: { $cond: ["$solved", 1, 0] } },
          avgConfidence: { $avg: "$confidence" },
          weakestConfidence: { $min: "$confidence" },
        },
      },
    ]),
    Topic.find({ user: userId }),
  ]);

  const problemStatsByTopic = Object.fromEntries(problemAgg.map((p) => [p._id, p]));
  const topicDocsByName = Object.fromEntries(topicDocs.map((t) => [t.name, t]));

  const progress = ALL_TOPICS.map((name) => {
    const stats = problemStatsByTopic[name];
    const doc = topicDocsByName[name];
    const target = doc?.targetProblems ?? DEFAULT_TARGET;
    const solved = stats?.solved ?? 0;
    const completionPct = target > 0 ? Math.min(100, Math.round((solved / target) * 100)) : 0;

    return {
      topic: name,
      solved,
      total: stats?.total ?? 0,
      target,
      avgConfidence: stats?.avgConfidence ? Number(stats.avgConfidence.toFixed(2)) : 0,
      completionPct,
      weakAreas: doc?.weakAreas ?? "",
      // Surfaced so the frontend can flag a topic as weak even if the user
      // hasn't written a weakAreas note — low avg confidence is itself a signal.
      isWeak: (stats?.avgConfidence ?? 5) <= 3 && (stats?.total ?? 0) > 0,
    };
  });

  res.status(200).json({ success: true, topics: progress });
});

// @desc    Set target problems and/or weak-areas note for one topic
// @route   PATCH /api/topics/:name
// @access  Private
export const updateTopic = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const { targetProblems, weakAreas } = req.body;

  if (!ALL_TOPICS.includes(name)) {
    res.status(400);
    throw new Error("Unknown topic");
  }

  const update = {};
  if (targetProblems !== undefined) update.targetProblems = Number(targetProblems);
  if (weakAreas !== undefined) update.weakAreas = weakAreas;

  const topic = await Topic.findOneAndUpdate(
    { user: req.user._id, name },
    { $set: update, $setOnInsert: { user: req.user._id, name } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({ success: true, topic });
});
