import express from "express";
import {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getProblemStats,
  getHeatmapData,
} from "../controllers/problemController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

// Specific paths before /:id so "stats" and "heatmap" aren't parsed as an id.
router.get("/stats", getProblemStats);
router.get("/heatmap", getHeatmapData);

router.route("/").get(getProblems).post(createProblem);
router.route("/:id").get(getProblemById).put(updateProblem).delete(deleteProblem);

export default router;
