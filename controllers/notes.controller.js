import { Notes } from "../models/notes.model.js";

export const addNote = async (req, res) => {
  const { title, tags, content } = req.body;
  const userId = req.user.id; // ✅ Fix: Access userId correctly

  if (!title || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const note = new Notes({
      title,
      tags: tags || [],
      content,
      userId, // ✅ Fix: Correctly assign user ID
    });

    await note.save();
    res.status(201).json({ message: "Note added successfully", note });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const editNote = async (req, res) => {
  const noteId = req.params.noteId;
  const { title, tags, content, isPinned } = req.body;
  const userId = req.user.id; // ✅ Correct way to access user ID

  if (!title && !tags && !content) {
    return res.status(400).json({ message: "No change provided." });
  }

  try {
    const note = await Notes.findOne({ _id: noteId, userId }); // ✅ Correct query
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (title) note.title = title;
    if (tags) note.tags = tags;
    if (content) note.content = content;
    if (isPinned !== undefined) note.isPinned = isPinned; // ✅ Handle false values properly

    await note.save();
    res.json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error("Error editing note:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    console.log("Decoded User:", req.user);

    const userId = req.user.id; 

    const notes = await Notes.find({ userId }).sort({ isPinned: -1 });

    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "No notes found" }); // ✅ Ensures only one response
    }

    return res.json({ notes, message: "All notes retrieved successfully" }); // ✅ Now safely returns response
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteNote = async (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.user.id;

  try {
    console.log(`Attempting to delete note: ${noteId} for user: ${userId}`);

    const note = await Notes.findOneAndDelete({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" }); // ✅ Stops execution
    }

    return res.json({ message: "Note deleted successfully" }); // ✅ Safe response
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateNote = async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const userId = req.user.id; // ✅ Correct user ID access

  try {
    console.log(`🔄 Updating Pin Status for Note: ${noteId}, User: ${userId}`);

    const note = await Notes.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    note.isPinned = isPinned;
    await note.save();

    return res.json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error("❌ Error updating note:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const SearchNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    console.log(`🔍 Searching notes for: "${query}"`); // ✅ Debugging

    const matchingNotes = await Notes.find({
      userId,
      $or: [
        { title: { $regex: new RegExp(query, "i") } }, // Case-insensitive
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    console.log("🔍 Found Notes:", matchingNotes.length); // ✅ Debugging

    if (!matchingNotes || matchingNotes.length === 0) {
      return res.status(404).json({ message: "No matching notes found" });
    }

    return res.json({ notes: matchingNotes, message: "Notes found" });
  } catch (error) {
    console.error("Error searching notes:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


