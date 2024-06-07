import express from "express";
import Note from "../models/Note.js";
import User from "../models/User.js";
import Moderator from "../models/Moderator.js";

const router = express.Router();

// Create a new note
router.post("/create", async (req, res) => {
  const {
    userId,
    userName,
    userEmeraldID,
    moderatorId,
    moderatorName,
    moderatorEmeraldID,
    note,
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

    const newNote = new Note({
      userId,
      moderatorId,
      note,
    });
    const savedNote = await newNote.save();

    // Update references
    user.notes.push(savedNote._id);
    moderator.notes.push(savedNote._id);
    await user.save();
    await moderator.save();

    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Edit a note
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { note },
      { new: true }
    );
    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all notes for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const notes = await Note.find({ userId }).populate("moderatorId", "name");
    res.json(notes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all notes by a moderator
router.get("/moderator/:moderatorId", async (req, res) => {
  const { moderatorId } = req.params;
  try {
    const notes = await Note.find({ moderatorId }).populate(
      "userId",
      "username"
    );
    res.json(notes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
