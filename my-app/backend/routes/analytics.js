import express from "express";
import Metric from "../models/Metric.js";
import Threat from "../models/Threat.js";

const router = express.Router();

/**
 * 📊 GET /api/analytics/efficiency
 * Returns detection efficiency stats (smoothed average)
 */
router.get("/efficiency", async (req, res) => {
  try {
    // Get last 10 metric records
    const recent = await Metric.find().sort({ _id: -1 }).limit(10);

    if (recent.length === 0)
      return res.json({ efficiency: 0, blocked: 0, total: 0, avg: 0 });

    // Calculate average blocked vs total
    let blockedSum = 0;
    let totalSum = 0;

    recent.forEach((m) => {
      const blocked = m.blockedIntrusions || 0;
      const active = m.activeThreats || 0;
      blockedSum += blocked;
      totalSum += blocked + active;
    });

    const avgEfficiency = totalSum > 0 ? ((blockedSum / totalSum) * 100).toFixed(1) : 0;

    // Use the latest record for absolute snapshot
    const latest = recent[0];
    const latestBlocked = latest.blockedIntrusions || 0;
    const latestTotal = (latest.blockedIntrusions || 0) + (latest.activeThreats || 0);
    const latestEfficiency =
      latestTotal > 0 ? ((latestBlocked / latestTotal) * 100).toFixed(1) : 0;

    res.json({
      efficiency: latestEfficiency,
      avgEfficiency,
      blocked: latestBlocked,
      total: latestTotal,
    });
  } catch (err) {
    console.error("❌ Error computing detection efficiency:", err);
    res.status(500).json({ error: "Failed to compute detection efficiency." });
  }
});

/**
 * 📈 Threat Trends Over Time
 */
router.get("/trends", async (req, res) => {
  try {
    const trends = await Threat.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%m-%d %H:%M", date: "$timestamp" } },
          count: { $sum: "$count" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 20 },
    ]);
    res.json(trends);
  } catch (err) {
    console.error("❌ Trend fetch error:", err);
    res.status(500).json({ error: "Failed to fetch threat trends." });
  }
});

/**
 * 🌎 Attack Origins by Source IP
 */
router.get("/origins", async (req, res) => {
  try {
    const origins = await Threat.aggregate([
      {
        $group: {
          _id: "$sourceIP",
          count: { $sum: "$count" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    res.json(origins);
  } catch (err) {
    console.error("❌ Origin fetch error:", err);
    res.status(500).json({ error: "Failed to fetch attack origins." });
  }
});

/**
 * 🧠 Overview counts by severity (for pie chart)
 */
router.get("/overview", async (req, res) => {
  try {
    const severityCounts = await Threat.aggregate([
      {
        $group: {
          _id: "$severity",
          total: { $sum: 1 },
        },
      },
    ]);

    const data = { highSeverity: 0, mediumSeverity: 0, lowSeverity: 0 };
    severityCounts.forEach((s) => {
      if (s._id === "high") data.highSeverity = s.total;
      if (s._id === "medium") data.mediumSeverity = s.total;
      if (s._id === "low") data.lowSeverity = s.total;
    });

    res.json(data);
  } catch (err) {
    console.error("❌ Overview fetch error:", err);
    res.status(500).json({ error: "Failed to fetch overview analytics." });
  }
});

export default router;
