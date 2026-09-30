import { Router } from 'express';
import {
  onboardGym,
  getGyms,
  getGymById,
  updateGymStatus,
} from '../controllers/gym.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { USER_ROLES } from '../models/user.model.js';

const router = Router();

// Onboard new gym partner (Accessible by Super Admin or onboarding portal)
router.post('/onboard', onboardGym);
router.post('/', onboardGym);

// List gyms with filters and pagination
router.get('/', getGyms);

// Get single gym by id or slug
router.get('/:id', getGymById);

// Super Admin status updates
router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  updateGymStatus
);

export default router;
