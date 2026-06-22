import express from "express";
import {
  createCalendarEvent,
  getCalendarEvents,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "../controllers/calendarEventController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getCalendarEvents).post(createCalendarEvent);
router.route("/:id").put(updateCalendarEvent).delete(deleteCalendarEvent);

export default router;
