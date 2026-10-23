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

/**
 * Calculate dynamic relative time ago from a date or timestamp.
 *
 * Intervals:
 *  - < 1 min: "Just now"
 *  - 1 min to 59 mins: "1 min ago", "2 mins ago"...
 *  - 1 hr to 23 hrs: "1 hr ago", "2 hrs ago"...
 *  - 1 day to 30 days: "1 day ago", "2 days ago"...
 *  - 1 month to 11 months: "1 month ago", "2 months ago"...
 *  - >= 1 year: "1 year ago", "2 years ago"...
 *
 * @param {Date|string|number} dateInput - The timestamp or date string to format
 * @returns {string} Human-friendly relative time string
 */
export const formatTimeAgo = (dateInput) => {
  if (!dateInput) return 'Just now';

  // If already formatted like "2 weeks ago" (and not "Just now")
  if (
    typeof dateInput === 'string' &&
    dateInput.includes('ago') &&
    !dateInput.toLowerCase().includes('just now')
  ) {
    return dateInput;
  }

  // Handle common unparsed strings like 'Recent', 'Today', 'Just now'
  if (
    typeof dateInput === 'string' &&
    (dateInput.trim().toLowerCase() === 'recent' ||
      dateInput.trim().toLowerCase() === 'today' ||
      dateInput.trim().toLowerCase() === 'just now')
  ) {
    return 'Just now';
  }

  const date = parseDate(dateInput);
  if (!date) {
    if (typeof dateInput === 'string' && dateInput.trim() && dateInput !== 'Just now') {
      return dateInput;
    }
    return 'Just now';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Less than 60 seconds or future/slight client clock skew
  if (diffMs < 60 * 1000) {
    return 'Just now';
  }

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hr' : 'hrs'} ago`;
  }
  if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  }
  if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  }
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
};

export const getTimeAgo = formatTimeAgo;
export const getRelativeTime = formatTimeAgo;

