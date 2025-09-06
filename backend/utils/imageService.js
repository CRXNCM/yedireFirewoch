import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ImageService {
  constructor() {
    this.uploadDir = path.join(__dirname, '../uploads');
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    this.quality = 85;
    this.maxWidth = 1200;
    this.maxHeight = 1200;
  }

  /**
   * Validate image file
   */
  validateImage(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new Error(`File size must be less than ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    if (!this.allowedMimes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }

    return true;
  }

  /**
   * Optimize image using Sharp
   */
  async optimizeImage(buffer, options = {}) {
    const {
      width = this.maxWidth,
      height = this.maxHeight,
      quality = this.quality,
      format = 'webp'
    } = options;

    try {
      let sharpInstance = sharp(buffer)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        });

      // Convert to specified format with quality
      switch (format.toLowerCase()) {
        case 'webp':
          sharpInstance = sharpInstance.webp({ quality });
          break;
        case 'jpeg':
        case 'jpg':
          sharpInstance = sharpInstance.jpeg({ quality });
          break;
        case 'png':
          sharpInstance = sharpInstance.png({ quality });
          break;
        default:
          sharpInstance = sharpInstance.webp({ quality });
      }

      return await sharpInstance.toBuffer();
    } catch (error) {
      console.error('Image optimization error:', error);
      throw new Error('Failed to optimize image');
    }
  }

  /**
   * Generate unique filename
   */
  generateFilename(originalname, prefix = 'image') {
    const ext = path.extname(originalname).toLowerCase();
    const timestamp = Date.now();
    const uuid = uuidv4().replace(/-/g, '').substring(0, 8);
    return `${prefix}-${timestamp}-${uuid}${ext}`;
  }

  /**
   * Save image to disk
   */
  async saveImage(buffer, filename, subdirectory = '') {
    try {
      const uploadPath = path.join(this.uploadDir, subdirectory);
      
      // Ensure directory exists
      await fs.mkdir(uploadPath, { recursive: true });
      
      const filePath = path.join(uploadPath, filename);
      await fs.writeFile(filePath, buffer);
      
      return {
        filename,
        path: path.join(subdirectory, filename),
        fullPath: filePath
      };
    } catch (error) {
      console.error('Error saving image:', error);
      throw new Error('Failed to save image');
    }
  }

  /**
   * Delete image from disk
   */
  async deleteImage(imagePath) {
    try {
      if (!imagePath) return;
      
      const fullPath = path.join(this.uploadDir, imagePath);
      await fs.unlink(fullPath);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  /**
   * Process and save image with optimization
   */
  async processAndSaveImage(file, options = {}) {
    try {
      // Validate file
      this.validateImage(file);

      // Optimize image
      const optimizedBuffer = await this.optimizeImage(file.buffer, options);

      // Generate filename
      const filename = this.generateFilename(file.originalname, options.prefix);

      // Save image
      const result = await this.saveImage(optimizedBuffer, filename, options.subdirectory);

      return {
        success: true,
        filename: result.filename,
        path: result.path,
        url: `/uploads/${result.path}`,
        size: optimizedBuffer.length,
        originalSize: file.size,
        mimetype: file.mimetype
      };
    } catch (error) {
      console.error('Image processing error:', error);
      throw error;
    }
  }

  /**
   * Convert relative URL to absolute URL
   */
  convertToAbsoluteUrl(imagePath, req) {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  }

  /**
   * Get image info
   */
  async getImageInfo(filePath) {
    try {
      const fullPath = path.join(this.uploadDir, filePath);
      const stats = await fs.stat(fullPath);
      const buffer = await fs.readFile(fullPath);
      const metadata = await sharp(buffer).metadata();
      
      return {
        size: stats.size,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        created: stats.birthtime
      };
    } catch (error) {
      console.error('Error getting image info:', error);
      return null;
    }
  }

  /**
   * Clean up orphaned images
   */
  async cleanupOrphanedImages(validPaths) {
    try {
      const files = await fs.readdir(this.uploadDir, { recursive: true });
      const orphanedFiles = [];

      for (const file of files) {
        if (file.endsWith('.gitkeep')) continue;
        
        const filePath = path.join(this.uploadDir, file);
        const relativePath = path.relative(this.uploadDir, filePath);
        
        if (!validPaths.includes(relativePath)) {
          orphanedFiles.push(filePath);
        }
      }

      // Delete orphaned files
      for (const filePath of orphanedFiles) {
        await fs.unlink(filePath);
        console.log(`Deleted orphaned file: ${filePath}`);
      }

      return orphanedFiles.length;
    } catch (error) {
      console.error('Error cleaning up orphaned images:', error);
      return 0;
    }
  }
}

export default new ImageService();
