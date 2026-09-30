import { Router } from 'express';
import { getDashboardStats } from '../controllers/admin.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { USER_ROLES } from '../models/user.model.js';

const router = Router();

// Protect all admin routes: Require authenticated SUPER_ADMIN
router.use(authenticate, authorizeRoles(USER_ROLES.SUPER_ADMIN));

// Executive Command Center Dashboard Stats
router.get('/dashboard-stats', getDashboardStats);

export default router;
