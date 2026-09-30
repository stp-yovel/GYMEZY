import { Router } from 'express';
import { login, getCurrentUser, logoutUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/logout', logoutUser);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

export default router;
