import mongoose from "mongoose";

const MetricsSchema = new mongoose.Schema({
  activeThreats: Number,
  blockedIntrusions: Number,
  systemUptime: String,
  usersOnline: Number,
});

export default mongoose.model("Metric", MetricsSchema);
