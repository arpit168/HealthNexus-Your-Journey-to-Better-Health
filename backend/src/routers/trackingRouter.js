import express from "express";
import {
  getTrackingData,
  updateTrackingData,
} from "../controllers/trackingController.js";
import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(Protect);

router.get("/", getTrackingData);
router.post("/", updateTrackingData);

export default router;
