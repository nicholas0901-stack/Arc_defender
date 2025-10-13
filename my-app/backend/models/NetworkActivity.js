import mongoose from "mongoose";

const networkActivitySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    intrusionsDetected: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("NetworkActivity", networkActivitySchema);
