import express from 'express';
import { authenticateAdmin, optionalAuth } from '../middleware/auth.js';
import { models } from '../utils/sequelize.js';

const UrgentMessage = models.UrgentMessage;

const router = express.Router();

// @route   GET /api/urgent-messages
// @desc    Get all urgent messages
// @access  Public
router.get('/', async (req, res) => {
  try {
    const urgentMessages = await UrgentMessage.findAll({
      order: [
        ['urgency_level', 'ASC'], // Urgent first, then Important, then Normal
        ['created_at', 'DESC']
      ]
    });

    res.json(urgentMessages);
  } catch (error) {
    console.error('Error fetching urgent messages:', error);
    res.status(500).json({ error: 'Failed to fetch urgent messages' });
  }
});

// @route   GET /api/urgent-messages/:id
// @desc    Get single urgent message
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const urgentMessage = await UrgentMessage.findByPk(req.params.id);
    
    if (!urgentMessage) {
      return res.status(404).json({ error: 'Urgent message not found' });
    }
    
    res.json(urgentMessage);
  } catch (error) {
    console.error('Error fetching urgent message:', error);
    res.status(500).json({ error: 'Failed to fetch urgent message' });
  }
});

// @route   POST /api/urgent-messages
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

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const urgentMessage = await UrgentMessage.create({
      title,
      message,
      urgency_level: urgency_level || 'Normal',
      image_path,
      action_link,
      action_text,
      status: 'inactive'
    });

    res.status(201).json(urgentMessage);
  } catch (error) {
    console.error('Error creating urgent message:', error);
    res.status(500).json({ error: 'Failed to create urgent message' });
  }
});

// @route   PUT /api/urgent-messages/:id
// @desc    Update urgent message
// @access  Private (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const urgentMessage = await UrgentMessage.findByPk(req.params.id);
    
    if (!urgentMessage) {
      return res.status(404).json({ error: 'Urgent message not found' });
    }

    const {
      title,
      message,
      urgency_level,
      status,
      image_path,
      action_link,
      action_text
    } = req.body;

    if (title) urgentMessage.title = title;
    if (message) urgentMessage.message = message;
    if (urgency_level) urgentMessage.urgency_level = urgency_level;
    if (status) urgentMessage.status = status;
    if (image_path !== undefined) urgentMessage.image_path = image_path;
    if (action_link !== undefined) urgentMessage.action_link = action_link;
    if (action_text !== undefined) urgentMessage.action_text = action_text;
    
    urgentMessage.updated_at = new Date();
    await urgentMessage.save();

    res.json(urgentMessage);
  } catch (error) {
    console.error('Error updating urgent message:', error);
    res.status(500).json({ error: 'Failed to update urgent message' });
  }
});

// @route   PATCH /api/urgent-messages/:id/status
// @desc    Update urgent message status
// @access  Private (Admin only)
router.patch('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const urgentMessage = await UrgentMessage.findByPk(req.params.id);
    
    if (!urgentMessage) {
      return res.status(404).json({ error: 'Urgent message not found' });
    }

    const { status } = req.body;
    
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Status must be either "active" or "inactive"' });
    }

    // If activating a message, deactivate all other active messages
    if (status === 'active') {
      await UrgentMessage.update(
        { status: 'inactive' },
        { where: { status: 'active' } }
      );
    }

    urgentMessage.status = status;
    urgentMessage.updated_at = new Date();
    await urgentMessage.save();

    res.json(urgentMessage);
  } catch (error) {
    console.error('Error updating urgent message status:', error);
    res.status(500).json({ error: 'Failed to update urgent message status' });
  }
});

// @route   DELETE /api/urgent-messages/:id
// @desc    Delete urgent message
// @access  Private (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const urgentMessage = await UrgentMessage.findByPk(req.params.id);
    
    if (!urgentMessage) {
      return res.status(404).json({ error: 'Urgent message not found' });
    }

    await urgentMessage.destroy();
    res.json({ message: 'Urgent message deleted successfully' });
  } catch (error) {
    console.error('Error deleting urgent message:', error);
    res.status(500).json({ error: 'Failed to delete urgent message' });
  }
});

export default router;
