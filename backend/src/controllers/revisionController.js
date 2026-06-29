import asyncHandler from "express-async-handler";
import RevisionQueue from "../models/RevisionQueue.js";

const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// @desc    Get today's (and overdue) revision queue, populated with problem details
// @route   GET /api/revisions/today
// @access  Private
// Overdue entries are included deliberately — a skipped revision doesn't
// vanish, it just stacks onto today until it's done. This is what the
// Dashboard's "Today's Revision Queue" card reads from.
export const getTodayQueue = asyncHandler(async (req, res) => {
  const entries = await RevisionQueue.find({
    user: req.user._id,
    completed: false,
    scheduledFor: { $lte: endOfDay(new Date()) },
  })
    .sort({ scheduledFor: 1 })
    .populate("problem", "problemName platform difficulty topic pattern confidence notebookPage");

  res.status(200).json({ success: true, entries });
});

// @desc    Get upcoming (not-yet-due) revision entries, e.g. for a calendar view
// @route   GET /api/revisions/upcoming
// @access  Private
export const getUpcomingQueue = asyncHandler(async (req, res) => {
  const days = Math.min(90, Number(req.query.days) || 14);
  const until = new Date();
  until.setDate(until.getDate() + days);

  const entries = await RevisionQueue.find({
    user: req.user._id,
    completed: false,
    scheduledFor: { $gt: endOfDay(new Date()), $lte: until },
  })
    .sort({ scheduledFor: 1 })
    .populate("problem", "problemName platform difficulty topic");

  res.status(200).json({ success: true, entries });
});

// @desc    Mark a revision entry complete
// @route   PATCH /api/revisions/:id/complete
// @access  Private
export const completeRevision = asyncHandler(async (req, res) => {
  const entry = await RevisionQueue.findOne({ _id: req.params.id, user: req.user._id });
  if (!entry) {
    res.status(404);
    throw new Error("Revision entry not found");
  }

  entry.completed = true;
  entry.completedAt = new Date();
  await entry.save();

  res.status(200).json({ success: true, entry });
});
