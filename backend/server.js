import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

import connectDB from "./src/config/db.js";
import apiRoutes from "./src/routes/index.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";

await connectDB();

const app = express();

// --- Security & parsing middleware ---
app.use(helmet());
app.use(express.json({ limit: "8mb" })); // roomy enough for a full backup import (Module 8) of months of tracker data
app.use(cookieParser());
app.use(mongoSanitize()); // strips $ and . operators from user input to prevent NoSQL injection

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // required so the httpOnly auth cookie is sent/received
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate limit auth routes specifically hard (brute force protection);
// general API limit is looser.
const generalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", generalLimiter);

// --- Routes ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Momentum API is running" });
});
app.use("/api", apiRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Momentum backend listening on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});
