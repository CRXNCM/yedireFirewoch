import { verifyToken } from '../utils/jwt.js';
import { models } from '../utils/sequelize.js';

const Admin = models.Admin;

// Middleware to authenticate and authorize admin users using MySQL
export const authenticateAdmin = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No token provided or invalid format.' 
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Get admin from MySQL database using Sequelize
    const admin = await Admin.findByPk(decoded.userId);
    
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token. Admin not found.' 
      });
    }

    // Add admin to request object
    req.user = admin;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.message === 'Invalid or expired token') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token.' 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Token verification failed.' 
    });
  }
};

// Optional: Middleware for optional authentication (admin might or might not be logged in)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // No token provided, continue without authentication
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return next(); // No token provided, continue without authentication
    }

    // Try to verify token
    const decoded = verifyToken(token);
    const admin = await Admin.findByPk(decoded.userId);
    
    if (admin) {
      req.user = admin;
    }
    
    next();

  } catch (error) {
    // If token verification fails, just continue without authentication
    next();
  }
};
