import imageService from './imageService.js';
import { models, sequelize } from './sequelize.js';

const Bank = models.Bank;
const Sponsor = models.Sponsor;
const { Op } = sequelize.Sequelize;

class CleanupService {
  /**
   * Get all valid image paths from database
   */
  async getValidImagePaths() {
    try {
      const validPaths = [];

      // Get bank images
      const banks = await Bank.findAll({
        attributes: ['bank_image'],
        where: {
          bank_image: {
            [Op.ne]: null
          }
        }
      });

      banks.forEach(bank => {
        if (bank.bank_image) {
          validPaths.push(bank.bank_image);
        }
      });

      // Get sponsor images
      const sponsors = await Sponsor.findAll({
        attributes: ['logo_path'],
        where: {
          logo_path: {
            [Op.ne]: null
          }
        }
      });

      sponsors.forEach(sponsor => {
        if (sponsor.logo_path) {
          validPaths.push(sponsor.logo_path);
        }
      });

      return validPaths;
    } catch (error) {
      console.error('Error getting valid image paths:', error);
      return [];
    }
  }

  /**
   * Clean up orphaned images
   */
  async cleanupOrphanedImages() {
    try {
      console.log('Starting orphaned image cleanup...');
      
      const validPaths = await this.getValidImagePaths();
      console.log(`Found ${validPaths.length} valid image paths in database`);
      
      const deletedCount = await imageService.cleanupOrphanedImages(validPaths);
      
      console.log(`Cleanup completed. Deleted ${deletedCount} orphaned images.`);
      
      return {
        success: true,
        validPathsCount: validPaths.length,
        deletedCount
      };
    } catch (error) {
      console.error('Error during cleanup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats() {
    try {
      const validPaths = await this.getValidImagePaths();
      let totalSize = 0;
      let imageCount = 0;

      for (const path of validPaths) {
        const info = await imageService.getImageInfo(path);
        if (info) {
          totalSize += info.size;
          imageCount++;
        }
      }

      return {
        totalImages: imageCount,
        totalSize: totalSize,
        totalSizeFormatted: this.formatBytes(totalSize),
        averageSize: imageCount > 0 ? totalSize / imageCount : 0,
        averageSizeFormatted: imageCount > 0 ? this.formatBytes(totalSize / imageCount) : '0 B'
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        error: error.message
      };
    }
  }

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validate all image references in database
   */
  async validateImageReferences() {
    try {
      const results = {
        banks: [],
        sponsors: [],
        orphaned: []
      };

      // Check bank images
      const banks = await Bank.findAll({
        attributes: ['id', 'bank_name', 'bank_image']
      });

      for (const bank of banks) {
        if (bank.bank_image) {
          const exists = await imageService.getImageInfo(bank.bank_image);
          if (!exists) {
            results.orphaned.push({
              type: 'bank',
              id: bank.id,
              name: bank.bank_name,
              path: bank.bank_image
            });
          } else {
            results.banks.push({
              id: bank.id,
              name: bank.bank_name,
              path: bank.bank_image,
              size: exists.size
            });
          }
        }
      }

      // Check sponsor images
      const sponsors = await Sponsor.findAll({
        attributes: ['id', 'name', 'logo_path']
      });

      for (const sponsor of sponsors) {
        if (sponsor.logo_path) {
          const exists = await imageService.getImageInfo(sponsor.logo_path);
          if (!exists) {
            results.orphaned.push({
              type: 'sponsor',
              id: sponsor.id,
              name: sponsor.name,
              path: sponsor.logo_path
            });
          } else {
            results.sponsors.push({
              id: sponsor.id,
              name: sponsor.name,
              path: sponsor.logo_path,
              size: exists.size
            });
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Error validating image references:', error);
      return {
        error: error.message
      };
    }
  }

  /**
   * Fix orphaned references by removing invalid image paths
   */
  async fixOrphanedReferences() {
    try {
      const validation = await this.validateImageReferences();
      
      if (validation.error) {
        throw new Error(validation.error);
      }

      let fixedCount = 0;

      // Fix orphaned bank references
      for (const orphaned of validation.orphaned) {
        if (orphaned.type === 'bank') {
          await Bank.update(
            { bank_image: null },
            { where: { id: orphaned.id } }
          );
          fixedCount++;
        } else if (orphaned.type === 'sponsor') {
          await Sponsor.update(
            { logo_path: null },
            { where: { id: orphaned.id } }
          );
          fixedCount++;
        }
      }

      return {
        success: true,
        fixedCount,
        orphanedCount: validation.orphaned.length
      };
    } catch (error) {
      console.error('Error fixing orphaned references:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new CleanupService();
