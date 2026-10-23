import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getSectionEnrollments,
} from '../controllers/booking.controller.js';
import { optionalAuthenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Create booking (Section, Group Class, or Gym Session)
router.post('/', optionalAuthenticate, createBooking);

// Get bookings for the logged-in user
router.get('/my', optionalAuthenticate, getMyBookings);

// Get section enrollments roster (Gym Owner & Staff)
router.get('/section/:sectionId', optionalAuthenticate, getSectionEnrollments);

// Get single booking details
router.get('/:id', optionalAuthenticate, getBookingById);

// Cancel booking
router.patch('/:id/cancel', optionalAuthenticate, cancelBooking);

export default router;
