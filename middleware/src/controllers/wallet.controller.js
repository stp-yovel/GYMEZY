import mongoose from 'mongoose';
import crypto from 'node:crypto';
import { Wallet } from '../models/wallet.model.js';
import Gym from '../models/gym.model.js';
import User from '../models/user.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Get logged-in user's consolidated wallet summary & transactions
 * GET /api/v1/wallet/my
 */
export const getMyWallet = async (req, res, next) => {
  try {
    const rawUserId = req.user?.userId || req.user?.id || req.user?._id || req.query?.userId;
    if (!rawUserId) {
      return res.status(200).json(
        ApiResponse.success(
          {
            totalBalancePaise: 0,
            totalBalanceINR: 0,
            totalCreditedINR: 0,
            totalDebitedINR: 0,
            walletsCount: 0,
            wallets: [],
            transactions: [],
          },
          'Wallet summary retrieved successfully.'
        )
      );
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(rawUserId);
    const userQuery = isObjectId ? { userId: new mongoose.Types.ObjectId(rawUserId) } : { userId: rawUserId };

    const userWallets = await Wallet.find(userQuery)
      .populate('gymId', 'name partnerId address location logo coverPhoto image images phone')
      .lean();

    let totalBalancePaise = 0;
    let totalCreditedPaise = 0;
    let totalDebitedPaise = 0;
    const allTransactions = [];

    const formattedWallets = (userWallets || []).map((w) => {
      totalBalancePaise += w.balancePaise || 0;

      const gymLogo =
        (typeof w.gymId?.logo === 'string' && w.gymId.logo.trim()) ||
        w.gymId?.logo?.fileData ||
        w.gymId?.coverPhoto?.fileData ||
        w.gymId?.image ||
        (Array.isArray(w.gymId?.images) && w.gymId.images[0]) ||
        null;

      const history = w.history || [];
      history.forEach((tx) => {
        const txAmountPaise = Number(tx.amountPaise) || 0;
        if (tx.type === 'CREDIT') {
          totalCreditedPaise += txAmountPaise;
        } else if (tx.type === 'DEBIT') {
          totalDebitedPaise += txAmountPaise;
        }

        allTransactions.push({
          id: tx._id ? String(tx._id) : tx.transactionId,
          transactionId: tx.transactionId,
          type: tx.type,
          source: tx.source,
          amountPaise: txAmountPaise,
          amountINR: txAmountPaise / 100,
          balanceAfterPaise: tx.balanceAfterPaise || 0,
          balanceAfterINR: (tx.balanceAfterPaise || 0) / 100,
          description: tx.description,
          createdAt: tx.createdAt,
          gymId: w.gymId?._id || w.gymId,
          gymName: w.gymId?.name || 'GYMEZY Partner Gym',
          gymLogo,
          referenceRequestId: tx.referenceRequestId || null,
        });
      });

      let gymLocationStr = 'Verified GYMEZY Partner';
      if (typeof w.gymId?.area === 'string' && w.gymId.area.trim()) {
        gymLocationStr = w.gymId.city ? `${w.gymId.area.trim()}, ${w.gymId.city.trim()}` : w.gymId.area.trim();
      } else if (typeof w.gymId?.city === 'string' && w.gymId.city.trim()) {
        gymLocationStr = w.gymId.city.trim();
      } else if (typeof w.gymId?.address === 'string' && w.gymId.address.trim()) {
        gymLocationStr = w.gymId.address.trim();
      } else if (typeof w.gymId?.location === 'string' && w.gymId.location.trim()) {
        gymLocationStr = w.gymId.location.trim();
      }

      return {
        id: String(w._id),
        gymId: w.gymId?._id || w.gymId,
        gymName: w.gymId?.name || 'GYMEZY Partner Gym',
        gymLocation: gymLocationStr,
        gymLogo,
        balancePaise: w.balancePaise || 0,
        balanceINR: (w.balancePaise || 0) / 100,
        currency: w.currency || 'INR',
        transactionsCount: history.length,
        updatedAt: w.updatedAt,
      };
    });

    // Sort all transactions newest first
    allTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const responseData = {
      totalBalancePaise,
      totalBalanceINR: totalBalancePaise / 100,
      totalCreditedINR: totalCreditedPaise / 100,
      totalDebitedINR: totalDebitedPaise / 100,
      walletsCount: formattedWallets.length,
      wallets: formattedWallets,
      transactions: allTransactions,
    };

    return res.status(200).json(ApiResponse.success(responseData, 'Wallet summary retrieved successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * Top Up / Add money to wallet
 * POST /api/v1/wallet/top-up
 */
export const topUpWallet = async (req, res, next) => {
  try {
    const rawUserId = req.user?.userId || req.user?.id || req.user?._id || req.body?.userId;
    const { gymId, amount, paymentMethod = 'UPI', transactionId } = req.body;

    if (!rawUserId) {
      throw ApiError.unauthorized('User must be logged in to top up wallet.');
    }
    const numAmount = Number(amount);
    if (Number.isNaN(numAmount) || numAmount <= 0) {
      throw ApiError.badRequest('Please specify a valid top-up amount greater than 0.');
    }

    // If no gymId provided, attach to primary gym or first available gym
    let targetGymId = gymId;
    if (!targetGymId) {
      const anyGym = await Gym.findOne().select('_id').lean();
      if (!anyGym) throw ApiError.notFound('Gym not found for wallet association.');
      targetGymId = anyGym._id;
    }

    const amountPaise = Math.round(numAmount * 100);
    const txnId = transactionId || `WAL_TOP_${Date.now()}_${crypto.randomInt(100, 999)}`;

    let userWallet = await Wallet.findOne({ userId: rawUserId, gymId: targetGymId });
    if (!userWallet) {
      userWallet = new Wallet({
        userId: rawUserId,
        gymId: targetGymId,
        balancePaise: 0,
        currency: 'INR',
        history: [],
      });
    }

    const newBalancePaise = userWallet.balancePaise + amountPaise;
    userWallet.balancePaise = newBalancePaise;
    userWallet.history.push({
      transactionId: txnId,
      type: 'CREDIT',
      source: 'TOP_UP',
      amountPaise,
      balanceAfterPaise: newBalancePaise,
      description: `Wallet top-up via ${paymentMethod}`,
      createdAt: new Date(),
    });

    await userWallet.save();

    return res.status(200).json(
      ApiResponse.success(
        {
          transactionId: txnId,
          amountINR: numAmount,
          newBalanceINR: newBalancePaise / 100,
          wallet: userWallet,
        },
        'Wallet topped up successfully.'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Request balance withdrawal / refund
 * POST /api/v1/wallet/withdraw
 */
export const withdrawWallet = async (req, res, next) => {
  try {
    const rawUserId = req.user?.userId || req.user?.id || req.user?._id || req.body?.userId;
    const { gymId, amount, upiId, accountDetails, reason } = req.body;

    if (!rawUserId) {
      throw ApiError.unauthorized('User must be logged in to withdraw.');
    }
    const numAmount = Number(amount);
    if (Number.isNaN(numAmount) || numAmount <= 0) {
      throw ApiError.badRequest('Please enter a valid withdrawal amount.');
    }

    const amountPaise = Math.round(numAmount * 100);

    // Find wallet
    const query = gymId ? { userId: rawUserId, gymId } : { userId: rawUserId, balancePaise: { $gte: amountPaise } };
    const userWallet = await Wallet.findOne(query);

    if (!userWallet || userWallet.balancePaise < amountPaise) {
      throw ApiError.badRequest('Insufficient wallet balance for this withdrawal amount.');
    }

    const txnId = `WAL_WTH_${Date.now()}_${crypto.randomInt(100, 999)}`;
    const newBalancePaise = userWallet.balancePaise - amountPaise;
    userWallet.balancePaise = newBalancePaise;

    const destination = upiId ? `UPI (${upiId})` : (accountDetails?.accountNumber ? `Bank Account (•••${accountDetails.accountNumber.slice(-4)})` : 'Primary Account');
    userWallet.history.push({
      transactionId: txnId,
      type: 'DEBIT',
      source: 'WALLET_WITHDRAWAL',
      amountPaise,
      balanceAfterPaise: newBalancePaise,
      description: `Withdrawal request to ${destination}${reason ? ` - ${reason}` : ''}`,
      createdAt: new Date(),
    });

    await userWallet.save();

    return res.status(200).json(
      ApiResponse.success(
        {
          transactionId: txnId,
          amountINR: numAmount,
          newBalanceINR: newBalancePaise / 100,
          destination,
        },
        'Withdrawal request submitted successfully. Funds will be transferred shortly.'
      )
    );
  } catch (error) {
    next(error);
  }
};
