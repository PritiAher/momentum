import express from "express";
import authRoutes from "./authRoutes.js";
import problemRoutes from "./problemRoutes.js"; // Module 4: DSA Tracker
import revisionRoutes from "./revisionRoutes.js"; // Module 6: Revision System
import dashboardRoutes from "./dashboardRoutes.js"; // Module 1: Dashboard aggregation
import topicRoutes from "./topicRoutes.js"; // Module 5: Topic Progress
import taskRoutes from "./taskRoutes.js"; // Module 3: Task Manager
import calendarEventRoutes from "./calendarEventRoutes.js"; // Module 2: Calendar
import analyticsRoutes from "./analyticsRoutes.js"; // Module 7: Analytics
import settingsRoutes from "./settingsRoutes.js"; // Module 8: Settings

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/problems", problemRoutes);
router.use("/revisions", revisionRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/topics", topicRoutes);
router.use("/tasks", taskRoutes);
router.use("/calendar-events", calendarEventRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/settings", settingsRoutes);

export default router;
