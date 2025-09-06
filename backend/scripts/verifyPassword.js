import bcryptjs from 'bcryptjs';

// Your existing password hash from the database
const existingHash = '$2y$10$uKrjAsCWYPV.S6XZnLbz0.HKUVm4KlbV9olM1VZ7Yk1W0IWwTMEHO';

// Test different possible passwords
const testPasswords = ['admin', 'admin123', 'password', '123456'];

console.log('🔍 Testing password compatibility...\n');

for (const password of testPasswords) {
  try {
    // Note: Your hash uses $2y$ which is PHP's bcrypt format
    // bcryptjs can read it, but we need to replace $2y$ with $2a$ for compatibility
    const jsCompatibleHash = existingHash.replace('$2y$', '$2a$');
    
    const isMatch = await bcryptjs.compare(password, jsCompatibleHash);
    console.log(`Password: "${password}" -> ${isMatch ? '✅ MATCH' : '❌ No match'}`);
    
    if (isMatch) {
      console.log(`\n🎉 Found matching password: "${password}"`);
      console.log('You can use this password to login to the admin panel.\n');
    }
  } catch (error) {
    console.log(`Password: "${password}" -> ❌ Error: ${error.message}`);
  }
}

console.log('\n📋 Next Steps:');
console.log('1. Use the matching password above to login');
console.log('2. Or create a new admin account using the createAdmin script');
console.log('3. Test login at: http://localhost:5000/api/auth/login');
