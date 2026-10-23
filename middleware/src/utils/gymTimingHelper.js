/**
 * Single Source of Truth (SSOT) for Gym Operating Hours & Timing Architecture
 * Handles parsing, validation, live status calculation, and dynamic slot generation.
 */

export const TIMING_MODES = Object.freeze({
  REGULAR: 'REGULAR',
  SPLIT_SHIFT: 'SPLIT_SHIFT',
  TWENTY_FOUR_HOURS: '24_HOURS',
  CLOSED: 'CLOSED',
});

export const DAYS_OF_WEEK = Object.freeze([
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]);

export const DEFAULT_HOURS = Object.freeze({
  WEEKDAY_OPEN: '05:30 AM',
  WEEKDAY_CLOSE: '10:30 PM',
  WEEKEND_OPEN: '06:00 AM',
  WEEKEND_CLOSE: '09:00 PM',
  MORNING_OPEN: '05:30 AM',
  MORNING_CLOSE: '11:30 AM',
  EVENING_OPEN: '04:30 PM',
  EVENING_CLOSE: '10:30 PM',
});

/**
 * Parses time string (e.g., "05:30 AM", "5:30 AM", "17:30", "12:00 AM") to minutes from midnight (0..1439).
 * Returns null if format is unparseable.
 */
export const parseTimeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const cleaned = timeStr.trim().toUpperCase();

  // Handle 12-hour format e.g. "05:30 AM", "5:30AM", "6:00 PM"
  const match12 = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (match12) {
    let hours = Number.parseInt(match12[1], 10);
    const minutes = Number.parseInt(match12[2] || '0', 10);
    const period = match12[3];

    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;
    if (period === 'AM' && hours === 12) hours = 0;
    if (period === 'PM' && hours < 12) hours += 12;

    return hours * 60 + minutes;
  }

  // Handle 24-hour format e.g. "17:30", "05:30", "23:00"
  const match24 = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = Number.parseInt(match24[1], 10);
    const minutes = Number.parseInt(match24[2], 10);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    return hours * 60 + minutes;
  }

  return null;
};

/**
 * Formats minutes from midnight to "hh:mm A" (e.g. 330 -> "05:30 AM").
 */
export const formatMinutesToTime = (minutes) => {
  if (minutes === null || minutes === undefined || Number.isNaN(minutes)) return '';
  const total = ((minutes % 1440) + 1440) % 1440;
  let hours = Math.floor(total / 60);
  const mins = total % 60;
  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const paddedH = String(hours).padStart(2, '0');
  const paddedM = String(mins).padStart(2, '0');
  return `${paddedH}:${paddedM} ${period}`;
};

/**
 * Standardizes any time string into canonical "hh:mm A" format.
 */
export const normalizeTimeFormat = (timeStr, fallback = '06:00 AM') => {
  const mins = parseTimeToMinutes(timeStr);
  if (mins === null) return fallback;
  return formatMinutesToTime(mins);
};

/**
 * Builds display text string for an opening hours configuration.
 */
export const formatTimingDisplayText = (hours) => {
  if (!hours) return `${DEFAULT_HOURS.WEEKDAY_OPEN} - ${DEFAULT_HOURS.WEEKDAY_CLOSE}`;

  const mode = hours.mode || (hours.is24Hours ? TIMING_MODES.TWENTY_FOUR_HOURS : (hours.isSplitShift ? TIMING_MODES.SPLIT_SHIFT : TIMING_MODES.REGULAR));

  if (mode === TIMING_MODES.TWENTY_FOUR_HOURS || hours.is24Hours) {
    return 'Open 24 Hours';
  }

  if (mode === TIMING_MODES.SPLIT_SHIFT || hours.isSplitShift) {
    const morningOpen = hours.morningOpen || DEFAULT_HOURS.MORNING_OPEN;
    const morningClose = hours.morningClose || DEFAULT_HOURS.MORNING_CLOSE;
    const eveningOpen = hours.eveningOpen || DEFAULT_HOURS.EVENING_OPEN;
    const eveningClose = hours.eveningClose || DEFAULT_HOURS.EVENING_CLOSE;
    return `${morningOpen} - ${morningClose}, ${eveningOpen} - ${eveningClose}`;
  }

  const openTime = hours.weekdayOpen || DEFAULT_HOURS.WEEKDAY_OPEN;
  const closeTime = hours.weekdayClose || DEFAULT_HOURS.WEEKDAY_CLOSE;
  return `${openTime} - ${closeTime}`;
};

