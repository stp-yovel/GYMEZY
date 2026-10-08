import 'dotenv/config';
import mongoose from 'mongoose';
import { Membership } from '../src/models/membership.model.js';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const now = new Date();

  const nonActiveFilter = {
    $or: [
      { status: { $ne: 'Active' } },
      { startDate: { $gt: now } },
      { endDate: { $lt: now } },
    ],
    entryOtp: { $ne: null },
  };

  const toClean = await Membership.find(nonActiveFilter).select('membershipId status startDate endDate entryOtp').lean();
  console.log('Memberships to clear entryOtp for:', toClean);

  const res = await Membership.updateMany(nonActiveFilter, { $set: { entryOtp: null } });
  console.log('Cleared entryOtp count:', res.modifiedCount);

  const mem009 = await Membership.findOne({ membershipId: 'MEM009' }).lean();
  console.log('MEM009 after cleanup:', {
    membershipId: mem009?.membershipId,
    status: mem009?.status,
    startDate: mem009?.startDate,
    entryOtp: mem009?.entryOtp,
  });

  await mongoose.disconnect();
}

main().catch(console.error);
