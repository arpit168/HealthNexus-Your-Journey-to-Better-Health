import express from "express";

import {
  createGoal,
  getUserGoals,
  getSingleGoal,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";

import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/", Protect, createGoal);

// GET ALL USER GOALS
router.get("/", Protect, getUserGoals);

// GET SINGLE GOAL
router.get("/:id", Protect, getSingleGoal);

// UPDATE GOAL
router.put("/:id", Protect, updateGoal);

// DELETE GOAL
router.delete("/:id", Protect, deleteGoal);

export default router;
