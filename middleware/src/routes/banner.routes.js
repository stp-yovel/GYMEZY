import { Router } from 'express';
import {
  getPublicBanners,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  toggleBannerPriority,
  deleteBanner,
} from '../controllers/banner.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { USER_ROLES } from '../models/user.model.js';

const router = Router();

// Public: Get distance-sorted, priority-first banners for mobile user app
router.get('/', getPublicBanners);

// Protected Super Admin Endpoints
router.get('/admin/all', authenticate, authorizeRoles(USER_ROLES.SUPER_ADMIN), getAllBannersAdmin);
router.post('/admin', authenticate, authorizeRoles(USER_ROLES.SUPER_ADMIN), createBanner);
router.put('/admin/:id', authenticate, authorizeRoles(USER_ROLES.SUPER_ADMIN), updateBanner);
router.patch('/admin/:id/priority', authenticate, authorizeRoles(USER_ROLES.SUPER_ADMIN), toggleBannerPriority);
router.delete('/admin/:id', authenticate, authorizeRoles(USER_ROLES.SUPER_ADMIN), deleteBanner);

export default router;
