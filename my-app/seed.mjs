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

const now = new Date();
const initialActivities = [];
for (let i = 6; i >= 0; i--) {
  initialActivities.push({
    date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000),
    intrusionsDetected: Math.floor(Math.random() * 200),
  });
}
await NetworkActivity.insertMany(initialActivities);
console.log("✅ Seed complete! Starting live updates...");

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
const alertSeverities = ["low", "medium", "high"]; // ✅ renamed for clarity

// 🔄 Every 10 seconds: update metrics + append activity + add alert
setInterval(async () => {
  try {
    // 🧮 Randomized metrics
    const updatedMetric = {
      activeThreats: Math.floor(Math.random() * 100) + 10,
      blockedIntrusions: Math.floor(Math.random() * 2000) + 500,
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

    // 🌍 Add new network activity
    const activity = new NetworkActivity({
      date: new Date(),
      intrusionsDetected: Math.floor(Math.random() * 200),
    });
    await activity.save();

    // 🧾 Log summary
    console.log("📊 Live Update:");
    console.log("  - Metric:", updatedMetric);
    console.log("  - Alert:", alert.message, `[${alert.severity}]`);
    console.log("  - New Intrusions:", activity.intrusionsDetected);
  } catch (err) {
    console.error("❌ Live update error:", err.message);
  }
}, 10000); // every 10 seconds

// 🌐 Threat Simulation Section
const threatTypes = ["Port Scan", "SQL Injection", "Phishing", "Malware Injection", "DDoS Flood"];
const threatCategories = ["ddos", "malware", "phishing", "ransomware", "insider"];
const threatSeverities = ["low", "medium", "high"];

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

    console.log(`⚔️  [${threat.severity.toUpperCase()}] ${threat.type} from ${threat.sourceIP} (${threat.category})`);
  } catch (err) {
    console.error("❌ Threat simulation error:", err.message);
  }
}, 12000); // every 12 seconds

// 🛑 Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await mongoose.connection.close();
  console.log("🔒 MongoDB connection closed.");
  process.exit(0);
});
