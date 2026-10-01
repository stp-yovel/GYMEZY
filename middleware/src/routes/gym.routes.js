import { Router } from 'express';
import {
  onboardGym,
  getGyms,
  getGymById,
  updateGymStatus,
  deleteGym,
} from '../controllers/gym.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { USER_ROLES } from '../models/user.model.js';

const router = Router();

// Enforce JWT Authentication across all gym endpoints
router.use(authenticate);

// Onboard new gym partner (Authenticated via JWT)
router.post('/onboard', onboardGym);
router.post('/', onboardGym);

// List gyms with filters and pagination
router.get('/', getGyms);

// Get single gym by id or slug
router.get('/:id', getGymById);

// Super Admin status updates
router.patch(
  '/:id/status',
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  updateGymStatus
);

// Super Admin delete gym
router.delete(
  '/:id',
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  deleteGym
);

export default router;
