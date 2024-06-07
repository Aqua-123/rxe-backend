import express from "express";
import User from "../models/User.js";
import Moderator from "../models/Moderator.js";

const router = express.Router();

router.put("/flag/:userId", async (req, res) => {
  const { userId } = req.params;
  const {
    moderatorId,
    moderatorName,
    moderatorEmeraldID,
    userName,
    userEmeraldID,
  } = req.body;

  try {
    let user = await User.findById(userId);
    if (!user) {
      user = new User({
        _id: userId,
        username: userName,
        name: userName,
        emeraldID: userEmeraldID,
        flagged: false,
        flaggedBy: [],
        notes: [],
        bans: [],
      });
      await user.save();
    }

    let moderator = await Moderator.findById(moderatorId);
    if (!moderator) {
      moderator = new Moderator({
        _id: moderatorId,
        username: moderatorName,
        name: moderatorName,
        emeraldID: moderatorEmeraldID,
        mod: true,
        master: false,
        notes: [],
        bans: [],
      });
      await moderator.save();
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

// Get all flagged users with moderator details
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
