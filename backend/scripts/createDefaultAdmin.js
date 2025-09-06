import dotenv from 'dotenv';
import { sequelize, models } from '../utils/sequelize.js';

const Admin = models.Admin;

// Load environment variables
dotenv.config();

const createDefaultAdmin = async () => {
  try {
    console.log('🔧 Creating Default Admin Account');
    console.log('=================================');
    console.log('');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Sync models
    await sequelize.sync();
    console.log('✅ Database models synchronized');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      console.log('⚠️  Default admin already exists!');
      console.log(`👤 Username: ${existingAdmin.username}`);
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log('');
      console.log('💡 You can login with:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      return;
    }

    // Create default admin
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@yedirefirewoch.org',
      password: 'admin123',
      role: 'admin',
      is_active: true
    });
    
    console.log('✅ Default admin created successfully!');
    console.log('');
    console.log('📋 Admin Details:');
    console.log(`   👤 Username: ${admin.username}`);
    console.log(`   📧 Email: ${admin.email}`);
    console.log(`   🔑 Role: ${admin.role}`);
    console.log(`   📅 Created: ${admin.created_at}`);
    console.log('');
    console.log('🎉 You can now login to the admin panel with:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('');
    console.log('⚠️  Remember to change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('   Username or email already exists in database!');
    }
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

// Run the setup
createDefaultAdmin();
