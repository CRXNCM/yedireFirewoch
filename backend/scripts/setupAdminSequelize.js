import readline from 'readline';
import dotenv from 'dotenv';
import { sequelize, models } from '../utils/sequelize.js';

const Admin = models.Admin;

// Load environment variables
dotenv.config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Utility function to ask questions
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

// Utility function to ask for password (hidden input)
const askPassword = (question) => {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    
    let password = '';
    process.stdin.on('data', (char) => {
      char = char.toString();
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004': // Ctrl-D
          process.stdin.setRawMode(false);
          process.stdin.pause();
          console.log(''); // New line
          resolve(password);
          break;
        case '\u0003': // Ctrl-C
          process.exit();
          break;
        case '\u007f': // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
};

const setupAdmin = async () => {
  try {
    console.log('🔧 Admin Setup Script (Sequelize)');
    console.log('=================================');
    console.log('');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Sync models
    await sequelize.sync();
    console.log('✅ Database models synchronized');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`👤 Username: ${existingAdmin.username}`);
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log('');
      
      const overwrite = await askQuestion('Do you want to overwrite the existing admin? (yes/no): ');
      if (overwrite.toLowerCase() !== 'yes' && overwrite.toLowerCase() !== 'y') {
        console.log('❌ Setup cancelled.');
        process.exit(0);
      }
      
      // Delete existing admin
      await existingAdmin.destroy();
      console.log('🗑️  Existing admin deleted.');
    }

    console.log('');
    console.log('📝 Create New Admin User:');
    console.log('');

    // Get admin details
    const username = await askQuestion('👤 Admin Username: ');
    if (!username) {
      console.log('❌ Username is required!');
      process.exit(1);
    }

    const email = await askQuestion('📧 Admin Email: ');
    if (!email) {
      console.log('❌ Email is required!');
      process.exit(1);
    }

    const password = await askPassword('🔒 Admin Password: ');
    if (!password || password.length < 6) {
      console.log('❌ Password must be at least 6 characters long!');
      process.exit(1);
    }

    const confirmPassword = await askPassword('🔒 Confirm Password: ');
    if (password !== confirmPassword) {
      console.log('❌ Passwords do not match!');
      process.exit(1);
    }

    // Create admin user
    const admin = await Admin.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role: 'admin',
      is_active: true
    });
    
    console.log('');
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📋 Admin Details:');
    console.log(`   👤 Username: ${admin.username}`);
    console.log(`   📧 Email: ${admin.email}`);
    console.log(`   🔑 Role: ${admin.role}`);
    console.log(`   📅 Created: ${admin.created_at}`);
    console.log('');
    console.log('🎉 You can now login to the admin panel with these credentials!');
    console.log('');
    console.log('💡 Test credentials for quick login:');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Password: ${password}`);
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('   Username or email already exists in database!');
    }
  } finally {
    rl.close();
    await sequelize.close();
    process.exit(0);
  }
};

// Handle script interruption
process.on('SIGINT', () => {
  console.log('\n❌ Setup cancelled.');
  rl.close();
  sequelize.close();
  process.exit(0);
});

// Run the setup
setupAdmin();
