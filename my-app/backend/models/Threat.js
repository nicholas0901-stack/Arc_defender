import mongoose from "mongoose";

const ThreatSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  type: String, // e.g. "Port Scan", "SQL Injection"
  category: String, // e.g. "ddos", "malware"
  severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
  sourceIP: String,
  count: Number,
});

export default mongoose.model("Threat", ThreatSchema);
