import mongoose from 'mongoose';

export const ATTENDANCE_METHODS = ['QR', 'OTP', 'Manual'];
export const ATTENDANCE_STATUS = ['Checked-In', 'Completed'];

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
      index: true,
    },
    membershipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Membership',
      default: null,
      index: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
      index: true,
    },
    method: {
      type: String,
      enum: ATTENDANCE_METHODS,
      default: 'QR',
      required: true,
    },
    checkInTime: {
      type: Date,
      default: Date.now,
      required: true,
      index: true,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ATTENDANCE_STATUS,
      default: 'Checked-In',
      index: true,
    },
    area: {
      type: String,
      default: 'General Workout',
      trim: true,
    },
    verifiedBy: {
      type: String,
      default: 'Turnstile Fast Check-In',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly find active check-ins for a user at a gym
attendanceSchema.index({ userId: 1, gymId: 1, status: 1 });
attendanceSchema.index({ gymId: 1, checkInTime: -1 });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
