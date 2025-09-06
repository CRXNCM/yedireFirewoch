import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import cleanupService from '../utils/cleanupService.js';
import imageService from '../utils/imageService.js';

const router = express.Router();

// @route   GET /api/admin/images/stats
// @desc    Get image storage statistics
// @access  Private (Admin only)
router.get('/images/stats', authenticateAdmin, async (req, res) => {
  try {
    const stats = await cleanupService.getStorageStats();
    
    if (stats.error) {
      return res.status(500).json({
        message: 'Error getting storage statistics',
        error: stats.error
      });
    }

    res.json({
      message: 'Storage statistics retrieved successfully',
      stats
    });

  } catch (error) {
    console.error('Get storage stats error:', error);
    res.status(500).json({
      message: 'Server error getting storage statistics'
    });
  }
});

// @route   GET /api/admin/images/validate
// @desc    Validate image references in database
// @access  Private (Admin only)
router.get('/images/validate', authenticateAdmin, async (req, res) => {
  try {
    const validation = await cleanupService.validateImageReferences();
    
    if (validation.error) {
      return res.status(500).json({
        message: 'Error validating image references',
        error: validation.error
      });
    }

    res.json({
      message: 'Image validation completed',
      validation
    });

  } catch (error) {
    console.error('Validate images error:', error);
    res.status(500).json({
      message: 'Server error validating images'
    });
  }
});

// @route   POST /api/admin/images/cleanup
// @desc    Clean up orphaned images
// @access  Private (Admin only)
router.post('/images/cleanup', authenticateAdmin, async (req, res) => {
  try {
    const result = await cleanupService.cleanupOrphanedImages();
    
    if (!result.success) {
      return res.status(500).json({
        message: 'Error during cleanup',
        error: result.error
      });
    }

    res.json({
      message: 'Cleanup completed successfully',
      result
    });

  } catch (error) {
    console.error('Cleanup images error:', error);
    res.status(500).json({
      message: 'Server error during cleanup'
    });
  }
});

// @route   POST /api/admin/images/fix-references
// @desc    Fix orphaned image references in database
// @access  Private (Admin only)
router.post('/images/fix-references', authenticateAdmin, async (req, res) => {
  try {
    const result = await cleanupService.fixOrphanedReferences();
    
    if (!result.success) {
      return res.status(500).json({
        message: 'Error fixing references',
        error: result.error
      });
    }

    res.json({
      message: 'References fixed successfully',
      result
    });

  } catch (error) {
    console.error('Fix references error:', error);
    res.status(500).json({
      message: 'Server error fixing references'
    });
  }
});

// @route   GET /api/admin/images/info/:path(*)
// @desc    Get information about a specific image
// @access  Private (Admin only)
router.get('/images/info/:path(*)', authenticateAdmin, async (req, res) => {
  try {
    const imagePath = req.params.path;
    const info = await imageService.getImageInfo(imagePath);
    
    if (!info) {
      return res.status(404).json({
        message: 'Image not found'
      });
    }

    res.json({
      message: 'Image information retrieved successfully',
      info
    });

  } catch (error) {
    console.error('Get image info error:', error);
    res.status(500).json({
      message: 'Server error getting image information'
    });
  }
});

// @route   DELETE /api/admin/images/:path(*)
// @desc    Delete a specific image
// @access  Private (Admin only)
router.delete('/images/:path(*)', authenticateAdmin, async (req, res) => {
  try {
    const imagePath = req.params.path;
    const deleted = await imageService.deleteImage(imagePath);
    
    if (!deleted) {
      return res.status(404).json({
        message: 'Image not found or could not be deleted'
      });
    }

    res.json({
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      message: 'Server error deleting image'
    });
  }
});

export default router;
