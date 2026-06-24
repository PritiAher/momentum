import asyncHandler from "express-async-handler";
import Task from "../models/Task.js";

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, task });
});

// @desc    List tasks with optional filters — same collection powers all
//          three views (List/Kanban/Calendar); the frontend just groups the
//          same flat list differently, so one endpoint is enough.
// @route   GET /api/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  const { category, priority, status, from, to } = req.query;

  const filter = { user: req.user._id };
  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (status) filter.status = status;
  if (from || to) {
    filter.deadline = {};
    if (from) filter.deadline.$gte = new Date(from);
    if (to) filter.deadline.$lte = new Date(to);
  }

  const tasks = await Task.find(filter).sort({ deadline: 1, createdAt: -1 });
  res.status(200).json({ success: true, tasks });
});

// @desc    Update a task (also used for drag-and-drop status changes on the Kanban board)
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  Object.assign(task, req.body);
  await task.save();
  res.status(200).json({ success: true, task });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  res.status(200).json({ success: true, message: "Task deleted" });
});
