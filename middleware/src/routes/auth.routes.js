import { Router } from 'express';
import {
  login,
  registerCustomer,
  getCurrentUser,
  logoutUser,
  checkEmailAvailability,
  updateProfile,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/register', registerCustomer);
router.post('/logout', logoutUser);
router.get('/check-email', checkEmailAvailability);
router.post('/check-email', checkEmailAvailability);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.patch('/profile', authenticate, updateProfile);
router.put('/profile', authenticate, updateProfile);

export default router;

