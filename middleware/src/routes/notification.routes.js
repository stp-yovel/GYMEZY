import { Router } from 'express';
import {
  registerDeviceToken,
  removeDeviceToken,
  sendTestNotification,
} from '../controllers/notification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// All notification device token routes require authentication
router.post('/device-token', authenticate, registerDeviceToken);
router.delete('/device-token', authenticate, removeDeviceToken);
router.post('/test', authenticate, sendTestNotification);

export default router;
