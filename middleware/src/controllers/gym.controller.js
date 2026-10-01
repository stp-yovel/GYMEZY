import mongoose from 'mongoose';
import Gym from '../models/gym.model.js';
import User, { USER_ROLES } from '../models/user.model.js';
import Counter from '../models/counter.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import {
  formatAndCompressFile,
} from '../utils/mediaCompressor.js';
import {
  sanitizeDocument,
  transformListWithIndex,
} from '../utils/responseTransformer.js';

/**
 * Helper to extract GPS coordinates from Google Maps URLs
 */
const AT_COORDS_REGEX = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;
const Q_COORDS_REGEX = /[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;
const D3D4_COORDS_REGEX = /!3d(-?\d+(?:\.\d+)?)[^!]*!4d(-?\d+(?:\.\d+)?)/;
const LL_COORDS_REGEX = /(?:ll|loc:)(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;

const extractCoordinatesFromMapsUrl = (url) => {
  if (!url || typeof url !== 'string') return null;

  const atMatch = AT_COORDS_REGEX.exec(url);
  if (atMatch) {
    return { lat: Number.parseFloat(atMatch[1]), lng: Number.parseFloat(atMatch[2]) };
  }

  const qMatch = Q_COORDS_REGEX.exec(url);
  if (qMatch) {
    return { lat: Number.parseFloat(qMatch[1]), lng: Number.parseFloat(qMatch[2]) };
  }

  const d3d4Match = D3D4_COORDS_REGEX.exec(url);
  if (d3d4Match) {
    return { lat: Number.parseFloat(d3d4Match[1]), lng: Number.parseFloat(d3d4Match[2]) };
  }

  const llMatch = LL_COORDS_REGEX.exec(url);
  if (llMatch) {
    return { lat: Number.parseFloat(llMatch[1]), lng: Number.parseFloat(llMatch[2]) };
  }

  return null;
};

/**
 * POST /api/v1/gyms/onboard
 * New Gym Partner Onboarding with Owner Account Creation and {gymname}_{filename} Media Base64 Compression
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
    logo,
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
  if (!password) {
    throw ApiError.badRequest('Owner account password is required.');
  }
  if (password.length < 8 || password.length > 16) {
    throw ApiError.badRequest('Password must be between 8 and 16 characters.');
  }
  if (!/[A-Z]/.test(password)) {
    throw ApiError.badRequest('Password must contain at least 1 uppercase letter.');
  }
  if (!/[0-9]/.test(password)) {
    throw ApiError.badRequest('Password must contain at least 1 number.');
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) {
    throw ApiError.badRequest('Password must contain at least 1 special character.');
  }
  if (/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]|[^\x20-\x7E]/u.test(password)) {
    throw ApiError.badRequest('Emoji characters and non-standard symbols are not allowed in password.');
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

  // 3. Compress Media (Images & PDFs) with high quality & {gymname}_{filename} formatting
  const primaryLogo = logo || coverPhoto || image || '';
  const structuredLogo = await formatAndCompressFile(finalGymName, 'logo', primaryLogo);
  const structuredCover = structuredLogo;

  const rawGallery = Array.isArray(galleryPhotos) ? galleryPhotos : Array.isArray(images) ? images : [];
  const structuredGallery = (
    await Promise.all(
      rawGallery.map((img, i) => formatAndCompressFile(finalGymName, `gallery_${i + 1}`, img))
    )
  ).filter(Boolean);

  // Compress Trainer Images with {gymname}_trainer_{name} naming
  const structuredTrainers = await Promise.all(
    trainers.map(async (t) => {
      const sanitizedTrainerName = (t.name || 'coach').toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const trainerImg = await formatAndCompressFile(finalGymName, `trainer_${sanitizedTrainerName}`, t.image);
      return {
        name: t.name,
        specialty: t.specialty || 'General Fitness',
        experienceYears: Number(t.experienceYears) || 1,
        rating: Number(t.rating) || 4.9,
        monthlyFee: Number(t.monthlyFee) || 0,
        image: trainerImg || {},
      };
    })
  );

  // Compress Verification Documents (PDFs or Images) with {gymname}_{filename} format
  const docsInput = documents || {};
  const [
    structuredGst,
    structuredPan,
    structuredTrade,
    structuredBankProof,
    structuredFireSafety,
    structuredFssai,
  ] = await Promise.all([
    formatAndCompressFile(finalGymName, 'gst_certificate', docsInput.gstCertificate || gstCertificate),
    formatAndCompressFile(finalGymName, 'pan', docsInput.panCard || panCard),
    formatAndCompressFile(finalGymName, 'trade_license', docsInput.tradeLicense || tradeLicense),
    formatAndCompressFile(finalGymName, 'bank_proof', docsInput.bankProof || bankProof),
    formatAndCompressFile(finalGymName, 'fire_safety', docsInput.fireSafetyCertificate || fireSafetyCertificate),
    formatAndCompressFile(finalGymName, 'fssai_certificate', docsInput.fssaiCertificate || fssaiCertificate),
  ]);

  // Coordinates (from direct lat/lng or parsed from googleMapsUrl)
  const parsedCoords = extractCoordinatesFromMapsUrl(googleMapsUrl);
  const latitude = Number(lat) || (parsedCoords ? parsedCoords.lat : 13.0827);
  const longitude = Number(lng) || (parsedCoords ? parsedCoords.lng : 80.2707);

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

  // 4. Generate Sequential Partner ID via Counter Table
  const partnerSeq = await Counter.getNextSequence('gym_partner_id');
  const partnerId = `GYM${partnerSeq}`;

  // 5. Create Gym in MongoDB
  const newGym = new Gym({
    partnerId,
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
    logo: structuredLogo || {},
    coverPhoto: structuredCover || {},
    image: structuredLogo?.fileData || structuredCover?.fileData || '',
    galleryPhotos: structuredGallery,
    images: structuredGallery.map((g) => g.fileData),
    facilities: Array.isArray(facilities) ? facilities : [],
    amenities: Array.isArray(amenities) ? amenities : [],
    workouts: Array.isArray(workouts) ? workouts : [],
    tags: Array.isArray(tags) ? tags : [],
    badgeText: badgeText || 'Verified',
    aboutText: aboutText || '',
    trainers: structuredTrainers,
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
      gstCertificate: structuredGst || {},
      panCard: structuredPan || {},
      tradeLicense: structuredTrade || {},
      bankProof: structuredBankProof || {},
      fireSafetyCertificate: structuredFireSafety || {},
      fssaiCertificate: structuredFssai || {},
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

  const sanitizedGym = sanitizeDocument(newGym);
  const sanitizedOwner = sanitizeDocument(gymOwnerUser);

  return res.status(201).json(
    ApiResponse.created(
      {
        gym: sanitizedGym,
        owner: sanitizedOwner,
      },
      `Gym "${finalGymName}" and Partner Owner account onboarded successfully!`
    )
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
      { partnerId: new RegExp(search, 'i') },
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

  const sanitizedList = transformListWithIndex(gyms, skip + 1);

  return res.status(200).json(
    ApiResponse.success(
      {
        gyms: sanitizedList,
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(totalCount / limitNum),
        },
      },
      'Gyms retrieved successfully'
    )
  );
});

/**
 * GET /api/v1/gyms/:id
 * Retrieve a specific gym by its Mongo ID, partnerId, or slug
 */
export const getGymById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let gym;
  if (mongoose.Types.ObjectId.isValid(id)) {
    gym = await Gym.findById(id);
  }
  if (!gym) {
    gym = await Gym.findOne({
      $or: [{ partnerId: id }, { slug: id }],
    });
  }

  if (!gym) {
    throw ApiError.notFound('Gym not found.');
  }

  return res.status(200).json(
    ApiResponse.success(sanitizeDocument(gym), 'Gym details retrieved successfully')
  );
});

