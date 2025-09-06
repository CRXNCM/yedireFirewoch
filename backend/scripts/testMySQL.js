import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yedire_frewoch',
  port: process.env.DB_PORT || 3306
};

async function testMySQLConnection() {
  console.log('🔍 Testing MySQL Connection...');
  console.log('📋 Configuration:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port
  });
  
  let connection;
  
  try {
    // Test connection
    console.log('\n🔄 Attempting to connect...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ MySQL connection successful!');
    
    // Test basic query
    console.log('\n🔄 Testing basic query...');
    const [rows] = await connection.execute('SELECT 1 as test, NOW() as timestamp');
    console.log('✅ Basic query successful:', rows[0]);
    
    // Test database selection
    console.log('\n🔄 Testing database selection...');
    const [dbRows] = await connection.execute('SELECT DATABASE() as current_db');
    console.log('✅ Current database:', dbRows[0].current_db);
    
    // Get table count
    console.log('\n🔄 Getting table information...');
    const [tables] = await connection.execute(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
    `, [dbConfig.database]);
    console.log('✅ Total tables in database:', tables[0].table_count);
    
    // Get list of tables with actual row counts
    const [tableList] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `, [dbConfig.database]);
    
    console.log('\n📊 Tables in database with actual row counts:');
    
    // Get actual row count for each table
    for (const table of tableList) {
      try {
        const [rowCount] = await connection.execute(`SELECT COUNT(*) as count FROM \`${table.TABLE_NAME}\``);
        console.log(`   - ${table.TABLE_NAME}: ${rowCount[0].count} rows`);
      } catch (error) {
        console.log(`   - ${table.TABLE_NAME}: Error getting row count - ${error.message}`);
      }
    }
    
    // Test performance
    console.log('\n🔄 Testing performance...');
    const startTime = Date.now();
    await connection.execute('SELECT 1');
    const endTime = Date.now();
    console.log(`✅ Query response time: ${endTime - startTime}ms`);
    
    console.log('\n🎉 All MySQL tests passed successfully!');
    console.log('💡 Your MySQL connection is working perfectly.');
    
  } catch (error) {
    console.error('\n❌ MySQL connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Make sure XAMPP is running');
    console.log('   2. Check if MySQL service is started');
    console.log('   3. Verify database name exists');
    console.log('   4. Check username/password');
    console.log('   5. Ensure port 3306 is not blocked');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🚨 Connection refused - MySQL service might not be running');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n🚨 Access denied - Check username/password');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n🚨 Database does not exist - Create the database first');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

// Run the test
testMySQLConnection().catch(console.error);
