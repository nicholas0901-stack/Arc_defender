import express from "express";
import Threat from "../models/Threat.js";

const router = express.Router();

// ✅ GET /api/threats
router.get("/", async (req, res) => {
  try {
    const threats = await Threat.find().sort({ timestamp: -1 }).limit(100);
    res.json(threats);
  } catch (err) {
    console.error("❌ Failed to fetch threats:", err.message);
    res.status(500).json({ error: "Server error fetching threats" });
  }
});

export default router;
