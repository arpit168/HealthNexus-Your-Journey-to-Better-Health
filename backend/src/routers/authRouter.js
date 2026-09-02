import express from "express";
import {
  UserRegister,
  UserLogin,
  Logout,
  UserGenOTP,
  UserVerifyOtp,
  UserForgetPassword,
  deleteAccount,
  refresh,
} from "../controllers/authController.js";
import {
  checkUserActive,
  OtpProtect,
  Protect,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.get("/refresh", refresh);

router.post("/logout", Logout);

router.post("/genOtp", UserGenOTP);
router.post("/verifyOtp", UserVerifyOtp);
router.post("/forgetPassword", OtpProtect, UserForgetPassword);

router.delete("/delete-account", Protect, deleteAccount);

export default router;
