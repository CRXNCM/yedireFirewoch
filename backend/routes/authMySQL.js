import express from 'express';
import { generateToken } from '../utils/jwt.js';
import { authenticateAdmin } from '../middleware/authMySQL.js';
import { models } from '../utils/sequelize.js';

const Admin = models.Admin;

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Admin login using MySQL
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find admin by username
    const admin = await Admin.findByUsername(username);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token using admin ID
    const token = generateToken(admin.id);

    // Return admin data (without password) and token
    const adminData = admin.toSafeObject();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: adminData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current admin user
// @access  Private (Admin only)
router.get('/me', authenticateAdmin, async (req, res) => {
  try {
    // Admin is already attached to req by authenticateAdmin middleware
    res.json({
      success: true,
      user: req.user.toSafeObject()
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user data'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout admin (client-side token removal)
// @access  Private (Admin only)
router.post('/logout', authenticateAdmin, (req, res) => {
  // With JWT, logout is primarily client-side (removing token)
  // We can add token blacklisting here if needed in the future
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// @route   PUT /api/auth/change-password
// @desc    Change admin password
// @access  Private (Admin only)
router.put('/change-password', authenticateAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All password fields are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get current admin from database
    const admin = await Admin.findByPk(req.user.id);

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
});

// @route   GET /api/auth/verify-token
// @desc    Verify if token is valid
// @access  Private (Admin only)
router.get('/verify-token', authenticateAdmin, (req, res) => {
  // If we reach here, token is valid (middleware passed)
  res.json({
    valid: true,
    user: req.user.toSafeObject()
  });
});

// @route   POST /api/auth/create-admin
// @desc    Create a new admin user (for development/testing)
// @access  Public (remove this in production)
router.post('/create-admin', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findByUsername(username);
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this username already exists'
      });
    }

    // Create new admin with proper password hashing
    const newAdmin = await Admin.createNewAdmin(username, password);

    res.json({
      success: true,
      message: 'Admin created successfully',
      admin: newAdmin.toSafeObject()
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating admin'
    });
  }
});

export default router;
