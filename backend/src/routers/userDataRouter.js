import express from "express";
import {
  getUserProfile,
  getUserHealthData,
  getWorkoutHistory,
  getMealHistory,
  getTrackingData,
  saveWorkout,
  saveMeal,
  saveTracking,
  saveHealthData,
  getDietPlan,
  saveDietPlan,
  getWorkoutPlan,
  saveWorkoutPlan,
} from "../controllers/userDataController.js";
import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET endpoints - fetch data
router.get("/profile", Protect, getUserProfile);
router.get("/health-data", Protect, getUserHealthData);
router.get("/workout-history", Protect, getWorkoutHistory);
router.get("/meal-history", Protect, getMealHistory);
router.get("/tracking-data", Protect, getTrackingData);
router.get("/diet-plan", Protect, getDietPlan);
router.get("/workout-plan", Protect, getWorkoutPlan);

// POST endpoints - save data
router.post("/workout", Protect, saveWorkout);
router.post("/meal", Protect, saveMeal);
router.post("/tracking", Protect, saveTracking);
router.patch("/health-data", Protect, saveHealthData);
router.post("/diet-plan", Protect, saveDietPlan);
router.post("/workout-plan", Protect, saveWorkoutPlan);

export default router;
