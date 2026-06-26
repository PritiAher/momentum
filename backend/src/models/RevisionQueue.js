import mongoose from "mongoose";

/**
 * One entry per scheduled revision touchpoint for a problem (tomorrow, +7d,
 * +21d). Entries are created automatically by a post-save hook on Problem
 * (see problemController) whenever confidence <= 3 or revisionRequired is
 * true — the user never creates these directly.
 */
const revisionQueueSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    stage: {
      type: String,
      enum: ["tomorrow", "7day", "21day"],
      required: true,
    },
    scheduledFor: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Dashboard's "Today's Revision Queue" queries: user + not completed + due today.
revisionQueueSchema.index({ user: 1, scheduledFor: 1, completed: 1 });
revisionQueueSchema.index({ problem: 1 });

export default mongoose.model("RevisionQueue", revisionQueueSchema);
