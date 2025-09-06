import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import banksRoutes from './routes/banks.js';
import sponsorsRoutes from './routes/sponsors.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';
import schoolsRoutes from './routes/schools.js';
import schoolImagesRoutes from './routes/schoolImages.js';
import alertsRoutes from './routes/alerts.js';
import communitiesRoutes from './routes/communities.js';
import socialLinksRoutes from './routes/socialLinks.js';
import testimonialsRoutes from './routes/testimonials.js';
import urgentMessagesRoutes from './routes/urgentMessages.js';
import volunteersRoutes from './routes/volunteers.js';

// Import database connection
import { sequelize } from './utils/sequelize.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/banks', banksRoutes);
app.use('/api/sponsors', sponsorsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/schools', schoolsRoutes);
app.use('/api/school-images', schoolImagesRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/communities', communitiesRoutes);
app.use('/api/social-links', socialLinksRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/urgent-messages', urgentMessagesRoutes);
app.use('/api/volunteers', volunteersRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  res.json({
    message: 'CORS is working correctly',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.errors
    });
  }
  
  if (error.name === 'MulterError') {
    return res.status(400).json({
      message: 'File upload error',
      error: error.message
    });
  }
  
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Optional: Model sync (disabled alter to avoid excessive schema/index changes)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Database models sync completed (alter disabled).');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📁 Upload directory: ${path.join(__dirname, 'uploads')}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer();
