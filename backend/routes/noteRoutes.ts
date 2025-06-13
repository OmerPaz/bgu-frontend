import { Router } from 'express';
import * as ctrl from '../controllers/noteController.js';
import { authRequired } from '../middlewares/auth.js';

export const noteRouter = Router();

// Specific routes first
noteRouter.get('/by-index/:i', ctrl.fetchNoteByIndex);
noteRouter.put('/by-index/:i', authRequired, ctrl.editNote);
noteRouter.delete('/by-index/:i', authRequired, ctrl.removeNote);

// General routes
noteRouter.get('/', ctrl.fetchNotes);
noteRouter.post('/', authRequired, ctrl.addNote);

noteRouter.get('/:id', ctrl.fetchNote);
noteRouter.put('/:id', authRequired, ctrl.editNote);
noteRouter.delete('/:id', authRequired, ctrl.removeNote);