/**
 * PATCH /api/v1/gyms/:id/status
 * Update gym approval or operational status
 */
export const updateGymStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, approvalStatus, rejectionReason } = req.body;

  let gym;
  if (mongoose.Types.ObjectId.isValid(id)) {
    gym = await Gym.findById(id);
  }
  if (!gym) {
    gym = await Gym.findOne({
      $or: [{ partnerId: id }, { slug: id }],
    });
  }

  if (!gym) {
    throw ApiError.notFound('Gym not found.');
  }

  if (status) gym.status = status;
  if (approvalStatus) gym.approvalStatus = approvalStatus;
  if (rejectionReason) gym.rejectionReason = rejectionReason;

  await gym.save();

  return res.status(200).json(
    ApiResponse.success(sanitizeDocument(gym), `Gym status updated to ${gym.status} (${gym.approvalStatus})`)
  );
});

/**
 * DELETE /api/v1/gyms/:id
 * Delete a gym and its associated owner account
 */
export const deleteGym = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let gym;
  if (mongoose.Types.ObjectId.isValid(id)) {
    gym = await Gym.findById(id);
  }
  if (!gym) {
    gym = await Gym.findOne({
      $or: [{ partnerId: id }, { slug: id }],
    });
  }

  if (!gym) {
    throw ApiError.notFound('Gym not found.');
  }

  const gymName = gym.name;
  const ownerId = gym.ownerId;

  await Gym.findByIdAndDelete(gym._id);
  if (ownerId) {
    await User.findByIdAndDelete(ownerId);
  }

  return res.status(200).json(
    ApiResponse.success(null, `Gym "${gymName}" and associated partner account deleted successfully`)
  );
});
