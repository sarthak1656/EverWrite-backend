import { Router } from "express";
import {
  addNote,
  deleteNote,
  editNote,
  getAllNotes,
  SearchNote,
  updateNote,
} from "../controllers/notes.controller.js";
import authenticateToken from "../middlewares/utilities.js";

const notesRouter = Router();

notesRouter.post("/add-note", authenticateToken, addNote);
notesRouter.put("/edit-note/:noteId", authenticateToken, editNote);
notesRouter.get("/get-all-notes", authenticateToken, getAllNotes);
notesRouter.delete("/delete-note/:noteId", authenticateToken, deleteNote);
notesRouter.put("/update-note/:noteId", authenticateToken, updateNote);
notesRouter.get("/search-note", authenticateToken, SearchNote);

export default notesRouter;
