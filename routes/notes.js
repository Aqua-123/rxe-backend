import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

// Create a new note
router.post("/", async (req, res) => {
  const { userId, moderatorId, note } = req.body;
  try {
    const newNote = new Note({
      userId,
      moderatorId,
      note,
    });
    const savedNote = await newNote.save();
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
