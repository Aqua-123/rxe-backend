import express from "express";
import Ban from "../models/Ban.js";
import User from "../models/User.js";
import Moderator from "../models/Moderator.js";

const router = express.Router();

// Create a new ban
router.post("/create", async (req, res) => {
  const {
    userId,
    userName,
    userEmeraldID,
    moderatorId,
    moderatorName,
    moderatorEmeraldID,
    duration,
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

    const newBan = new Ban({
      userId,
      moderatorId,
      moderatorName,
      duration,
    });
    const savedBan = await newBan.save();

    // Update references
    user.bans.push(savedBan._id);
    moderator.bans.push(savedBan._id);
    await user.save();
    await moderator.save();

    res.status(201).json(savedBan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get ban details for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const bans = await Ban.find({ userId }).populate("moderatorId", "name");
    const activeBans = bans
      .filter((ban) => {
        const banEndTime = new Date(
          ban.startTime.getTime() + ban.duration * 60000
        );
        return new Date() < banEndTime;
      })
      .map((ban) => ({
        ...ban.toObject(),
        timeRemaining: Math.max(
          0,
          Math.round(
            (ban.startTime.getTime() + ban.duration * 60000 - Date.now()) /
              60000
          )
        ), // time remaining in minutes
      }));

    if (activeBans.length > 0) {
      res.json({ active: true, bans: activeBans });
    } else {
      res.json({ active: false, bans: [] });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all bans by a moderator
router.get("/moderator/:moderatorId", async (req, res) => {
  const { moderatorId } = req.params;
  try {
    const bans = await Ban.find({ moderatorId }).populate("userId", "username");
    res.json(bans);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
