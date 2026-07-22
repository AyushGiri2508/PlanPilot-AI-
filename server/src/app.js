const express = require("express");
const cors = require("cors");

const rateLimiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const goalRoutes = require("./routes/goalRoutes");
const aiRoutes = require("./routes/aiRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

/* -------------------------- Global Middlewares -------------------------- */

// Enable CORS
app.use(cors());

// Parse JSON & Form Data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
app.use(rateLimiter);

/* ---------------------------- Health Check ----------------------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PlanPilot AI Backend is Running 🚀",
    version: "1.0.0",
  });
});

/* ------------------------------ API Routes ----------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/analytics", analyticsRoutes);

/* -------------------------- 404 Route Handler -------------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/* ----------------------- Global Error Handler -------------------------- */

app.use(errorHandler);

module.exports = app;