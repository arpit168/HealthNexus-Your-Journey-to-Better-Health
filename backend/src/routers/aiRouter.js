import express from "express";
import {
  generateResponse,
  streamResponse,
} from "../controllers/aiController.js";
import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/ask-ai", Protect, generateResponse);
router.post("/ask-ai-stream", Protect, streamResponse);

export default router;
