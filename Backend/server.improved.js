import dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// ✅ Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution

// ✅ CORS Configuration (use environment variables)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      "http://localhost:5173",
      "https://virtualassistant-4eps.onrender.com"
    ];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// ✅ Request Logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ✅ Body Parser
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent attacks
app.use(cookieParser());

// ✅ Rate Limiting for Auth Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ General API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ✅ Routes with versioning
app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/user", apiLimiter, userRouter);

// Keep old routes for backward compatibility
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/user", apiLimiter, userRouter);

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  // Don't expose error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong!'
    : err.message;

  res.status(err.statusCode || 500).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 8000;

// ✅ CONNECT DB FIRST, THEN START SERVER
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log("MongoDB Connected ✅");
      console.log(`Server running on port ${PORT} 🚀`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed ❌", err.message);
    process.exit(1); // Exit process with failure
  });

// ✅ Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// ✅ Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});
