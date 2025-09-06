import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import { models } from '../utils/sequelize.js';

const Volunteer = models.Volunteer;

const router = express.Router();

// @route   GET /api/volunteers
// @desc    Get all volunteers
// @access  Private (Admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const volunteers = await Volunteer.findAll({
      order: [['join_date', 'DESC']]
    });

    res.json({
      volunteers,
      count: volunteers.length
    });

  } catch (error) {
    console.error('Get volunteers error:', error);
    res.status(500).json({
      message: 'Server error fetching volunteers'
    });
  }
});

// @route   GET /api/volunteers/:id
// @desc    Get single volunteer
// @access  Private (Admin only)
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const volunteer = await Volunteer.findByPk(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        message: 'Volunteer not found'
      });
    }

    res.json(volunteer);

  } catch (error) {
    console.error('Get volunteer error:', error);
    res.status(500).json({
      message: 'Server error fetching volunteer'
    });
  }
});

// @route   POST /api/volunteers
// @desc    Create new volunteer
// @access  Private (Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      email,
      phone
    } = req.body;

    const volunteer = await Volunteer.create({
      name,
      email: email || null,
      phone: phone || null,
      join_date: new Date()
    });

    res.status(201).json({
      message: 'Volunteer created successfully',
      volunteer
    });

  } catch (error) {
    console.error('Create volunteer error:', error);
    res.status(500).json({
      message: 'Server error creating volunteer'
    });
  }
});

// @route   PUT /api/volunteers/:id
// @desc    Update volunteer
// @access  Private (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const volunteer = await Volunteer.findByPk(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        message: 'Volunteer not found'
      });
    }

    const updatedVolunteer = await volunteer.update(req.body);

    res.json({
      message: 'Volunteer updated successfully',
      volunteer: updatedVolunteer
    });

  } catch (error) {
    console.error('Update volunteer error:', error);
    res.status(500).json({
      message: 'Server error updating volunteer'
    });
  }
});

// @route   DELETE /api/volunteers/:id
// @desc    Delete volunteer
// @access  Private (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const volunteer = await Volunteer.findByPk(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        message: 'Volunteer not found'
      });
    }

    await volunteer.destroy();

    res.json({
      message: 'Volunteer deleted successfully'
    });

  } catch (error) {
    console.error('Delete volunteer error:', error);
    res.status(500).json({
      message: 'Server error deleting volunteer'
    });
  }
});

export default router;
