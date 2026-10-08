import mongoose from 'mongoose';
import crypto from 'node:crypto';
import { Membership, MEMBERSHIP_TIERS } from '../models/membership.model.js';
import Gym from '../models/gym.model.js';
import Employee from '../models/employee.model.js';
import User from '../models/user.model.js';
import Counter from '../models/counter.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

const TIER_DURATION_DAYS = {
  Monthly: 30,
  Quarterly: 90,
  'Half Yearly': 180,
  Annual: 365,
};

const TIER_PRICE_KEYS = {
  Monthly: 'monthly',
  Quarterly: 'quarterly',
  'Half Yearly': 'halfYearly',
  Annual: 'annual',
};

/**
 * Helper to calculate base gym price for a given tier
 */
const getGymBasePrice = (gym, tier) => {
  const priceKey = TIER_PRICE_KEYS[tier];
  if (gym?.pricingPlans && typeof gym.pricingPlans[priceKey] === 'number') {
    return Number(gym.pricingPlans[priceKey]);
  }
  // Standard fallback defaults
  const defaults = {
    Monthly: 1999,
    Quarterly: 4999,
    'Half Yearly': 8999,
    Annual: 14999,
  };
  return defaults[tier] || 1999;
};

/**
 * Helper to calculate trainer fee for a given tier
 */
const getTrainerTierFee = (trainer, tier) => {
  if (!trainer) return 0;
  const priceKey = TIER_PRICE_KEYS[tier];
  const tierFee = trainer.trainerPricing?.[priceKey];
  if (typeof tierFee === 'number' && tierFee > 0) {
    return tierFee;
  }
  const baseMonthly = Number(trainer.trainerPricing?.monthly) || Number(trainer.compensation?.payAmount) || 0;
  const multiplier = {
    Monthly: 1,
    Quarterly: 3,
    'Half Yearly': 6,
    Annual: 12,
  }[tier] || 1;
  return baseMonthly * multiplier;
};

/**
 * Generate sequential membership ID formatted as MEM00{counter} scoped to the gym
 */
const generateGymMembershipId = async (gym) => {
  const gymSeqKey = `mem_${gym.partnerId || gym._id}`;
  const seq = await Counter.getNextSequence(gymSeqKey);
  return `MEM00${seq}`;
};

/**
 * Purchase/Create Membership
 * POST /api/v1/memberships
 */
