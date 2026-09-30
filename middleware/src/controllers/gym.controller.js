import mongoose from 'mongoose';
import Gym from '../models/gym.model.js';
import User, { USER_ROLES } from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { compressImageBase64, compressPdfBase64, isPdfData } from '../utils/mediaCompressor.js';

/**
 * Helper to compress document field (supports image or PDF)
 */
const compressDocumentField = async (docStr) => {
  if (!docStr) return '';
  if (isPdfData(docStr)) {
    return compressPdfBase64(docStr);
  }
  return compressImageBase64(docStr, { maxWidth: 1600, maxHeight: 1600, quality: 75 });
};

/**
 * POST /api/v1/gyms/onboard
 * New Gym Partner Onboarding with Owner Account Creation and Media Base64 Compression
 */
export const onboardGym = asyncHandler(async (req, res) => {
  const {
    gymName,
    name,
    tagline,
    ownerName,
    phone,
    email,
    password,
    businessType,
    yearEstablished,
    gstNumber,
    panNumber,
    branches,
    address,
    area,
    city,
    state,
    pincode,
    landmark,
    lat,
    lng,
    googleMapsUrl,
    floorSpaceSqFt,
    maxFloorCapacity,
    coverPhoto,
    image,
    galleryPhotos,
    images,
    facilities,
    amenities,
    workouts,
    tags,
    badgeText,
    aboutText,
    trainers = [],
    openingHours,
    weekdayOpen,
    weekdayClose,
    weekendOpen,
    weekendClose,
    isSplitShift,
    isOpenHolidays,
    is24Hours,
    slotDurationMinutes,
    maxSlotCapacity,
    slotsMorning,
    slotsEvening,
    singleSessionPrice,
    weeklyPassPrice,
    fiveSessionPrice,
    monthlyPrice,
    quarterlyPrice,
    halfYearlyPrice,
    annualPrice,
    pricingPlans,
    rules,
    safetyMeasures,
    freeCancellationHours,
    refundPercentage,
    rescheduleAllowedCount,
    subscriptionType,
    commissionRate,
    settlementCycle,
    bankDetails,
    accountHolder,
    bankName,
    accountNumber,
    ifscCode,
    upiId,
    documents,
    gstCertificate,
    panCard,
    tradeLicense,
    bankProof,
    fireSafetyCertificate,
    fssaiCertificate,
    status,
    approvalStatus,
    initialApprovalStatus,
  } = req.body;

  const finalGymName = (gymName || name || '').trim();
  const finalOwnerName = (ownerName || '').trim();
  const finalEmail = (email || '').trim().toLowerCase();
  const finalPhone = (phone || '').trim();
  const finalCity = (city || '').trim();
  const finalAddress = (address || '').trim();

  // 1. Validation
  if (!finalGymName) {
    throw ApiError.badRequest('Gym name is required.');
  }
  if (!finalOwnerName) {
    throw ApiError.badRequest('Owner name is required.');
  }
  if (!finalEmail) {
    throw ApiError.badRequest('Email address is required.');
  }
  if (!finalPhone) {
    throw ApiError.badRequest('Phone number is required.');
  }
  if (!password || password.length < 6) {
    throw ApiError.badRequest('Owner password is required (minimum 6 characters).');
  }
  if (!finalCity) {
    throw ApiError.badRequest('City is required.');
  }
  if (!finalAddress) {
    throw ApiError.badRequest('Gym address is required.');
  }

  // 2. Check for duplicate gym email or owner account
  const existingUser = await User.findOne({ email: finalEmail });
  if (existingUser) {
    throw ApiError.conflict('An account with this email address already exists.');
  }

  // 3. Compress Media (Images & PDFs) with high quality
  const primaryCover = coverPhoto || image || '';
  const compressedCover = await compressImageBase64(primaryCover, { maxWidth: 1600, maxHeight: 1200, quality: 78 });

  const rawGallery = Array.isArray(galleryPhotos) ? galleryPhotos : Array.isArray(images) ? images : [];
  const compressedGallery = await Promise.all(
    rawGallery.map((img) => compressImageBase64(img, { maxWidth: 1200, maxHeight: 900, quality: 75 }))
  );

  // Compress Trainer Images
  const compressedTrainers = await Promise.all(
    trainers.map(async (t) => ({
      name: t.name,
      specialty: t.specialty || 'General Fitness',
      experienceYears: Number(t.experienceYears) || 1,
      rating: Number(t.rating) || 4.9,
      monthlyFee: Number(t.monthlyFee) || 0,
      image: await compressImageBase64(t.image, { maxWidth: 400, maxHeight: 400, quality: 80 }),
    }))
  );

  // Compress Verification Documents (PDFs or Images)
  const docsInput = documents || {};
  const [
    compressedGst,
    compressedPan,
    compressedTrade,
    compressedBankProof,
    compressedFireSafety,
    compressedFssai,
  ] = await Promise.all([
    compressDocumentField(docsInput.gstCertificate || gstCertificate),
    compressDocumentField(docsInput.panCard || panCard),
    compressDocumentField(docsInput.tradeLicense || tradeLicense),
    compressDocumentField(docsInput.bankProof || bankProof),
    compressDocumentField(docsInput.fireSafetyCertificate || fireSafetyCertificate),
    compressDocumentField(docsInput.fssaiCertificate || fssaiCertificate),
  ]);

  // Coordinates
  const latitude = Number(lat) || 13.0827;
  const longitude = Number(lng) || 80.2707;

  // Pricing Structure
  const resolvedPricing = pricingPlans || {
    singleSession: Number(singleSessionPrice) || 199,
    weeklyPass: Number(weeklyPassPrice) || 799,
    fiveSessions: Number(fiveSessionPrice) || 899,
    monthly: Number(monthlyPrice) || 1999,
    quarterly: Number(quarterlyPrice) || 4999,
    halfYearly: Number(halfYearlyPrice) || 8999,
    annual: Number(annualPrice) || 14999,
  };

  // Bank Details
  const resolvedBankDetails = bankDetails || {
    accountHolder: accountHolder || '',
    bankName: bankName || '',
    accountNumber: accountNumber || '',
    ifscCode: ifscCode || '',
    upiId: upiId || '',
  };

  // Operational Hours
  const resolvedOpeningHours = openingHours || {
    weekdayOpen: weekdayOpen || '05:30 AM',
    weekdayClose: weekdayClose || '10:30 PM',
    weekendOpen: weekendOpen || '06:00 AM',
    weekendClose: weekendClose || '09:00 PM',
    displayText: `${weekdayOpen || '05:30 AM'} - ${weekdayClose || '10:30 PM'}`,
    isSplitShift: Boolean(isSplitShift),
    isOpenHolidays: isOpenHolidays !== false,
    is24Hours: Boolean(is24Hours),
  };

  // 4. Create Gym in MongoDB
  const newGym = new Gym({
    name: finalGymName,
    tagline: tagline || '',
    slug: finalGymName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    ownerName: finalOwnerName,
    businessType: businessType || 'Private Limited',
    phone: finalPhone,
    email: finalEmail,
    yearEstablished: yearEstablished || '',
    gstNumber: gstNumber || '',
    panNumber: panNumber || '',
    branches: branches || '1',
    location: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
    area: area || '',
    city: finalCity,
    state: state || 'Tamil Nadu',
    pincode: pincode || '',
    landmark: landmark || '',
    address: finalAddress,
    fullAddress: `${finalAddress}, ${area ? area + ', ' : ''}${finalCity}, ${state || 'Tamil Nadu'} - ${pincode || ''}`,
    googleMapsUrl: googleMapsUrl || `https://maps.google.com/?q=${latitude},${longitude}`,
    floorSpaceSqFt: Number(floorSpaceSqFt) || 0,
    maxFloorCapacity: Number(maxFloorCapacity) || 0,
    coverPhoto: compressedCover,
    image: compressedCover,
    galleryPhotos: compressedGallery,
    images: compressedGallery,
    facilities: Array.isArray(facilities) ? facilities : [],
    amenities: Array.isArray(amenities) ? amenities : [],
    workouts: Array.isArray(workouts) ? workouts : [],
    tags: Array.isArray(tags) ? tags : [],
    badgeText: badgeText || 'Verified',
    aboutText: aboutText || '',
    trainers: compressedTrainers,
    openingHours: resolvedOpeningHours,
    slotDurationMinutes: Number(slotDurationMinutes) || 60,
    maxSlotCapacity: Number(maxSlotCapacity) || 25,
    slotsMorning: Array.isArray(slotsMorning) ? slotsMorning : [],
    slotsEvening: Array.isArray(slotsEvening) ? slotsEvening : [],
    singleSessionPrice: Number(singleSessionPrice) || resolvedPricing.singleSession || 199,
    pricingPlans: resolvedPricing,
    rules: Array.isArray(rules) ? rules : [],
    safetyMeasures: Array.isArray(safetyMeasures) ? safetyMeasures : [],
    freeCancellationHours: Number(freeCancellationHours) || 2,
    refundPercentage: Number(refundPercentage) || 100,
    rescheduleAllowedCount: Number(rescheduleAllowedCount) || 2,
    subscriptionType: subscriptionType || 'Hybrid',
    commissionRate: Number(commissionRate) || 10,
    settlementCycle: settlementCycle || 'Daily (T+1)',
    bankDetails: resolvedBankDetails,
    documents: {
      gstCertificate: compressedGst,
      panCard: compressedPan,
      tradeLicense: compressedTrade,
      bankProof: compressedBankProof,
      fireSafetyCertificate: compressedFireSafety,
      fssaiCertificate: compressedFssai,
    },
    status: status || 'Active',
    approvalStatus: approvalStatus || initialApprovalStatus || 'Approved',
  });

  await newGym.save();

  // 5. Create Gym Owner User Account
  const gymOwnerUser = new User({
    fullName: finalOwnerName,
    email: finalEmail,
    phone: finalPhone,
    password, // Pre-save hook hashes with bcryptjs
    role: USER_ROLES.GYM_OWNER,
    gymId: newGym._id,
    isActive: true,
    isVerified: true,
  });

  await gymOwnerUser.save();

  // Link Owner ID in Gym
  newGym.ownerId = gymOwnerUser._id;
  await newGym.save();

  const responseGym = newGym.toObject();

  return ApiResponse.success(
    res,
    201,
    `Gym "${finalGymName}" and Partner Owner account onboarded successfully!`,
    {
      gym: responseGym,
      owner: {
        fullName: gymOwnerUser.fullName,
        email: gymOwnerUser.email,
        phone: gymOwnerUser.phone,
        role: gymOwnerUser.role,
      },
    }
  );
});

