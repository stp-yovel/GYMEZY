import mongoose from 'mongoose';
import Attendance from '../models/attendance.model.js';
import Membership from '../models/membership.model.js';
import Gym from '../models/gym.model.js';
import User from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Resolve Gym by ID or partnerId
 */
const resolveGym = async (gymId) => {
  if (!gymId) {
    throw ApiError.badRequest('Gym ID is required.');
  }
  const isObjectId = mongoose.Types.ObjectId.isValid(gymId);
  const gym = await Gym.findOne(
    isObjectId ? { $or: [{ _id: gymId }, { partnerId: gymId }] } : { partnerId: gymId }
  );
  if (!gym) {
    throw ApiError.notFound('Gym not found.');
  }
  return gym;
};

/**
 * Parse QR or code input to extract lookup criteria
 */
const parseCodePayload = (rawCode) => {
  if (!rawCode || typeof rawCode !== 'string') {
    return { otp: null, id: null, raw: rawCode };
  }

  const trimmed = rawCode.trim();

  // Try parsing JSON format
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      return {
        otp: parsed.entryOtp || parsed.otp || null,
        id: parsed.id || parsed.membershipId || parsed._id || null,
        userId: parsed.userId || null,
        raw: trimmed,
      };
    } catch {
      // JSON parse fallback
    }
  }

  // 6 digit numeric OTP
  if (/^\d{6}$/.test(trimmed)) {
    return { otp: trimmed, id: null, raw: trimmed };
  }

  return { otp: null, id: trimmed, raw: trimmed };
};

/**
 * Find Membership matching code or OTP for a specific gym
 */
const findMembershipForEntry = async (gymDbId, parsedInfo) => {
  const { otp, id, raw } = parsedInfo;

  // 1. If OTP is provided, query by gymId and entryOtp
  if (otp) {
    const mem = await Membership.findOne({ gymId: gymDbId, entryOtp: otp })
      .populate('userId', 'fullName phone email profilePicture customerProfile customerId')
      .populate('gymId', 'name partnerId address');
    if (mem) return mem;
  }

  // 2. Query by MongoDB _id if valid
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    const mem = await Membership.findOne({ _id: id, gymId: gymDbId })
      .populate('userId', 'fullName phone email profilePicture customerProfile customerId')
      .populate('gymId', 'name partnerId address');
    if (mem) return mem;
  }

  // 3. Query by membershipId string (e.g. MEM001)
  if (id || raw) {
    const memId = id || raw;
    const mem = await Membership.findOne({ membershipId: memId, gymId: gymDbId })
      .populate('userId', 'fullName phone email profilePicture customerProfile customerId')
      .populate('gymId', 'name partnerId address');
    if (mem) return mem;
  }

  return null;
};

/**
 * Check-In Member
 * POST /api/v1/attendance/check-in
 */
