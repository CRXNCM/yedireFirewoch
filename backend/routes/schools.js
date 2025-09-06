import express from 'express';
import { authenticateAdmin, optionalAuth } from '../middleware/auth.js';
import { models, sequelize } from '../utils/sequelize.js';
import { Op } from 'sequelize';

const School = models.School;

const router = express.Router();

// @route   GET /api/schools
// @desc    Get all schools (public shows only visible)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { status, region, city } = req.query;
    let schools;

    if (req.user) {
      // Admin can see all schools with filters
      let whereClause = {};
      if (status) whereClause.status = status;
      if (region) whereClause.region = { [Op.like]: `%${region}%` };
      if (city) whereClause.city = { [Op.like]: `%${city}%` };
      
      schools = await School.findAll({
        where: whereClause,
        order: [['created_at', 'DESC']]
      });
    } else {
      // Public only sees visible schools - for now, show all
      schools = await School.findAll({
        order: [['created_at', 'DESC']]
      });
    }

    res.json({
      schools,
      count: schools.length
    });

  } catch (error) {
    console.error('Get schools error:', error);
    res.status(500).json({
      message: 'Server error fetching schools'
    });
  }
});

// @route   GET /api/schools/active-projects
// @desc    Get active school projects for public
// @access  Public
router.get('/active-projects', async (req, res) => {
  try {
    const schools = await School.findAll({
      where: { status: 'active' },
      order: [['created_at', 'DESC']]
    });

    res.json({
      schools,
      count: schools.length
    });

  } catch (error) {
    console.error('Get active projects error:', error);
    res.status(500).json({
      message: 'Server error fetching active projects'
    });
  }
});

// @route   GET /api/schools/:id
// @desc    Get single school
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const school = await School.findByPk(req.params.id);

    if (!school) {
      return res.status(404).json({
        message: 'School not found'
      });
    }

    // Check if school is accessible to public
    if (!req.user && (!school.isVisible || school.status === 'inactive')) {
      return res.status(404).json({
        message: 'School not found'
      });
    }

    res.json(school);

  } catch (error) {
    console.error('Get school error:', error);
    res.status(500).json({
      message: 'Server error fetching school'
    });
  }
});

// @route   POST /api/schools
// @desc    Create new school
// @access  Private (Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      region,
      children_served,
      status = 'active',
      isVisible = true
    } = req.body;

    // Generate unique school ID
    const schoolId = `SCH${Date.now()}`;

    const school = await School.create({
      school_id: schoolId,
      name,
      description,
      region,
      children_served: children_served || 0,
      status,
      isVisible,
      created_at: new Date()
    });

    res.status(201).json({
      message: 'School created successfully',
      school
    });

  } catch (error) {
    console.error('Create school error:', error);
    res.status(500).json({
      message: 'Server error creating school'
    });
  }
});

// @route   PUT /api/schools/:id
// @desc    Update school
// @access  Private (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const school = await School.findByPk(req.params.id);

    if (!school) {
      return res.status(404).json({
        message: 'School not found'
      });
    }

    const updatedSchool = await school.update(req.body);

    res.json({
      message: 'School updated successfully',
      school: updatedSchool
    });

  } catch (error) {
    console.error('Update school error:', error);
    res.status(500).json({
      message: 'Server error updating school'
    });
  }
});

// @route   DELETE /api/schools/:id
// @desc    Delete school
// @access  Private (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const school = await School.findByPk(req.params.id);

    if (!school) {
      return res.status(404).json({
        message: 'School not found'
      });
    }

    await school.destroy();

    res.json({
      message: 'School deleted successfully'
    });

  } catch (error) {
    console.error('Delete school error:', error);
    res.status(500).json({
      message: 'Server error deleting school'
    });
  }
});

export default router;
