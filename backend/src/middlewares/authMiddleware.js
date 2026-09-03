import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// ----------------------Protect------------------
export const Protect = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      const error = new Error(
        "Unauthorized! No token provided. Please login again.",
      );
      error.statusCode = 401;
      return next(error);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    } catch (jwtError) {
      const error = new Error("Invalid or expired token. Please login again.");
      error.statusCode = 401;
      return next(error);
    }

    const verifiedUser = await User.findById(decoded.id);
    if (!verifiedUser) {
      const error = new Error("User not found. Please login again.");
      error.statusCode = 401;
      return next(error);
    }

    req.user = verifiedUser;
    next();
  } catch (error) {
    next(error);
  }
};

// -------------------OTP Protect-----------------
export const OtpProtect = async (req, res, next) => {
  try {
    const token = req.cookies.otpToken;

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      const error = new Error("Unauthorized! Please try again");
      error.statusCode = 401;
      return next(error);
    }

    const verifiedUser = await User.findById(decode.id);
    if (!verifiedUser) {
      const error = new Error("Unauthorized! Please try again");
      error.statusCode = 401;
      return next(error);
    }

    req.user = verifiedUser;
    next();
  } catch (error) {
    next(error);
  }
};

// ----------------------user validation for active-----------------
export const checkUserActive = async (req, res, next) => {
  try {
    if (req.user && req.user.isActive === false) {
      const error = new Error("Account has been deactivated or deleted");
      error.statusCode = 403;
      return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};
