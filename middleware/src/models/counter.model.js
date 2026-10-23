import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Atomically increment and return the next integer sequence number
 * @param {string} sequenceName - Identifier for the counter (e.g. 'gym_partner_id')
 * @param {number} [startAt=1] - Starting number if the counter does not yet exist
 * @returns {Promise<number>} Next sequence integer
 */
counterSchema.statics.getNextSequence = async function (sequenceName, startAt = 1) {
  try {
    const res = await this.collection.findOneAndUpdate(
      { _id: sequenceName },
      [
        {
          $set: {
            seq: {
              $cond: {
                if: { $or: [{ $eq: ['$seq', null] }, { $not: ['$seq'] }] },
                then: startAt,
                else: { $add: ['$seq', 1] },
              },
            },
            updatedAt: '$$NOW',
            createdAt: {
              $cond: {
                if: { $or: [{ $eq: ['$createdAt', null] }, { $not: ['$createdAt'] }] },
                then: '$$NOW',
                else: '$createdAt',
              },
            },
          },
        },
      ],
      { returnDocument: 'after', upsert: true }
    );
    return res?.seq ?? (res?.value?.seq || startAt);
  } catch (error) {
    console.warn('[COUNTER] getNextSequence fallback:', error.message);
    return startAt;
  }
};

export const Counter = mongoose.model('Counter', counterSchema);
export default Counter;
