// backend/generator.js
import mongoose from "mongoose";
import Alert from "./models/Alert.js";
import Metric from "./models/Metric.js";
import SystemStatus from "./models/SystemStatus.js";
import NetworkActivity from "./models/NetworkActivity.js"; // ✅ added

mongoose.connect("mongodb://localhost:27017/arc_defender", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const severities = ["low", "medium", "high"];
const alertMessages = [
  "Unauthorized login attempt detected.",
  "Port scan activity from external IP.",
  "Malware signature detected in packet stream.",
  "Unusual outbound traffic volume.",
  "Suspicious SSH access from 10.0.0.45.",
  "Firewall rule triggered on port 443.",
  "Brute-force login attempt blocked.",
  "High latency detected in IDS module.",
  "System process anomaly detected.",
  "External IP 198.51.100.23 flagged as malicious.",
];

async function insertFakeData() {
  try {
    // 🔥 Random alert
    const alert = new Alert({
      message: alertMessages[Math.floor(Math.random() * alertMessages.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
    });
    await alert.save();

    // 🔥 Update metrics
    const randomMetric = {
      activeThreats: Math.floor(Math.random() * 40) + 10,
      blockedIntrusions: Math.floor(Math.random() * 2000) + 500,
      systemUptime: `${(99 + Math.random()).toFixed(2)}%`,
      usersOnline: Math.floor(Math.random() * 100),
    };
    await Metric.create(randomMetric);

    // 🔥 Update system status
    const statuses = [
      { component: "IDS engine", status: "Running" },
      { component: "Firewall rules", status: "Active" },
      { component: "Log monitoring", status: "Enabled" },
      { component: "Backup", status: "Scheduled 3AM" },
    ];
    await SystemStatus.deleteMany({});
    await SystemStatus.insertMany(statuses);

    // 🔥 Add a new Network Activity point
    const newActivity = {
      date: new Date(),
      intrusionsDetected: Math.floor(Math.random() * 200),
    };
    await NetworkActivity.create(newActivity);

    // // Keep only the last 7 entries (so chart stays clean)
    // const count = await NetworkActivity.countDocuments();
    // if (count > 7) {
    //   const oldest = await NetworkActivity.find().sort({ date: 1 }).limit(count - 7);
    //   const idsToDelete = oldest.map((d) => d._id);
    //   await NetworkActivity.deleteMany({ _id: { $in: idsToDelete } });
    // }

    console.log(
      `✅ New fake data inserted: ${alert.message} | Intrusions: ${newActivity.intrusionsDetected}`
    );
  } catch (err) {
    console.error("❌ Error generating fake data:", err);
  }
}

// Run every 5 seconds
setInterval(insertFakeData, 5000);
