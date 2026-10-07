import { connectDatabase } from './src/config/db.js';
import { Gym } from './src/models/gym.model.js';
import { Employee } from './src/models/employee.model.js';
import Counter from './src/models/counter.model.js';

async function migrateAllTrainersToEmployees() {
  await connectDatabase();
  console.log('[MIGRATION] Starting migration of embedded trainers to Employee collection (SSOT)...');

  const gyms = await Gym.find({});
  let totalMigrated = 0;

  for (const gym of gyms) {
    if (!Array.isArray(gym.trainers) || gym.trainers.length === 0) {
      continue;
    }

    console.log(`[MIGRATION] Checking gym: ${gym.partnerId} (${gym.name}) with ${gym.trainers.length} embedded trainers...`);

    for (let i = 0; i < gym.trainers.length; i++) {
      const tr = gym.trainers[i];
      if (!tr || !tr.name) continue;

      // Check if employee already exists by name & gym
      const existing = await Employee.findOne({
        $or: [{ gymPartnerId: gym.partnerId }, { gymId: gym._id }],
        name: tr.name.trim(),
        role: 'Trainer',
      });

      if (!existing) {
        // Generate TR### sequence
        const seq = await Counter.getNextSequence(`emp_${gym.partnerId || gym._id}`);
        const employeeId = `TR${String(seq).padStart(3, '0')}`;

        await Employee.create({
          gymId: gym._id,
          gymPartnerId: gym.partnerId || '',
          gymName: gym.name,
          employeeId,
          name: tr.name.trim(),
          role: 'Trainer',
          avatar: tr.imageUrl || '',
          specialty: tr.specialty || 'Certified Fitness Trainer',
          experienceYears: Number(tr.experienceYears) || 2,
          rating: Number(tr.rating) || 4.9,
          reviewsCount: Number(tr.reviewsCount) || 0,
          ratings: Array.isArray(tr.ratings) ? tr.ratings : [],
          status: 'Active',
          attendance: 'Present',
          approvalStatus: 'Approved',
          pendingAction: 'NONE',
          type: 'Full-Time',
          accessType: 'Employee',
          joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          approvedBy: 'System Migration',
          approvedAt: new Date(),
        });

        console.log(`  -> Created Employee record for: ${tr.name} (${employeeId}) in ${gym.name}`);
        totalMigrated++;
      } else {
        // Ensure rating and avatar are synced if missing
        let modified = false;
        if (!existing.avatar && tr.imageUrl) {
          existing.avatar = tr.imageUrl;
          modified = true;
        }
        if (!existing.specialty && tr.specialty) {
          existing.specialty = tr.specialty;
          modified = true;
        }
        if (modified) {
          await existing.save();
        }
      }
    }
  }

  console.log(`[MIGRATION] Complete! Total newly migrated trainers into Employee collection: ${totalMigrated}`);
  process.exit(0);
}

migrateAllTrainersToEmployees().catch((err) => {
  console.error('[MIGRATION] Error:', err);
  process.exit(1);
});
