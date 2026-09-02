import express from "express";
import {
  updateUserProfile,
  UserChangePhoto,
  UserResetPassword,
} from "../controllers/userController.js";
import { Protect } from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const Uploads = multer();

router.patch("/update-profile", Protect, updateUserProfile);
router.patch("/changePhoto", Protect, Uploads.single("image"), UserChangePhoto);
router.patch("/resetPassword", Protect, UserResetPassword);

export default router;
