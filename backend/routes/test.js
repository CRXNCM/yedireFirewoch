import express from 'express';
import { pool } from '../utils/database.js';

const router = express.Router();

// Test database connection
router.get('/connection', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Test basic query
    const [rows] = await connection.execute('SELECT 1 as test, NOW() as timestamp');
    
    connection.release();
    
    res.json({
      success: true,
      message: 'MySQL connection successful!',
      data: rows[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'MySQL connection failed',
      error: error.message
    });
  }
});

// Test database tables
router.get('/tables', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Get list of tables
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME, CREATE_TIME, UPDATE_TIME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `, [process.env.DB_NAME || 'yedire_frewoch']);
    
    // Get actual row count for each table
    const tablesWithRowCounts = [];
    for (const table of tables) {
      try {
        const [rowCount] = await connection.execute(`SELECT COUNT(*) as count FROM \`${table.TABLE_NAME}\``);
        tablesWithRowCounts.push({
          ...table,
          actualRows: rowCount[0].count
        });
      } catch (error) {
        tablesWithRowCounts.push({
          ...table,
          actualRows: 'Error',
          error: error.message
        });
      }
    }
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Tables retrieved successfully',
      database: process.env.DB_NAME || 'yedire_frewoch',
      tableCount: tablesWithRowCounts.length,
      tables: tablesWithRowCounts
    });
  } catch (error) {
    console.error('Tables test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tables',
      error: error.message
    });
  }
});

// Test specific table data
router.get('/table/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const connection = await pool.getConnection();
    
    // Get table structure
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'yedire_frewoch', tableName]);
    
    // Get sample data (limit to 5 rows)
    const [rows] = await connection.execute(`
      SELECT * FROM \`${tableName}\` LIMIT 5
    `);
    
    connection.release();
    
    res.json({
      success: true,
      message: `Table ${tableName} information retrieved`,
      tableName,
      columns,
      sampleData: rows,
      rowCount: rows.length
    });
  } catch (error) {
    console.error('Table test error:', error);
    res.status(500).json({
      success: false,
      message: `Failed to retrieve table ${req.params.tableName}`,
      error: error.message
    });
  }
});

// Test database performance
router.get('/performance', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const startTime = Date.now();
    
    // Simple performance test
    const [result] = await connection.execute('SELECT COUNT(*) as total FROM information_schema.TABLES');
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Performance test completed',
      responseTime: `${responseTime}ms`,
      totalTables: result[0].total,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Performance test error:', error);
    res.status(500).json({
      success: false,
      message: 'Performance test failed',
      error: error.message
    });
  }
});

// Test fetching data from specific tables
router.get('/fetch/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    const connection = await pool.getConnection();
    
    // Get table structure first
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'yedire_frewoch', tableName]);
    
    // Get actual data with pagination
    const [rows] = await connection.execute(`
      SELECT * FROM \`${tableName}\` 
      LIMIT ? OFFSET ?
    `, [parseInt(limit), parseInt(offset)]);
    
    // Get total count
    const [countResult] = await connection.execute(`
      SELECT COUNT(*) as total FROM \`${tableName}\`
    `);
    
    connection.release();
    
    res.json({
      success: true,
      message: `Data fetched from ${tableName}`,
      tableName,
      columns: columns.map(col => ({
        name: col.COLUMN_NAME,
        type: col.DATA_TYPE,
        nullable: col.IS_NULLABLE,
        default: col.COLUMN_DEFAULT
      })),
      data: rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: countResult[0].total,
        currentPage: Math.floor(parseInt(offset) / parseInt(limit)) + 1,
        totalPages: Math.ceil(countResult[0].total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Data fetch error:', error);
    res.status(500).json({
      success: false,
      message: `Failed to fetch data from ${req.params.tableName}`,
      error: error.message
    });
  }
});

// Test fetching admin data specifically
router.get('/fetch-admin', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Get admin table data
    const [adminRows] = await connection.execute('SELECT * FROM admin LIMIT 5');
    
    // Get admin table structure
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'admin'
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'yedire_frewoch']);
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Admin data fetched successfully',
      tableName: 'admin',
      columns: columns.map(col => ({
        name: col.COLUMN_NAME,
        type: col.DATA_TYPE,
        nullable: col.IS_NULLABLE,
        default: col.COLUMN_DEFAULT
      })),
      data: adminRows,
      rowCount: adminRows.length
    });
  } catch (error) {
    console.error('Admin fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin data',
      error: error.message
    });
  }
});

