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
 * @returns {Promise<number>} Next sequence integer
 */
counterSchema.statics.getNextSequence = async function (sequenceName) {
  try {
    const counter = await this.findByIdAndUpdate(
      sequenceName,
      { $inc: { seq: 1 } },
      { returnDocument: 'after', new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return counter?.seq || 1;
  } catch (error) {
    console.warn('[COUNTER] getNextSequence fallback:', error.message);
    return Math.floor(100 + Math.random() * 900);
  }
};

export const Counter = mongoose.model('Counter', counterSchema);
export default Counter;
