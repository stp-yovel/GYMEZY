import mongoose from 'mongoose';
import crypto from 'node:crypto';
import Booking from '../models/booking.model.js';
import { Section } from '../models/section.model.js';
import Gym from '../models/gym.model.js';
import User from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Resolve User ID from token or request body
 */
const resolveUserId = async (req) => {
  const rawUserId = req.user?._id || req.user?.userId || req.user?.id || req.body?.userId || req.query?.userId || req.headers?.['x-user-id'];
  if (rawUserId && mongoose.Types.ObjectId.isValid(rawUserId)) {
    return new mongoose.Types.ObjectId(rawUserId);
  }

  if (req.user?.email || req.body?.email) {
    const foundUser = await User.findOne({
      $or: [
        { email: req.user?.email || req.body?.email },
        { phone: req.user?.phone || req.body?.phone || '' },
      ],
    }).lean().maxTimeMS(4000);
    if (foundUser) return foundUser._id;
  }

  const anyUser = await User.findOne().lean().maxTimeMS(4000);
  return anyUser ? anyUser._id : new mongoose.Types.ObjectId();
};

/**
 * Resolve Gym by ID or partnerId
 */
const resolveGym = async (gymId) => {
  const normalizedGymId = typeof gymId === 'object' && gymId !== null
    ? (gymId._id || gymId.id || gymId.partnerId)
    : gymId;

  if (!normalizedGymId) {
    const anyGym = await Gym.findOne().lean().maxTimeMS(4000);
    if (anyGym) return anyGym;
    throw ApiError.badRequest('Gym ID is required.');
  }
  const isObjectId = mongoose.Types.ObjectId.isValid(normalizedGymId);
  const gym = await Gym.findOne(
    isObjectId ? { $or: [{ _id: normalizedGymId }, { partnerId: normalizedGymId }] } : { partnerId: normalizedGymId }
  );
  if (!gym) {
    const anyGym = await Gym.findOne().lean().maxTimeMS(4000);
    if (anyGym) return anyGym;
    throw ApiError.notFound('Gym not found.');
  }
  return gym;
};

/**
 * Create a new Booking (Section / Group Class / Gym Session)
 * POST /api/v1/bookings
 */
