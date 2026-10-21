/**
 * Utility functions for membership date and progress calculations
 */

export const parseDate = (val) => {
  if (!val) return null;
  if (val instanceof Date) return Number.isNaN(val.getTime()) ? null : val;
  const parsed = new Date(val);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  return null;
};

export const calculateMembershipProgress = (membership) => {
  if (!membership) {
    return { daysRemaining: 0, progressPercent: '0%', totalDays: 0 };
  }

  const rawStart = membership.rawStartDate || membership.startDate;
  const rawEnd = membership.rawEndDate || membership.endDate;

  const startDate = parseDate(rawStart);
  const endDate = parseDate(rawEnd);
  const now = new Date();

  // If end date cannot be parsed, fallback to durationDays
  if (!endDate) {
    const fallbackDays = typeof membership.durationDays === 'number' ? membership.durationDays : 0;
    return { daysRemaining: fallbackDays, progressPercent: '100%', totalDays: fallbackDays };
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const effectiveStart = startDate || new Date(endDate.getTime() - (membership.durationDays || 30) * msPerDay);
  const totalDurationDays = Math.max(1, Math.round((endDate.getTime() - effectiveStart.getTime()) / msPerDay));

  const normStatus = String(membership.status || '').toUpperCase();
  if (normStatus === 'CANCELLED' || normStatus === 'EXPIRED' || normStatus === 'COMPLETED' || endDate < now) {
    return {
      daysRemaining: 0,
      progressPercent: '0%',
      totalDays: totalDurationDays,
    };
  }

  if (startDate && startDate > now) {
    return {
      daysRemaining: totalDurationDays,
      progressPercent: '100%',
      totalDays: totalDurationDays,
    };
  }

  // Active Membership: Calculate accurate remaining days and progress bar width
  const msRemaining = endDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / msPerDay));
  const ratio = Math.min(1, Math.max(0, daysRemaining / totalDurationDays));
  const progressPercent = `${Math.round(ratio * 100)}%`;

  return {
    daysRemaining,
    progressPercent,
    totalDays: totalDurationDays,
  };
};
