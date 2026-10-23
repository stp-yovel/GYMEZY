import mongoose from 'mongoose';

const fileAttachmentSchema = new mongoose.Schema(
  {
    fileName: { type: String, trim: true, default: '' },
    fileData: { type: String, default: '' }, // Compressed Base64 Data URL (data:image/webp;base64,...)
    mimeType: { type: String, trim: true, default: 'image/webp' },
    fileSizeKb: { type: Number, default: 0 },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Banner title is required'],
      trim: true,
      maxlength: 120,
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
      maxlength: 200,
    },
    badgeText: {
      type: String,
      trim: true,
      default: 'FEATURED DEAL',
      maxlength: 50,
    },
    // Compressed WebP image storage
    image: {
      type: fileAttachmentSchema,
      default: () => ({}),
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    // Associated Gym (Mapped by Mongo ObjectId and cached slug/name/coordinates)
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'Gym ID is required'],
      index: true,
    },
    gymSlug: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    gymName: {
      type: String,
      trim: true,
      default: '',
    },
    gymArea: {
      type: String,
      trim: true,
      default: '',
    },
    gymLocation: {
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
    // Priority flag: if true, displayed first in user app before distance sorting
    isPriority: {
      type: Boolean,
      default: false,
      index: true,
    },
    // Status flag
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    validUntil: {
      type: Date,
      default: null,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Geo-spatial index for location queries
bannerSchema.index({ gymLocation: '2dsphere' });
bannerSchema.index({ isActive: 1, isPriority: -1, createdAt: -1 });

export const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
