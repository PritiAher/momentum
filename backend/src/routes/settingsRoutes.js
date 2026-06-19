import express from "express";
import { getSettings, updateSettings, exportUserData, importUserData } from "../controllers/settingsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getSettings).put(updateSettings);
router.get("/export", exportUserData);
router.post("/import", importUserData);

export default router;
