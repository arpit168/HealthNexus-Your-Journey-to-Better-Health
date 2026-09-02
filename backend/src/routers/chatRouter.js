import express from "express";
import {
  getChatHistory,
  updateChatHistory,
  clearChatHistory,
} from "../controllers/chatController.js";
import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(Protect);

router.get("/", getChatHistory);
router.post("/", updateChatHistory);
router.delete("/", clearChatHistory);

export default router;
