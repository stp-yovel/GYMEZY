import mongoose from 'mongoose';

const fileAttachmentSchema = new mongoose.Schema(
  {
    fileName: { type: String, trim: true, default: '' }, // Formatted as {gymname}_{filename} e.g. "titanium_fitness_pan.webp"
    fileData: { type: String, default: '' }, // Compressed Base64 Data URL (data:image/webp;base64,... or data:application/pdf;base64,...)
    mimeType: { type: String, trim: true, default: '' }, // "image/webp" | "application/pdf"
    fileSizeKb: { type: Number, default: 0 },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const openingHoursSchema = new mongoose.Schema(
  {
    weekdayOpen: { type: String, trim: true, default: '05:30 AM' },
    weekdayClose: { type: String, trim: true, default: '10:30 PM' },
    weekendOpen: { type: String, trim: true, default: '06:00 AM' },
    weekendClose: { type: String, trim: true, default: '09:00 PM' },
    displayText: { type: String, trim: true, default: '05:30 AM - 10:30 PM' },
    isSplitShift: { type: Boolean, default: false },
    isOpenHolidays: { type: Boolean, default: true },
    is24Hours: { type: Boolean, default: false },
  },
  { _id: false }
);

const pricingPlansSchema = new mongoose.Schema(
  {
    singleSession: { type: Number, default: 199, min: 0 },
    weeklyPass: { type: Number, default: 799, min: 0 },
    fiveSessions: { type: Number, default: 899, min: 0 },
    monthly: { type: Number, default: 1999, min: 0 },
    quarterly: { type: Number, default: 4999, min: 0 },
    halfYearly: { type: Number, default: 8999, min: 0 },
    annual: { type: Number, default: 14999, min: 0 },
  },
  { _id: false }
);

const bankDetailsSchema = new mongoose.Schema(
  {
    accountHolder: { type: String, trim: true, default: '' },
    bankName: { type: String, trim: true, default: '' },
    accountNumber: { type: String, trim: true, default: '' },
    ifscCode: { type: String, trim: true, default: '' },
    upiId: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const trainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, trim: true, default: 'General Fitness' },
    experienceYears: { type: Number, default: 1, min: 0 },
    rating: { type: Number, default: 4.9, min: 0, max: 5 },
    monthlyFee: { type: Number, default: 0, min: 0 },
    image: { type: fileAttachmentSchema, default: () => ({}) }, // { fileName: "{gymname}_trainer_{name}", fileData: "..." }
  },
  { _id: false }
);

const documentsSchema = new mongoose.Schema(
  {
    gstCertificate: { type: fileAttachmentSchema, default: () => ({}) },
    panCard: { type: fileAttachmentSchema, default: () => ({}) },
    tradeLicense: { type: fileAttachmentSchema, default: () => ({}) },
    bankProof: { type: fileAttachmentSchema, default: () => ({}) },
    fireSafetyCertificate: { type: fileAttachmentSchema, default: () => ({}) },
    fssaiCertificate: { type: fileAttachmentSchema, default: () => ({}) },
  },
  { _id: false }
);

const gymSchema = new mongoose.Schema(
  {
    partnerId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Gym name is required'],
      trim: true,
      index: true,
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    ownerName: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true,
    },
    businessType: {
      type: String,
      enum: ['Sole Proprietorship', 'Partnership', 'Private Limited', 'LLP', 'Other'],
      default: 'Private Limited',
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    yearEstablished: { type: String, trim: true, default: '' },
    gstNumber: { type: String, trim: true, uppercase: true, default: '' },
    panNumber: { type: String, trim: true, uppercase: true, default: '' },
    branches: { type: String, trim: true, default: '1' },

    // Location
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [80.2707, 13.0827],
      },
    },
    area: { type: String, trim: true, default: '' },
    city: { type: String, required: [true, 'City is required'], trim: true, index: true },
    state: { type: String, trim: true, default: 'Tamil Nadu' },
    pincode: { type: String, trim: true, default: '' },
    landmark: { type: String, trim: true, default: '' },
    address: { type: String, required: [true, 'Address is required'], trim: true },
    fullAddress: { type: String, trim: true, default: '' },
    googleMapsUrl: { type: String, trim: true, default: '' },

    // Facilities, Capacity & Media
    floorSpaceSqFt: { type: Number, default: 0, min: 0 },
    maxFloorCapacity: { type: Number, default: 0, min: 0 },
    logo: { type: fileAttachmentSchema, default: () => ({}) }, // { fileName: "{gymname}_logo.webp", fileData: "..." }
    coverPhoto: { type: fileAttachmentSchema, default: () => ({}) }, // Backwards compatibility
    image: { type: String, default: '' }, // String convenience field
    galleryPhotos: [fileAttachmentSchema], // Array of { fileName: "{gymname}_gallery_1.webp", fileData: "..." }
    images: [{ type: String }],

    facilities: [{ type: String, trim: true }],
    amenities: [{ type: String, trim: true }],
    workouts: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    badgeText: { type: String, trim: true, default: 'Verified' },
    aboutText: { type: String, trim: true, default: '' },

    // Trainers
    trainers: [trainerSchema],

    // Operational Hours & Slots
    openingHours: {
      type: openingHoursSchema,
      default: () => ({}),
    },
    slotDurationMinutes: { type: Number, default: 60, min: 15 },
    maxSlotCapacity: { type: Number, default: 25, min: 1 },
    slotsMorning: [{ type: String, trim: true }],
    slotsEvening: [{ type: String, trim: true }],

    // Pricing Plans
    singleSessionPrice: { type: Number, default: 199, min: 0 },
    pricingPlans: {
      type: pricingPlansSchema,
      default: () => ({}),
    },

    // Rules & Safety
    rules: [{ type: String, trim: true }],
    safetyMeasures: [{ type: String, trim: true }],
    freeCancellationHours: { type: Number, default: 2, min: 0 },
    refundPercentage: { type: Number, default: 100, min: 0, max: 100 },
    rescheduleAllowedCount: { type: Number, default: 2, min: 0 },

    // Subscription & Settlement
    subscriptionType: {
      type: String,
      enum: ['Hybrid', 'App Only', 'GMS', 'Listing Only'],
      default: 'Hybrid',
      index: true,
    },
    subscriptionStatus: {
      type: String,
      enum: ['Active', 'Inactive', 'Trial', 'Expired'],
      default: 'Active',
    },
    commissionRate: { type: Number, default: 10, min: 0, max: 100 },
    settlementCycle: { type: String, default: 'Daily (T+1)', trim: true },
    bankDetails: {
      type: bankDetailsSchema,
      default: () => ({}),
    },
    documents: {
      type: documentsSchema,
      default: () => ({}),
    },

    // Platform State
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Inactive', 'Suspended'],
      default: 'Active',
      index: true,
    },
    approvalStatus: {
      type: String,
      enum: ['Approved', 'Pending Approval', 'Rejected'],
      default: 'Approved',
      index: true,
    },
    changesCount: { type: Number, default: 0, min: 0 },
    rejectionReason: { type: String, trim: true, default: '' },
    rating: { type: Number, default: 4.9, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    membersCount: { type: Number, default: 0, min: 0 },
    monthlyRevenue: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

gymSchema.index({ location: '2dsphere' });
gymSchema.index({ city: 1, isActive: 1 });
gymSchema.index({ status: 1, approvalStatus: 1 });

const sanitizeJsonTransform = (_doc, ret) => {
  if (ret._id) {
    ret.mongoId = ret._id.toString();
    ret.id = ret.partnerId || ret._id.toString();
  }
  delete ret._id;
  delete ret.__v;
  return ret;
};

gymSchema.set('toJSON', { transform: sanitizeJsonTransform });
gymSchema.set('toObject', { transform: sanitizeJsonTransform });

export const Gym = mongoose.model('Gym', gymSchema);
export default Gym;
