import mongoose from 'mongoose';

export const SECTION_CATEGORIES = [
  'gym',
  'yoga',
  'zumba',
  'crossfit',
  'hiit',
  'pilates',
  'boxing',
  'other',
];

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const sectionSchema = new mongoose.Schema(
  {
    // Gym Association - By ID Only
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'Gym ID is required'],
      index: true,
    },

    // Assigned Trainer - By ID Only
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Trainer ID is required'],
      index: true,
    },

    // Section Title (e.g. "Basic Yoga 20 Days")
    title: {
      type: String,
      required: [true, 'Section name is required'],
      trim: true,
      maxlength: 120,
    },

    // Category
    category: {
      type: String,
      enum: SECTION_CATEGORIES,
      default: 'yoga',
      index: true,
    },

    // Cost / Pricing
    cost: {
      type: Number,
      required: [true, 'Section cost is required'],
      min: [0, 'Cost cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
    },

    // Schedule: Start Date & Duration in Days
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      index: true,
    },
    durationDays: {
      type: Number,
      required: [true, 'Duration in days is required'],
      min: [1, 'Duration must be at least 1 day'],
      default: 20,
    },
    endDate: {
      type: Date,
    },

    // Daily Timings
    startTime: {
      type: String, // e.g. "06:00 AM"
      required: [true, 'Start time is required'],
      trim: true,
    },
    endTime: {
      type: String, // e.g. "07:00 AM"
      required: [true, 'End time is required'],
      trim: true,
    },

    // Weekly Recurrence (Selected Days)
    activeDays: {
      type: [
        {
          type: String,
          enum: DAYS_OF_WEEK,
        },
      ],
      default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'At least one active day of the week must be selected',
      },
    },

    // Max Student/Member Capacity
    maxCapacity: {
      type: Number,
      default: 25,
      min: [1, 'Capacity must be at least 1'],
    },
    enrolledCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Program Description & Guidelines
    description: {
      type: String,
      trim: true,
      default: '',
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: auto-calculate endDate if not provided
sectionSchema.pre('save', function (next) {
  if (this.startDate && this.durationDays && !this.endDate) {
    const end = new Date(this.startDate);
    end.setDate(end.getDate() + Number(this.durationDays));
    this.endDate = end;
  }
  next();
});

export const Section = mongoose.model('Section', sectionSchema);
export default Section;
