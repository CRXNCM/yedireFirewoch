import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE || '30d',
      issuer: 'my-react-app-backend',
      audience: 'my-react-app-frontend'
    }
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'my-react-app-backend',
      audience: 'my-react-app-frontend'
    });
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Decode JWT token without verification (for debugging)
export const decodeToken = (token) => {
  return jwt.decode(token);
};
