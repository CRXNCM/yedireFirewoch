import express from 'express';
import { authenticateAdmin, optionalAuth } from '../middleware/auth.js';
import { models } from '../utils/sequelize.js';
import { 
  uploadSingleImage, 
  processUploadedImage, 
  addImageUrls, 
  handleUploadError 
} from '../utils/imageMiddleware.js';
import imageService from '../utils/imageService.js';

const Bank = models.Bank;

const router = express.Router();


// @route   GET /api/banks
// @desc    Get all active banks (public for donation page)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    let banks;

    if (req.user) {
      // Admin can see all banks
      banks = await Bank.findAll({
        order: [['last_updated', 'DESC']]
      });
    } else {
      // Public only sees active banks
      banks = await Bank.findAll({
        where: { is_active: true },
        order: [['last_updated', 'DESC']]
      });
    }

    // Process image URLs manually
    const processedBanks = banks.map(bank => {
      const bankData = bank.toJSON();
      
      // Handle image URLs - convert bank_image to absolute URL
      if (bankData.bank_image) {
        if (!bankData.bank_image.startsWith('http')) {
          const protocol = req.protocol;
          const host = req.get('host');
          bankData.image_url = `${protocol}://${host}${bankData.bank_image.startsWith('/') ? bankData.bank_image : `/uploads/${bankData.bank_image}`}`;
        } else {
          bankData.image_url = bankData.bank_image;
        }
      }
      
      return bankData;
    });

    res.json({
      banks: processedBanks,
      count: processedBanks.length
    });

  } catch (error) {
    console.error('Get banks error:', error);
    res.status(500).json({
      message: 'Server error fetching banks'
    });
  }
});

// @route   GET /api/banks/primary
// @desc    Get primary bank account
// @access  Public
router.get('/primary', async (req, res) => {
  try {
    const primaryBank = await Bank.findOne({
      where: { is_active: true },
      order: [['last_updated', 'DESC']]
    });

    if (!primaryBank) {
      return res.status(404).json({
        message: 'No active bank account found'
      });
    }

    res.json(primaryBank);

  } catch (error) {
    console.error('Get primary bank error:', error);
    res.status(500).json({
      message: 'Server error fetching primary bank'
    });
  }
});

// @route   GET /api/banks/:id
// @desc    Get single bank by ID
// @access  Private (Admin only)
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const bank = await Bank.findByPk(req.params.id);

    if (!bank) {
      return res.status(404).json({
        message: 'Bank not found'
      });
    }

    res.json(bank);

  } catch (error) {
    console.error('Get bank error:', error);
    res.status(500).json({
      message: 'Server error fetching bank'
    });
  }
});

// @route   POST /api/banks
// @desc    Create new bank account
// @access  Private (Admin only)
router.post('/', 
  authenticateAdmin,
  uploadSingleImage('bankLogo'),
  processUploadedImage({ 
    prefix: 'bank', 
    subdirectory: 'banks',
    width: 300,
    height: 300,
    format: 'webp'
  }),
  async (req, res) => {
    try {
      const {
        bankName,
        accountName,
        accountNumber,
        routingNumber,
        swiftCode,
        bankAddress,
        isActive = true,
        paymentLink
      } = req.body;
      
      console.log('Bank creation - req.body:', req.body);
      console.log('Bank creation - req.files:', req.files);

      // Validate required fields
      if (!bankName || !accountName || !accountNumber) {
        return res.status(400).json({
          message: 'Bank name, account name, and account number are required'
        });
      }

      let bankImagePath = null;
      console.log('Bank creation - req.file:', req.file);
      console.log('Bank creation - req.processedImage:', req.processedImage);
      if (req.processedImage) {
        bankImagePath = req.processedImage.path;
        console.log('Bank creation - bankImagePath:', bankImagePath);
      }

      const bankData = {
        bank_name: bankName,
        account_name: accountName,
        account_number: accountNumber,
        routing_number: routingNumber || null,
        swift_code: swiftCode || null,
        bank_address: bankAddress || null,
        bank_image: bankImagePath,
        is_active: isActive,
        payment_link: paymentLink || null,
        last_updated: new Date()
      };

      const bank = await Bank.create(bankData);

      res.status(201).json({
        message: 'Bank account created successfully',
        bank
      });

    } catch (error) {
      console.error('Create bank error:', error);
      res.status(500).json({
        message: 'Server error creating bank account'
      });
    }
  }
);

// @route   PUT /api/banks/:id
// @desc    Update bank account
// @access  Private (Admin only)
router.put('/:id', 
  authenticateAdmin,
  uploadSingleImage('bankLogo'),
  processUploadedImage({ 
    prefix: 'bank', 
    subdirectory: 'banks',
    width: 300,
    height: 300,
    format: 'webp'
  }),
  async (req, res) => {
    try {
      const bank = await Bank.findByPk(req.params.id);

      if (!bank) {
        return res.status(404).json({
          message: 'Bank not found'
        });
      }

      const updateData = { ...req.body };
      
      // Handle file upload - delete old image if new one is uploaded
      if (req.processedImage) {
        // Delete old image if it exists
        if (bank.bank_image) {
          await imageService.deleteImage(bank.bank_image);
        }
        updateData.bank_image = req.processedImage.path;
      }

      // Update timestamp
      updateData.last_updated = new Date();

      const updatedBank = await bank.update(updateData);

      res.json({
        message: 'Bank account updated successfully',
        bank: updatedBank
      });

    } catch (error) {
      console.error('Update bank error:', error);
      res.status(500).json({
        message: 'Server error updating bank account'
      });
    }
  }
);

// @route   PATCH /api/banks/:id/status
// @desc    Toggle bank account status
// @access  Private (Admin only)
router.patch('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const bank = await Bank.findByPk(req.params.id);

    if (!bank) {
      return res.status(404).json({
        message: 'Bank not found'
      });
    }

    const newStatus = !bank.is_active;
    await bank.update({ 
      is_active: newStatus,
      last_updated: new Date()
    });

    res.json({
      message: `Bank account ${newStatus ? 'activated' : 'deactivated'} successfully`,
      bank
    });

  } catch (error) {
    console.error('Toggle bank status error:', error);
    res.status(500).json({
      message: 'Server error updating bank status'
    });
  }
});

// @route   DELETE /api/banks/:id
// @desc    Delete bank account
// @access  Private (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const bank = await Bank.findByPk(req.params.id);

    if (!bank) {
      return res.status(404).json({
        message: 'Bank not found'
      });
    }

    // Delete associated image
    if (bank.bank_image || bank.image_path) {
      await imageService.deleteImage(bank.bank_image || bank.image_path);
    }

    await bank.destroy();

    res.json({
      message: 'Bank account deleted successfully'
    });

  } catch (error) {
    console.error('Delete bank error:', error);
    res.status(500).json({
      message: 'Server error deleting bank account'
    });
  }
});

// Error handling middleware
router.use(handleUploadError);

export default router;
