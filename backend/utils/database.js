import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yedire_frewoch',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection function
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database connection
const connectDB = async () => {
  try {
    await testConnection();
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('🔄 Closing MySQL connections...');
      await pool.end();
      console.log('✅ MySQL connections closed');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

// Export both pool and connection function
export { pool, connectDB };
export default connectDB;
