import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  emeraldID: { type: String, required: true, unique: true },
  flagged: { type: Boolean, default: false },
  flaggedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Moderator" }],
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  bans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ban" }],
});

const User = mongoose.model("User", userSchema);
export default User;