export const checkInMember = async (req, res, next) => {
  try {
    const { gymId, code, otp, method = 'QR', area = 'General Workout', verifiedBy = 'Turnstile Scanner' } = req.body;

    const gym = await resolveGym(gymId);
    const lookupCode = (code || otp || '').toString().trim();
    if (!lookupCode) {
      throw ApiError.badRequest('Please enter or scan a valid QR code or 6-digit OTP.');
    }

    const parsedInfo = parseCodePayload(lookupCode);
    if (otp && !parsedInfo.otp) {
      parsedInfo.otp = otp.toString().trim();
    }

    const membership = await findMembershipForEntry(gym._id, parsedInfo);
    if (!membership) {
      throw ApiError.notFound('No active membership found matching this Pass/OTP. Please try again or use another check-in method (Member ID, Phone number, or QR scan).');
    }

    // Validate Membership Status & Date Window
    const now = new Date();

    if (membership.status === 'Upcoming' || (membership.startDate && new Date(membership.startDate) > now)) {
      const startStr = membership.startDate
        ? new Date(membership.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'a future date';
      throw ApiError.badRequest(`Membership pass is not active yet (Starts on ${startStr}). Entry is not permitted before the start date.`);
    }

    if (membership.status === 'Expired' || (membership.endDate && new Date(membership.endDate) < now)) {
      throw ApiError.badRequest('Membership has expired. Renewal required before entry.');
    }

    if (membership.status === 'Cancelled') {
      throw ApiError.badRequest('This membership pass has been cancelled. Entry is not permitted.');
    }

    if (membership.status !== 'Active') {
      throw ApiError.badRequest(`Membership status is ${membership.status}. Only Active memberships can enter.`);
    }

    // Check for double entry (already checked in and not checked out)
    const existingActive = await Attendance.findOne({
      userId: membership.userId?._id || membership.userId,
      gymId: gym._id,
      status: 'Checked-In',
    });

    if (existingActive) {
      throw ApiError.badRequest(
        `Member is already checked in at ${new Date(existingActive.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Please check out first.`
      );
    }

    // Create attendance record
    const attendance = await Attendance.create({
      userId: membership.userId?._id || membership.userId,
      gymId: gym._id,
      membershipId: membership._id,
      method: method.toUpperCase() === 'OTP' ? 'OTP' : 'QR',
      checkInTime: new Date(),
      status: 'Checked-In',
      area,
      verifiedBy,
    });

    const user = membership.userId;
    const responseData = {
      attendanceId: attendance._id,
      status: 'Granted',
      attendanceStatus: attendance.status,
      checkInTime: attendance.checkInTime,
      method: attendance.method,
      area: attendance.area,
      member: {
        id: user?._id,
        name: user?.fullName || 'Gym Member',
        phone: user?.phone || 'N/A',
        avatar: user?.profilePicture || null,
        membershipId: membership.membershipId,
        tier: membership.membershipTier,
        endDate: membership.endDate,
        status: membership.status,
        entryOtp: membership.entryOtp,
      },
    };

    return res.status(201).json(ApiResponse.created(responseData, 'Check-in verified successfully. Access granted.'));
  } catch (error) {
    next(error);
  }
};

/**
 * Check-Out Member
 * POST /api/v1/attendance/check-out
 */
export const checkOutMember = async (req, res, next) => {
  try {
    const { attendanceId, userId, gymId, membershipId } = req.body;

    let attendanceRecord = null;

    if (attendanceId && mongoose.Types.ObjectId.isValid(attendanceId)) {
      attendanceRecord = await Attendance.findById(attendanceId);
    } else if (userId && gymId) {
      const gym = await resolveGym(gymId);
      attendanceRecord = await Attendance.findOne({
        userId,
        gymId: gym._id,
        status: 'Checked-In',
      }).sort({ checkInTime: -1 });
    } else if (membershipId && gymId) {
      const gym = await resolveGym(gymId);
      attendanceRecord = await Attendance.findOne({
        membershipId,
        gymId: gym._id,
        status: 'Checked-In',
      }).sort({ checkInTime: -1 });
    }

    if (!attendanceRecord) {
      throw ApiError.notFound('No active check-in session found to check out.');
    }

    if (attendanceRecord.status === 'Completed') {
      return res.status(200).json(ApiResponse.success(attendanceRecord, 'Member is already checked out.'));
    }

    attendanceRecord.checkOutTime = new Date();
    attendanceRecord.status = 'Completed';
    await attendanceRecord.save();

    await attendanceRecord.populate('userId', 'fullName phone email profilePicture');
    await attendanceRecord.populate('membershipId', 'membershipId membershipTier');

    return res.status(200).json(ApiResponse.success(attendanceRecord, 'Check-out completed successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get Today's Attendance Logs for Gym
 * GET /api/v1/attendance/today?gymId=...
 */
export const getTodayAttendance = async (req, res, next) => {
  try {
    const { gymId, date } = req.query;
    if (!gymId) {
      throw ApiError.badRequest('Gym ID is required.');
    }

    const gym = await resolveGym(gymId);

    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await Attendance.find({
      gymId: gym._id,
      checkInTime: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate('userId', 'fullName phone email profilePicture customerProfile customerId')
      .populate('membershipId', 'membershipId membershipTier startDate endDate status entryOtp')
      .sort({ checkInTime: -1 })
      .lean();

    const formattedLogs = logs.map((log) => {
      const user = log.userId;
      const mem = log.membershipId;

      const checkInDate = new Date(log.checkInTime);
      const timeStr = checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      let checkOutStr = '-';
      let durationStr = '-';
      if (log.checkOutTime) {
        const outDate = new Date(log.checkOutTime);
        checkOutStr = outDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const diffMins = Math.max(1, Math.round((outDate.getTime() - checkInDate.getTime()) / (1000 * 60)));
        durationStr = diffMins >= 60 ? `${Math.floor(diffMins / 60)}h ${diffMins % 60}m` : `${diffMins} mins`;
      }

      return {
        key: log._id.toString(),
        attendanceId: log._id.toString(),
        passId: mem?.membershipId || 'PASS-' + log._id.toString().slice(-6),
        membershipId: mem?.membershipId || 'N/A',
        userId: user?._id?.toString() || 'N/A',
        customerId: user?.customerId || user?._id?.toString().slice(-8) || 'N/A',
        memberName: user?.fullName || 'Gym Member',
        avatar: user?.profilePicture || null,
        phone: user?.phone || 'N/A',
        plan: mem?.membershipTier || 'General Pass',
        time: timeStr,
        checkInTime: log.checkInTime,
        checkOutTime: log.checkOutTime,
        checkOutStr,
        durationStr,
        otp: mem?.entryOtp || '------',
        status: log.status === 'Checked-In' ? 'GRANTED' : 'COMPLETED',
        attendanceStatus: log.status,
        method: log.method === 'OTP' ? 'OTP Entry' : 'QR Code',
        rawMethod: log.method,
        area: log.area || 'General Workout',
        gate: 'Main Turnstile 01',
      };
    });

    // Summary counts
    const totalToday = formattedLogs.length;
    const currentlyInside = formattedLogs.filter((l) => l.attendanceStatus === 'Checked-In').length;
    const completedSessions = totalToday - currentlyInside;

    return res.status(200).json(
      ApiResponse.success(
        {
          logs: formattedLogs,
          summary: {
            totalToday,
            currentlyInside,
            completedSessions,
          },
        },
        "Today's attendance logs retrieved successfully."
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Search active members of this gym for quick lookup
 * GET /api/v1/attendance/members?gymId=...&query=...
 */
export const searchGymMembersForCheckIn = async (req, res, next) => {
  try {
    const { gymId, query = '' } = req.query;
    if (!gymId) {
      throw ApiError.badRequest('Gym ID is required.');
    }

    const gym = await resolveGym(gymId);

    const memberships = await Membership.find({
      gymId: gym._id,
      status: { $in: ['Active', 'Upcoming', 'Expiring Soon'] },
    })
      .populate('userId', 'fullName phone email profilePicture customerId')
      .sort({ createdAt: -1 })
      .lean();

    const q = query.trim().toLowerCase();
    const filtered = memberships
      .filter((m) => {
        if (!q) return true;
        const name = m.userId?.fullName?.toLowerCase() || '';
        const phone = m.userId?.phone || '';
        const memId = m.membershipId?.toLowerCase() || '';
        const otp = m.entryOtp || '';
        return name.includes(q) || phone.includes(q) || memId.includes(q) || otp.includes(q);
      })
      .map((m) => ({
        key: m._id.toString(),
        membershipDbId: m._id.toString(),
        name: m.userId?.fullName || 'Gym Member',
        phone: m.userId?.phone || 'N/A',
        userId: m.userId?._id?.toString() || 'N/A',
        customerId: m.userId?.customerId || m.userId?._id?.toString().slice(-8) || 'N/A',
        membershipId: m.membershipId,
        bookingId: 'BKG-' + m._id.toString().slice(-5).toUpperCase(),
        plan: `${m.membershipTier} Pass`,
        status: m.status.toUpperCase(),
        startDate: m.startDate,
        endDate: m.endDate,
        planExpiry: m.endDate ? new Date(m.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
        avatar: m.userId?.profilePicture || null,
        gymBranch: gym.name,
        entryOtp: m.entryOtp || null,
      }));

    return res.status(200).json(ApiResponse.success(filtered, 'Gym members retrieved successfully.'));
  } catch (error) {
    next(error);
  }
};
