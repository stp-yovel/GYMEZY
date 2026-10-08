import cron from 'node-cron';
import Attendance from '../models/attendance.model.js';

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

    if (staleRecords.length === 0) return 0;

    let updatedCount = 0;
    for (const record of staleRecords) {
      const estimatedCheckout = new Date(record.checkInTime.getTime() + 2 * 60 * 60 * 1000);
      record.status = 'Completed';
      record.checkOutTime = estimatedCheckout;
      record.notes = (record.notes ? record.notes + '; ' : '') + 'Auto checked-out by system';
      await record.save();
      updatedCount += 1;
    }

    console.log(`[ATTENDANCE CRON] Auto-checked out ${updatedCount} stale check-in records.`);
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
    console.log('[ATTENDANCE CRON] Running 02:00 AM nightly stale check-out clean up...');
    await autoCheckoutStaleRecords();
  });

  console.log('[ATTENDANCE CRON] Attendance nightly auto-checkout cron initialized (0 2 * * *).');
};

export default {
  initAttendanceCron,
  autoCheckoutStaleRecords,
};
