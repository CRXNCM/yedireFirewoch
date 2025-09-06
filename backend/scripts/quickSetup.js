// Quick setup script for testing with MySQL - Admin model
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const quickSetup = async () => {
  try {
    console.log('🔧 Quick Admin Setup for Testing');
    console.log('==================================');
    
    // Connect to database and sync
    await Admin.sequelize.authenticate();
    console.log('✅ Connected to MySQL database');
    
    // Sync the Admin model
    await Admin.sync({ force: true });
    console.log('🗑️  Cleared existing admin users');

    // Create admin user
    const admin = await Admin.create({
      username: 'yoni',
      password: 'yoni123'
    });

    console.log('✅ Admin user created!');
    console.log('');
    console.log('📋 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('');
    console.log('🎉 Ready to test with Postman!');
    
  } catch (error) {
    console.error('❌ Setup error:', error.message);
    console.error(error.stack);
  } finally {
    await Admin.sequelize.close();
    process.exit(0);
  }
};

quickSetup();
