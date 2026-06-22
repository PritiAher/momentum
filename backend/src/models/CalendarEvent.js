import mongoose from "mongoose";

/**
 * Recurring events are stored as a single document with a recurrence rule,
 * not expanded into individual documents — expansion happens at read time
 * in the controller for a given date range. This keeps "edit this class's
 * time for every week" a one-document update instead of a bulk rewrite.
 */
const calendarEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    type: {
      type: String,
      required: true,
      enum: ["Class", "StudyBlock", "Exam", "Assignment", "PlacementEvent"],
    },
    color: { type: String, default: "#6366f1" }, // hex, used directly by frontend color coding
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    allDay: { type: Boolean, default: false },

    // Recurrence: null means one-off event.
    recurrence: {
      frequency: {
        type: String,
        enum: ["none", "daily", "weekly"],
        default: "none",
      },
      daysOfWeek: [{ type: Number, min: 0, max: 6 }], // 0=Sunday ... used when frequency='weekly'
      until: { type: Date, default: null }, // recurrence end date
    },

    notes: { type: String, trim: true, maxlength: 1000, default: "" },
  },
  { timestamps: true }
);

calendarEventSchema.index({ user: 1, startTime: 1 });
calendarEventSchema.index({ user: 1, type: 1 });

export default mongoose.model("CalendarEvent", calendarEventSchema);
