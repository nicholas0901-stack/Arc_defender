import mongoose from "mongoose";
import Metric from "./backend/models/Metric.js";
import Alert from "./backend/models/Alert.js";
import SystemStatus from "./backend/models/SystemStatus.js";
import NetworkActivity from "./backend/models/NetworkActivity.js";
import Threat from "./backend/models/Threat.js";

console.log("🚀 Connecting to MongoDB...");
await mongoose.connect("mongodb://localhost:27017/arc_defender", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("✅ Connected to MongoDB!");

// 🧹 Initial Setup — clear and seed once
console.log("🧹 Clearing old data...");
await Promise.all([
  Metric.deleteMany({}),
  Alert.deleteMany({}),
  SystemStatus.deleteMany({}),
  NetworkActivity.deleteMany({}),
  Threat.deleteMany({}),
]);

console.log("🧠 Inserting initial seed data...");
await Metric.create({
  activeThreats: 46,
  blockedIntrusions: 1212,
  systemUptime: "99.14%",
  usersOnline: 10,
});

await Alert.insertMany([
  { message: "Unauthorized login attempt detected.", severity: "medium" },
  { message: "Firewall rule triggered on port 443.", severity: "low" },
  { message: "System process anomaly detected.", severity: "high" },
  { message: "Port scan activity from external IP.", severity: "medium" },
  { message: "Brute-force login attempt blocked.", severity: "high" },
]);

await SystemStatus.insertMany([
  { component: "IDS engine", status: "Running" },
  { component: "Firewall rules", status: "Active" },
  { component: "Log monitoring", status: "Enabled" },
  { component: "Backup", status: "Scheduled 3AM" },
]);

// 🌍 Network activity (7-day seed)
const now = new Date();
const initialActivities = [];
for (let i = 6; i >= 0; i--) {
  initialActivities.push({
    date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000),
    intrusionsDetected: Math.floor(Math.random() * 200),
  });
}
await NetworkActivity.insertMany(initialActivities);

// 🌐 Threat Simulation — create initial timeline for analytics
const threatTypes = ["Port Scan", "SQL Injection", "Phishing", "Malware Injection", "DDoS Flood"];
const threatCategories = ["ddos", "malware", "phishing", "ransomware", "insider"];
const threatSeverities = ["low", "medium", "high"];

const threats = [];
for (let i = 15; i >= 0; i--) {
  threats.push({
    timestamp: new Date(now.getTime() - i * 6 * 60 * 60 * 1000), // every 6 hours for history
    type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
    category: threatCategories[Math.floor(Math.random() * threatCategories.length)],
    severity: threatSeverities[Math.floor(Math.random() * threatSeverities.length)],
    sourceIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    count: Math.floor(Math.random() * 8) + 1,
  });
}
await Threat.insertMany(threats);

console.log("✅ Seed complete! Starting live updates...");
console.log("📡 Live metrics and threat analytics simulation running...");

// ⚙️ Continuous Simulation Section
const alertMessages = [
  "Unauthorized login attempt detected.",
  "Firewall rule triggered on port 443.",
  "System process anomaly detected.",
  "Port scan activity from external IP.",
  "Brute-force login attempt blocked.",
  "Malware signature detected.",
  "Anomalous DNS activity detected.",
];
const alertSeverities = ["low", "medium", "high"];

// 🧮 Dynamic cumulative counters for analytics
let totalBlocked = 1200;
let totalThreats = 46;

// 🔁 Every 10 seconds: update metrics, alerts, and activities
setInterval(async () => {
  try {
    totalBlocked += Math.floor(Math.random() * 10);
    totalThreats = Math.floor(Math.random() * 80) + 20;

    const updatedMetric = {
      activeThreats: totalThreats,
      blockedIntrusions: totalBlocked,
      systemUptime: `${(99 + Math.random()).toFixed(2)}%`,
      usersOnline: Math.floor(Math.random() * 50) + 5,
    };
    await Metric.create(updatedMetric);

    // 🧠 Random alert
    const alert = new Alert({
      message: alertMessages[Math.floor(Math.random() * alertMessages.length)],
      severity: alertSeverities[Math.floor(Math.random() * alertSeverities.length)],
    });
    await alert.save();

    // 🌍 Network activity update
    const activity = new NetworkActivity({
      date: new Date(),
      intrusionsDetected: Math.floor(Math.random() * 200),
    });
    await activity.save();

    console.log("📊 Live Update:");
    console.log("  - Metric:", updatedMetric);
  } catch (err) {
    console.error("❌ Live update error:", err.message);
  }
}, 10000);

// 🌐 Threat Simulation Section — adds new threats regularly
setInterval(async () => {
  try {
    const threat = new Threat({
      timestamp: new Date(),
      type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      category: threatCategories[Math.floor(Math.random() * threatCategories.length)],
      severity: threatSeverities[Math.floor(Math.random() * threatSeverities.length)],
      sourceIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      count: Math.floor(Math.random() * 10) + 1,
    });
    await threat.save();

    console.log(`⚔️ [${threat.severity.toUpperCase()}] ${threat.type} from ${threat.sourceIP} (${threat.category})`);
  } catch (err) {
    console.error("❌ Threat simulation error:", err.message);
  }
}, 12000);

// 🧠 Daily Trend Simulation — for analytics graphs
setInterval(async () => {
  try {
    const simulatedDate = new Date();
    const trendEntry = new Threat({
      timestamp: simulatedDate,
      type: "Aggregated Trend",
      category: "analysis",
      severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      sourceIP: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      count: Math.floor(Math.random() * 30) + 5,
    });
    await trendEntry.save();

    console.log(`📈 Analytics trend point added: ${trendEntry.count} threats logged`);
  } catch (err) {
    console.error("❌ Trend simulation error:", err.message);
  }
}, 60000); // every 1 minute adds to analytics trend

// 🛑 Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await mongoose.connection.close();
  console.log("🔒 MongoDB connection closed.");
  process.exit(0);
});
