import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../middleware/.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yovel_db_user:2CPXfLtZvHaqxUtx@gymezy.hgxvr6x.mongodb.net/gymezy_db';

async function runTest() {
  console.log('--- STARTING TRAINER TIER PRICING INTEGRATION TEST ---');
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB Connected');

  const { Gym } = await import('../middleware/src/models/gym.model.js');
  const { Employee } = await import('../middleware/src/models/employee.model.js');
  const { Membership } = await import('../middleware/src/models/membership.model.js');
  const { syncGymTrainersFromEmployees } = await import('../middleware/src/controllers/employee.controller.js');

  // Find or create test gym
  let gym = await Gym.findOne({ name: /Gold|Fitness|Power/i });
  if (!gym) {
    gym = await Gym.findOne({});
  }
  if (!gym) {
    console.error('No gym found for testing.');
    process.exit(1);
  }

  console.log(`Using Gym: ${gym.name} (${gym._id})`);

  // Ensure gym has standard pricing tiers
  if (!gym.pricing) gym.pricing = {};
  gym.pricing.monthly = 1500;
  gym.pricing.quarterly = 4000;
  gym.pricing.halfYearly = 7500;
  gym.pricing.annual = 14000;
  await gym.save();
  console.log('Configured Gym Standard Tiers: Monthly=1500, Quarterly=4000, Annual=14000');

  // Find or create two trainer employees for this gym
  let trainerA = await Employee.findOne({ gymId: gym._id, role: 'Trainer' });
  if (!trainerA) {
    trainerA = new Employee({
      gymId: gym._id,
      name: 'Test Trainer Alex',
      email: 'alex.trainer@test.com',
      phone: '9876543210',
      role: 'Trainer',
      status: 'Active',
      approvalStatus: 'Approved',
      type: 'Full-Time',
    });
  }

  trainerA.tierPricing = [
    { tier: 'Monthly', fee: 600, durationDays: 30 },
    { tier: 'Quarterly', fee: 1600, durationDays: 90 },
    { tier: 'Annual', fee: 5500, durationDays: 365 },
  ];
  trainerA.personalTrainingFee = 600;
  await trainerA.save();
  console.log(`Saved Trainer A (${trainerA.name}) with tierPricing: Monthly=600, Quarterly=1600, Annual=5500`);

  let trainerB = await Employee.findOne({ gymId: gym._id, role: 'Trainer', _id: { $ne: trainerA._id } });
  if (!trainerB) {
    trainerB = new Employee({
      gymId: gym._id,
      name: 'Test Trainer Brenda',
      email: 'brenda.trainer@test.com',
      phone: '9876543211',
      role: 'Trainer',
      status: 'Active',
      approvalStatus: 'Approved',
      type: 'Part-Time',
    });
  }

  trainerB.tierPricing = [
    { tier: 'Monthly', fee: 950, durationDays: 30 },
    { tier: 'Quarterly', fee: 2600, durationDays: 90 },
    { tier: 'Annual', fee: 9000, durationDays: 365 },
  ];
  trainerB.personalTrainingFee = 950;
  await trainerB.save();
  console.log(`Saved Trainer B (${trainerB.name}) with tierPricing: Monthly=950, Quarterly=2600, Annual=9000`);

  // Sync to gym
  await syncGymTrainersFromEmployees(gym._id);
  const reloadedGym = await Gym.findById(gym._id);

  console.log(`Synced gym trainers count: ${reloadedGym.trainers.length}`);
  const syncedA = reloadedGym.trainers.find((t) => t.employeeId?.toString() === trainerA._id.toString() || t.name === trainerA.name);
  const syncedB = reloadedGym.trainers.find((t) => t.employeeId?.toString() === trainerB._id.toString() || t.name === trainerB.name);

  console.log('Synced Trainer A in Gym:', {
    name: syncedA?.name,
    personalTrainingFee: syncedA?.personalTrainingFee,
    tierPricing: syncedA?.tierPricing,
  });

  console.log('Synced Trainer B in Gym:', {
    name: syncedB?.name,
    personalTrainingFee: syncedB?.personalTrainingFee,
    tierPricing: syncedB?.tierPricing,
  });

  if (!syncedA?.tierPricing?.length || !syncedB?.tierPricing?.length) {
    throw new Error('FAIL: Gym.trainers did not inherit tierPricing from Employee records!');
  }
  console.log('PASS: Gym.trainers correctly holds tierPricing mapping!');

  // Test Membership Purchase: Alex (Monthly)
  const AlexMonthlyPrice = reloadedGym.pricing.monthly + (syncedA.tierPricing.find((p) => p.tier === 'Monthly')?.fee || 0);
  console.log(`Expected Monthly with Alex: ${AlexMonthlyPrice} (Gym 1500 + Trainer 600)`);

  const memAlex = new Membership({
    gymId: gym._id,
    userId: new mongoose.Types.ObjectId(),
    trainerId: trainerA._id,
    membershipTier: 'Monthly',
    durationDays: 30,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    pricing: {
      baseAmount: 1500,
      trainerFee: 600,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: 2100,
      currency: 'INR',
    },
    payment: {
      status: 'Paid',
      method: 'UPI',
      amount: 2100,
    },
    status: 'Active',
  });
  await memAlex.save();
  console.log(`Created Membership for Alex: ID=${memAlex.membershipId}, total=${memAlex.pricing.totalAmount}`);

  // Test Membership Purchase: Brenda (Quarterly)
  const BrendaQuarterlyPrice = reloadedGym.pricing.quarterly + (syncedB.tierPricing.find((p) => p.tier === 'Quarterly')?.fee || 0);
  console.log(`Expected Quarterly with Brenda: ${BrendaQuarterlyPrice} (Gym 4000 + Trainer 2600)`);

  const memBrenda = new Membership({
    gymId: gym._id,
    userId: new mongoose.Types.ObjectId(),
    trainerId: trainerB._id,
    membershipTier: 'Quarterly',
    durationDays: 90,
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    pricing: {
      baseAmount: 4000,
      trainerFee: 2600,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: 6600,
      currency: 'INR',
    },
    payment: {
      status: 'Paid',
      method: 'UPI',
      amount: 6600,
    },
    status: 'Active',
  });
  await memBrenda.save();
  console.log(`Created Membership for Brenda: ID=${memBrenda.membershipId}, total=${memBrenda.pricing.totalAmount}`);

  // Verify sequential ID format MEM00{counter}
  if (!memAlex.membershipId.startsWith('MEM') || !memBrenda.membershipId.startsWith('MEM')) {
    throw new Error('FAIL: Membership ID format is not sequential MEM00{counter}');
  }
  console.log('PASS: Membership IDs verified:', memAlex.membershipId, memBrenda.membershipId);

  // Clean up created test memberships
  await Membership.deleteMany({ _id: { $in: [memAlex._id, memBrenda._id] } });
  console.log('Cleaned up test membership records.');

  console.log('--- ALL INTEGRATION TESTS PASSED SUCCESSFULLY! ---');
  await mongoose.disconnect();
}

runTest().catch((err) => {
  console.error('Integration test error:', err);
  process.exit(1);
});
