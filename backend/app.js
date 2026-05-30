import express from "express";
import cors from "cors";
import errorHandleMiddleware from "./middlewares/errorHandler.js";
import user from "./routes/userRoutes.js";
import test from "./routes/testRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

// 🔹 CORS (MUST BE BEFORE ROUTES)
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);

// 🔹 Middleware
app.use(express.json());
app.use(cookieParser());

// 🔹 Routes
app.use("/api/v1", user);
app.use("/api/v1",test)

// 🔹 Error Middleware
app.use(errorHandleMiddleware);

export default app;