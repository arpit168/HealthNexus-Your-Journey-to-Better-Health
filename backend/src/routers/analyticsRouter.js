import express from "express";
import {
  getAnalyticsData,
  generateAnalyticsReport,
} from "../controllers/analyticsController.js";
import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(Protect);

router.get("/", getAnalyticsData);
router.post("/generate", generateAnalyticsReport);

export default router;
