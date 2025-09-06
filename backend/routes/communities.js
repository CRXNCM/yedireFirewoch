import express from 'express';
import { authenticateAdmin, optionalAuth } from '../middleware/auth.js';
import { models } from '../utils/sequelize.js';

const Community = models.Community;

const router = express.Router();

// @route   GET /api/communities
router.get('/', optionalAuth, async (req, res) => {
  try {
    let communities;
    
    if (req.user) {
      // Admin can see all communities
      communities = await Community.findAll({
        order: [['created_at', 'ASC']]
      });
    } else {
      // Public only sees visible communities - for now, show all
      communities = await Community.findAll({
        order: [['created_at', 'ASC']]
      });
    }

    res.json({ communities, count: communities.length });
  } catch (error) {
    console.error('Get communities error:', error);
    res.status(500).json({ message: 'Server error fetching communities' });
  }
});

// @route   POST /api/communities
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      region,
      description
    } = req.body;

    const community = await Community.create({
      name,
      region,
      description,
      created_at: new Date()
    });

    res.status(201).json({ message: 'Community created successfully', community });
  } catch (error) {
    console.error('Create community error:', error);
    res.status(500).json({ message: 'Server error creating community' });
  }
});

// @route   PUT /api/communities/:id
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const community = await Community.findByPk(req.params.id);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const updatedCommunity = await community.update(req.body);
    res.json({ message: 'Community updated successfully', community: updatedCommunity });
  } catch (error) {
    console.error('Update community error:', error);
    res.status(500).json({ message: 'Server error updating community' });
  }
});

// @route   DELETE /api/communities/:id
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const community = await Community.findByPk(req.params.id);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    await community.destroy();
    res.json({ message: 'Community deleted successfully' });
  } catch (error) {
    console.error('Delete community error:', error);
    res.status(500).json({ message: 'Server error deleting community' });
  }
});

export default router;
