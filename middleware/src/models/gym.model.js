import mongoose from 'mongoose';

const openingHoursSchema = new mongoose.Schema(
  {
    openTime: { type: String, trim: true, default: '05:30 AM' },
    closeTime: { type: String, trim: true, default: '10:30 PM' },
    displayText: { type: String, trim: true, default: '05:30 AM - 10:30 PM' },
  },
  { _id: false }
);

const pricingPlansSchema = new mongoose.Schema(
  {
    singleSession: { type: Number, default: 0, min: 0 },
    weeklyPass: { type: Number, default: 0, min: 0 },
    fiveSessions: { type: Number, default: 0, min: 0 },
    monthly: { type: Number, default: 0, min: 0 },
    quarterly: { type: Number, default: 0, min: 0 },
    halfYearly: { type: Number, default: 0, min: 0 },
    annual: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const bankDetailsSchema = new mongoose.Schema(
  {
    accountHolder: { type: String, trim: true, default: '' },
    bankName: { type: String, trim: true, default: '' },
    accountNumber: { type: String, trim: true, default: '' },
    ifsc: { type: String, trim: true, default: '' },
    upiId: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const gymSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Gym name is required'],
      trim: true,
      index: true,
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
      trim: true,
      default: '',
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
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [80.2707, 13.0827], // Default Chennai [lng, lat]
      },
    },
    area: { type: String, trim: true, default: '' },
    city: { type: String, required: [true, 'City is required'], trim: true, index: true },
    state: { type: String, trim: true, default: 'Tamil Nadu' },
    pincode: { type: String, trim: true, default: '' },
    fullAddress: { type: String, required: [true, 'Full address is required'], trim: true },
    images: [{ type: String }],
    image: { type: String, default: '' },
    rating: { type: Number, default: 0.0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    membersCount: { type: Number, default: 0, min: 0 },
    monthlyRevenue: { type: Number, default: 0, min: 0 },
    pricePerSession: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Inactive', 'Suspended'],
      default: 'Pending',
      index: true,
    },
    approvalStatus: {
      type: String,
      enum: ['Approved', 'Pending Approval', 'Rejected'],
      default: 'Pending Approval',
      index: true,
    },
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
    changesCount: { type: Number, default: 0, min: 0 },
    rejectionReason: { type: String, trim: true, default: '' },
    tags: [{ type: String, trim: true }],
    badgeText: { type: String, trim: true, default: '' },
    aboutText: { type: String, trim: true, default: '' },
    openingHours: {
      type: openingHoursSchema,
      default: () => ({}),
    },
    pricingPlans: {
      type: pricingPlansSchema,
      default: () => ({}),
    },
    bankDetails: {
      type: bankDetailsSchema,
      default: () => ({}),
    },
    facilities: [{ type: String, trim: true }],
    amenities: [{ type: String, trim: true }],
    workouts: [{ type: String, trim: true }],
    rules: [{ type: String, trim: true }],
    safetyMeasures: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

// Geo-spatial index for proximity queries
gymSchema.index({ location: '2dsphere' });
gymSchema.index({ city: 1, isActive: 1 });
gymSchema.index({ status: 1, approvalStatus: 1 });

const sanitizeJsonTransform = (_doc, ret) => {
  delete ret._id;
  delete ret.id;
  delete ret.__v;
  return ret;
};

gymSchema.set('toJSON', { transform: sanitizeJsonTransform });
gymSchema.set('toObject', { transform: sanitizeJsonTransform });

export const Gym = mongoose.model('Gym', gymSchema);
export default Gym;
