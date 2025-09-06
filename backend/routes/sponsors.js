import express from 'express';
import { authenticateAdmin, optionalAuth } from '../middleware/auth.js';
import { models } from '../utils/sequelize.js';
import { Op } from 'sequelize';

const Sponsor = models.Sponsor;

const router = express.Router();

// @route   GET /api/sponsors
// @desc    Get all sponsors (public shows only visible and active)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { level } = req.query;
    let sponsors;

    if (req.user) {
      // Admin can see all sponsors with filters
      let whereClause = {};
      if (level) whereClause.sponsorshipLevel = level;
      
      sponsors = await Sponsor.findAll({
        where: whereClause,
        order: [['created_at', 'ASC']]
      });
    } else {
      // Public only sees active sponsors
      if (level) {
        sponsors = await Sponsor.findAll({
          where: { sponsorshipLevel: level, is_active: true },
          order: [['created_at', 'ASC']]
        });
      } else {
        sponsors = await Sponsor.findAll({
          where: { is_active: true },
          order: [['created_at', 'ASC']]
        });
      }
    }

    res.json({
      sponsors,
      count: sponsors.length
    });

  } catch (error) {
    console.error('Get sponsors error:', error);
    res.status(500).json({
      message: 'Server error fetching sponsors'
    });
  }
});

// @route   POST /api/sponsors
// @desc    Create new sponsor
// @access  Private (Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      logo_path,
      website_url,
      is_active = true
    } = req.body;
    
    if (!name) {
      return res.status(400).json({
        message: 'Sponsor name is required'
      });
    }

    const sponsor = await Sponsor.create({
      name,
      description,
      logo_path,
      website_url,
      is_active,
      created_at: new Date()
    });

    res.status(201).json({
      message: 'Sponsor created successfully',
      sponsor
    });

  } catch (error) {
    console.error('Create sponsor error:', error);
    res.status(500).json({
      message: 'Server error creating sponsor'
    });
  }
});

// @route   PUT /api/sponsors/:id
// @desc    Update sponsor
// @access  Private (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const sponsor = await Sponsor.findByPk(req.params.id);

    if (!sponsor) {
      return res.status(404).json({
        message: 'Sponsor not found'
      });
    }

    const updatedSponsor = await sponsor.update(req.body);

    res.json({
      message: 'Sponsor updated successfully',
      sponsor: updatedSponsor
    });

  } catch (error) {
    console.error('Update sponsor error:', error);
    res.status(500).json({
      message: 'Server error updating sponsor'
    });
  }
});

// @route   DELETE /api/sponsors/:id
// @desc    Delete sponsor
// @access  Private (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const sponsor = await Sponsor.findByPk(req.params.id);

    if (!sponsor) {
      return res.status(404).json({
        message: 'Sponsor not found'
      });
    }

    await sponsor.destroy();

    res.json({
      message: 'Sponsor deleted successfully'
    });

  } catch (error) {
    console.error('Delete sponsor error:', error);
    res.status(500).json({
      message: 'Server error deleting sponsor'
    });
  }
});

export default router;
