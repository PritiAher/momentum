import asyncHandler from "express-async-handler";
import Settings from "../models/Settings.js";
import Problem from "../models/Problem.js";
import Task from "../models/Task.js";
import CalendarEvent from "../models/CalendarEvent.js";
import Topic from "../models/Topic.js";
import { syncRevisionQueueForProblem } from "../utils/revisionScheduler.js";

// @desc    Get current user's settings (creates a default doc if somehow missing)
// @route   GET /api/settings
// @access  Private
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne({ user: req.user._id });
  if (!settings) {
    settings = await Settings.create({ user: req.user._id });
  }
  res.status(200).json({ success: true, settings });
});

// @desc    Update theme, accent color, and daily/weekly DSA targets
// @route   PUT /api/settings
// @access  Private
export const updateSettings = asyncHandler(async (req, res) => {
  const { theme, accentColor, dailyDsaTarget, weeklyDsaTarget } = req.body;

  const update = {};
  if (theme !== undefined) update.theme = theme;
  if (accentColor !== undefined) update.accentColor = accentColor;
  if (dailyDsaTarget !== undefined) update.dailyDsaTarget = Number(dailyDsaTarget);
  if (weeklyDsaTarget !== undefined) update.weeklyDsaTarget = Number(weeklyDsaTarget);

  const settings = await Settings.findOneAndUpdate(
    { user: req.user._id },
    { $set: update, $setOnInsert: { user: req.user._id } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({ success: true, settings });
});

// @desc    Export everything this user owns as one JSON document, for backup
//          or moving to another machine. RevisionQueue is deliberately NOT
//          included — it's a derived collection (see revisionScheduler.js),
//          fully reconstructable from each problem's confidence/
//          revisionRequired fields, so exporting it would just be
//          duplicating data that re-import already regenerates correctly.
// @route   GET /api/settings/export
// @access  Private
export const exportUserData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [problems, tasks, calendarEvents, topics, settings] = await Promise.all([
    Problem.find({ user: userId }).lean(),
    Task.find({ user: userId }).lean(),
    CalendarEvent.find({ user: userId }).lean(),
    Topic.find({ user: userId }).lean(),
    Settings.findOne({ user: userId }).lean(),
  ]);

  res.status(200).json({
    success: true,
    exportedAt: new Date().toISOString(),
    version: 1,
    data: { problems, tasks, calendarEvents, topics, settings },
  });
});

// @desc    Import a previously exported backup. Additive, not destructive —
//          existing data is never deleted; imported records are inserted
//          as new documents (or upserted, for Topics/Settings, which are
//          one-per-user/topic and would otherwise duplicate).
// @route   POST /api/settings/import
// @access  Private
export const importUserData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { data } = req.body;

  if (!data || typeof data !== "object") {
    res.status(400);
    throw new Error("Expected a backup payload with a 'data' object");
  }

  const strip = (doc) => {
    const { _id, user, createdAt, updatedAt, __v, ...rest } = doc;
    return { ...rest, user: userId };
  };

  const counts = { problems: 0, tasks: 0, calendarEvents: 0, topics: 0 };

  if (Array.isArray(data.problems) && data.problems.length > 0) {
    const created = await Problem.insertMany(data.problems.map(strip), { ordered: false });
    await Promise.all(created.map((p) => syncRevisionQueueForProblem(p)));
    counts.problems = created.length;
  }

  if (Array.isArray(data.tasks) && data.tasks.length > 0) {
    const created = await Task.insertMany(data.tasks.map(strip), { ordered: false });
    counts.tasks = created.length;
  }

  if (Array.isArray(data.calendarEvents) && data.calendarEvents.length > 0) {
    const created = await CalendarEvent.insertMany(data.calendarEvents.map(strip), { ordered: false });
    counts.calendarEvents = created.length;
  }

  if (Array.isArray(data.topics) && data.topics.length > 0) {
    await Promise.all(
      data.topics.map((t) =>
        Topic.findOneAndUpdate(
          { user: userId, name: t.name },
          { $set: { targetProblems: t.targetProblems, weakAreas: t.weakAreas } },
          { upsert: true }
        )
      )
    );
    counts.topics = data.topics.length;
  }

  if (data.settings && typeof data.settings === "object") {
    const { theme, accentColor, dailyDsaTarget, weeklyDsaTarget } = data.settings;
    await Settings.findOneAndUpdate(
      { user: userId },
      { $set: { theme, accentColor, dailyDsaTarget, weeklyDsaTarget } },
      { upsert: true }
    );
  }

  res.status(200).json({ success: true, imported: counts });
});
