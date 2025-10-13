import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dashboardRoutes from "./routes/dashboard.js";
import authRoutes from "./routes/auth.js";

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // your React app
    credentials: true,
  })
);

// ✅ Connect MongoDB
mongoose
  .connect("mongodb://localhost:27017/arc_defender", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Mount routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);

// ✅ Debug route loading
console.log("✅ Dashboard routes mounted at /api/dashboard");
console.log("✅ Auth routes mounted at /api/auth");

// ✅ Default root route
app.get("/", (req, res) => {
  res.send("Arc Defender API running...");
});

// ✅ 404 handler (for clarity when you hit missing routes)
app.use((req, res, next) => {
  console.warn(`⚠️ Route not found: ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
