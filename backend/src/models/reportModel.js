import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    reportsData: {
      type: Object, // Stores dynamic report structures
      default: {},
    },
  },
  { timestamps: true },
);

export default mongoose.model("Report", reportSchema);