/**
 * Creates a standard 7-day schedule array with sensible defaults.
 */
export const buildDefaultSchedule = (options = {}) => {
  const {
    mode = TIMING_MODES.REGULAR,
    weekdayOpen = DEFAULT_HOURS.WEEKDAY_OPEN,
    weekdayClose = DEFAULT_HOURS.WEEKDAY_CLOSE,
    weekendOpen = DEFAULT_HOURS.WEEKEND_OPEN,
    weekendClose = DEFAULT_HOURS.WEEKEND_CLOSE,
    morningOpen = DEFAULT_HOURS.MORNING_OPEN,
    morningClose = DEFAULT_HOURS.MORNING_CLOSE,
    eveningOpen = DEFAULT_HOURS.EVENING_OPEN,
    eveningClose = DEFAULT_HOURS.EVENING_CLOSE,
  } = options;

  return DAYS_OF_WEEK.map((day) => {
    const isWeekend = day === 'Saturday' || day === 'Sunday';
    return {
      day,
      isOpen: true,
      mode,
      openTime: isWeekend ? weekendOpen : weekdayOpen,
      closeTime: isWeekend ? weekendClose : weekdayClose,
      morningShift: {
        openTime: morningOpen,
        closeTime: morningClose,
      },
      eveningShift: {
        openTime: eveningOpen,
        closeTime: eveningClose,
      },
    };
  });
};

/**
 * Normalizes opening hours input payload from onboarding, settings, or API updates.
 */
