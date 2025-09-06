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

// Data to insert for each table (converted from PostgreSQL to MySQL format)
const tableData = {
  schools: [
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
  ],

  communities: [
    { id: 4, name: 'Somali Community', region: 'Dire Dawa', description: 'The Somali community places growing importance on education in Dire Dawa, especially in recent years. Many Somali families prioritize sending their children to private Islamic schools as well as public institutions. Somali students are visible in secondary schools, universities, and technical colleges across the city. There is also a strong network of community-led tutoring centers and madrassas that focus on both religious and academic education.', created_at: '2025-04-12 08:06:02' },
    { id: 5, name: 'Oromo Community ', region: 'dire dawa', description: 'Oromo students in Dire Dawa are active across all levels of the education system—from elementary schools to universities. The community has been advocating for Afaan Oromo to be used more widely in schools, supporting the preservation of language and culture. Many Oromo families encourage their children to pursue education as a path to leadership and public service, and it\'s common to see Oromo youth excelling in both academic and athletic programs.', created_at: '2025-04-12 08:06:26' },
    { id: 6, name: 'Amhara Community', region: 'Dire Dawa', description: 'The Amhara community has a long-standing tradition of valuing formal education. In Dire Dawa, many Amhara parents are involved in their children\'s schooling, with strong representation in both public and private schools. A good number of school administrators, teachers, and university lecturers in Dire Dawa are from the Amhara community, contributing significantly to the region\'s academic development.', created_at: '2025-04-12 08:06:56' },
    { id: 7, name: 'Harari Community', region: 'Dire Dawa', description: 'Education is a central value in the Harari community. Despite being smaller in population, Harari families often prioritize quality education, especially in subjects like history, culture, and religious studies. Harari youth are active in higher education, often focusing on law, business, and social sciences. The community also supports heritage preservation through schools that teach the Harari language and history', created_at: '2025-04-12 08:07:32' }
  ],

  bank_info: [
    { id: 1, bank_name: 'ebirr', account_name: 'ye dire firewoch', account_number: '0912345678', routing_number: null, swift_code: null, bank_address: null, bank_image: null, is_active: true, last_updated: '2025-08-14 08:03:26', payment_link: null },
    { id: 4, bank_name: 'Berhan Bank', account_name: 'Ye Dire Firewoch Charity Organization (YDFCO)', account_number: '1000346915420', routing_number: null, swift_code: 'BERHETAA', bank_address: 'Dire Dawa Branch', bank_image: 'https://ryufuhcepxhndkfnhxlu.supabase.co/storage/v1/object/public/images/https://ryufuhcepxhndkfnhxlu.supabase.co/storage/v1/object/public/images/https://ryufuhcepxhndkfnhxlu.supabase.co/storage/v1/object/public/images/banks/birhan-logo.png', is_active: true, last_updated: '2025-08-14 06:49:06', payment_link: null },
    { id: 5, bank_name: 'CBE', account_name: 'Ye Dire Firewoch Charity Organization (YDFCO)', account_number: '1000300098553', routing_number: '', swift_code: 'CBETETAA', bank_address: 'Dire Dawa Branch', bank_image: 'banks/cbe.png', is_active: true, last_updated: '2025-04-12 04:45:50', payment_link: null }
  ],

  social_links: [
    { id: 3, platform: 'Telegram', url: 'https://t.me/Wesenbiratu', icon_class: 'fa-telegram', display_order: 2, is_active: true, date_added: '2025-04-12 00:02:47', last_updated: '2025-04-12 00:02:47' },
    { id: 4, platform: 'Tiktok', url: 'https://www.tiktok.com/@wesen.biratu?', icon_class: 'fa-tiktok', display_order: 3, is_active: true, date_added: '2025-04-12 00:04:18', last_updated: '2025-04-12 00:04:18' },
    { id: 5, platform: 'Youtube', url: 'https://www.youtube.com/@%E1%8B%A8%E1%8B%B5%E1%88%AC%E1%8D%8D%E1%88%AC%E1%8B%8E%E1%89%BD%E1%89%A0%E1%8C%8E%E1%8A%A0%E1%8B%B5%E1%88%AB%E1%89%B5', icon_class: 'fa-youtube', display_order: 1, is_active: true, date_added: '2025-04-12 00:05:07', last_updated: '2025-04-12 00:05:07' }
  ],

  volunteers: [
    { id: 2, name: 'MM Hotel', email: 'mmhoteldiredawa@gmail.com', phone: '025-411-44-44', join_date: '2025-04-12 08:10:02' },
    { id: 3, name: 'Watch & Pray', email: 'Watchandpray@gmail.com', phone: '+251123456789', join_date: '2025-04-12 08:10:53' },
    { id: 4, name: 'yemariyam worke Hospital', email: 'yemariyamworkeHospital@gmail.com', phone: '0912345678', join_date: '2025-04-12 08:11:39' }
  ]
};

async function importAllData() {
  console.log('📥 Importing all data...');
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

    // Import data for each table
    for (const [tableName, data] of Object.entries(tableData)) {
      console.log(`\n📊 Processing ${tableName} table...`);
      
      // Check if table exists
      const [tables] = await connection.execute(`
        SELECT COUNT(*) as exists_flag 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      `, [dbConfig.database, tableName]);

      if (tables[0].exists_flag === 0) {
        console.log(`❌ ${tableName} table does not exist. Skipping...`);
        continue;
      }

      // Get current count
      const [currentCount] = await connection.execute(`SELECT COUNT(*) as count FROM \`${tableName}\``);
      console.log(`   Current records: ${currentCount[0].count}`);

      // Insert data
      let insertedCount = 0;
      let skippedCount = 0;

      for (const record of data) {
        try {
          const columns = Object.keys(record).join(', ');
          const placeholders = Object.keys(record).map(() => '?').join(', ');
          const values = Object.values(record);

          const [result] = await connection.execute(`
            INSERT IGNORE INTO \`${tableName}\` (${columns})
            VALUES (${placeholders})
          `, values);

          if (result.affectedRows > 0) {
            insertedCount++;
          } else {
            skippedCount++;
          }
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            skippedCount++;
          } else {
            console.log(`   ❌ Error inserting record: ${error.message}`);
          }
        }
      }

      console.log(`   ✅ Inserted: ${insertedCount} records`);
      console.log(`   ⏭️  Skipped: ${skippedCount} records`);

      // Get new total count
      const [newCount] = await connection.execute(`SELECT COUNT(*) as count FROM \`${tableName}\``);
      console.log(`   Total records after import: ${newCount[0].count}`);
    }

    console.log('\n🎉 All data import completed successfully!');

  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Make sure MySQL is running');
    console.log('   2. Check if database exists');
    console.log('   3. Verify username/password');
    console.log('   4. Ensure tables exist (run the app first)');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

// Run the import
importAllData().catch(console.error);
