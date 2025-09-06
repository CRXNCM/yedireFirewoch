import imageService from './utils/imageService.js';
import cleanupService from './utils/cleanupService.js';

console.log('🧪 Testing Enhanced Image System...\n');

// Test 1: Image Service Configuration
console.log('1. Testing Image Service Configuration:');
console.log(`   - Upload Directory: ${imageService.uploadDir}`);
console.log(`   - Max File Size: ${imageService.maxFileSize / (1024 * 1024)}MB`);
console.log(`   - Allowed Mimes: ${imageService.allowedMimes.join(', ')}`);
console.log(`   - Quality: ${imageService.quality}%`);
console.log(`   - Max Dimensions: ${imageService.maxWidth}x${imageService.maxHeight}\n`);

// Test 2: Filename Generation
console.log('2. Testing Filename Generation:');
const testFilename = imageService.generateFilename('test-image.jpg', 'test');
console.log(`   - Generated: ${testFilename}\n`);

// Test 3: URL Conversion
console.log('3. Testing URL Conversion:');
const mockReq = {
  protocol: 'http',
  get: () => 'localhost:5000'
};

const relativeUrl = '/uploads/banks/test-image.jpg';
const absoluteUrl = imageService.convertToAbsoluteUrl(relativeUrl, mockReq);
console.log(`   - Relative: ${relativeUrl}`);
console.log(`   - Absolute: ${absoluteUrl}\n`);

// Test 4: File Validation
console.log('4. Testing File Validation:');
const mockFile = {
  size: 1024 * 1024, // 1MB
  mimetype: 'image/jpeg'
};

try {
  imageService.validateImage(mockFile);
  console.log('   ✅ Valid file passed validation');
} catch (error) {
  console.log(`   ❌ Validation failed: ${error.message}`);
}

const invalidFile = {
  size: 10 * 1024 * 1024, // 10MB (too large)
  mimetype: 'image/jpeg'
};

try {
  imageService.validateImage(invalidFile);
  console.log('   ❌ Invalid file should have failed validation');
} catch (error) {
  console.log(`   ✅ Invalid file correctly rejected: ${error.message}`);
}

console.log('\n5. Testing Cleanup Service:');
try {
  const stats = await cleanupService.getStorageStats();
  console.log('   ✅ Storage stats retrieved successfully');
  console.log(`   - Total Images: ${stats.totalImages || 0}`);
  console.log(`   - Total Size: ${stats.totalSizeFormatted || '0 B'}`);
} catch (error) {
  console.log(`   ❌ Storage stats failed: ${error.message}`);
}

console.log('\n🎉 Image System Test Complete!');
console.log('\n📋 Next Steps:');
console.log('1. Start the server: npm run dev');
console.log('2. Test image upload via API endpoints');
console.log('3. Check admin endpoints for management features');
console.log('4. Verify frontend components are using new utilities');
