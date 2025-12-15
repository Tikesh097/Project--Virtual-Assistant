import dotenv from "dotenv";
dotenv.config();
import express from "express";

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://virtualassistant-4eps.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 8000;

// ✅ CONNECT DB FIRST, THEN START SERVER
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log("MongoDB Connected ✅");
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed ❌", err.message);
  });
