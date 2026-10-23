import mongoose from 'mongoose';
import crypto from 'node:crypto';

export const BOOKING_TYPES = ['SECTION', 'GROUP_CLASS', 'GYM_SESSION'];
export const BOOKING_STATUS = ['Upcoming', 'Active', 'Completed', 'Cancelled'];
export const PAYMENT_METHODS = ['UPI', 'Card', 'Net Banking', 'Cash', 'Wallet'];
export const PAYMENT_STATUS = ['Completed', 'Pending', 'Failed', 'Refunded'];

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'Gym ID is required'],
      index: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      default: null,
      index: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
      index: true,
    },
    bookingType: {
      type: String,
      enum: BOOKING_TYPES,
      default: 'SECTION',
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Booking title is required'],
      trim: true,
      maxlength: 150,
    },
    category: {
      type: String,
      trim: true,
      default: 'general',
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    timeSlot: {
      type: String,
      trim: true,
      default: '',
    },
    durationDays: {
      type: Number,
      default: 1,
      min: 1,
    },
    sessionsCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    pricing: {
      subtotal: { type: Number, required: true, min: 0 },
      discount: { type: Number, default: 0, min: 0 },
      totalAmount: { type: Number, required: true, min: 0 },
      currency: { type: String, default: 'INR', trim: true },
    },
    payment: {
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
      transactionId: {
        type: String,
        required: true,
        trim: true,
      },
      paidAt: {
        type: Date,
        default: Date.now,
      },
    },
    entryOtp: {
      type: String,
      trim: true,
      index: true,
    },
    qrCodeData: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: BOOKING_STATUS,
      default: 'Upcoming',
      index: true,
    },
    cancellation: {
      cancelledAt: { type: Date, default: null },
      reason: { type: String, trim: true, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: auto-assign 6-digit entry OTP & qrCodeData if not provided
bookingSchema.pre('save', function () {
  if (!this.entryOtp) {
    this.entryOtp = crypto.randomInt(100000, 1000000).toString();
  }
  if (!this.qrCodeData) {
    this.qrCodeData = JSON.stringify({
      bookingId: this.bookingId,
      entryOtp: this.entryOtp,
      gymId: this.gymId,
      sectionId: this.sectionId,
      userId: this.userId,
    });
  }
});

// Compound partial index to prevent duplicate active bookings for the same section
bookingSchema.index(
  { sectionId: 1, userId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      sectionId: { $type: 'objectId' },
      status: { $in: ['Upcoming', 'Active'] },
    },
    name: 'unique_active_section_booking',
  }
);

export const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
