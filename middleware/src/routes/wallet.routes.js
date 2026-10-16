import { Router } from 'express';
import {
  getMyWallet,
  topUpWallet,
  withdrawWallet,
} from '../controllers/wallet.controller.js';
import { optionalAuthenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Get logged-in user wallet balance & transaction ledger
router.get('/my', optionalAuthenticate, getMyWallet);

// Top-up wallet balance
router.post('/top-up', optionalAuthenticate, topUpWallet);

// Request wallet balance withdrawal / refund
router.post('/withdraw', optionalAuthenticate, withdrawWallet);

export default router;
