import mongoose from "mongoose";

const moderatorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  emeraldID: { type: String, required: true, unique: true },
  mod: { type: Boolean, required: true },
  master: { type: Boolean, required: true },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  bans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ban" }],
});

const Moderator = mongoose.model("Moderator", moderatorSchema);
export default Moderator;
