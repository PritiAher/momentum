import mongoose from "mongoose";

/**
 * One document per user per topic (Arrays, Graphs, DP, ...).
 * Solved counts are derived from Problem documents at read time via
 * aggregation (see problemController.getTopicStats) rather than duplicated
 * here, so this model only stores the parts a user actually sets manually:
 * their target and any freeform notes on weak areas.
 */
const topicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
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
    targetProblems: { type: Number, default: 30, min: 0 },
    weakAreas: { type: String, trim: true, maxlength: 500, default: "" },
  },
  { timestamps: true }
);

// A user should only have one progress record per topic.
topicSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Topic", topicSchema);