export const createBooking = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const {
    gymId,
    sectionId,
    trainerId,
    bookingType = 'SECTION',
    title,
    category,
    startDate,
    endDate,
    timeSlot,
    durationDays,
    sessionsCount = 1,
    pricing,
    payment,
    paymentMode,
    amount,
  } = body;

  const rawGymId = typeof gymId === 'object' && gymId !== null ? (gymId._id || gymId.id || gymId.partnerId) : gymId;
  const rawSectionId = typeof sectionId === 'object' && sectionId !== null ? (sectionId._id || sectionId.id) : sectionId;
  const rawTrainerId = typeof trainerId === 'object' && trainerId !== null ? (trainerId._id || trainerId.id) : trainerId;

  const resolvedUser = await resolveUserId(req);
  const gym = await resolveGym(rawGymId);

  let section = null;
  let allocatedTrainerId = rawTrainerId || null;

  // If sectionId is provided, perform atomic validation & enrollment
  if (rawSectionId) {
    if (!mongoose.Types.ObjectId.isValid(rawSectionId)) {
      throw ApiError.badRequest('Invalid Section ID format.');
    }

    section = await Section.findById(rawSectionId);
    if (!section) {
      throw ApiError.notFound('The selected Batch / Section was not found.');
    }

    if (!section.isActive) {
      throw ApiError.badRequest('This Batch / Section is currently inactive and not accepting bookings.');
    }

    // Check duplicate active booking for this user in this section
    const existingActiveBooking = await Booking.findOne({
      sectionId: section._id,
      userId: resolvedUser,
      status: { $in: ['Upcoming', 'Active'] },
    });

    if (existingActiveBooking) {
      throw ApiError.badRequest('You already have an active enrollment in this Batch.');
    }

    // Atomically increment enrolledCount only if below maxCapacity
    const updatedSection = await Section.findOneAndUpdate(
      {
        _id: section._id,
        $expr: { $lt: ['$enrolledCount', '$maxCapacity'] },
      },
      { $inc: { enrolledCount: 1 } },
      { returnDocument: 'after', new: true }
    );

    if (!updatedSection) {
      throw ApiError.badRequest('This batch is already full. No available slots remain.');
    }

    section = updatedSection;
    if (!allocatedTrainerId && section.trainerId) {
      allocatedTrainerId = section.trainerId;
    }
  }

  // Generate unique human-friendly Booking ID and 6-digit entry OTP
  const bookingId = `BK-${Date.now().toString().slice(-6)}-${crypto.randomInt(100, 999)}`;
  const entryOtp = crypto.randomInt(100000, 1000000).toString();

  const resolvedStartDate = startDate ? new Date(startDate) : (section?.startDate || new Date());
  const resolvedEndDate = endDate ? new Date(endDate) : (section?.endDate || null);
  const resolvedDuration = durationDays || section?.durationDays || 1;
  const resolvedTimeSlot = timeSlot || (section ? `${section.startTime} - ${section.endTime}` : '');
  const resolvedTitle = title || (section ? section.title : 'Gym Session');
  const resolvedCategory = category || section?.category || 'general';

  const subtotalVal = Number(pricing?.subtotal ?? amount ?? section?.cost ?? 0);
  const discountVal = Number(pricing?.discount ?? 0);
  const totalVal = Number(pricing?.totalAmount ?? (subtotalVal - discountVal));

  let resolvedBookingType = bookingType || 'GYM_SESSION';
  if (section) {
    resolvedBookingType = bookingType === 'GROUP_CLASS' ? 'GROUP_CLASS' : 'SECTION';
  }

  const newBooking = new Booking({
    bookingId,
    userId: resolvedUser,
    gymId: gym._id,
    sectionId: section ? section._id : null,
    trainerId: allocatedTrainerId,
    bookingType: resolvedBookingType,
    title: resolvedTitle,
    category: resolvedCategory,
    startDate: resolvedStartDate,
    endDate: resolvedEndDate,
    timeSlot: resolvedTimeSlot,
    durationDays: resolvedDuration,
    sessionsCount: sessionsCount || resolvedDuration,
    pricing: {
      subtotal: Math.max(0, subtotalVal),
      discount: Math.max(0, discountVal),
      totalAmount: Math.max(0, totalVal),
      currency: pricing?.currency || 'INR',
    },
    payment: {
      method: payment?.method || paymentMode || 'UPI',
      status: payment?.status || 'Completed',
      transactionId: payment?.transactionId || `TXN-${Date.now()}-${crypto.randomInt(1000, 9999)}`,
      paidAt: payment?.paidAt ? new Date(payment.paidAt) : new Date(),
    },
    entryOtp,
    status: 'Upcoming',
  });

  try {
    await newBooking.save();
  } catch (error) {
    // If saving the booking document fails, roll back the section capacity increment
    if (section) {
      await Section.findByIdAndUpdate(section._id, { $inc: { enrolledCount: -1 } });
    }
    throw error;
  }

  // Populate references for client response
  const populated = await Booking.findById(newBooking._id)
    .populate('gymId', 'name partnerId address images imageUrl logo contactPhone location')
    .populate('sectionId', 'title category startTime endTime durationDays activeDays trainerId maxCapacity enrolledCount')
    .populate('trainerId', 'name specialization avatar employeeId phone')
    .populate('userId', 'fullName name phone email customerId customerProfile');

  return res.status(201).json(ApiResponse.created(populated, 'Booking created successfully'));
});

/**
 * Get all Bookings for Logged-In User
 * GET /api/v1/bookings/my
 */
