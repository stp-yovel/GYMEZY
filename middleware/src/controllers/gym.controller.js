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
  const primaryLogo = logo || '';
  const primaryCover = coverPhoto || image || logo || '';
  const structuredLogo = primaryLogo ? await formatAndCompressFile(finalGymName, 'logo', primaryLogo) : {};
  const structuredCover = primaryCover ? await formatAndCompressFile(finalGymName, 'cover', primaryCover) : structuredLogo;

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

  // 4. Determine Initial Status and Sequential Partner ID
  const resolvedApprovalStatus =
    approvalStatus ||
    initialApprovalStatus ||
    (req.user?.role === USER_ROLES.SUPER_ADMIN ? 'Approved' : 'Pending Approval');
  const resolvedStatus =
    status || (resolvedApprovalStatus === 'Approved' ? 'Active' : 'Pending');

  // Only generate sequential partner ID if directly approved at creation (e.g. by Super Admin)
  let partnerId = undefined;
  if (resolvedApprovalStatus === 'Approved') {
    const partnerSeq = await Counter.getNextSequence('gym_partner_id');
    partnerId = `GYM${partnerSeq}`;
  }

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
    image: structuredCover?.fileData || structuredLogo?.fileData || '',
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
    status: resolvedStatus,
    approvalStatus: resolvedApprovalStatus,
    remark: req.body.remark || '',
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
 * Calculate distance in km between two GPS coordinates using Haversine formula
 */
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.5;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

/**
 * GET /api/v1/gyms/zones
 * GET /api/v1/gyms/popular-cities
 * Aggregate distinct cities & zones from active database gyms and combine with key metro zones
 */
export const getGymZones = asyncHandler(async (_req, res) => {
  const PRESET_METRO_ZONES = [
    { name: 'Anna Nagar, Chennai', area: 'Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', lat: 13.085, lon: 80.2101 },
    { name: 'T. Nagar, Chennai', area: 'T. Nagar', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0418, lon: 80.2341 },
    { name: 'Adyar, Chennai', area: 'Adyar', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0012, lon: 80.2565 },
    { name: 'Besant Nagar, Chennai', area: 'Besant Nagar', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9996, lon: 80.2678 },
    { name: 'Velachery, Chennai', area: 'Velachery', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9815, lon: 80.218 },
    { name: 'Nungambakkam, Chennai', area: 'Nungambakkam', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0569, lon: 80.2425 },
    { name: 'Porur, Chennai', area: 'Porur', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0382, lon: 80.1585 },
    { name: 'OMR, Chennai', area: 'OMR', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9698, lon: 80.2376 },
    { name: 'Guindy, Chennai', area: 'Guindy', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0067, lon: 80.203 },
    { name: 'Alwarpet, Chennai', area: 'Alwarpet', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0334, lon: 80.2508 },
    { name: 'Kilpauk, Chennai', area: 'Kilpauk', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0784, lon: 80.2412 },
    { name: 'Tambaram, Chennai', area: 'Tambaram', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9249, lon: 80.1275 },
  ];

  // Aggregate active gym counts grouped by city and area from MongoDB
  const dbZones = await Gym.aggregate([
    { $match: { status: 'Active', approvalStatus: 'Approved', isActive: true } },
    {
      $group: {
        _id: {
          city: { $trim: { input: '$city' } },
          area: { $trim: { input: { $ifNull: ['$area', ''] } } },
        },
        gymCount: { $sum: 1 },
        state: { $first: '$state' },
        lat: { $avg: { $arrayElemAt: ['$location.coordinates', 1] } },
        lon: { $avg: { $arrayElemAt: ['$location.coordinates', 0] } },
      },
    },
    { $sort: { gymCount: -1 } },
  ]);

  const zonesMap = new Map();

  for (const item of dbZones) {
    const cityName = item._id.city || 'Chennai';
    const areaName = item._id.area || '';
    const displayName = areaName ? `${areaName}, ${cityName}` : cityName;
    zonesMap.set(displayName.toLowerCase(), {
      name: displayName,
      area: areaName || cityName,
      city: cityName,
      state: item.state || 'Tamil Nadu',
      lat: Number(item.lat) || 13.085,
      lon: Number(item.lon) || 80.2101,
      gymCount: item.gymCount || 1,
      isPopular: true,
    });
  }

  for (const preset of PRESET_METRO_ZONES) {
    const key = preset.name.toLowerCase();
    if (!zonesMap.has(key)) {
      zonesMap.set(key, {
        ...preset,
        gymCount: 0,
        isPopular: true,
      });
    }
  }

  const zonesList = Array.from(zonesMap.values());

  return res.status(200).json(
    ApiResponse.success(
      {
        zones: zonesList,
        total: zonesList.length,
      },
      'Popular cities and gym zones retrieved successfully'
    )
  );
});