// Test fetching users data
router.get('/fetch-users', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Get users table data (limit sensitive info)
    const [userRows] = await connection.execute(`
      SELECT id, username, email, role, created_at, updated_at 
      FROM users 
      LIMIT 10
    `);
    
    // Get users table structure
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'yedire_frewoch']);
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Users data fetched successfully',
      tableName: 'users',
      columns: columns.map(col => ({
        name: col.COLUMN_NAME,
        type: col.DATA_TYPE,
        nullable: col.IS_NULLABLE,
        default: col.COLUMN_DEFAULT
      })),
      data: userRows,
      rowCount: userRows.length
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users data',
      error: error.message
    });
  }
});

// Test fetching schools data
router.get('/fetch-schools', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Get schools table data
    const [schoolRows] = await connection.execute('SELECT * FROM schools LIMIT 10');
    
    // Get schools table structure
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'schools'
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'yedire_frewoch']);
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Schools data fetched successfully',
      tableName: 'schools',
      columns: columns.map(col => ({
        name: col.COLUMN_NAME,
        type: col.DATA_TYPE,
        nullable: col.IS_NULLABLE,
        default: col.COLUMN_DEFAULT
      })),
      data: schoolRows,
      rowCount: schoolRows.length
    });
  } catch (error) {
    console.error('Schools fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schools data',
      error: error.message
    });
  }
});

// Test complex query with JOIN
router.get('/test-join', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Test a more complex query (adjust based on your actual table relationships)
    let query = '';
    let params = [];
    
    // Try to find a relationship between tables
    try {
      // Example: if schools have community_id, try to join with communities
      query = `
        SELECT s.id, s.name as school_name, s.location, 
               c.name as community_name, c.description
        FROM schools s
        LEFT JOIN communities c ON s.community_id = c.id
        LIMIT 5
      `;
      
      const [joinRows] = await connection.execute(query);
      
      res.json({
        success: true,
        message: 'Complex JOIN query successful',
        query: query,
        data: joinRows,
        rowCount: joinRows.length
      });
      
    } catch (joinError) {
      // If JOIN fails, fall back to simple query
      query = 'SELECT * FROM schools LIMIT 3';
      const [simpleRows] = await connection.execute(query);
      
      res.json({
        success: true,
        message: 'Simple query successful (JOIN not available)',
        query: query,
        data: simpleRows,
        rowCount: simpleRows.length,
        note: 'JOIN query failed, showing simple query instead'
      });
    }
    
    connection.release();
    
  } catch (error) {
    console.error('Complex query error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to execute complex query',
      error: error.message
    });
  }
});

// ===== CRUD OPERATIONS TESTING =====

// CREATE - Test inserting data
router.post('/create-test', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Create a test record in a safe way
    const testData = {
      name: `Test Record ${Date.now()}`,
      description: 'This is a test record for CRUD testing',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    // Try to insert into a test table or create a temporary one
    let insertResult;
    
    try {
      // First, try to create a test table if it doesn't exist
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS test_crud (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Insert test data
      const [result] = await connection.execute(`
        INSERT INTO test_crud (name, description, created_at, updated_at) 
        VALUES (?, ?, ?, ?)
      `, [testData.name, testData.description, testData.created_at, testData.updated_at]);
      
      insertResult = result;
      
      // Fetch the inserted data to confirm
      const [insertedRow] = await connection.execute(`
        SELECT * FROM test_crud WHERE id = ?
      `, [result.insertId]);
      
      res.json({
        success: true,
        message: 'Test record created successfully',
        operation: 'CREATE',
        insertedId: result.insertId,
        insertedData: insertedRow[0],
        testData: testData
      });
      
    } catch (tableError) {
      res.status(500).json({
        success: false,
        message: 'Failed to create test table or insert data',
        error: tableError.message
      });
    }
    
    connection.release();
    
  } catch (error) {
    console.error('Create test error:', error);
    res.status(500).json({
      success: false,
      message: 'CREATE operation failed',
      error: error.message
    });
  }
});

// READ - Test reading data (we already have this, but let's enhance it)
router.get('/read-test/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const connection = await pool.getConnection();
    
    // Get table structure
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'yedire_frewoch', tableName]);
    
    // Get sample data
    const [rows] = await connection.execute(`
      SELECT * FROM \`${tableName}\` LIMIT 5
    `);
    
    // Get total count
    const [countResult] = await connection.execute(`
      SELECT COUNT(*) as total FROM \`${tableName}\`
    `);
    
    connection.release();
    
    res.json({
      success: true,
      message: `READ operation successful for ${tableName}`,
      operation: 'READ',
      tableName,
      columns: columns.map(col => ({
        name: col.COLUMN_NAME,
        type: col.DATA_TYPE,
        nullable: col.IS_NULLABLE,
        default: col.COLUMN_DEFAULT
      })),
      data: rows,
      totalRows: countResult[0].total,
      sampleSize: rows.length
    });
    
  } catch (error) {
    console.error('Read test error:', error);
    res.status(500).json({
      success: false,
      message: `READ operation failed for ${req.params.tableName}`,
      error: error.message
    });
  }
});

