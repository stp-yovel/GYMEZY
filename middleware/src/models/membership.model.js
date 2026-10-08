import mongoose from 'mongoose';
import crypto from 'node:crypto';

export const MEMBERSHIP_TIERS = ['Monthly', 'Quarterly', 'Half Yearly', 'Annual'];
export const MEMBERSHIP_STATUS = ['Active', 'Upcoming', 'Expiring Soon', 'Expired', 'Cancelled'];
export const PAYMENT_METHODS = ['UPI', 'Card', 'Net Banking', 'Cash', 'Wallet'];
export const PAYMENT_STATUS = ['Completed', 'Pending', 'Failed', 'Refunded'];

const pricingSchema = new mongoose.Schema(
  {
    basePrice: { type: Number, required: true, min: 0 },
    trainerFee: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR', trim: true },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: PAYMENT_METHODS,
      default: 'UPI',
    },
    status: {
      type: String,
      enum: PAYMENT_STATUS,
      default: 'Completed',
    },
    transactionId: { type: String, required: true, trim: true },
    paidAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const cancellationSchema = new mongoose.Schema(
  {
    cancelledAt: { type: Date },
    reason: { type: String, trim: true },
  },
  { _id: false }
);

const membershipSchema = new mongoose.Schema(
  {
    membershipId: {
      type: String,
      required: true,
      trim: true,
      index: true,
      // Scoped per gym: MEM00{counter} (e.g. MEM001, MEM002)
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
      index: true,
    },
    gymPartnerId: {
      type: String,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
      index: true,
    },
    hasTrainer: {
      type: Boolean,
      default: false,
    },
    trainerSlot: {
      type: String,
      default: null,
      trim: true,
    },
    membershipTier: {
      type: String,
      enum: MEMBERSHIP_TIERS,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    pricing: {
      type: pricingSchema,
      required: true,
    },
    payment: {
      type: paymentSchema,
      required: true,
    },
    status: {
      type: String,
      enum: MEMBERSHIP_STATUS,
      default: 'Active',
      index: true,
    },
    cancellation: {
      type: cancellationSchema,
      default: null,
    },
    entryOtp: {
      type: String,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate 6-digit entry OTP only for currently active memberships
membershipSchema.pre('save', function (next) {
  const now = new Date();
  const isFuture = this.startDate && new Date(this.startDate) > now;
  const isPast = this.endDate && new Date(this.endDate) < now;
  const isStrictlyActive = this.status === 'Active' && !isFuture && !isPast;

  if (isStrictlyActive) {
    if (!this.entryOtp) {
      this.entryOtp = crypto.randomInt(100000, 1000000).toString();
    }
  } else {
    // Upcoming, Expired, and Cancelled memberships do not receive an entry OTP
    this.entryOtp = null;
  }
  next();
});

// Compound index guaranteeing uniqueness of membershipId per gym
membershipSchema.index({ gymId: 1, membershipId: 1 }, { unique: true });

export const Membership = mongoose.model('Membership', membershipSchema);
export default Membership;
