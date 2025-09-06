import mongoose from 'mongoose';
import readline from 'readline';
import dotenv from 'dotenv';
import User from '../models/User.js';

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
    console.log('🔧 Admin Setup Script');
    console.log('===================');
    console.log('');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({});
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Name: ${existingAdmin.name}`);
      console.log('');
      
      const overwrite = await askQuestion('Do you want to overwrite the existing admin? (yes/no): ');
      if (overwrite.toLowerCase() !== 'yes' && overwrite.toLowerCase() !== 'y') {
        console.log('❌ Setup cancelled.');
        process.exit(0);
      }
      
      // Delete existing admin
      await User.deleteOne({ _id: existingAdmin._id });
      console.log('🗑️  Existing admin deleted.');
    }

    console.log('');
    console.log('📝 Create New Admin User:');
    console.log('');

    // Get admin details
    const name = await askQuestion('👤 Admin Name: ');
    if (!name) {
      console.log('❌ Name is required!');
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
    const admin = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin'
    });

    await admin.save();
    
    console.log('');
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📋 Admin Details:');
    console.log(`   👤 Name: ${admin.name}`);
    console.log(`   📧 Email: ${admin.email}`);
    console.log(`   🔑 Role: ${admin.role}`);
    console.log(`   📅 Created: ${admin.createdAt}`);
    console.log('');
    console.log('🎉 You can now login to the admin panel with these credentials!');
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    if (error.code === 11000) {
      console.error('   Email already exists in database!');
    }
  } finally {
    rl.close();
    mongoose.connection.close();
    process.exit(0);
  }
};

// Handle script interruption
process.on('SIGINT', () => {
  console.log('\n❌ Setup cancelled.');
  rl.close();
  mongoose.connection.close();
  process.exit(0);
});

// Run the setup
setupAdmin();
