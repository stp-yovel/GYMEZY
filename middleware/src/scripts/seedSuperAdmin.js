import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import { User, USER_ROLES } from '../models/user.model.js';

const seedSuperAdmin = async () => {
  try {
    console.log('[SEED] Connecting to MongoDB...');
    await connectDatabase();

    const adminEmail = 'admin@gymezy.com';

    // Check if Super Admin already exists
    let superAdmin = await User.findOne({ email: adminEmail });

    const superAdminData = {
      fullName: 'Gymezy',
      email: adminEmail,
      phone: '+91 9150955071',
      password: 'SuperAdmin@Gymezy2026!',
      role: USER_ROLES.SUPER_ADMIN,
      address: 'Second Floor, Mahalakshmi Nagar, Plot No 5, Jyothi Nagar, Moulivakkam, Kolathuvancheri, Tamil Nadu 600125',
      isActive: true,
      isVerified: true,
    };

    if (superAdmin) {
      console.log(`[SEED WARN] User with email ${adminEmail} already exists. Updating credentials & role...`);
      superAdmin.fullName = superAdminData.fullName;
      superAdmin.phone = superAdminData.phone;
      superAdmin.password = superAdminData.password;
      superAdmin.role = superAdminData.role;
      superAdmin.address = superAdminData.address;
      superAdmin.isActive = superAdminData.isActive;
      superAdmin.isVerified = superAdminData.isVerified;
      await superAdmin.save();
      console.log('[SEED SUCCESS] Super Admin account updated successfully!');
    } else {
      superAdmin = await User.create(superAdminData);
      console.log('[SEED SUCCESS] Super Admin account created successfully in database!');
    }

    console.log('\n=============================================');
    console.log('GYMEZY SUPER ADMIN CREDENTIALS');
    console.log('=============================================');
    console.log(`Name:     ${superAdmin.fullName}`);
    console.log(`Email:    ${superAdmin.email}`);
    console.log(`Phone:    ${superAdmin.phone}`);
    console.log(`Password: SuperAdmin@Gymezy2026!`);
    console.log(`Role:     ${superAdmin.role}`);
    console.log(`Address:  ${superAdmin.address}`);
    console.log('=============================================\n');

    await mongoose.connection.close();
    console.log('[DATABASE] Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('[SEED ERROR] Error creating Super Admin user:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedSuperAdmin();
