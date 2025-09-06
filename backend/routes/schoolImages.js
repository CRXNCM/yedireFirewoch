import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import { models } from '../utils/sequelize.js';
import { uploadMultipleImages, processMultipleImages } from '../utils/imageMiddleware.js';

const { SchoolImage } = models;

const router = express.Router();

// GET /api/school-images?school_id=SCH123
router.get('/', async (req, res) => {
  try {
    const { school_id, featured } = req.query;
    const where = {};
    if (school_id) where.school_id = school_id;
    if (featured === 'true') where.is_featured = true;
    if (featured === 'false') where.is_featured = false;

    const images = await SchoolImage.findAll({
      where,
      order: [['upload_date', 'DESC']]
    });

    res.json({ images, count: images.length });
  } catch (error) {
    console.error('Get school images error:', error);
    res.status(500).json({ message: 'Server error fetching school images' });
  }
});

// POST /api/school-images (multipart/form-data)
// fields: images[], school_id, title, description, is_featured
router.post('/',
  authenticateAdmin,
  uploadMultipleImages('images', 20),
  processMultipleImages({ prefix: 'school', subdirectory: 'schools', format: 'webp', quality: 85 }),
  async (req, res) => {
    try {
      const { school_id, title, description } = req.body;
      const is_featured = req.body.is_featured === 'true' || req.body.is_featured === true;

      if (!school_id) {
        return res.status(400).json({ message: 'school_id is required' });
      }

      if (!req.processedImages || req.processedImages.length === 0) {
        return res.status(400).json({ message: 'No images uploaded' });
      }

      const created = [];
      for (const img of req.processedImages) {
        const record = await SchoolImage.create({
          school_id,
          title: title || null,
          description: description || null,
          is_featured,
          image_url: img.url,
          image_path: img.path,
          upload_date: new Date()
        });
        created.push(record);
      }

      res.status(201).json({ message: 'Images uploaded successfully', images: created });
    } catch (error) {
      console.error('Create school images error:', error);
      res.status(500).json({ message: 'Server error creating school images' });
    }
  }
);

// PUT /api/school-images/:id
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const image = await SchoolImage.findByPk(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    const { title, description, is_featured } = req.body;
    const updated = await image.update({
      title: title ?? image.title,
      description: description ?? image.description,
      is_featured: typeof is_featured === 'boolean' ? is_featured : image.is_featured
    });

    res.json({ message: 'Image updated successfully', image: updated });
  } catch (error) {
    console.error('Update school image error:', error);
    res.status(500).json({ message: 'Server error updating school image' });
  }
});

// DELETE /api/school-images/:id
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const image = await SchoolImage.findByPk(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    await image.destroy();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete school image error:', error);
    res.status(500).json({ message: 'Server error deleting school image' });
  }
});

export default router;