export const getMyBookings = asyncHandler(async (req, res) => {
  const rawUserId = req.user?.userId || req.user?.id || req.user?._id || req.query?.userId || req.headers?.['x-user-id'];
  if (!rawUserId) {
    return res.status(200).json(ApiResponse.success([], 'My bookings retrieved successfully'));
  }

  const filter = mongoose.Types.ObjectId.isValid(rawUserId)
    ? { userId: new mongoose.Types.ObjectId(rawUserId) }
    : { userId: rawUserId };

  const bookings = await Booking.find(filter)
    .populate('gymId', 'name partnerId address images imageUrl logo contactPhone location')
    .populate({
      path: 'sectionId',
      select: 'title category startTime endTime durationDays activeDays trainerId maxCapacity enrolledCount inclusions instructions',
      populate: {
        path: 'trainerId',
        select: 'name specialization avatar employeeId phone rating',
      },
    })
    .populate('trainerId', 'name specialization avatar employeeId phone')
    .sort({ createdAt: -1 })
    .lean()
    .maxTimeMS(8000);

  return res.status(200).json(ApiResponse.success(bookings || [], 'My bookings retrieved successfully'));
});

/**
 * Get Single Booking Details
 * GET /api/v1/bookings/:id
 */
export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(id);

  const booking = await Booking.findOne(
    isObjectId ? { $or: [{ _id: id }, { bookingId: id }] } : { bookingId: id }
  )
    .populate('gymId', 'name partnerId address images imageUrl logo contactPhone location')
    .populate('sectionId', 'title category startTime endTime durationDays activeDays trainerId maxCapacity enrolledCount inclusions instructions')
    .populate('trainerId', 'name specialization avatar employeeId phone')
    .populate('userId', 'fullName name phone email customerId customerProfile');

  if (!booking) {
    throw ApiError.notFound('Booking not found.');
  }

  return res.status(200).json(ApiResponse.success(booking, 'Booking retrieved successfully'));
});

/**
 * Cancel Booking
 * PATCH /api/v1/bookings/:id/cancel
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason = 'Cancelled by member' } = req.body;
  const isObjectId = mongoose.Types.ObjectId.isValid(id);

  const booking = await Booking.findOne(
    isObjectId ? { $or: [{ _id: id }, { bookingId: id }] } : { bookingId: id }
  );

  if (!booking) {
    throw ApiError.notFound('Booking not found.');
  }

  if (booking.status === 'Cancelled') {
    throw ApiError.badRequest('This booking is already cancelled.');
  }

  booking.status = 'Cancelled';
  booking.cancellation = {
    cancelledAt: new Date(),
    reason: (reason || '').trim(),
  };

  await booking.save();

  // Atomically decrement section enrolledCount if this was a section booking
  if (booking.sectionId) {
    await Section.findOneAndUpdate(
      { _id: booking.sectionId, enrolledCount: { $gt: 0 } },
      { $inc: { enrolledCount: -1 } }
    );
  }

  const updatedBooking = await Booking.findById(booking._id)
    .populate('gymId', 'name partnerId address images imageUrl logo contactPhone location')
    .populate('sectionId', 'title category startTime endTime durationDays activeDays trainerId maxCapacity enrolledCount')
    .populate('trainerId', 'name specialization avatar employeeId phone');

  return res.status(200).json(ApiResponse.success(updatedBooking, 'Booking cancelled successfully'));
});

/**
 * Get Section Enrollments Roster (Gym Owner & Admin)
 * GET /api/v1/bookings/section/:sectionId
 */
export const getSectionEnrollments = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;

  if (!sectionId || !mongoose.Types.ObjectId.isValid(sectionId)) {
    throw ApiError.badRequest('Valid Section ID is required.');
  }

  const section = await Section.findById(sectionId)
    .populate('trainerId', 'name specialization avatar employeeId phone')
    .populate('gymId', 'name partnerId');

  if (!section) {
    throw ApiError.notFound('Section not found.');
  }

  const enrollments = await Booking.find({ sectionId })
    .populate('userId', 'fullName name phone email avatar customerId customerProfile profilePicture')
    .sort({ createdAt: -1 });

  const activeCount = enrollments.filter((b) => b.status === 'Upcoming' || b.status === 'Active').length;
  const cancelledCount = enrollments.filter((b) => b.status === 'Cancelled').length;

  return res.status(200).json(ApiResponse.success({
    section,
    summary: {
      maxCapacity: section.maxCapacity || 25,
      enrolledCount: section.enrolledCount || 0,
      activeCount,
      cancelledCount,
      availableSlots: Math.max(0, (section.maxCapacity || 25) - (section.enrolledCount || 0)),
    },
    enrollments,
  }, 'Section enrollments retrieved successfully'));
});