export const normalizeOpeningHours = (inputRaw = {}) => {
  let raw = inputRaw;
  if (!raw || typeof raw !== 'object') {
    if (typeof raw === 'string' && raw.trim()) {
      if (raw.toLowerCase().includes('24 hour')) {
        raw = { is24Hours: true, mode: TIMING_MODES.TWENTY_FOUR_HOURS, displayText: raw };
      } else {
        const parts = raw.split('-').map((s) => s.trim());
        raw = {
          weekdayOpen: parts[0] || DEFAULT_HOURS.WEEKDAY_OPEN,
          weekdayClose: parts[1] || DEFAULT_HOURS.WEEKDAY_CLOSE,
          weekendOpen: parts[0] || DEFAULT_HOURS.WEEKEND_OPEN,
          weekendClose: parts[1] || DEFAULT_HOURS.WEEKEND_CLOSE,
          displayText: raw,
        };
      }
    } else {
      raw = {};
    }
  }

  const is24Hours = Boolean(
    raw.is24Hours || raw.mode === TIMING_MODES.TWENTY_FOUR_HOURS
  );
  const isSplitShift = Boolean(
    !is24Hours && (raw.isSplitShift || raw.mode === TIMING_MODES.SPLIT_SHIFT)
  );

  let mode = TIMING_MODES.REGULAR;
  if (is24Hours) {
    mode = TIMING_MODES.TWENTY_FOUR_HOURS;
  } else if (isSplitShift) {
    mode = TIMING_MODES.SPLIT_SHIFT;
  }

  const weekdayOpen = normalizeTimeFormat(raw.weekdayOpen, DEFAULT_HOURS.WEEKDAY_OPEN);
  const weekdayClose = normalizeTimeFormat(raw.weekdayClose, DEFAULT_HOURS.WEEKDAY_CLOSE);
  const weekendOpen = normalizeTimeFormat(raw.weekendOpen, DEFAULT_HOURS.WEEKEND_OPEN);
  const weekendClose = normalizeTimeFormat(raw.weekendClose, DEFAULT_HOURS.WEEKEND_CLOSE);
  const morningOpen = normalizeTimeFormat(raw.morningOpen, DEFAULT_HOURS.MORNING_OPEN);
  const morningClose = normalizeTimeFormat(raw.morningClose, DEFAULT_HOURS.MORNING_CLOSE);
  const eveningOpen = normalizeTimeFormat(raw.eveningOpen, DEFAULT_HOURS.EVENING_OPEN);
  const eveningClose = normalizeTimeFormat(raw.eveningClose, DEFAULT_HOURS.EVENING_CLOSE);

  // Normalize existing schedule or generate defaults
  const existingScheduleMap = new Map();
  if (Array.isArray(raw.schedule)) {
    raw.schedule.forEach((item) => {
      if (item && item.day) existingScheduleMap.set(item.day.toLowerCase(), item);
    });
  }

  const schedule = DAYS_OF_WEEK.map((day) => {
    const existing = existingScheduleMap.get(day.toLowerCase());
    const isWeekend = day === 'Saturday' || day === 'Sunday';

    if (!existing) {
      return {
        day,
        isOpen: true,
        mode,
        openTime: isWeekend ? weekendOpen : weekdayOpen,
        closeTime: isWeekend ? weekendClose : weekdayClose,
        morningShift: { openTime: morningOpen, closeTime: morningClose },
        eveningShift: { openTime: eveningOpen, closeTime: eveningClose },
      };
    }

    const dayMode = existing.mode || mode;
    return {
      day,
      isOpen: existing.isOpen !== false,
      mode: dayMode,
      openTime: normalizeTimeFormat(existing.openTime, isWeekend ? weekendOpen : weekdayOpen),
      closeTime: normalizeTimeFormat(existing.closeTime, isWeekend ? weekendClose : weekdayClose),
      morningShift: {
        openTime: normalizeTimeFormat(existing.morningShift?.openTime, morningOpen),
        closeTime: normalizeTimeFormat(existing.morningShift?.closeTime, morningClose),
      },
      eveningShift: {
        openTime: normalizeTimeFormat(existing.eveningShift?.openTime, eveningOpen),
        closeTime: normalizeTimeFormat(existing.eveningShift?.closeTime, eveningClose),
      },
    };
  });

  const displayText = raw.displayText && raw.displayText.trim()
    ? raw.displayText.trim()
    : formatTimingDisplayText({ mode, is24Hours, isSplitShift, weekdayOpen, weekdayClose, morningOpen, morningClose, eveningOpen, eveningClose });

  return {
    mode,
    is24Hours,
    isSplitShift,
    weekdayOpen,
    weekdayClose,
    weekendOpen,
    weekendClose,
    morningOpen,
    morningClose,
    eveningOpen,
    eveningClose,
    displayText,
    isOpenHolidays: raw.isOpenHolidays !== false,
    schedule,
    holidays: Array.isArray(raw.holidays) ? raw.holidays : [],
  };
};

/**
 * Calculates current live open/closed status for a gym at a specific target date/time.
 */
