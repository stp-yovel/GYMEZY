import { Router } from 'express';
import {
  createSection,
  getSections,
  getSectionById,
  updateSection,
  toggleSectionStatus,
  deleteSection,
} from '../controllers/section.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { USER_ROLES } from '../models/user.model.js';

const router = Router();

// All section endpoints require authentication
router.use(authenticate);

// Get all sections for gym (Gym Owner, Super Admin, or Member)
router.get('/', getSections);

// Get single section details
router.get('/:id', getSectionById);

// Create new section (Gym Owner or Super Admin)
router.post(
  '/',
  authorizeRoles(USER_ROLES.GYM_OWNER, USER_ROLES.SUPER_ADMIN),
  createSection
);

// Update section (Gym Owner or Super Admin)
router.put(
  '/:id',
  authorizeRoles(USER_ROLES.GYM_OWNER, USER_ROLES.SUPER_ADMIN),
  updateSection
);

// Toggle section active/inactive status
router.patch(
  '/:id/status',
  authorizeRoles(USER_ROLES.GYM_OWNER, USER_ROLES.SUPER_ADMIN),
  toggleSectionStatus
);

// Delete section
router.delete(
  '/:id',
  authorizeRoles(USER_ROLES.GYM_OWNER, USER_ROLES.SUPER_ADMIN),
  deleteSection
);

export default router;
