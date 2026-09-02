import express from "express";
import {
  getSustainabilityData,
  updateSustainabilityData,
} from "../controllers/sustainabilityController.js";
import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(Protect);

router.get("/", getSustainabilityData);
router.post("/", updateSustainabilityData);

export default router;
