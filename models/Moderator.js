import mongoose from "mongoose";

const moderatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Moderator = mongoose.model("Moderator", moderatorSchema);
export default Moderator;
