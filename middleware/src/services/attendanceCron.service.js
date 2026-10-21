import cron from 'node-cron';
import crypto from 'node:crypto';
import Attendance from '../models/attendance.model.js';
import Membership from '../models/membership.model.js';
import MembershipSwitchRequest from '../models/membershipSwitchRequest.model.js';

/**
 * Auto-transition memberships based on date window:
 * - 'Upcoming' -> 'Active' (and generate entry OTP) once startDate <= now <= endDate (provided not under review)
 * - 'Active' -> 'Expired' (and clear entry OTP) once endDate < now
 * - Suppress/Clear OTP while plan switch is under review ('PENDING_GYM_APPROVAL', 'PENDING_SUPER_ADMIN_APPROVAL')
 */
export const syncMembershipStatuses = async () => {
  try {
    const now = new Date();

    // 0. Find all memberships currently under switch review
    const pendingReviews = await MembershipSwitchRequest.find({
      status: { $in: ['PENDING_GYM_APPROVAL', 'PENDING_SUPER_ADMIN_APPROVAL'] },
    })
      .select('membershipId')
      .lean();

    const pendingMembershipIds = new Set(
      pendingReviews
        .filter((r) => r.membershipId)
        .map((r) => r.membershipId.toString())
    );

    // Ensure all memberships currently under review do NOT have an active entry OTP
    if (pendingMembershipIds.size > 0) {
      await Membership.updateMany(
        {
          _id: { $in: Array.from(pendingMembershipIds) },
          entryOtp: { $ne: null },
        },
        { $set: { entryOtp: null } }
      );
    }

    // 1. Activate all memberships whose start date has arrived
    const toActivate = await Membership.find({
      status: { $in: ['Upcoming', 'Pending'] },
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    const activatePromises = toActivate.map((mem) => {
      mem.status = 'Active';
      const isUnderReview = pendingMembershipIds.has(mem._id.toString());
      if (isUnderReview) {
        // While under review, do NOT generate QR/OTP
        mem.entryOtp = null;
      } else if (!mem.entryOtp) {
        mem.entryOtp = crypto.randomInt(100000, 1000000).toString();
      }
      return mem.save();
    });
    await Promise.all(activatePromises);
    const activatedCount = toActivate.length;

    // 2. Ensure active memberships not under review have a valid entry OTP
    const activeWithoutOtp = await Membership.find({
      status: 'Active',
      startDate: { $lte: now },
      endDate: { $gte: now },
      _id: { $nin: Array.from(pendingMembershipIds) },
      $or: [{ entryOtp: null }, { entryOtp: { $exists: false } }],
    });

    const otpPromises = activeWithoutOtp.map((mem) => {
      mem.entryOtp = crypto.randomInt(100000, 1000000).toString();
      return mem.save();
    });
    await Promise.all(otpPromises);

    // 3. Expire all past memberships
    const toExpire = await Membership.find({
      status: { $in: ['Active', 'Expiring Soon'] },
      endDate: { $lt: now },
    });

    const expirePromises = toExpire.map((mem) => {
      mem.status = 'Expired';
      mem.entryOtp = null;
      return mem.save();
    });
    await Promise.all(expirePromises);
    const expiredCount = toExpire.length;

    if (activatedCount > 0 || expiredCount > 0) {
      console.log(`[MEMBERSHIP CRON] Activated: ${activatedCount}, Expired: ${expiredCount}`);
    }
    return { activated: activatedCount, expired: expiredCount };
  } catch (error) {
    console.error('[MEMBERSHIP SYNC ERROR]:', error.message);
    return { activated: 0, expired: 0 };
  }
};

/**
 * Auto-checkout stale attendance sessions.
 * Finds all 'Checked-In' sessions older than 4 hours or from prior days,
 * and sets checkOutTime to checkInTime + 2 hours with status 'Completed'.
 */
export const autoCheckoutStaleRecords = async () => {
  try {
    const cutoff = new Date(Date.now() - 4 * 60 * 60 * 1000); // 4 hours ago
    const staleRecords = await Attendance.find({
      status: 'Checked-In',
      checkInTime: { $lt: cutoff },
    });

    let updatedCount = 0;
    if (staleRecords.length > 0) {
      for (const record of staleRecords) {
        const estimatedCheckout = new Date(record.checkInTime.getTime() + 2 * 60 * 60 * 1000);
        record.status = 'Completed';
        record.checkOutTime = estimatedCheckout;
        record.notes = (record.notes ? record.notes + '; ' : '') + 'Auto checked-out by system';
        await record.save();
        updatedCount += 1;
      }
      console.log(`[ATTENDANCE CRON] Auto-checked out ${updatedCount} stale check-in records.`);
    }

    // Also sync membership statuses
    await syncMembershipStatuses();

    return updatedCount;
  } catch (error) {
    console.error('[ATTENDANCE CRON ERROR]:', error.message);
    return 0;
  }
};

/**
 * Initialize nightly cron job at 2:00 AM
 */
export const initAttendanceCron = () => {
  // Run daily at 02:00 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('[ATTENDANCE CRON] Running 02:00 AM nightly stale check-out and membership sync...');
    await autoCheckoutStaleRecords();
  });

  // Also run every hour to activate memberships as soon as their start date arrives
  cron.schedule('0 * * * *', async () => {
    await syncMembershipStatuses();
  });

  console.log('[ATTENDANCE CRON] Attendance nightly auto-checkout & hourly membership sync initialized.');
};

// If run directly via CLI (e.g. node src/services/attendanceCron.service.js)
if (process.argv[1] && (process.argv[1].endsWith('attendanceCron.service.js') || process.argv[1].includes('attendanceCron'))) {
  try {
    await import('dotenv/config');
    const { default: mongoose } = await import('mongoose');
    if (!process.env.MONGODB_URI) {
      console.error('[ATTENDANCE CRON ERROR] MONGODB_URI environment variable is missing.');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[ATTENDANCE CRON] Connected to MongoDB. Running autoCheckoutStaleRecords & syncMembershipStatuses...');
    const count = await autoCheckoutStaleRecords();
    console.log(`[ATTENDANCE CRON] Successfully processed ${count} stale records.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[ATTENDANCE CRON ERROR]:', err);
    process.exit(1);
  }
}

export default {
  initAttendanceCron,
  autoCheckoutStaleRecords,
  syncMembershipStatuses,
};
