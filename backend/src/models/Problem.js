import mongoose from "mongoose";

/**
 * Core DSA tracker document. Deliberately does NOT store algorithm
 * explanations or solutions — the user keeps those in a physical notebook
 * (see notebookPage). This model is a fast-entry log, not a knowledge base.
 */
const problemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true, default: Date.now },
    platform: {
      type: String,
      required: true,
      enum: ["LeetCode", "GFG", "Codeforces", "CodeStudio", "HackerRank", "Other"],
    },
    problemNumber: { type: String, trim: true, maxlength: 20, default: "" },
    problemName: { type: String, required: true, trim: true, maxlength: 200 },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    topic: {
      type: String,
      required: true,
      enum: [
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
      ],
    },
    pattern: { type: String, trim: true, maxlength: 100, default: "" },
    timeTakenMinutes: { type: Number, min: 0, default: null },
    solved: { type: Boolean, required: true, default: true },
    hintUsed: { type: Boolean, default: false },
    confidence: { type: Number, min: 1, max: 5, required: true },
    revisionRequired: { type: Boolean, default: false },
    notebookPage: { type: String, trim: true, maxlength: 20, default: "" },
    remarks: { type: String, trim: true, maxlength: 500, default: "" },
  },
  { timestamps: true }
);

// Every list/filter view is scoped to a user and usually sorted by date —
// this compound index covers the dashboard, tracker table, and heatmap query.
problemSchema.index({ user: 1, date: -1 });
// Topic progress cards filter by user + topic.
problemSchema.index({ user: 1, topic: 1 });
// Revision queue query: user + (confidence<=3 OR revisionRequired=true).
problemSchema.index({ user: 1, revisionRequired: 1, confidence: 1 });
// Free-text search across name/pattern for the tracker's search box.
problemSchema.index({ problemName: "text", pattern: "text" });

export default mongoose.model("Problem", problemSchema);
