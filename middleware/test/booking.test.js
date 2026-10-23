import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { Booking, BOOKING_TYPES, BOOKING_STATUS, PAYMENT_METHODS } from '../src/models/booking.model.js';

describe('Booking Model Schema & Validation Tests', () => {
  it('should expose standard constants', () => {
    assert.ok(Array.isArray(BOOKING_TYPES));
    assert.ok(BOOKING_TYPES.includes('SECTION'));
    assert.ok(BOOKING_TYPES.includes('GROUP_CLASS'));
    assert.ok(BOOKING_TYPES.includes('GYM_SESSION'));

    assert.ok(Array.isArray(BOOKING_STATUS));
    assert.ok(BOOKING_STATUS.includes('Upcoming'));
    assert.ok(BOOKING_STATUS.includes('Completed'));
    assert.ok(BOOKING_STATUS.includes('Cancelled'));

    assert.ok(Array.isArray(PAYMENT_METHODS));
    assert.ok(PAYMENT_METHODS.includes('UPI'));
  });

  it('should fail validation if required fields (bookingId, userId, gymId, title) are missing', () => {
    const invalidBooking = new Booking({});
    const error = invalidBooking.validateSync();
    assert.ok(error);
    assert.ok(error.errors.bookingId, 'bookingId is required');
    assert.ok(error.errors.userId, 'userId is required');
    assert.ok(error.errors.gymId, 'gymId is required');
    assert.ok(error.errors.title, 'title is required');
  });

  it('should instantiate a valid Section Booking referencing gymId and sectionId', () => {
    const fakeGymId = new mongoose.Types.ObjectId();
    const fakeUserId = new mongoose.Types.ObjectId();
    const fakeSectionId = new mongoose.Types.ObjectId();

    const validBooking = new Booking({
      bookingId: 'BK-123456-789',
      userId: fakeUserId,
      gymId: fakeGymId,
      sectionId: fakeSectionId,
      bookingType: 'GROUP_CLASS',
      title: 'Group Class: Power Yoga 20 Days',
      category: 'yoga',
      timeSlot: '06:00 AM - 07:00 AM',
      durationDays: 20,
      pricing: {
        subtotal: 1500,
        discount: 0,
        totalAmount: 1500,
        currency: 'INR',
      },
      payment: {
        method: 'UPI',
        status: 'Completed',
        transactionId: 'TXN-998877',
      },
    });

    const error = validBooking.validateSync();
    assert.strictEqual(error, undefined, 'Validation should pass without errors');
    assert.strictEqual(validBooking.bookingType, 'GROUP_CLASS');
    assert.strictEqual(validBooking.pricing.totalAmount, 1500);
    assert.strictEqual(validBooking.status, 'Upcoming');
    assert.strictEqual(validBooking.sectionId.toString(), fakeSectionId.toString());
  });
});