/**
 * GET /api/v1/gyms
 * List gyms with search, status filters, and sequential index mapping
 */
export const getGyms = asyncHandler(async (req, res) => {
  const { status, approvalStatus, subscriptionType, city, search, page = 1, limit = 50 } = req.query;

  const query = {};

  if (status && status !== 'All') {
    query.status = status;
  }
  if (approvalStatus && approvalStatus !== 'All') {
    query.approvalStatus = approvalStatus;
  }
  if (subscriptionType && subscriptionType !== 'All') {
    query.subscriptionType = subscriptionType;
  }
  if (city && city !== 'All') {
    query.city = new RegExp(city, 'i');
  }
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { ownerName: new RegExp(search, 'i') },
      { city: new RegExp(search, 'i') },
      { phone: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [totalCount, gyms] = await Promise.all([
    Gym.countDocuments(query),
    Gym.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
  ]);

  const sanitizedList = gyms.map((gym, index) => {
    const obj = gym.toObject();
    return {
      ...obj,
      id: skip + index + 1, // Sequential integer row index
    };
  });

  return ApiResponse.success(res, 200, 'Gyms retrieved successfully', {
    gyms: sanitizedList,
    pagination: {
      total: totalCount,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(totalCount / limitNum),
    },
  });
});

/**
 * GET /api/v1/gyms/:id
 * Retrieve a specific gym by its Mongo ID or slug
 */
export const getGymById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let gym;
  if (mongoose.Types.ObjectId.isValid(id)) {
    gym = await Gym.findById(id);
  } else {
    gym = await Gym.findOne({ slug: id });
  }

  if (!gym) {
    throw ApiError.notFound('Gym not found.');
  }

  return ApiResponse.success(res, 200, 'Gym details retrieved successfully', gym.toObject());
});

/**
 * PATCH /api/v1/gyms/:id/status
 * Update gym approval or operational status
 */
export const updateGymStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, approvalStatus, rejectionReason } = req.body;

  const gym = await Gym.findById(id);
  if (!gym) {
    throw ApiError.notFound('Gym not found.');
  }

  if (status) gym.status = status;
  if (approvalStatus) gym.approvalStatus = approvalStatus;
  if (rejectionReason) gym.rejectionReason = rejectionReason;

  await gym.save();

  return ApiResponse.success(res, 200, `Gym status updated to ${gym.status} (${gym.approvalStatus})`, gym.toObject());
});
