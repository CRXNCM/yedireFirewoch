import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yedire_frewoch',
  port: process.env.DB_PORT || 3306
};

// School data to insert (converted from PostgreSQL to MySQL format)
const schoolData = [
  { school_id: 'mesala_enate', name: 'mesala enate', description: '', region: 'Dire dawa', children_served: 100, created_at: '2025-04-11 20:48:27' },
  { school_id: 'legraher_school', name: 'Legehare School', description: '', region: 'dire dawa', children_served: 100, created_at: '2025-04-11 20:46:49' },
  { school_id: 'mariyam_sefer', name: 'mariyam sefer', description: '', region: 'dire dawa', children_served: 100, created_at: '2025-04-11 21:27:21' },
  { school_id: 'sabiyab_no_3', name: 'sabiyab no 3', description: '', region: 'dire dawa', children_served: 100, created_at: '2025-04-11 21:28:03' },
  { school_id: 'Gende_Ada', name: 'Gende Ada', description: '', region: 'dire dawa', children_served: 100, created_at: '2025-04-11 21:28:42' },
  { school_id: 'goro', name: 'goro', description: '', region: 'dire dawa', children_served: 100, created_at: '2025-04-11 21:29:18' },
  { school_id: 'high_school', name: 'high school', description: '', region: 'dire dawa', children_served: 100, created_at: '2025-04-11 20:45:57' },
  { school_id: 'kezira', name: 'kezira', description: '', region: 'dire dawa', children_served: 100, created_at: '2025-04-11 20:46:19' },
  { school_id: 'medhanialem', name: 'medhanialem', description: '', region: 'dire dawa', children_served: 100, created_at: '2025-04-11 20:47:28' },
  { school_id: 'misrak_jegnoch', name: 'Misrak Jegnoch', description: '', region: 'dire dawa', children_served: 100, created_at: '2025-04-11 20:48:56' },
  { school_id: 'oxaday_school', name: 'oxaday school', description: '', region: 'dire dawa', children_served: 100, created_at: '2025-04-11 20:50:26' },
  { school_id: 'sabiyan_no_1', name: 'Sabiyan no 1', description: '', region: 'dire dawa', children_served: 100, created_at: '2025-04-11 20:51:10' },
  { school_id: 'ye_hetsanat_ken', name: 'ye hetsanat ken', description: '', region: 'dire dawa', children_served: 100, created_at: '2025-04-11 20:51:48' },
  { school_id: 'Melka_jebdu__school', name: 'Melka jebdu elementary school', description: '', region: 'dire dawa', children_served: 100, created_at: '2025-04-11 21:24:50' },
  { school_id: 'Aba_Yohanes', name: 'Aba Yohanes', description: '', region: 'Dira Dawa', children_served: 100, created_at: '2025-04-11 20:36:36' },
  { school_id: 'brhan', name: 'Brhan', description: '', region: '', children_served: 100, created_at: '2025-04-11 20:37:34' },
  { school_id: 'Aftesa', name: 'Aftesa', description: '', region: '', children_served: 100, created_at: '2025-04-11 20:37:09' },
  { school_id: 'Dechatu_hedase', name: 'Dechatu hedase', description: '', region: '', children_served: 100, created_at: '2025-04-11 20:38:12' }
];

async function importSchools() {
  console.log('📥 Importing school data...');
  console.log('📋 Configuration:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port
  });

  let connection;

  try {
    // Connect to database
    console.log('\n🔄 Connecting to MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ MySQL connection successful!');

    // Check if schools table exists
    console.log('\n🔍 Checking if schools table exists...');
    const [tables] = await connection.execute(`
      SELECT COUNT(*) as exists_flag 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'schools'
    `, [dbConfig.database]);

    if (tables[0].exists_flag === 0) {
      console.log('❌ Schools table does not exist. Please run the application first to create the table.');
      return;
    }

    console.log('✅ Schools table exists');

    // Get current count of schools
    const [currentCount] = await connection.execute('SELECT COUNT(*) as count FROM schools');
    console.log(`📊 Current schools in database: ${currentCount[0].count}`);

    // Insert schools data
    console.log('\n🔄 Inserting school data...');
    let insertedCount = 0;
    let skippedCount = 0;

    for (const school of schoolData) {
      try {
        // Use INSERT IGNORE to avoid duplicate key errors
        const [result] = await connection.execute(`
          INSERT IGNORE INTO schools (school_id, name, description, region, children_served, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [school.school_id, school.name, school.description, school.region, school.children_served, school.created_at]);

        if (result.affectedRows > 0) {
          insertedCount++;
          console.log(`   ✅ Inserted: ${school.name}`);
        } else {
          skippedCount++;
          console.log(`   ⏭️  Skipped (already exists): ${school.name}`);
        }
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          skippedCount++;
          console.log(`   ⏭️  Skipped (duplicate): ${school.name}`);
        } else {
          console.log(`   ❌ Error inserting ${school.name}: ${error.message}`);
        }
      }
    }

    console.log(`\n📊 Import Summary:`);
    console.log(`   ✅ Inserted: ${insertedCount} schools`);
    console.log(`   ⏭️  Skipped: ${skippedCount} schools`);
    console.log(`   📋 Total processed: ${insertedCount + skippedCount} schools`);

    // Get new total count
    const [newCount] = await connection.execute('SELECT COUNT(*) as count FROM schools');
    console.log(`📊 Total schools in database after import: ${newCount[0].count}`);

    console.log('\n🎉 School data import completed successfully!');

  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Make sure MySQL is running');
    console.log('   2. Check if database exists');
    console.log('   3. Verify username/password');
    console.log('   4. Ensure schools table exists (run the app first)');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

// Run the import
importSchools().catch(console.error);