// UPDATE - Test updating data
router.put('/update-test/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const connection = await pool.getConnection();
    
    // Update the test record
    const [updateResult] = await connection.execute(`
      UPDATE test_crud 
      SET name = ?, description = ?, updated_at = NOW()
      WHERE id = ?
    `, [name || `Updated Record ${Date.now()}`, description || 'This record was updated', id]);
    
    if (updateResult.affectedRows === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'No record found to update',
        operation: 'UPDATE'
      });
    }
    
    // Fetch the updated record to confirm
    const [updatedRow] = await connection.execute(`
      SELECT * FROM test_crud WHERE id = ?
    `, [id]);
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Test record updated successfully',
      operation: 'UPDATE',
      updatedId: id,
      affectedRows: updateResult.affectedRows,
      updatedData: updatedRow[0]
    });
    
  } catch (error) {
    console.error('Update test error:', error);
    res.status(500).json({
      success: false,
      message: 'UPDATE operation failed',
      error: error.message
    });
  }
});

// DELETE - Test deleting data
router.delete('/delete-test/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    // First, get the record before deleting (for confirmation)
    const [recordToDelete] = await connection.execute(`
      SELECT * FROM test_crud WHERE id = ?
    `, [id]);
    
    if (recordToDelete.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'No record found to delete',
        operation: 'DELETE'
      });
    }
    
    // Delete the record
    const [deleteResult] = await connection.execute(`
      DELETE FROM test_crud WHERE id = ?
    `, [id]);
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Test record deleted successfully',
      operation: 'DELETE',
      deletedId: id,
      affectedRows: deleteResult.affectedRows,
      deletedData: recordToDelete[0]
    });
    
  } catch (error) {
    console.error('Delete test error:', error);
    res.status(500).json({
      success: false,
      message: 'DELETE operation failed',
      error: error.message
    });
  }
});

// COMPREHENSIVE CRUD TEST
router.get('/test-all-crud', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    console.log('🔄 Setting up test environment...');
    
    // First, create the test table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS test_crud (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Test table ready');
    
    // Test 1: CREATE
    console.log('🔄 Testing CREATE operation...');
    const [createResult] = await connection.execute(`
      INSERT INTO test_crud (name, description) 
      VALUES (?, ?)
    `, [`CRUD Test ${Date.now()}`, 'Testing all CRUD operations']);
    
    const testId = createResult.insertId;
    console.log('✅ CREATE successful, ID:', testId);
    
    // Test 2: READ
    console.log('🔄 Testing READ operation...');
    const [readResult] = await connection.execute(`
      SELECT * FROM test_crud WHERE id = ?
    `, [testId]);
    console.log('✅ READ successful');
    
    // Test 3: UPDATE
    console.log('🔄 Testing UPDATE operation...');
    const [updateResult] = await connection.execute(`
      UPDATE test_crud 
      SET name = ?, updated_at = NOW()
      WHERE id = ?
    `, [`Updated CRUD Test ${Date.now()}`, testId]);
    console.log('✅ UPDATE successful');
    
    // Test 4: READ after update
    const [readAfterUpdate] = await connection.execute(`
      SELECT * FROM test_crud WHERE id = ?
    `, [testId]);
    
    // Test 5: DELETE
    console.log('🔄 Testing DELETE operation...');
    const [deleteResult] = await connection.execute(`
      DELETE FROM test_crud WHERE id = ?
    `, [testId]);
    console.log('✅ DELETE successful');
    
    connection.release();
    
    res.json({
      success: true,
      message: 'All CRUD operations tested successfully!',
      operations: {
        CREATE: { success: true, insertedId: testId },
        READ: { success: true, data: readResult[0] },
        UPDATE: { success: true, affectedRows: updateResult.affectedRows },
        READ_AFTER_UPDATE: { success: true, data: readAfterUpdate[0] },
        DELETE: { success: true, affectedRows: deleteResult.affectedRows }
      },
      summary: '🎉 MySQL database is fully functional for all CRUD operations!'
    });
    
  } catch (error) {
    console.error('Comprehensive CRUD test error:', error);
    res.status(500).json({
      success: false,
      message: 'Comprehensive CRUD test failed',
      error: error.message
    });
  }
});

export default router;
