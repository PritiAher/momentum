import express from "express";
import { getTopicProgress, updateTopic } from "../controllers/topicController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getTopicProgress);
router.patch("/:name", updateTopic);

export default router;
