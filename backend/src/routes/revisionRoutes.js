import express from "express";
import { getTodayQueue, getUpcomingQueue, completeRevision } from "../controllers/revisionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/today", getTodayQueue);
router.get("/upcoming", getUpcomingQueue);
router.patch("/:id/complete", completeRevision);

export default router;
