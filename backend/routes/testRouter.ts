import { Router } from 'express';
import { Note } from '../models/note.js';

const router = Router();

router.delete('/wipe', async (_req, res) => {
  await Note.deleteMany({});
  res.status(204).end();
});

export default router;