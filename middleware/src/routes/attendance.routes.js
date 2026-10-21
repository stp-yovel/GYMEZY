import { Router } from 'express';
import {
  checkInMember,
  checkOutMember,
  getTodayAttendance,
  searchGymMembersForCheckIn,
  triggerAttendanceCron,
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

// Manually trigger auto-checkout cron
router.post('/trigger-cron', triggerAttendanceCron);

export default router;
