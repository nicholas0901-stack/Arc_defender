import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
  message: String,
  severity: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Alert", AlertSchema);
