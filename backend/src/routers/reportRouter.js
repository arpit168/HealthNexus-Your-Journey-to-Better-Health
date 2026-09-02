import express from "express";
import {
  getReportData,
  updateReportData,
} from "../controllers/reportController.js";
import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(Protect);

router.get("/", getReportData);
router.post("/", updateReportData);

export default router;
