import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import { 
  uploadSingleImage, 
  uploadMultipleImages,
  processUploadedImage, 
  processMultipleImages,
  addImageUrls,
  handleUploadError 
} from '../utils/imageMiddleware.js';

const router = express.Router();

// @route   POST /api/upload/image
// @desc    Upload single image
// @access  Private (Admin only)
router.post('/image', 
  authenticateAdmin, 
  uploadSingleImage('image'),
  processUploadedImage({ 
    prefix: 'image',
    format: 'webp',
    quality: 85
  }),
  addImageUrls('url'),
  (req, res) => {
    try {
      if (!req.processedImage) {
        return res.status(400).json({
          message: 'No file uploaded'
        });
      }

      res.json({
        message: 'File uploaded successfully',
        file: {
          filename: req.processedImage.filename,
          url: req.processedImage.url,
          size: req.processedImage.size,
          originalSize: req.processedImage.originalSize,
          mimetype: req.processedImage.mimetype
        }
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        message: 'Server error during file upload'
      });
    }
  }
);

// @route   POST /api/upload/images
// @desc    Upload multiple images
// @access  Private (Admin only)
router.post('/images', 
  authenticateAdmin, 
  uploadMultipleImages('images', 10),
  processMultipleImages({ 
    prefix: 'image',
    format: 'webp',
    quality: 85
  }),
  (req, res) => {
    try {
      if (!req.processedImages || req.processedImages.length === 0) {
        return res.status(400).json({
          message: 'No files uploaded'
        });
      }

      const files = req.processedImages.map(image => ({
        filename: image.filename,
        url: image.url,
        size: image.size,
        originalSize: image.originalSize,
        mimetype: image.mimetype
      }));

      res.json({
        message: `${files.length} files uploaded successfully`,
        files
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        message: 'Server error during file upload'
      });
    }
  }
);

// @route   POST /api/upload/bank-logo
// @desc    Upload bank logo with specific optimization
// @access  Private (Admin only)
router.post('/bank-logo', 
  authenticateAdmin, 
  uploadSingleImage('logo'),
  processUploadedImage({ 
    prefix: 'bank',
    subdirectory: 'banks',
    width: 300,
    height: 300,
    format: 'webp',
    quality: 90
  }),
  addImageUrls('url'),
  (req, res) => {
    try {
      if (!req.processedImage) {
        return res.status(400).json({
          message: 'No file uploaded'
        });
      }

      res.json({
        message: 'Bank logo uploaded successfully',
        file: {
          filename: req.processedImage.filename,
          url: req.processedImage.url,
          path: req.processedImage.path,
          size: req.processedImage.size,
          originalSize: req.processedImage.originalSize,
          mimetype: req.processedImage.mimetype
        }
      });

    } catch (error) {
      console.error('Bank logo upload error:', error);
      res.status(500).json({
        message: 'Server error during bank logo upload'
      });
    }
  }
);

// @route   POST /api/upload/sponsor-logo
// @desc    Upload sponsor logo with specific optimization
// @access  Private (Admin only)
router.post('/sponsor-logo', 
  authenticateAdmin, 
  uploadSingleImage('logo'),
  processUploadedImage({ 
    prefix: 'sponsor',
    subdirectory: 'sponsors',
    width: 400,
    height: 400,
    format: 'webp',
    quality: 90
  }),
  addImageUrls('url'),
  (req, res) => {
    try {
      if (!req.processedImage) {
        return res.status(400).json({
          message: 'No file uploaded'
        });
      }

      res.json({
        message: 'Sponsor logo uploaded successfully',
        file: {
          filename: req.processedImage.filename,
          url: req.processedImage.url,
          path: req.processedImage.path,
          size: req.processedImage.size,
          originalSize: req.processedImage.originalSize,
          mimetype: req.processedImage.mimetype
        }
      });

    } catch (error) {
      console.error('Sponsor logo upload error:', error);
      res.status(500).json({
        message: 'Server error during sponsor logo upload'
      });
    }
  }
);

// @route   POST /api/upload/gallery
// @desc    Upload gallery images with specific optimization
// @access  Private (Admin only)
router.post('/gallery', 
  authenticateAdmin, 
  uploadMultipleImages('images', 20),
  processMultipleImages({ 
    prefix: 'gallery',
    subdirectory: 'gallery',
    width: 1200,
    height: 800,
    format: 'webp',
    quality: 85
  }),
  (req, res) => {
    try {
      if (!req.processedImages || req.processedImages.length === 0) {
        return res.status(400).json({
          message: 'No files uploaded'
        });
      }

      const files = req.processedImages.map(image => ({
        filename: image.filename,
        url: image.url,
        path: image.path,
        size: image.size,
        originalSize: image.originalSize,
        mimetype: image.mimetype
      }));

      res.json({
        message: `${files.length} gallery images uploaded successfully`,
        files
      });

    } catch (error) {
      console.error('Gallery upload error:', error);
      res.status(500).json({
        message: 'Server error during gallery upload'
      });
    }
  }
);

// Error handling middleware
router.use(handleUploadError);

export default router;
