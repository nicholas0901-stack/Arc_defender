import mongoose from "mongoose";

const SystemSchema = new mongoose.Schema({
  component: String,
  status: String,
});

export default mongoose.model("SystemStatus", SystemSchema);