/**
 * GET /api/v1/gyms
 * List gyms with geospatial proximity sorting, category filter, facilities, search, and pagination
 */
export const getGyms = asyncHandler(async (req, res) => {
  const {
    status,
    approvalStatus,
    subscriptionType,
    city,
    area,
    category,
    type,
    genderAllowed,
    facility,
    workout,
    search,
    lat,
    lng,
    latitude,
    longitude,
    radius,
    radius_km,
    sortBy,
    page = 1,
    limit = 50,
  } = req.query;

  const isSuperAdmin = req.user?.role === USER_ROLES.SUPER_ADMIN;
  const userLat = Number(lat || latitude);
  const userLng = Number(lng || longitude);
  const hasCoordinates = !Number.isNaN(userLat) && !Number.isNaN(userLng);

  const query = {};

  // Status filtering: Public customers discovery gets only Active & Approved gyms
  if (!isSuperAdmin) {
    query.status = 'Active';
    query.approvalStatus = 'Approved';
    query.isActive = true;
  } else {
    if (status && status !== 'All') query.status = status;
    if (approvalStatus && approvalStatus !== 'All') query.approvalStatus = approvalStatus;
  }

  if (subscriptionType && subscriptionType !== 'All') {
    query.subscriptionType = subscriptionType;
  }

  // City & Area Filters
  if (city && city !== 'All') {
    query.city = new RegExp(city.trim(), 'i');
  }
  if (area && area !== 'All') {
    query.area = new RegExp(area.trim(), 'i');
  }

  // Category Filter
  if (category && category !== 'All') {
    const cat = category.trim().toLowerCase();
    if (cat === 'ac gym') {
      query.facilities = { $regex: /ac|air condition/i };
    } else if (cat === 'women only') {
      query.$or = [
        { tags: { $regex: /women only/i } },
        { name: { $regex: /women|female/i } },
        { genderAllowed: { $regex: /women/i } },
      ];
    } else if (cat === 'strength') {
      query.$or = [
        { tags: { $regex: /strength|bodybuilding|weights/i } },
        { workouts: { $regex: /strength|bodybuilding/i } },
      ];
    } else if (cat === 'hiit') {
      query.$or = [
        { tags: { $regex: /hiit|cardio/i } },
        { workouts: { $regex: /hiit|cardio/i } },
      ];
    } else if (cat === 'yoga') {
      query.$or = [
        { tags: { $regex: /yoga|pilates/i } },
        { workouts: { $regex: /yoga|pilates/i } },
      ];
    } else if (cat === 'boxing') {
      query.$or = [
        { tags: { $regex: /boxing|mma|kickboxing/i } },
        { workouts: { $regex: /boxing|mma/i } },
      ];
    } else if (cat === 'zumba') {
      query.$or = [
        { tags: { $regex: /zumba|dance|aerobics/i } },
        { workouts: { $regex: /zumba|dance/i } },
      ];
    } else if (cat === 'crossfit') {
      query.$or = [
        { tags: { $regex: /crossfit|functional/i } },
        { workouts: { $regex: /crossfit|functional/i } },
      ];
    } else {
      query.$or = [
        { tags: { $regex: new RegExp(cat, 'i') } },
        { workouts: { $regex: new RegExp(cat, 'i') } },
      ];
    }
  }

  // Type / Gender Filter
  const gymType = type || genderAllowed;
  if (gymType && gymType !== 'All Gyms' && gymType !== 'All') {
    query.$or = [
      { tags: { $regex: new RegExp(gymType, 'i') } },
      { genderAllowed: { $regex: new RegExp(gymType, 'i') } },
    ];
  }

  // Specific Facility Filter
  if (facility && facility !== 'All Facilities' && facility !== 'All') {
    query.facilities = { $regex: new RegExp(facility.trim(), 'i') };
  }

  // Specific Workout Filter
  if (workout && workout !== 'All') {
    query.workouts = { $regex: new RegExp(workout.trim(), 'i') };
  }

  // Keyword Search
  if (search && search.trim()) {
    const s = search.trim();
    const searchRegex = new RegExp(s, 'i');
    query.$or = [
      { partnerId: searchRegex },
      { name: searchRegex },
      { ownerName: searchRegex },
      { city: searchRegex },
      { area: searchRegex },
      { address: searchRegex },
      { tags: searchRegex },
      { workouts: searchRegex },
      { facilities: searchRegex },
    ];
  }

  const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 50));
  const skip = (pageNum - 1) * limitNum;

  // Retrieve matching gyms from DB
  const [totalCount, rawGyms] = await Promise.all([
    Gym.countDocuments(query),
    Gym.find(query).lean(),
  ]);

  // Transform and calculate distance dynamically
  let processedGyms = rawGyms.map((g, index) => {
    const gymLat = g.location?.coordinates ? g.location.coordinates[1] : 13.0827;
    const gymLng = g.location?.coordinates ? g.location.coordinates[0] : 80.2707;

    const distance = hasCoordinates
      ? calculateDistanceKm(userLat, userLng, gymLat, gymLng)
      : calculateDistanceKm(13.085, 80.2101, gymLat, gymLng);

    const price = g.singleSessionPrice || g.pricingPlans?.singleSession || 199;
    const displayLocation = g.area ? `${g.area}, ${g.city}` : g.city;
    const coverImg =
      g.coverPhoto?.fileData ||
      (typeof g.coverPhoto === 'string' && g.coverPhoto.length > 0 ? g.coverPhoto : null) ||
      (g.galleryPhotos && g.galleryPhotos[0]?.fileData) ||
      (Array.isArray(g.images) && g.images[0]) ||
      (g.image && g.image !== g.logo?.fileData ? g.image : null) ||
      g.logo?.fileData ||
      (typeof g.logo === 'string' && g.logo.length > 0 ? g.logo : null) ||
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop';

    return {
      index: skip + index + 1,
      id: g.partnerId || g._id.toString(),
      mongoId: g._id.toString(),
      partnerId: g.partnerId || '',
      name: g.name,
      tagline: g.tagline || '',
      location: displayLocation,
      area: g.area || '',
      city: g.city,
      state: g.state || 'Tamil Nadu',
      address: g.address,
      fullAddress: g.fullAddress || `${g.address}, ${displayLocation}`,
      distance,
      distanceText: `${distance} km`,
      coords: { latitude: gymLat, longitude: gymLng },
      rating: g.rating || 4.8,
      reviewsCount: g.reviewsCount || 120,
      pricePerSession: price,
      singleSessionPrice: price,
      imageUrl: coverImg,
      coverPhoto: g.coverPhoto || {},
      logo: g.logo || {},
      galleryPhotos: g.galleryPhotos || [],
      images: g.images || [],
      badgeText: g.badgeText || (g.rating >= 4.8 ? 'Top Rated' : 'Verified'),
      facilities: g.facilities || ['AC', 'Locker', 'Shower', 'Cardio', 'Weights'],
      amenities: g.amenities || [],
      workouts: g.workouts || ['Cardio', 'Strength', 'CrossFit'],
      tags: g.tags || ['Strength', 'Cardio', 'Personal Training'],
      pricingPlans: g.pricingPlans || {
        singleSession: price,
        weeklyPass: price * 4,
        monthly: price * 10,
      },
      openingHours: g.openingHours || { displayText: '05:30 AM - 10:30 PM' },
      trainers: g.trainers || [],
      phone: g.phone || '',
      email: g.email || '',
      status: g.status,
      approvalStatus: g.approvalStatus,
      createdAt: g.createdAt,
    };
  });

  // Filter by radius if provided
  const maxRadius = Number(radius_km || radius);
  if (!Number.isNaN(maxRadius) && maxRadius > 0 && hasCoordinates) {
    processedGyms = processedGyms.filter((g) => g.distance <= maxRadius);
  }

  // Sorting
  if (sortBy === 'rating') {
    processedGyms.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'price_low') {
    processedGyms.sort((a, b) => a.pricePerSession - b.pricePerSession);
  } else if (sortBy === 'price_high') {
    processedGyms.sort((a, b) => b.pricePerSession - a.pricePerSession);
  } else {
    // Default: nearest distance first
    processedGyms.sort((a, b) => a.distance - b.distance);
  }

  // Pagination slice
  const paginatedGyms = processedGyms.slice(skip, skip + limitNum);

  return res.status(200).json(
    ApiResponse.success(
      {
        gyms: paginatedGyms,
        pagination: {
          total: processedGyms.length,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(processedGyms.length / limitNum) || 1,
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
 * Helper to calculate field-level diff between previous gym snapshot and new updates
 */
const calculateGymFieldDiff = (previous, updated) => {
  const diff = {};
  const ignoredKeys = new Set(['_id', 'id', 'key', 'updatedAt', 'createdAt', 'auditHistory', '__v', 'pendingChanges', 'changesCount']);

  Object.keys(updated).forEach((key) => {
    if (ignoredKeys.has(key)) return;
    const oldVal = previous[key];
    const newVal = updated[key];

    if (JSON.stringify(oldVal) !== JSON.stringify(newVal) && newVal !== undefined) {
      diff[key] = {
        oldValue: oldVal !== undefined ? oldVal : null,
        newValue: newVal,
      };
    }
  });

  return diff;
};

/**
 * Apply sanitized changes into a live gym mongoose document
 */
const applyChangesToGymDocument = async (gym, changes) => {
  if (!changes || typeof changes !== 'object') return;

  // Basic Information
  if (changes.name || changes.gymName) gym.name = (changes.name || changes.gymName).trim();
  if (changes.tagline !== undefined) gym.tagline = changes.tagline;
  if (changes.ownerName) gym.ownerName = changes.ownerName.trim();
  if (changes.phone) gym.phone = changes.phone.trim();
  if (changes.email) gym.email = changes.email.trim().toLowerCase();
  if (changes.businessType) gym.businessType = changes.businessType;
  if (changes.yearEstablished !== undefined) gym.yearEstablished = changes.yearEstablished;
  if (changes.gstNumber !== undefined) gym.gstNumber = changes.gstNumber.trim().toUpperCase();
  if (changes.panNumber !== undefined) gym.panNumber = changes.panNumber.trim().toUpperCase();
  if (changes.subscriptionType) gym.subscriptionType = changes.subscriptionType;
  if (changes.commissionRate !== undefined) gym.commissionRate = Number(changes.commissionRate);
  if (changes.settlementCycle) gym.settlementCycle = changes.settlementCycle;
  if (changes.branches) gym.branches = changes.branches;

  // Location & Address
  if (changes.address) gym.address = changes.address.trim();
  if (changes.area !== undefined) gym.area = changes.area.trim();
  if (changes.city) gym.city = changes.city.trim();
  if (changes.state !== undefined) gym.state = changes.state.trim();
  if (changes.pincode !== undefined) gym.pincode = changes.pincode.trim();
  if (changes.landmark !== undefined) gym.landmark = changes.landmark.trim();
  if (changes.fullAddress !== undefined) gym.fullAddress = changes.fullAddress;
  if (changes.googleMapsUrl) gym.googleMapsUrl = changes.googleMapsUrl;

  if (changes.lat !== undefined || changes.lng !== undefined || changes.googleMapsUrl) {
    const parsedCoords = extractCoordinatesFromMapsUrl(changes.googleMapsUrl || gym.googleMapsUrl);
    const latitude = Number(changes.lat) || (parsedCoords ? parsedCoords.lat : (gym.location?.coordinates ? gym.location.coordinates[1] : 13.0827));
    const longitude = Number(changes.lng) || (parsedCoords ? parsedCoords.lng : (gym.location?.coordinates ? gym.location.coordinates[0] : 80.2707));
    gym.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
  }

  // Facility, Capacity & Specs
  if (changes.floorSpaceSqFt !== undefined) gym.floorSpaceSqFt = Number(changes.floorSpaceSqFt);
  if (changes.maxFloorCapacity !== undefined) gym.maxFloorCapacity = Number(changes.maxFloorCapacity);
  if (changes.genderAllowed) gym.genderAllowed = changes.genderAllowed;
  if (changes.aboutText !== undefined) gym.aboutText = changes.aboutText;
  if (changes.facilities !== undefined) gym.facilities = changes.facilities;
  if (changes.amenities !== undefined) gym.amenities = changes.amenities;
  if (changes.workouts !== undefined) gym.workouts = changes.workouts;
  if (changes.customFacilities !== undefined) gym.customFacilities = changes.customFacilities;

  // Pricing Plans
  if (changes.singleSessionPrice !== undefined) {
    gym.singleSessionPrice = Number(changes.singleSessionPrice);
    if (gym.pricingPlans) gym.pricingPlans.singleSession = Number(changes.singleSessionPrice);
  }
  if (changes.weeklyPassPrice !== undefined && gym.pricingPlans) gym.pricingPlans.weeklyPass = Number(changes.weeklyPassPrice);
  if (changes.monthlyPrice !== undefined && gym.pricingPlans) gym.pricingPlans.monthly = Number(changes.monthlyPrice);
  if (changes.quarterlyPrice !== undefined && gym.pricingPlans) gym.pricingPlans.quarterly = Number(changes.quarterlyPrice);
  if (changes.halfYearlyPrice !== undefined && gym.pricingPlans) gym.pricingPlans.halfYearly = Number(changes.halfYearlyPrice);
  if (changes.annualPrice !== undefined && gym.pricingPlans) gym.pricingPlans.annual = Number(changes.annualPrice);
  if (changes.pricingPlans && typeof changes.pricingPlans === 'object') {
    gym.pricingPlans = { ...(gym.pricingPlans || {}), ...changes.pricingPlans };
  }
  if (changes.customPricingPlans !== undefined) gym.customPricingPlans = changes.customPricingPlans;

  // Operations & Schedule
  if (changes.openingHours || changes.schedule || changes.holidays || changes.weekdayOpen || changes.weekdayClose) {
    const rawHours = changes.openingHours || {};
    gym.openingHours = {
      ...(gym.openingHours || {}),
      weekdayOpen: changes.weekdayOpen || rawHours.weekdayOpen || gym.openingHours?.weekdayOpen || '05:30 AM',
      weekdayClose: changes.weekdayClose || rawHours.weekdayClose || gym.openingHours?.weekdayClose || '10:30 PM',
      weekendOpen: changes.weekendOpen || rawHours.weekendOpen || gym.openingHours?.weekendOpen || '06:00 AM',
      weekendClose: changes.weekendClose || rawHours.weekendClose || gym.openingHours?.weekendClose || '09:00 PM',
      displayText: changes.displayText || rawHours.displayText || `${changes.weekdayOpen || rawHours.weekdayOpen || gym.openingHours?.weekdayOpen || '05:30 AM'} - ${changes.weekdayClose || rawHours.weekdayClose || gym.openingHours?.weekdayClose || '10:30 PM'}`,
      isSplitShift: changes.isSplitShift !== undefined ? Boolean(changes.isSplitShift) : (rawHours.isSplitShift !== undefined ? Boolean(rawHours.isSplitShift) : gym.openingHours?.isSplitShift),
      isOpenHolidays: changes.isOpenHolidays !== undefined ? Boolean(changes.isOpenHolidays) : (rawHours.isOpenHolidays !== undefined ? Boolean(rawHours.isOpenHolidays) : gym.openingHours?.isOpenHolidays),
      is24Hours: changes.is24Hours !== undefined ? Boolean(changes.is24Hours) : (rawHours.is24Hours !== undefined ? Boolean(rawHours.is24Hours) : gym.openingHours?.is24Hours),
      schedule: changes.schedule !== undefined ? changes.schedule : (rawHours.schedule !== undefined ? rawHours.schedule : gym.openingHours?.schedule),
      holidays: changes.holidays !== undefined ? changes.holidays : (rawHours.holidays !== undefined ? rawHours.holidays : gym.openingHours?.holidays),
    };
  }

  // Bank Details
  if (changes.bankDetails || changes.accountHolder || changes.bankName || changes.accountNumber || changes.ifscCode || changes.upiId || changes.accountType || changes.branch) {
    const rawBank = changes.bankDetails || {};
    gym.bankDetails = {
      ...(gym.bankDetails || {}),
      accountHolder: changes.accountHolder !== undefined ? changes.accountHolder : (rawBank.accountHolder !== undefined ? rawBank.accountHolder : gym.bankDetails?.accountHolder),
      bankName: changes.bankName !== undefined ? changes.bankName : (rawBank.bankName !== undefined ? rawBank.bankName : gym.bankDetails?.bankName),
      accountNumber: changes.accountNumber !== undefined ? changes.accountNumber : (rawBank.accountNumber !== undefined ? rawBank.accountNumber : gym.bankDetails?.accountNumber),
      ifscCode: changes.ifscCode !== undefined ? changes.ifscCode : (rawBank.ifscCode !== undefined ? rawBank.ifscCode : gym.bankDetails?.ifscCode),
      upiId: changes.upiId !== undefined ? changes.upiId : (rawBank.upiId !== undefined ? rawBank.upiId : gym.bankDetails?.upiId),
      accountType: changes.accountType !== undefined ? changes.accountType : (rawBank.accountType !== undefined ? rawBank.accountType : gym.bankDetails?.accountType),
      branch: changes.branch !== undefined ? changes.branch : (rawBank.branch !== undefined ? rawBank.branch : gym.bankDetails?.branch),
      payoutSchedule: changes.payoutSchedule !== undefined ? changes.payoutSchedule : (rawBank.payoutSchedule !== undefined ? rawBank.payoutSchedule : gym.bankDetails?.payoutSchedule),
      gstInvoiceEnabled: changes.gstInvoiceEnabled !== undefined ? Boolean(changes.gstInvoiceEnabled) : (rawBank.gstInvoiceEnabled !== undefined ? Boolean(rawBank.gstInvoiceEnabled) : gym.bankDetails?.gstInvoiceEnabled),
    };
  }

  // Social Links
  if (changes.socialLinks || changes.instagram || changes.instagramHandle || changes.facebook || changes.youtube || changes.whatsapp || changes.website || changes.googleBusinessUrl) {
    const rawSocial = changes.socialLinks || {};
    gym.socialLinks = {
      ...(gym.socialLinks || {}),
      instagram: changes.instagram !== undefined ? changes.instagram : (rawSocial.instagram !== undefined ? rawSocial.instagram : gym.socialLinks?.instagram),
      instagramHandle: changes.instagramHandle !== undefined ? changes.instagramHandle : (rawSocial.instagramHandle !== undefined ? rawSocial.instagramHandle : gym.socialLinks?.instagramHandle),
      facebook: changes.facebook !== undefined ? changes.facebook : (rawSocial.facebook !== undefined ? rawSocial.facebook : gym.socialLinks?.facebook),
      youtube: changes.youtube !== undefined ? changes.youtube : (rawSocial.youtube !== undefined ? rawSocial.youtube : gym.socialLinks?.youtube),
      whatsapp: changes.whatsapp !== undefined ? changes.whatsapp : (rawSocial.whatsapp !== undefined ? rawSocial.whatsapp : gym.socialLinks?.whatsapp),
      website: changes.website !== undefined ? changes.website : (rawSocial.website !== undefined ? rawSocial.website : gym.socialLinks?.website),
      googleBusinessUrl: changes.googleBusinessUrl !== undefined ? changes.googleBusinessUrl : (rawSocial.googleBusinessUrl !== undefined ? rawSocial.googleBusinessUrl : gym.socialLinks?.googleBusinessUrl),
      googleRating: changes.googleRating !== undefined ? changes.googleRating : (rawSocial.googleRating !== undefined ? rawSocial.googleRating : gym.socialLinks?.googleRating),
      googleReviewCount: changes.googleReviewCount !== undefined ? changes.googleReviewCount : (rawSocial.googleReviewCount !== undefined ? rawSocial.googleReviewCount : gym.socialLinks?.googleReviewCount),
    };
  }

  // System Settings
  if (changes.systemSettings && typeof changes.systemSettings === 'object') {
    gym.systemSettings = { ...(gym.systemSettings || {}), ...changes.systemSettings };
  }

  // Media
  if (changes.logo) {
    if (typeof changes.logo === 'object' && changes.logo.fileData) {
      gym.logo = changes.logo;
    } else {
      gym.logo = await formatAndCompressFile(gym.name, 'logo', changes.logo);
    }
  }
  if (changes.coverPhoto) {
    if (typeof changes.coverPhoto === 'object' && changes.coverPhoto.fileData) {
      gym.coverPhoto = changes.coverPhoto;
    } else {
      gym.coverPhoto = await formatAndCompressFile(gym.name, 'cover', changes.coverPhoto);
    }
  }
  if (changes.galleryPhotos && Array.isArray(changes.galleryPhotos)) {
    const rawNewGallery = changes.galleryPhotos;
    const structured = (
      await Promise.all(
        rawNewGallery.map((img, i) => {
          if (typeof img === 'object' && img.fileData) return img;
          return formatAndCompressFile(gym.name, `gallery_${i + 1}`, img);
        })
      )
    ).filter(Boolean);
    gym.galleryPhotos = structured;
  }
};

/**
 * PUT /api/v1/gyms/:id
 * PATCH /api/v1/gyms/:id
 * Update general gym profile with mandatory Super Admin approval requirement for Partner Owners
 */
export const updateGym = asyncHandler(async (req, res) => {
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

  // Check authorization for Gym Owner
  const isSuperAdmin = req.user.role === USER_ROLES.SUPER_ADMIN;
  if (!isSuperAdmin) {
    const isOwner =
      (gym.ownerId && String(gym.ownerId) === String(req.user._id)) ||
      (req.user.gymId && String(gym._id) === String(req.user.gymId));
    if (!isOwner) {
      throw ApiError.forbidden('You are not authorized to update this gym.');
    }
  }

  const updates = req.body;
  const currentSnapshot = gym.toObject();

  if (isSuperAdmin) {
    // Super Admin direct edit: apply changes immediately and mark approved
    await applyChangesToGymDocument(gym, updates);
    gym.pendingChanges = null;
    gym.approvalStatus = 'Approved';
    gym.status = 'Active';
    gym.changesCount = 0;

    if (!gym.auditHistory) gym.auditHistory = [];
    gym.auditHistory.unshift({
      changeType: 'SUPER_ADMIN_DIRECT_EDIT',
      changedBy: req.user.fullName || req.user.name || req.user.email || 'Super Admin',
      changedByRole: 'SUPER_ADMIN',
      changedAt: new Date(),
      requestedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      field: 'Direct Super Admin Profile Update',
      editedFields: { directUpdate: { oldValue: null, newValue: 'Updated directly by Super Administrator' } },
      previousSnapshot: currentSnapshot,
      newSnapshot: gym.toObject(),
      approvalStatus: 'Approved',
      reviewedBy: req.user.email,
      reviewedAt: new Date(),
      adminRemarks: 'Directly applied and approved by Super Administrator',
    });

    await gym.save();

    return res.status(200).json(
      ApiResponse.success(sanitizeDocument(gym), 'Gym details updated and approved successfully.')
    );
  }

  // Gym Owner edit: process media & schedule in proposed updates, calculate diff, and set to Pending Approval
  const proposedChanges = { ...updates };

  // If new logo/cover/gallery was passed as Base64 by gym owner, pre-compress for pending changes
  if (updates.logo && typeof updates.logo === 'string' && updates.logo.startsWith('data:')) {
    proposedChanges.logo = await formatAndCompressFile(gym.name, 'logo', updates.logo);
  }
  if (updates.coverPhoto && typeof updates.coverPhoto === 'string' && updates.coverPhoto.startsWith('data:')) {
    proposedChanges.coverPhoto = await formatAndCompressFile(gym.name, 'cover', updates.coverPhoto);
  }
  if (updates.galleryPhotos && Array.isArray(updates.galleryPhotos)) {
    proposedChanges.galleryPhotos = (
      await Promise.all(
        updates.galleryPhotos.map((img, i) => {
          if (typeof img === 'object' && img.fileData) return img;
          if (typeof img === 'string' && img.startsWith('data:')) {
            return formatAndCompressFile(gym.name, `gallery_${i + 1}`, img);
          }
          return img;
        })
      )
    ).filter(Boolean);
  }

  const editedDiff = calculateGymFieldDiff(currentSnapshot, proposedChanges);

  if (Object.keys(editedDiff).length === 0 && !updates.resubmit) {
    return res.status(200).json(ApiResponse.success(sanitizeDocument(gym), 'No changes detected.'));
  }

  const onlyChangedFields = {};
  Object.entries(editedDiff).forEach(([field, diffItem]) => {
    onlyChangedFields[field] = diffItem.newValue;
  });

  // Store proposed changes in pendingChanges without overriding live active fields
  gym.pendingChanges = {
    ...(gym.pendingChanges || {}),
    ...onlyChangedFields,
  };
  gym.approvalStatus = 'Pending Approval';
  gym.changesCount = Object.keys(gym.pendingChanges).length;

  const changedByName = req.user.fullName || req.user.name || gym.ownerName || 'Gym Owner';

  if (!gym.auditHistory) gym.auditHistory = [];
  gym.auditHistory.unshift({
    changeType: 'EDIT_GYM_PROFILE',
    changedBy: changedByName,
    changedByRole: 'GYM_OWNER',
    changedAt: new Date(),
    requestedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    field: Object.keys(onlyChangedFields).join(', ') || 'General Profile Update',
    editedFields: editedDiff,
    previousSnapshot: currentSnapshot,
    newSnapshot: onlyChangedFields,
    approvalStatus: 'Pending Approval',
  });

  await gym.save();

  return res.status(200).json(
    ApiResponse.success(
      sanitizeDocument(gym),
      'Gym profile changes submitted successfully. Pending Super Admin review and approval.'
    )
  );
});

/**
 * PATCH /api/v1/gyms/:id/status
 * Super Admin Decision Engine: Approve, Hold, or Reject Gym Registration / Edits
 */
export const updateGymStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, approvalStatus, rejectionReason, remark, notes } = req.body;

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

  const finalRemark = remark !== undefined ? remark : (notes !== undefined ? notes : rejectionReason);
  const reviewerName = req.user?.fullName || req.user?.name || req.user?.email || 'Super Admin';

  if (approvalStatus === 'Approved') {
    // 1. If there are pending changes submitted by owner, apply them to the live gym document
    if (gym.pendingChanges && typeof gym.pendingChanges === 'object') {
      await applyChangesToGymDocument(gym, gym.pendingChanges);
      gym.pendingChanges = null;
    }

    gym.approvalStatus = 'Approved';
    gym.status = 'Active';
    gym.changesCount = 0;
    gym.remark = finalRemark || 'Approved and published by Super Admin';

    if (!gym.partnerId) {
      const partnerSeq = await Counter.getNextSequence('gym_partner_id');
      gym.partnerId = `GYM${partnerSeq}`;
    }

    // Mark all pending audit records as Approved
    if (gym.auditHistory && Array.isArray(gym.auditHistory)) {
      gym.auditHistory.forEach((log) => {
        if (log.approvalStatus === 'Pending Approval' || log.approvalStatus === 'Pending Admin Review') {
          log.approvalStatus = 'Approved';
          log.reviewedBy = reviewerName;
          log.reviewedAt = new Date();
          log.adminRemarks = finalRemark || 'Approved by Super Administrator';
        }
      });
    }
  } else if (approvalStatus === 'Rejected') {
    // Reject pending changes
    gym.pendingChanges = null;
    gym.changesCount = 0;
    gym.remark = finalRemark || 'Rejected during Super Admin inspection';
    gym.rejectionReason = finalRemark || 'Rejected during Super Admin inspection';

    if (gym.partnerId) {
      // Existing active partner: keep status active but discard the rejected edits
      gym.approvalStatus = 'Approved';
      gym.status = 'Active';
    } else {
      // New onboard application rejected
      gym.approvalStatus = 'Rejected';
      gym.status = 'Rejected';
    }

    // Mark pending audit records as Rejected
    if (gym.auditHistory && Array.isArray(gym.auditHistory)) {
      gym.auditHistory.forEach((log) => {
        if (log.approvalStatus === 'Pending Approval' || log.approvalStatus === 'Pending Admin Review') {
          log.approvalStatus = 'Rejected';
          log.reviewedBy = reviewerName;
          log.reviewedAt = new Date();
          log.adminRemarks = finalRemark || 'Rejected by Super Administrator';
        }
      });
    }
  } else if (approvalStatus === 'On Hold') {
    gym.approvalStatus = 'On Hold';
    gym.status = 'On Hold';
    if (finalRemark !== undefined) {
      gym.remark = finalRemark;
    }
  } else if (approvalStatus === 'Pending Approval') {
    gym.approvalStatus = 'Pending Approval';
    gym.status = 'Pending';
  } else if (status && !approvalStatus) {
    gym.status = status;
  }

  await gym.save();

  return res.status(200).json(
    ApiResponse.success(
      sanitizeDocument(gym),
      `Gym status updated to ${gym.status} (${gym.approvalStatus}). Changes synchronized.`
    )
  );
});

/**
 * POST /api/v1/gyms/:id/resubmit
 * Partner Owner resubmits their application back into "Pending Approval"
 */
export const resubmitGymApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { notes, remark } = req.body;

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

  // Authorization check for Gym Owner
  if (req.user.role === USER_ROLES.GYM_OWNER) {
    const isOwner =
      (gym.ownerId && String(gym.ownerId) === String(req.user._id)) ||
      (req.user.gymId && String(gym._id) === String(req.user.gymId));
    if (!isOwner) {
      throw ApiError.forbidden('You are not authorized to resubmit this gym application.');
    }
  }

  gym.approvalStatus = 'Pending Approval';
  gym.status = 'Pending';
  if (notes !== undefined || remark !== undefined) {
    gym.remark = notes || remark || '';
    gym.rejectionReason = notes || remark || '';
  }

  await gym.save();

  return res.status(200).json(
    ApiResponse.success(
      sanitizeDocument(gym),
      'Gym application resubmitted successfully. It is now awaiting review.'
    )
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
