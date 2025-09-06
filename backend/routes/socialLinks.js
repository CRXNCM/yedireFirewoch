import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import { models } from '../utils/sequelize.js';

const SocialLink = models.SocialLink;
const router = express.Router();

// @route   GET /api/social-links
// @desc    Get all social links
// @access  Private (Admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const socialLinks = await SocialLink.findAll({
      order: [['display_order', 'ASC']]
    });
    res.json({
      socialLinks,
      count: socialLinks.length
    });
  } catch (error) {
    console.error('Get social links error:', error);
    res.status(500).json({
      message: 'Server error fetching social links'
    });
  }
});

// @route   POST /api/social-links
// @desc    Create new social link
// @access  Private (Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { platform, url, icon_class, display_order, is_active } = req.body;
    const socialLink = await SocialLink.create({
      platform,
      url,
      icon_class,
      display_order,
      is_active
    });
    res.status(201).json({
      message: 'Social link created successfully',
      socialLink
    });
  } catch (error) {
    console.error('Create social link error:', error);
    res.status(500).json({
      message: 'Server error creating social link'
    });
  }
});

// @route   PUT /api/social-links/:id
// @desc    Update social link
// @access  Private (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const socialLink = await SocialLink.findByPk(req.params.id);
    if (!socialLink) {
      return res.status(404).json({
        message: 'Social link not found'
      });
    }
    const updatedSocialLink = await socialLink.update(req.body);
    res.json({
      message: 'Social link updated successfully',
      socialLink: updatedSocialLink
    });
  } catch (error) {
    console.error('Update social link error:', error);
    res.status(500).json({
      message: 'Server error updating social link'
    });
  }
});

// @route   DELETE /api/social-links/:id
// @desc    Delete social link
// @access  Private (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const socialLink = await SocialLink.findByPk(req.params.id);
    if (!socialLink) {
      return res.status(404).json({
        message: 'Social link not found'
      });
    }
    await socialLink.destroy();
    res.json({
      message: 'Social link deleted successfully'
    });
  } catch (error) {
    console.error('Delete social link error:', error);
    res.status(500).json({
      message: 'Server error deleting social link'
    });
  }
});

export default router;
