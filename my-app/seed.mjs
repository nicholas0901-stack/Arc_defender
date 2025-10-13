import mongoose from "mongoose";
import Metric from "./backend/models/Metric.js";
import Alert from "./backend/models/Alert.js";
import SystemStatus from "./backend/models/SystemStatus.js";
import NetworkActivity from "./backend/models/NetworkActivity.js";

console.log("🚀 Connecting to MongoDB...");
await mongoose.connect("mongodb://localhost:27017/arc_defender");
console.log("✅ Connected to MongoDB!");

console.log("🧹 Clearing old data...");
await Promise.all([
  Metric.deleteMany({}),
  Alert.deleteMany({}),
  SystemStatus.deleteMany({}),
  NetworkActivity.deleteMany({}),
]);

console.log("🧠 Inserting data...");
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
const activities = [];
for (let i = 6; i >= 0; i--) {
  activities.push({
    date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000),
    intrusionsDetected: Math.floor(Math.random() * 200),
  });
}

console.log("📊 Activities to insert:", activities);
await NetworkActivity.insertMany(activities);

const count = await NetworkActivity.countDocuments();
console.log("✅ NetworkActivity count:", count);

await mongoose.connection.close();
console.log("🔒 MongoDB connection closed.");
console.log("📦 Database name:", mongoose.connection.name);
console.log("💾 Host:", mongoose.connection.host);
console.log("🔌 Port:", mongoose.connection.port);
