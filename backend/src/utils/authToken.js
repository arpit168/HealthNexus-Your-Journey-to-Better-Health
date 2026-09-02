import jwt from "jsonwebtoken";

export const genToken = (user, res) => {
  try {
    // Validate user object
    if (!user || !user._id) {
      console.error("Token generation failed: Invalid user object");
      return null;
    }

    // Check if user is still active (optional - if you have an active flag)
    if (user.isActive === false) {
      console.error(
        "Token generation failed: User account is inactive/deleted",
      );
      return null;
    }

    const payload = {
      id: user._id,
      role: user.role || "admin",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Only log in development environment
    if (process.env.NODE_ENV === "development") {
      console.log("Token generated for user:", user._id);
    }

    // Set cookie with security options based on environment
    res.cookie("health", token, {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "lax",
      // domain: process.env.COOKIE_DOMAIN || undefined, // optional
    });

    return token;
  } catch (error) {
    console.error("Token generation error:", error.message);
    // Don't throw - gracefully handle the error
    return null;
  }
};

export const genOtpToken = (user, res) => {
  const payload = {
    id: user._id,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  console.log(token);

  res.cookie("otpToken", token, {
    maxAge: 100 * 60 * 10,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return token;
};
