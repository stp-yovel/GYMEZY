import { Router } from 'express';
import {
  checkInMember,
  checkOutMember,
  getTodayAttendance,
  searchGymMembersForCheckIn,
} from '../controllers/attendance.controller.js';

const router = Router();

// Check-in via QR or OTP
router.post('/check-in', checkInMember);

// Check-out
router.post('/check-out', checkOutMember);

// Today's attendance logs
router.get('/today', getTodayAttendance);

// Search members for quick manual check-in
router.get('/members', searchGymMembersForCheckIn);

export default router;
