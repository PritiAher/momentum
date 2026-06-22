import asyncHandler from "express-async-handler";
import CalendarEvent from "../models/CalendarEvent.js";
import { expandEventOccurrences } from "../utils/occurrenceExpander.js";

// @desc    Create a calendar event (one-off or recurring)
// @route   POST /api/calendar-events
// @access  Private
export const createCalendarEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, event });
});

// @desc    Get occurrences within a date range, with recurring events expanded
// @route   GET /api/calendar-events?from=&to=
// @access  Private
// Query params `from`/`to` are required — an unbounded query would need to
// expand daily recurrences over an unknown window, which is wasted work the
// frontend never needs (it always asks for exactly the visible week/month).
export const getCalendarEvents = asyncHandler(async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    res.status(400);
    throw new Error("Both 'from' and 'to' query params are required");
  }

  const rangeStart = new Date(from);
  const rangeEnd = new Date(to);

  // Fetch any event that could possibly produce an occurrence in range:
  // one-offs starting in range, OR recurring events that started before
  // the range ends and (have no end date, or their end date is after the range starts).
  const events = await CalendarEvent.find({
    user: req.user._id,
    startTime: { $lte: rangeEnd },
    $or: [
      { "recurrence.frequency": "none" },
      { "recurrence.until": null },
      { "recurrence.until": { $gte: rangeStart } },
    ],
  });

  const occurrences = events.flatMap((event) => expandEventOccurrences(event, rangeStart, rangeEnd));
  occurrences.sort((a, b) => a.startTime - b.startTime);

  res.status(200).json({ success: true, occurrences });
});

// @desc    Update a calendar event's series (time, recurrence rule, etc.)
// @route   PUT /api/calendar-events/:id
// @access  Private
export const updateCalendarEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findOne({ _id: req.params.id, user: req.user._id });
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  Object.assign(event, req.body);
  await event.save();
  res.status(200).json({ success: true, event });
});

// @desc    Delete a calendar event (whole series)
// @route   DELETE /api/calendar-events/:id
// @access  Private
export const deleteCalendarEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  res.status(200).json({ success: true, message: "Event deleted" });
});
