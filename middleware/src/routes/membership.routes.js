import { Router } from 'express';
import {
  createMembership,
  getMyMemberships,
  getMembershipById,
  getGymMemberships,
  cancelMembership,
} from '../controllers/membership.controller.js';
import { optionalAuthenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Purchase / Create Membership
router.post('/', optionalAuthenticate, createMembership);

// Get Memberships for Logged-In User
router.get('/my', optionalAuthenticate, getMyMemberships);

// Get Memberships for a Gym (Gym Owner Portal & Gym Owner Mobile)
router.get('/gym/:gymId', optionalAuthenticate, getGymMemberships);

// Get Single Membership Details
router.get('/:id', optionalAuthenticate, getMembershipById);

// Cancel Membership
router.patch('/:id/cancel', optionalAuthenticate, cancelMembership);

export default router;
