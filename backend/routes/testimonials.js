import express from 'express';
import { authenticateAdmin, optionalAuth } from '../middleware/auth.js';
import { models } from '../utils/sequelize.js';
import { Op } from 'sequelize';

const Testimonial = models.Testimonial;

const router = express.Router();

// @route   GET /api/testimonials
// @desc    Get all testimonials (public shows only active)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    let testimonials;

    if (req.user) {
      // Admin can see all testimonials
      testimonials = await Testimonial.findAll({
        order: [['rating', 'DESC'], ['created_at', 'DESC']]
      });
    } else {
      // Public only sees active testimonials
      testimonials = await Testimonial.findAll({
        where: { is_active: true },
        order: [['rating', 'DESC'], ['created_at', 'DESC']]
      });
    }

    res.json({
      testimonials,
      count: testimonials.length
    });

  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      message: 'Server error fetching testimonials'
    });
  }
});

// @route   GET /api/testimonials/featured
// @desc    Get featured testimonials for homepage (5-star ratings)
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { is_active: true, rating: 5 },
      order: [['created_at', 'DESC']],
      limit: 5
    });

    res.json({
      testimonials,
      count: testimonials.length
    });

  } catch (error) {
    console.error('Get featured testimonials error:', error);
    res.status(500).json({
      message: 'Server error fetching featured testimonials'
    });
  }
});

// @route   GET /api/testimonials/:id
// @desc    Get single testimonial
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        message: 'Testimonial not found'
      });
    }

    // Check if testimonial is accessible to public
    if (!req.user && !testimonial.is_active) {
      return res.status(404).json({
        message: 'Testimonial not found'
      });
    }

    res.json(testimonial);

  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({
      message: 'Server error fetching testimonial'
    });
  }
});

// @route   POST /api/testimonials
// @desc    Create new testimonial
// @access  Private (Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      role,
      organization,
      message,
      rating = 5,
      image_path = null,
      is_active = true
    } = req.body;

    const testimonial = await Testimonial.create({
      name,
      role,
      organization,
      message,
      rating,
      image_path,
      is_active,
      created_at: new Date()
    });

    res.status(201).json({
      message: 'Testimonial created successfully',
      testimonial
    });

  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({
      message: 'Server error creating testimonial'
    });
  }
});

// @route   PUT /api/testimonials/:id
// @desc    Update testimonial
// @access  Private (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        message: 'Testimonial not found'
      });
    }

    const updatedTestimonial = await testimonial.update(req.body);

    res.json({
      message: 'Testimonial updated successfully',
      testimonial: updatedTestimonial
    });

  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      message: 'Server error updating testimonial'
    });
  }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete testimonial
// @access  Private (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        message: 'Testimonial not found'
      });
    }

    await testimonial.destroy();

    res.json({
      message: 'Testimonial deleted successfully'
    });

  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      message: 'Server error deleting testimonial'
    });
  }
});

export default router;
