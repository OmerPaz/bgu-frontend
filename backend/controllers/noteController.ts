import { Request, Response } from 'express';
import * as noteService from '../services/noteService.js';

/* GET /notes */
export const fetchNotes = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query._page ?? 1);
  const per = Number(req.query._per_page ?? 10);
  const { notes, total } = await noteService.getPaginatedNotes(page, per);
  res.set('x-total-count', total.toString()).status(200).json(notes);
};

/* GET /notes/:id */
export const fetchNote = async (req: Request, res: Response): Promise<void> => {
  const note = await noteService.getNoteById(req.params.id);
  if (!note) {
    res.status(404).json({ error: 'Not Found' });
  } else {
    res.json(note);
  }
};

/* POST /notes */
export const addNote = async (req: Request, res: Response): Promise<void> => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: 'title & content required' });
    return;
  }
  const user = (req as any).user || null;
  const author = user ? { name: user.name, email: user.email } : null;
  const created = await noteService.createNote({ title, author, content, user: user?._id ?? null });
  res.status(201).json(created);
};

/* PUT /notes/:id */
export const editNote = async (req: Request, res: Response): Promise<void> => {
  const note = await noteService.getNoteById(req.params.id);
  const current = (req as any).user;
  if (!note) {
    res.status(404).json({ error: 'Not Found' });
    return;
  }
  if (current && note.user && note.user.toString() !== current._id.toString()) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const updated = await noteService.updateNote(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Not Found' });
  } else {
    res.json(updated);
  }
};

/* DELETE /notes/:id */
export const removeNote = async (req: Request, res: Response): Promise<void> => {
  const note = await noteService.getNoteById(req.params.id);
  const current = (req as any).user;
  if (!note) {
    res.status(404).json({ error: 'Not Found' });
    return;
  }
  if (current && note.user && note.user.toString() !== current._id.toString()) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const deleted = await noteService.deleteNote(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Not Found' });
  } else {
    res.status(204).end();
  }
};

/* GET /notes/by-index/:i */
export const fetchNoteByIndex = async (req: Request, res: Response): Promise<void> => {
  const idx = Number(req.params.i);
  const note = await noteService.getNoteByIndex(idx);
  if (!note) {
    res.status(404).json({ error: 'Not Found' });
  } else {
    res.json(note);
  }
};