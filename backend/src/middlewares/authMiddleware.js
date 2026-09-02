import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// ----------------------Protect------------------
export const Protect = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    console.log("Token received in Cookies:", token);

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

    console.log(decoded);

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

// ----------------------admin Protect------------
export const AdminProtect = async (req, res, next) => {
  try {
    let token;

    // 1. Check token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 4. Optional role check
    if (req.headers.role && req.headers.role !== user.role) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};

// -------------------OTP Protect-----------------
export const OtpProtect = async (req, res, next) => {
  try {
    const token = req.cookies.otpToken;
    console.log("Token recived in Cookies:", token);

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
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
