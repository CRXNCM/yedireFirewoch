import express from 'express';
import { generateToken } from '../utils/jwt.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { models } from '../utils/sequelize.js';

const Admin = models.Admin;
const router = express.Router();

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input - accept either username or email
    if ((!username && !email) || !password) {
      return res.status(400).json({
        message: 'Username/email and password are required'
      });
    }

    // Find admin by username or email
    let admin;
    if (username) {
      admin = await Admin.findOne({ 
        where: { username: username.toLowerCase() }
      });
    } else if (email) {
      admin = await Admin.findOne({ 
        where: { email: email.toLowerCase() }
      });
    }

    if (!admin) {
      return res.status(401).json({
        message: 'Invalid username/email or password'
      });
    }

    // Check if account is active
    if (!admin.is_active) {
      return res.status(401).json({
        message: 'Account is deactivated'
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid username/email or password'
      });
    }

    // Update last login
    await admin.update({ last_login: new Date() });

    // Generate JWT token
    const token = generateToken(admin.id);

    // Return admin data (without password) and token
    const adminData = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      last_login: admin.last_login,
      created_at: admin.created_at
    };

    res.json({
      message: 'Login successful',
      token,
      user: adminData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current admin user
// @access  Private (Admin only)
router.get('/me', authenticateAdmin, async (req, res) => {
  try {
    // User is already attached to req by authenticateAdmin middleware
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        last_login: req.user.last_login,
        created_at: req.user.created_at,
        updated_at: req.user.updated_at
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Server error getting user data'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Admin logout
// @access  Private (Admin only)
router.post('/logout', authenticateAdmin, async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // by removing the token. Server-side, we could implement
    // a token blacklist if needed.
    
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      message: 'Server error during logout'
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change admin password
// @access  Private (Admin only)
router.post('/change-password', authenticateAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get admin with password for comparison
    const admin = await Admin.findByPk(req.user.id);

    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      message: 'Server error changing password'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private (Admin only)
router.post('/refresh', authenticateAdmin, async (req, res) => {
  try {
    // Generate new token
    const token = generateToken(req.user.id);

    res.json({
      message: 'Token refreshed successfully',
      token
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      message: 'Server error refreshing token'
    });
  }
});

// @route   GET /api/auth/verify-token
// @desc    Verify JWT token (for frontend compatibility)
// @access  Private (Admin only)
router.get('/verify-token', authenticateAdmin, async (req, res) => {
  try {
    // If we reach here, the token is valid (authenticateAdmin middleware passed)
    res.json({
      valid: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        last_login: req.user.last_login,
        created_at: req.user.created_at,
        updated_at: req.user.updated_at
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      message: 'Server error verifying token'
    });
  }
});

export default router;
