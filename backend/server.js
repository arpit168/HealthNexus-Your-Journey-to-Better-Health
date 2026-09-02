import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cloudinary from "./src/config/cloudinary.js";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import AuthRouter from "./src/routers/authRouter.js";
import UserRouter from "./src/routers/UserRouter.js";
import aiRoutes from "./src/routers/aiRouter.js";
import goalRoutes from "./src/routers/goalRouter.js";
import UserDataRouter from "./src/routers/userDataRouter.js";
import chatRouter from "./src/routers/chatRouter.js";
import sustainabilityRouter from "./src/routers/sustainabilityRouter.js";
import overtrainingRouter from "./src/routers/overtrainingRouter.js";
import trackingRouter from "./src/routers/trackingRouter.js";
import reportRouter from "./src/routers/reportRouter.js";
import analyticsRouter from "./src/routers/analyticsRouter.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://vermillion-griffin-998a4f.netlify.app",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no Origin header) and known frontends.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/userData", UserDataRouter);
app.use("/api/chat", chatRouter);
app.use("/api/sustainability", sustainabilityRouter);
app.use("/api/overtraining", overtrainingRouter);
app.use("/api/tracking", trackingRouter);
app.use("/api/reports", reportRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/", (req, res) => {
  console.log("Server is Working");
  res.send("Server is Working");
});

app.use((err, req, res, next) => {
  const ErrorMessage = err.message || "Internal Server Error";
  const StatusCode = err.statusCode || 500;
  console.log("Error Found", { ErrorMessage, StatusCode });

  res.status(StatusCode).json({ message: ErrorMessage });
});

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  console.log("Server started at port:", port);
  connectDB();

  try {
    const res = await cloudinary.api.ping();
    console.log("Cloudinary API is working", res);
  } catch (error) {
    console.error("Error Connection Cloudinary API", error);
  }
});
