import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { Section, SECTION_CATEGORIES, DAYS_OF_WEEK } from '../src/models/section.model.js';

describe('Section Model Schema & Validation Tests', () => {
  it('should expose standard SECTION_CATEGORIES and DAYS_OF_WEEK', () => {
    assert.ok(Array.isArray(SECTION_CATEGORIES));
    assert.ok(SECTION_CATEGORIES.includes('yoga'));
    assert.ok(SECTION_CATEGORIES.includes('gym'));
    assert.ok(SECTION_CATEGORIES.includes('zumba'));

    assert.ok(Array.isArray(DAYS_OF_WEEK));
    assert.strictEqual(DAYS_OF_WEEK.length, 7);
    assert.deepStrictEqual(DAYS_OF_WEEK, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });

  it('should fail validation if gymId or trainerId is missing (strict ID requirement)', () => {
    const invalidSection = new Section({
      title: 'Basic Yoga 20 Days',
      category: 'yoga',
      cost: 1500,
      startDate: new Date(),
      startTime: '06:00 AM',
      endTime: '07:00 AM',
    });

    const error = invalidSection.validateSync();
    assert.ok(error);
    assert.ok(error.errors.gymId, 'gymId is required');
    assert.ok(error.errors.trainerId, 'trainerId is required');
  });

  it('should instantiate a valid Section referencing gymId and trainerId by ObjectId', () => {
    const fakeGymId = new mongoose.Types.ObjectId();
    const fakeTrainerId = new mongoose.Types.ObjectId();

    const validSection = new Section({
      gymId: fakeGymId,
      trainerId: fakeTrainerId,
      title: 'Basic Yoga 20 Days',
      category: 'yoga',
      cost: 1500,
      startDate: new Date('2026-11-01'),
      durationDays: 20,
      startTime: '06:00 AM',
      endTime: '07:00 AM',
      activeDays: ['Mon', 'Wed', 'Fri'],
      maxCapacity: 25,
      description: 'Introductory 20-day yoga program covering postures and breathing.',
    });

    const error = validSection.validateSync();
    assert.strictEqual(error, undefined, 'Validation should pass without errors');
    assert.strictEqual(validSection.gymId.toString(), fakeGymId.toString());
    assert.strictEqual(validSection.trainerId.toString(), fakeTrainerId.toString());
    assert.strictEqual(validSection.cost, 1500);
    assert.strictEqual(validSection.durationDays, 20);
    assert.deepStrictEqual(validSection.activeDays, ['Mon', 'Wed', 'Fri']);
    assert.strictEqual(validSection.isActive, true);
  });
});
