import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one settings doc per user
    },
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
    accentColor: { type: String, default: "#6366f1" },
    dailyDsaTarget: { type: Number, default: 3, min: 0 },
    weeklyDsaTarget: { type: Number, default: 20, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
