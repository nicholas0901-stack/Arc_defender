import express from "express";
import Metric from "../models/Metric.js";
import Alert from "../models/Alert.js";
import SystemStatus from "../models/SystemStatus.js";
import NetworkActivity from "../models/NetworkActivity.js";

const router = express.Router();

// Existing dashboard summary
router.get("/", async (req, res) => {
  try {
    const metrics = await Metric.findOne().sort({ _id: -1 });
    const alerts = await Alert.find().sort({ timestamp: -1 }).limit(5);
    const systemStatus = await SystemStatus.find();
    res.json({ metrics, alerts, systemStatus });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// Live alerts
router.get("/alerts", async (req, res) => {
  const alerts = await Alert.find().sort({ timestamp: -1 }).limit(10);
  res.json(alerts);
});

router.get("/activity", async (req, res) => {
  try {
    const data = await NetworkActivity.find()
      .sort({ date: 1 }) // ascending order for chart
      .limit(7);

    res.json(data);
  } catch (error) {
    console.error("❌ Failed to fetch network activity:", error);
    res.status(500).json({ error: "Failed to fetch network activity" });
  }
});


export default router;
