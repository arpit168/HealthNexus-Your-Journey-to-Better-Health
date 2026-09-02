import express from "express";
import {
  getOvertrainingData,
  updateOvertrainingData,
} from "../controllers/overtrainingController.js";
import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(Protect);

router.get("/", getOvertrainingData);
router.post("/", updateOvertrainingData);

export default router;
