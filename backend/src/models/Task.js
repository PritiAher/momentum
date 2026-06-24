import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    category: {
      type: String,
      required: true,
      enum: ["DSA", "Algorithms", "Coursework", "Assignments", "Projects", "Personal"],
    },
    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    deadline: { type: Date, default: null },
    estimatedMinutes: { type: Number, min: 0, default: null },
    status: {
      type: String,
      required: true,
      enum: ["Todo", "InProgress", "Done"],
      default: "Todo",
    },
  },
  { timestamps: true }
);

// Powers the "Today's Top 3 Tasks" dashboard card and the Kanban/List views.
taskSchema.index({ user: 1, status: 1, deadline: 1 });
taskSchema.index({ user: 1, deadline: 1 });

export default mongoose.model("Task", taskSchema);
