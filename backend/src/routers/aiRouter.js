import express from "express";
import {
  generateResponse,
  streamResponse,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/ask-ai", generateResponse);
router.post("/ask-ai-stream", streamResponse);

export default router;
