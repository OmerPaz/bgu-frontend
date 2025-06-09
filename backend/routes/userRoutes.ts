import { Router } from 'express';
import { createUser, login } from '../controllers/userController.js';

const router = Router();

router.post('/users', createUser);
router.post('/login', login);

export default router; 