export const getGymTimingStatus = (openingHours, targetDate = new Date()) => {
  if (!openingHours) {
    return {
      isOpen: true,
      statusText: 'Open',
      badgeText: 'Open',
      badgeVariant: 'success',
      mode: TIMING_MODES.REGULAR,
    };
  }

  const normalized = normalizeOpeningHours(openingHours);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayName = dayNames[targetDate.getDay()];
  const currentMinutes = targetDate.getHours() * 60 + targetDate.getMinutes();

  const daySchedule = normalized.schedule.find(
    (s) => s.day.toLowerCase() === currentDayName.toLowerCase()
  );

  if (!daySchedule || !daySchedule.isOpen) {
    return {
      isOpen: false,
      statusText: 'Closed Today',
      badgeText: 'Closed',
      badgeVariant: 'danger',
      mode: TIMING_MODES.CLOSED,
      closesAt: null,
    };
  }

  const activeMode = daySchedule.mode || normalized.mode;

  if (activeMode === TIMING_MODES.TWENTY_FOUR_HOURS) {
    return {
      isOpen: true,
      statusText: 'Open 24/7',
      badgeText: 'Open 24/7',
      badgeVariant: 'success',
      mode: TIMING_MODES.TWENTY_FOUR_HOURS,
      closesAt: null,
    };
  }

  if (activeMode === TIMING_MODES.SPLIT_SHIFT) {
    const mOpen = parseTimeToMinutes(daySchedule.morningShift?.openTime || normalized.morningOpen);
    const mClose = parseTimeToMinutes(daySchedule.morningShift?.closeTime || normalized.morningClose);
    const eOpen = parseTimeToMinutes(daySchedule.eveningShift?.openTime || normalized.eveningOpen);
    const eClose = parseTimeToMinutes(daySchedule.eveningShift?.closeTime || normalized.eveningClose);

    if (currentMinutes < mOpen) {
      return {
        isOpen: false,
        statusText: `Closed • Opens ${daySchedule.morningShift?.openTime || normalized.morningOpen}`,
        badgeText: 'Closed',
        badgeVariant: 'warning',
        mode: TIMING_MODES.SPLIT_SHIFT,
      };
    }
    if (currentMinutes >= mOpen && currentMinutes < mClose) {
      return {
        isOpen: true,
        statusText: `Open Now • Closes ${daySchedule.morningShift?.closeTime || normalized.morningClose}`,
        badgeText: 'Open Now',
        badgeVariant: 'success',
        activeShift: 'morning',
        closesAt: daySchedule.morningShift?.closeTime || normalized.morningClose,
        mode: TIMING_MODES.SPLIT_SHIFT,
      };
    }
    if (currentMinutes >= mClose && currentMinutes < eOpen) {
      return {
        isOpen: false,
        statusText: `Closed • Reopens ${daySchedule.eveningShift?.openTime || normalized.eveningOpen}`,
        badgeText: 'Closed',
        badgeVariant: 'warning',
        mode: TIMING_MODES.SPLIT_SHIFT,
      };
    }
    if (currentMinutes >= eOpen && currentMinutes < eClose) {
      return {
        isOpen: true,
        statusText: `Open Now • Closes ${daySchedule.eveningShift?.closeTime || normalized.eveningClose}`,
        badgeText: 'Open Now',
        badgeVariant: 'success',
        activeShift: 'evening',
        closesAt: daySchedule.eveningShift?.closeTime || normalized.eveningClose,
        mode: TIMING_MODES.SPLIT_SHIFT,
      };
    }
    return {
      isOpen: false,
      statusText: 'Closed for the day',
      badgeText: 'Closed',
      badgeVariant: 'secondary',
      mode: TIMING_MODES.SPLIT_SHIFT,
    };
  }

  // Regular single-shift mode
  const openMins = parseTimeToMinutes(daySchedule.openTime || normalized.weekdayOpen);
  const closeMins = parseTimeToMinutes(daySchedule.closeTime || normalized.weekdayClose);

  if (currentMinutes < openMins) {
    return {
      isOpen: false,
      statusText: `Closed • Opens ${daySchedule.openTime || normalized.weekdayOpen}`,
      badgeText: 'Closed',
      badgeVariant: 'warning',
      mode: TIMING_MODES.REGULAR,
    };
  }
  if (currentMinutes >= openMins && currentMinutes < closeMins) {
    return {
      isOpen: true,
      statusText: `Open Now • Closes ${daySchedule.closeTime || normalized.weekdayClose}`,
      badgeText: 'Open Now',
      badgeVariant: 'success',
      closesAt: daySchedule.closeTime || normalized.weekdayClose,
      mode: TIMING_MODES.REGULAR,
    };
  }

  return {
    isOpen: false,
    statusText: 'Closed for the day',
    badgeText: 'Closed',
    badgeVariant: 'secondary',
    mode: TIMING_MODES.REGULAR,
  };
};

