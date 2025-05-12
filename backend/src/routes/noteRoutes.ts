import { Router } from 'express';
import * as ctrl from '../controllers/noteController.js';

export const noteRouter = Router();

// Specific routes first
noteRouter.get('/by-index/:i', ctrl.fetchNoteByIndex);
noteRouter.put('/by-index/:i', ctrl.editNote);
noteRouter.delete('/by-index/:i', ctrl.removeNote);

// General routes
noteRouter.get('/', ctrl.fetchNotes);
noteRouter.post('/', ctrl.addNote);

noteRouter.get('/:id', ctrl.fetchNote);
noteRouter.put('/:id', ctrl.editNote);
noteRouter.delete('/:id', ctrl.removeNote);