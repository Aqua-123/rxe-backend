import mongoose from "mongoose";

const banSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    moderatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Moderator",
    },
    moderatorName: { type: String, required: true },
    duration: { type: Number, required: true },
    startTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Ban = mongoose.model("Ban", banSchema);
export default Ban;