export const createMembership = async (req, res, next) => {
  try {
    const {
      gymId,
      membershipTier,
      startDate,
      trainerId,
      trainerSlot,
      paymentMethod = 'UPI',
      transactionId,
    } = req.body;

    // 1. Validate required fields
    if (!gymId) {
      throw ApiError.badRequest('Gym ID is required.');
    }
    if (!membershipTier || !MEMBERSHIP_TIERS.includes(membershipTier)) {
      throw ApiError.badRequest(`Invalid membership tier. Allowed values: ${MEMBERSHIP_TIERS.join(', ')}.`);
    }
    if (!startDate) {
      throw ApiError.badRequest('Start date is required.');
    }

    // 2. Resolve User ID (from JWT authenticated user or request)
    const rawUserId = req.user?.userId || req.user?.id || req.body.userId;
    let resolvedUserId = null;

    if (rawUserId && mongoose.Types.ObjectId.isValid(rawUserId)) {
      resolvedUserId = rawUserId;
    } else {
      const foundUser = await User.findOne({
        $or: [
          { email: req.user?.email || req.body.email || '' },
          { phone: req.user?.phone || req.body.phone || '' },
        ],
      });
      if (foundUser) {
        resolvedUserId = foundUser._id;
      } else {
        const anyUser = await User.findOne();
        resolvedUserId = anyUser ? anyUser._id : new mongoose.Types.ObjectId();
      }
    }

    // 3. Validate Gym
    const isObjectId = mongoose.Types.ObjectId.isValid(gymId);
    const gym = await Gym.findOne(
      isObjectId ? { $or: [{ _id: gymId }, { partnerId: gymId }] } : { partnerId: gymId }
    );
    if (!gym) {
      throw ApiError.notFound('Gym not found.');
    }

    // 4. Validate Trainer (if selected)
    let trainer = null;
    let trainerFee = 0;
    if (trainerId && trainerId !== 'No Personal Trainer') {
      const isTrainerObjectId = mongoose.Types.ObjectId.isValid(trainerId);
      trainer = await Employee.findOne(
        isTrainerObjectId
          ? { $or: [{ _id: trainerId }, { employeeId: trainerId }] }
          : { employeeId: trainerId }
      );
      if (!trainer) {
        throw ApiError.badRequest('Selected personal trainer does not exist.');
      }
      if (trainer.status !== 'Active') {
        throw ApiError.badRequest('Selected trainer is currently inactive.');
      }
      trainerFee = getTrainerTierFee(trainer, membershipTier);
    }

    // 5. Calculate Pricing & Dates
    const durationDays = TIER_DURATION_DAYS[membershipTier] || 30;
    const basePrice = getGymBasePrice(gym, membershipTier);
    const totalAmount = basePrice + trainerFee;

    const parsedStart = new Date(startDate);
    if (Number.isNaN(parsedStart.getTime())) {
      throw ApiError.badRequest('Invalid start date format.');
    }
    parsedStart.setHours(0, 0, 0, 0);

    const parsedEnd = new Date(parsedStart.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const now = new Date();
    const status = parsedStart > now ? 'Upcoming' : 'Active';

    // 6. Generate sequential Membership ID
    const membershipId = await generateGymMembershipId(gym);

    // 7. Create Membership Record
    const membership = new Membership({
      membershipId,
      gymId: gym._id,
      gymPartnerId: gym.partnerId || '',
      userId: resolvedUserId,
      trainerId: trainer ? trainer._id : null,
      hasTrainer: Boolean(trainer),
      trainerSlot: trainer ? trainerSlot || 'General Slot' : null,
      membershipTier,
      durationDays,
      startDate: parsedStart,
      endDate: parsedEnd,
      pricing: {
        basePrice,
        trainerFee,
        totalAmount,
        currency: 'INR',
      },
      payment: {
        method: paymentMethod,
        status: 'Completed',
        transactionId: transactionId || `TXN${Date.now()}${Math.floor(100 + Math.random() * 900)}`,
        paidAt: new Date(),
      },
      status,
    });

    await membership.save();

    const populatedMembership = await Membership.findById(membership._id)
      .populate('gymId', 'name partnerId address location images phone email')
      .populate('trainerId', 'name employeeId specialty profilePicture rating reviewsCount')
      .populate('userId', 'fullName email phone profilePicture');

    return res.status(201).json(ApiResponse.created(populatedMembership, 'Membership purchased successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * Helper to extract primary logo/image for a gym document
 */
const resolveGymLogo = (gym) => {
  if (!gym) return null;
  if (typeof gym.logo === 'string' && gym.logo.trim()) return gym.logo.trim();
  if (gym.logo?.fileData && typeof gym.logo.fileData === 'string') return gym.logo.fileData.trim();
  if (gym.logoUrl && typeof gym.logoUrl === 'string') return gym.logoUrl.trim();
  if (gym.coverPhoto?.fileData && typeof gym.coverPhoto.fileData === 'string') return gym.coverPhoto.fileData.trim();
  if (gym.coverPhotoUrl && typeof gym.coverPhotoUrl === 'string') return gym.coverPhotoUrl.trim();
  if (gym.image && typeof gym.image === 'string') return gym.image.trim();
  if (Array.isArray(gym.images) && gym.images.length > 0) return gym.images[0];
  return null;
};

/**
 * Get Memberships for Logged-In User
 * GET /api/v1/memberships/my
 */
export const getMyMemberships = async (req, res, next) => {
  try {
    const rawUserId = req.user?.userId || req.user?.id || req.query.userId;
    if (!rawUserId) {
      return res.status(200).json(ApiResponse.success([], 'My memberships retrieved successfully.'));
    }

    const filter = mongoose.Types.ObjectId.isValid(rawUserId)
      ? { userId: new mongoose.Types.ObjectId(rawUserId) }
      : { userId: rawUserId };

    const memberships = await Membership.find(filter)
      .populate('gymId', 'name partnerId address location logo coverPhoto image images phone email')
      .populate('trainerId', 'name employeeId specialty profilePicture rating reviewsCount')
      .sort({ createdAt: -1 })
      .lean()
      .maxTimeMS(8000);

    const now = new Date();
    const formattedMemberships = (memberships || []).map((m) => {
      const logoUrl = resolveGymLogo(m.gymId);
      const isFuture = m.startDate && new Date(m.startDate) > now;
      const isPast = m.endDate && new Date(m.endDate) < now;
      const isStrictlyActive = m.status === 'Active' && !isFuture && !isPast;

      let otp = null;
      if (isStrictlyActive) {
        otp = m.entryOtp;
        if (!otp && m._id) {
          otp = crypto.randomInt(100000, 1000000).toString();
          Membership.updateOne({ _id: m._id }, { entryOtp: otp }).catch(() => {});
        }
      } else if (m.entryOtp && m._id) {
        Membership.updateOne({ _id: m._id }, { entryOtp: null }).catch(() => {});
      }

      return {
        ...m,
        entryOtp: otp,
        gymLogo: logoUrl,
        gymImageUrl: logoUrl || (m.gymId?.images?.[0] || null),
      };
    });

    return res.status(200).json(ApiResponse.success(formattedMemberships, 'My memberships retrieved successfully.'));
  } catch (error) {
    console.warn('[GET MY MEMBERSHIPS ERROR]:', error.message);
    return res.status(200).json(ApiResponse.success([], 'My memberships retrieved successfully.'));
  }
};

/**
 * Get Single Membership Details
 * GET /api/v1/memberships/:id
 */
export const getMembershipById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const query = isObjectId ? { $or: [{ _id: id }, { membershipId: id }] } : { membershipId: id };
    const membership = await Membership.findOne(query)
      .populate('gymId', 'name partnerId address location logo coverPhoto image images phone email')
      .populate('trainerId', 'name employeeId specialty profilePicture rating reviewsCount')
      .populate('userId', 'fullName email phone profilePicture customerProfile')
      .lean();

    if (!membership) {
      throw ApiError.notFound('Membership not found.');
    }

    const now = new Date();
    const isFuture = membership.startDate && new Date(membership.startDate) > now;
    const isPast = membership.endDate && new Date(membership.endDate) < now;
    const isStrictlyActive = membership.status === 'Active' && !isFuture && !isPast;

    let otp = null;
    if (isStrictlyActive) {
      otp = membership.entryOtp;
      if (!otp && membership._id) {
        otp = crypto.randomInt(100000, 1000000).toString();
        Membership.updateOne({ _id: membership._id }, { entryOtp: otp }).catch(() => {});
      }
    } else if (membership.entryOtp && membership._id) {
      Membership.updateOne({ _id: membership._id }, { entryOtp: null }).catch(() => {});
    }

    const logoUrl = resolveGymLogo(membership.gymId);
    const formatted = {
      ...membership,
      entryOtp: otp,
      gymLogo: logoUrl,
      gymImageUrl: logoUrl || (membership.gymId?.images?.[0] || null),
    };

    return res.status(200).json(ApiResponse.success(formatted, 'Membership details retrieved successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get Memberships for a Gym (Gym Owner Portal & Gym Owner Mobile App)
 * GET /api/v1/memberships/gym/:gymId
 */
export const getGymMemberships = async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const { status, tier, search, page = 1, limit = 50 } = req.query;

    const isObjectId = mongoose.Types.ObjectId.isValid(gymId);
    const gym = await Gym.findOne(
      isObjectId ? { $or: [{ _id: gymId }, { partnerId: gymId }] } : { partnerId: gymId }
    );

    if (!gym) {
      throw ApiError.notFound('Gym not found.');
    }

    // Build filter
    const filter = { gymId: gym._id };
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (tier && tier !== 'All') {
      filter.membershipTier = tier;
    }
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ membershipId: searchRegex }];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Membership.countDocuments(filter);

    const memberships = await Membership.find(filter)
      .populate('userId', 'fullName email phone profilePicture')
      .populate('trainerId', 'name employeeId specialty profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    return res.status(200).json(ApiResponse.success({
      memberships,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)) || 1,
    }, 'Gym memberships retrieved successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel Membership
 * PATCH /api/v1/memberships/:id/cancel
 */
export const cancelMembership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason = 'Cancelled by member' } = req.body;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { membershipId: id }] } : { membershipId: id };

    const membership = await Membership.findOne(query);
    if (!membership) {
      throw ApiError.notFound('Membership not found.');
    }

    if (membership.status === 'Cancelled') {
      throw ApiError.badRequest('Membership is already cancelled.');
    }

    membership.status = 'Cancelled';
    membership.cancellation = {
      cancelledAt: new Date(),
      reason,
    };

    await membership.save();

    return res.status(200).json(ApiResponse.success(membership, 'Membership cancelled successfully.'));
  } catch (error) {
    next(error);
  }
};
