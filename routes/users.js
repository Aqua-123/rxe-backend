import express from "express";
import User from "../models/User.js";
import Moderator from "../models/Moderator.js";

const router = express.Router();

router.put("/flag/:userId", async (req, res) => {
  const { userId } = req.params;
  const { moderatorId } = req.body;
  try {
    const user = await User.findById(userId);
    const moderator = await Moderator.findById(moderatorId);

    if (!user || !moderator) {
      return res.status(404).json({ message: "User or Moderator not found" });
    }

    user.flagged = true;
    if (!user.flaggedBy.includes(moderatorId)) {
      user.flaggedBy.push(moderatorId);
    }
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/flagged", async (req, res) => {
  try {
    const users = await User.find({ flagged: true }).populate(
      "flaggedBy",
      "name"
    );
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