/**
 * Generates bookable slot windows strictly adhering to the gym's operational shifts.
 * Returns both structured slot objects and plain string arrays (morning/evening) for UI components.
 */
export const generateAvailableSlots = (openingHours, targetDate = new Date(), slotDurationMinutes = 60) => {
  const emptyResult = {
    morningSlots: [],
    eveningSlots: [],
    allSlots: [],
    morning: [],
    evening: [],
    all: [],
    isOpen: false,
    reason: 'Closed',
  };

  if (!openingHours) return emptyResult;
  const normalized = normalizeOpeningHours(openingHours);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[targetDate.getDay()];

  const daySchedule = normalized.schedule.find(
    (s) => s.day.toLowerCase() === dayName.toLowerCase()
  );

  if (!daySchedule || !daySchedule.isOpen) {
    return { ...emptyResult, reason: 'Gym is closed on this day' };
  }

  const activeMode = daySchedule.mode || normalized.mode;
  const duration = Math.max(15, Math.min(240, Number(slotDurationMinutes) || 60));

  const slots = [];

  const addSlotsInRange = (startMins, endMins, period) => {
    if (startMins === null || endMins === null || startMins >= endMins) return;
    for (let current = startMins; current + duration <= endMins; current += duration) {
      const startTime = formatMinutesToTime(current);
      const endTime = formatMinutesToTime(current + duration);
      slots.push({
        time: startTime,
        startTime,
        endTime,
        label: `${startTime} - ${endTime}`,
        period: period || (current < 720 ? 'morning' : 'evening'),
      });
    }
  };

  if (activeMode === TIMING_MODES.TWENTY_FOUR_HOURS) {
    // Round-the-clock 24h slots (00:00 to 24:00)
    addSlotsInRange(0, 720, 'morning');
    addSlotsInRange(720, 1440, 'evening');
  } else if (activeMode === TIMING_MODES.SPLIT_SHIFT) {
    const mOpen = parseTimeToMinutes(daySchedule.morningShift?.openTime || normalized.morningOpen);
    const mClose = parseTimeToMinutes(daySchedule.morningShift?.closeTime || normalized.morningClose);
    const eOpen = parseTimeToMinutes(daySchedule.eveningShift?.openTime || normalized.eveningOpen);
    const eClose = parseTimeToMinutes(daySchedule.eveningShift?.closeTime || normalized.eveningClose);

    addSlotsInRange(mOpen, mClose, 'morning');
    addSlotsInRange(eOpen, eClose, 'evening');
  } else {
    // Regular continuous shift
    const openMins = parseTimeToMinutes(daySchedule.openTime || normalized.weekdayOpen);
    const closeMins = parseTimeToMinutes(daySchedule.closeTime || normalized.weekdayClose);

    // Split at 12:00 PM (720 min) or afternoon 2:00 PM (840 min)
    const middayCutoff = Math.max(openMins, Math.min(closeMins, 780)); // 1:00 PM
    addSlotsInRange(openMins, middayCutoff, 'morning');
    addSlotsInRange(middayCutoff, closeMins, 'evening');
  }

  const morningSlots = slots.filter((s) => s.period === 'morning');
  const eveningSlots = slots.filter((s) => s.period === 'evening');

  return {
    isOpen: true,
    morningSlots,
    eveningSlots,
    allSlots: slots,
    morning: morningSlots.map((s) => s.time),
    evening: eveningSlots.map((s) => s.time),
    all: slots.map((s) => s.time),
  };
};
