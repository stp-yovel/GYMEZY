import mongoose from 'mongoose';

const walletLedgerSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['CREDIT', 'DEBIT'],
      required: true,
    },
    source: {
      type: String,
      enum: [
        'MEMBERSHIP_DOWNGRADE_PRORATION',
        'ADMIN_ADJUSTMENT',
        'MEMBERSHIP_PURCHASE',
        'REFUND_REVERSAL',
        'TOP_UP',
        'WALLET_WITHDRAWAL',
        'BOOKING_PAYMENT',
      ],
      required: true,
    },
    amountPaise: {
      type: Number,
      required: true,
      min: 1,
    },
    balanceAfterPaise: {
      type: Number,
      required: true,
      min: 0,
    },
    referenceRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipSwitchRequest',
      default: null,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const walletSchema = new mongoose.Schema(
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
    balancePaise: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
    },
    history: [walletLedgerSchema],
  },
  {
    timestamps: true,
  }
);

walletSchema.index({ userId: 1, gymId: 1 }, { unique: true });

export const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;
