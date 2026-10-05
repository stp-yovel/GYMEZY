import { Router } from 'express';
import {
  onboardGym,
  getGymZones,
  getGyms,
  getGymById,
  updateGym,
  updateGymStatus,
  resubmitGymApplication,
  deleteGym,
} from '../controllers/gym.controller.js';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { USER_ROLES } from '../models/user.model.js';

const router = Router();

// ==================== PUBLIC / DISCOVERY ROUTES ====================
// Public Partner Self-Registration endpoint (No JWT required, created with Pending Approval)
router.post('/register', onboardGym);

// Public City & Zone Chips aggregator endpoint
router.get('/zones', getGymZones);
router.get('/popular-cities', getGymZones);

// Public / Authenticated Gym Search & Proximity Discovery (Calculates distance via coordinates)
router.get('/', optionalAuthenticate, getGyms);

// Public / Authenticated Single Gym Details
router.get('/:id', optionalAuthenticate, getGymById);

// ==================== PROTECTED / ADMIN & OWNER ROUTES ====================
// Onboard new gym partner (Authenticated via Super Admin JWT)
router.post('/onboard', authenticate, onboardGym);
router.post('/', authenticate, onboardGym);

// Update gym profile & application details (Owner or Super Admin)
router.put(
  '/:id',
  authenticate,
  authorizeRoles(USER_ROLES.GYM_OWNER, USER_ROLES.SUPER_ADMIN),
  updateGym
);
router.patch(
  '/:id',
  authenticate,
  authorizeRoles(USER_ROLES.GYM_OWNER, USER_ROLES.SUPER_ADMIN),
  updateGym
);

// Partner Owner or Super Admin application resubmission
router.post(
  '/:id/resubmit',
  authenticate,
  authorizeRoles(USER_ROLES.GYM_OWNER, USER_ROLES.SUPER_ADMIN),
  resubmitGymApplication
);
router.patch(
  '/:id/resubmit',
  authenticate,
  authorizeRoles(USER_ROLES.GYM_OWNER, USER_ROLES.SUPER_ADMIN),
  resubmitGymApplication
);

// Super Admin status updates
router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  updateGymStatus
);

// Super Admin delete gym
router.delete(
  '/:id',
  authenticate,
  authorizeRoles(USER_ROLES.SUPER_ADMIN),
  deleteGym
);

export default router;

