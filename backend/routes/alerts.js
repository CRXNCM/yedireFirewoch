import express from 'express';
import { authenticateAdmin, optionalAuth } from '../middleware/auth.js';
import { models } from '../utils/sequelize.js';

const UrgentMessage = models.UrgentMessage;

const router = express.Router();

// @route   GET /api/alerts
// @desc    Get all urgent messages (public for frontend display)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, urgency_level, page } = req.query;
    
    // Build query
    let query = {};
    
    // For public access, only show active messages
    if (!req.user) {
      query.status = 'active';
    } else {
      // Admin can see all messages
      if (status) query.status = status;
    }
    
    if (urgency_level) query.urgency_level = urgency_level;

    const urgentMessages = await UrgentMessage.findAll({
      where: query,
      order: [
        ['urgency_level', 'ASC'], // Urgent first, then Important, then Normal
        ['created_at', 'DESC']
      ],
      limit: parseInt(page) ? parseInt(page) * 20 : 100
    });

    res.json({
      alerts: urgentMessages,
      count: urgentMessages.length
    });

  } catch (error) {
    console.error('Get urgent messages error:', error);
    res.status(500).json({
      message: 'Server error fetching urgent messages'
    });
  }
});

// @route   GET /api/alerts/:id
// @desc    Get single urgent message
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const urgentMessage = await UrgentMessage.findByPk(req.params.id);

    if (!urgentMessage) {
      return res.status(404).json({
        message: 'Urgent message not found'
      });
    }

    // Check if message is accessible to public
    if (!req.user && urgentMessage.status !== 'active') {
      return res.status(404).json({
        message: 'Urgent message not found'
      });
    }

    res.json(urgentMessage);

  } catch (error) {
    console.error('Get urgent message error:', error);
    res.status(500).json({
      message: 'Server error fetching urgent message'
    });
  }
});

// @route   POST /api/alerts
// @desc    Create new urgent message
// @access  Private (Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const {
      title,
      message,
      urgency_level,
      image_path,
      action_link,
      action_text
    } = req.body;

    // Validate required fields
    if (!title || !message) {
      return res.status(400).json({
        message: 'Title and message are required'
      });
    }

    const urgentMessageData = {
      title: title.trim(),
      message: message.trim(),
      urgency_level: urgency_level || 'Normal',
      image_path: image_path || null,
      action_link: action_link || null,
      action_text: action_text || null,
      status: 'inactive' // Default to inactive, admin can activate later
    };

    const urgentMessage = await UrgentMessage.create(urgentMessageData);

    res.status(201).json({
      message: 'Urgent message created successfully',
      alert: urgentMessage
    });

  } catch (error) {
    console.error('Create urgent message error:', error);
    res.status(500).json({
      message: 'Server error creating urgent message'
    });
  }
});

// @route   PUT /api/alerts/:id
// @desc    Update urgent message
// @access  Private (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const {
      title,
      message,
      urgency_level,
      status,
      image_path,
      action_link,
      action_text
    } = req.body;

    const urgentMessage = await UrgentMessage.findByPk(req.params.id);

    if (!urgentMessage) {
      return res.status(404).json({
        message: 'Urgent message not found'
      });
    }

    // Update fields
    if (title) urgentMessage.title = title.trim();
    if (message) urgentMessage.message = message.trim();
    if (urgency_level) urgentMessage.urgency_level = urgency_level;
    if (status) urgentMessage.status = status;
    if (image_path !== undefined) urgentMessage.image_path = image_path;
    if (action_link !== undefined) urgentMessage.action_link = action_link;
    if (action_text !== undefined) urgentMessage.action_text = action_text;
    
    urgentMessage.updated_at = new Date();

    await urgentMessage.save();

    res.json({
      message: 'Urgent message updated successfully',
      alert: urgentMessage
    });

  } catch (error) {
    console.error('Update urgent message error:', error);
    res.status(500).json({
      message: 'Server error updating urgent message'
    });
  }
});

// @route   PATCH /api/alerts/:id/status
// @desc    Update urgent message status (activate/deactivate)
// @access  Private (Admin only)
router.patch('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        message: 'Valid status (active/inactive) is required'
      });
    }

    const urgentMessage = await UrgentMessage.findByPk(req.params.id);

    if (!urgentMessage) {
      return res.status(404).json({
        message: 'Urgent message not found'
      });
    }

    urgentMessage.status = status;
    urgentMessage.updated_at = new Date();
    await urgentMessage.save();

    res.json({
      message: `Urgent message ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      alert: urgentMessage
    });

  } catch (error) {
    console.error('Update urgent message status error:', error);
    res.status(500).json({
      message: 'Server error updating urgent message status'
    });
  }
});

// @route   DELETE /api/alerts/:id
// @desc    Delete urgent message
// @access  Private (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const urgentMessage = await UrgentMessage.findByPk(req.params.id);

    if (!urgentMessage) {
      return res.status(404).json({
        message: 'Urgent message not found'
      });
    }

    await urgentMessage.destroy();

    res.json({
      message: 'Urgent message deleted successfully'
    });

  } catch (error) {
    console.error('Delete urgent message error:', error);
    res.status(500).json({
      message: 'Server error deleting urgent message'
    });
  }
});

// @route   GET /api/alerts/active/current
// @desc    Get currently active urgent messages for frontend display
// @access  Public
router.get('/active/current', async (req, res) => {
  try {
    const urgentMessages = await UrgentMessage.getActiveMessages();

    res.json({
      alerts: urgentMessages,
      count: urgentMessages.length
    });

  } catch (error) {
    console.error('Get active urgent messages error:', error);
    res.status(500).json({
      message: 'Server error fetching active urgent messages'
    });
  }
});

export default router;
