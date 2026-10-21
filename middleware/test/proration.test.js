import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ProrationEngine } from '../src/services/proration.service.js';

describe('ProrationEngine Unit Tests', () => {
  // 1. WORKED EXAMPLE 1: UPGRADE Monthly -> Half-Year
  // Monthly: ₹30 / 30 days = ₹1/day. Used 10 days, remaining 20 days.
  // credit = 20 * 1 = ₹20 (2000 paise)
  // Half-year: ₹360 / 180 days = ₹2/day (36000 paise)
  // amount_to_pay = 360 - 20 = ₹340 (34000 paise)
  it('1. UPGRADE: Monthly (₹30 / 30d, used 10d) -> Half-Year (₹360 / 180d)', () => {
    const currentMembership = {
      membershipId: 'MEM001',
      membershipTier: 'Monthly',
      durationDays: 30,
      startDate: new Date('2026-10-01T00:00:00Z'),
      pricing: { basePrice: 30, totalAmount: 30 },
      pauseHistory: [],
    };
    const newPlan = { name: 'Half Yearly', tierId: 'half_yearly', price: 360, durationDays: 180 };
    const switchDate = new Date('2026-10-11T00:00:00Z'); // Exactly 10 calendar days elapsed

    const quote = ProrationEngine.calculateSwitchQuote({
      currentMembership,
      newPlan,
      switchDate,
    });

    assert.strictEqual(quote.switchType, 'UPGRADE');
    assert.strictEqual(quote.currentPlan.daysUsed, 10);
    assert.strictEqual(quote.currentPlan.daysRemaining, 20);
    assert.strictEqual(quote.currentPlan.perDayCostINR, 1);
    assert.strictEqual(quote.financialBreakdown.proRatedCreditPaise, 2000);
    assert.strictEqual(quote.financialBreakdown.proRatedCreditINR, 20);
    assert.strictEqual(quote.financialBreakdown.grossPayablePaise, 34000);
    assert.strictEqual(quote.financialBreakdown.grossPayableINR, 340);
    assert.strictEqual(quote.financialBreakdown.netAmountToPayINR, 340);
    assert.strictEqual(quote.financialBreakdown.leftoverCreditINR, 0);
  });

  // 2. WORKED EXAMPLE 2: DOWNGRADE Half-Year -> Monthly (WALLET Policy)
  // Half-year: ₹360 / 180 days = ₹2/day. Used 40 days, remaining 140 days.
  // credit = 140 * 2 = ₹280 (28000 paise)
  // Monthly price = ₹30 (3000 paise)
  // amount_to_pay = 0, leftover_credit = ₹250 (25000 paise)
  it('2. DOWNGRADE (WALLET): Half-Year (₹360 / 180d, used 40d) -> Monthly (₹30 / 30d)', () => {
    const currentMembership = {
      membershipId: 'MEM002',
      membershipTier: 'Half Yearly',
      durationDays: 180,
      startDate: new Date('2026-06-01T00:00:00Z'),
      pricing: { basePrice: 360, totalAmount: 360 },
      pauseHistory: [],
    };
    const newPlan = { name: 'Monthly', tierId: 'monthly', price: 30, durationDays: 30 };
    const switchDate = new Date('2026-07-11T00:00:00Z'); // Exactly 40 calendar days elapsed

    const quote = ProrationEngine.calculateSwitchQuote({
      currentMembership,
      newPlan,
      gymSettings: { downgradePolicy: 'WALLET' },
      switchDate,
    });

    assert.strictEqual(quote.switchType, 'DOWNGRADE');
    assert.strictEqual(quote.currentPlan.daysUsed, 40);
    assert.strictEqual(quote.currentPlan.daysRemaining, 140);
    assert.strictEqual(quote.currentPlan.perDayCostINR, 2);
    assert.strictEqual(quote.financialBreakdown.proRatedCreditPaise, 28000);
    assert.strictEqual(quote.financialBreakdown.proRatedCreditINR, 280);
    assert.strictEqual(quote.financialBreakdown.grossPayablePaise, 0);
    assert.strictEqual(quote.financialBreakdown.leftoverCreditPaise, 25000);
    assert.strictEqual(quote.financialBreakdown.leftoverCreditINR, 250);
    assert.strictEqual(quote.financialBreakdown.leftoverWalletCreditINR, 250);
    assert.strictEqual(quote.financialBreakdown.leftoverRefundINR, 0);
  });

  // 3. WORKED EXAMPLE 2: DOWNGRADE Half-Year -> Monthly (EXTEND Policy)
  // Leftover ₹250 / ₹1 per day (Monthly ₹30 / 30d) = 250 extra days
  // Effective new duration = 30 + 250 = 280 days
  it('3. DOWNGRADE (EXTEND): Converts leftover ₹250 into extra days on new Monthly plan', () => {
    const currentMembership = {
      membershipId: 'MEM002',
      membershipTier: 'Half Yearly',
      durationDays: 180,
      startDate: new Date('2026-06-01T00:00:00Z'),
      pricing: { basePrice: 360, totalAmount: 360 },
      pauseHistory: [],
    };
    const newPlan = { name: 'Monthly', tierId: 'monthly', price: 30, durationDays: 30 };
    const switchDate = new Date('2026-07-11T00:00:00Z');

    const quote = ProrationEngine.calculateSwitchQuote({
      currentMembership,
      newPlan,
      gymSettings: { downgradePolicy: 'EXTEND' },
      switchDate,
    });

    assert.strictEqual(quote.switchType, 'DOWNGRADE');
    assert.strictEqual(quote.financialBreakdown.grossPayablePaise, 0);
    assert.strictEqual(quote.newPlan.extraDaysAwarded, 250);
    assert.strictEqual(quote.newPlan.effectiveDurationDays, 280);
    assert.strictEqual(quote.financialBreakdown.leftoverWalletCreditPaise, 0);
  });

  // 4. DOWNGRADE (REFUND Policy)
  it('4. DOWNGRADE (REFUND): Leftover ₹250 marked for payment gateway refund', () => {
    const currentMembership = {
      membershipId: 'MEM002',
      membershipTier: 'Half Yearly',
      durationDays: 180,
      startDate: new Date('2026-06-01T00:00:00Z'),
      pricing: { basePrice: 360, totalAmount: 360 },
    };
    const newPlan = { name: 'Monthly', tierId: 'monthly', price: 30, durationDays: 30 };
    const switchDate = new Date('2026-07-11T00:00:00Z');

    const quote = ProrationEngine.calculateSwitchQuote({
      currentMembership,
      newPlan,
      gymSettings: { downgradePolicy: 'REFUND' },
      switchDate,
    });

    assert.strictEqual(quote.financialBreakdown.leftoverRefundINR, 250);
    assert.strictEqual(quote.financialBreakdown.leftoverWalletCreditINR, 0);
  });

  // 5. EDGE CASE: Same-day switch (0 days used -> 100% credit)
  it('5. Same-day switch yields 100% credit', () => {
    const currentMembership = {
      membershipId: 'MEM003',
      membershipTier: 'Monthly',
      durationDays: 30,
      startDate: new Date('2026-10-08T00:00:00Z'),
      pricing: { basePrice: 2000, totalAmount: 2000 },
      pauseHistory: [],
    };
    const newPlan = { name: 'Quarterly', tierId: 'quarterly', price: 5000, durationDays: 90 };
    const switchDate = new Date('2026-10-08T00:00:00Z');

    const quote = ProrationEngine.calculateSwitchQuote({
      currentMembership,
      newPlan,
      switchDate,
    });

    assert.strictEqual(quote.currentPlan.daysUsed, 0);
    assert.strictEqual(quote.currentPlan.daysRemaining, 30);
    assert.strictEqual(quote.financialBreakdown.proRatedCreditINR, 2000);
    assert.strictEqual(quote.financialBreakdown.grossPayableINR, 3000);
  });

  // 6. EDGE CASE: Expired or 0 days remaining plan -> 0 credit
  it('6. Expired plan yields 0 credit and full price payable', () => {
    const currentMembership = {
      membershipId: 'MEM004',
      membershipTier: 'Monthly',
      durationDays: 30,
      startDate: new Date('2026-08-01T00:00:00Z'),
      pricing: { basePrice: 2000, totalAmount: 2000 },
      pauseHistory: [],
    };
    const newPlan = { name: 'Quarterly', tierId: 'quarterly', price: 5000, durationDays: 90 };
    const switchDate = new Date('2026-10-08T00:00:00Z'); // 68 days elapsed (> 30 days)

    const quote = ProrationEngine.calculateSwitchQuote({
      currentMembership,
      newPlan,
      switchDate,
    });

    assert.strictEqual(quote.currentPlan.daysRemaining, 0);
    assert.strictEqual(quote.financialBreakdown.proRatedCreditINR, 0);
    assert.strictEqual(quote.financialBreakdown.grossPayableINR, 5000);
  });

  // 7. EDGE CASE: Paused/Frozen Membership
  it('7. Paused days are excluded from used days count', () => {
    const currentMembership = {
      membershipId: 'MEM005',
      membershipTier: 'Monthly',
      durationDays: 30,
      startDate: new Date('2026-10-01T00:00:00Z'),
      pricing: { basePrice: 3000, totalAmount: 3000 }, // ₹100/day
      pauseHistory: [{ daysPaused: 5 }], // 5 days paused
    };
    const newPlan = { name: 'Quarterly', tierId: 'quarterly', price: 8000, durationDays: 90 };
    const switchDate = new Date('2026-10-16T00:00:00Z'); // 15 calendar days elapsed, active used = 10 days

    const quote = ProrationEngine.calculateSwitchQuote({
      currentMembership,
      newPlan,
      switchDate,
    });

    assert.strictEqual(quote.currentPlan.daysUsed, 10);
    assert.strictEqual(quote.currentPlan.daysRemaining, 20);
    assert.strictEqual(quote.financialBreakdown.proRatedCreditINR, 2000); // 20 days * ₹100 = ₹2000
    assert.strictEqual(quote.financialBreakdown.grossPayableINR, 6000);
  });

  // 8. WALLET CO-PAY: Existing wallet balance applied to gross payable
  it('8. Existing wallet balance reduces net amount to pay', () => {
    const currentMembership = {
      membershipId: 'MEM006',
      membershipTier: 'Monthly',
      durationDays: 30,
      startDate: new Date('2026-10-01T00:00:00Z'),
      pricing: { basePrice: 3000, totalAmount: 3000 },
    };
    const newPlan = { name: 'Annual', tierId: 'annual', price: 15000, durationDays: 365 };
    const switchDate = new Date('2026-10-11T00:00:00Z'); // 10 days used, 20 days remaining (credit = ₹2000)

    const quote = ProrationEngine.calculateSwitchQuote({
      currentMembership,
      newPlan,
      userWalletBalancePaise: 150000, // ₹1500 in wallet
      switchDate,
    });

    assert.strictEqual(quote.financialBreakdown.grossPayableINR, 13000); // 15000 - 2000
    assert.strictEqual(quote.financialBreakdown.walletDeductionINR, 1500); // ₹1500 applied from wallet
    assert.strictEqual(quote.financialBreakdown.netAmountToPayINR, 11500); // ₹11500 to pay
  });
});
