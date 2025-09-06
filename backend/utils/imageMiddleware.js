import multer from 'multer';
import imageService from './imageService.js';

// Configure multer for memory storage (we'll process images ourselves)
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  try {
    imageService.validateImage(file);
    cb(null, true);
  } catch (error) {
    cb(error, false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: imageService.maxFileSize,
  },
  fileFilter: fileFilter
});

// Middleware for single image upload
export const uploadSingleImage = (fieldName = 'image') => {
  return (req, res, next) => {
    console.log('uploadSingleImage - fieldName:', fieldName);
    console.log('uploadSingleImage - req.body before:', req.body);
    
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        console.error('uploadSingleImage - Error:', err);
        return next(err);
      }
      
      console.log('uploadSingleImage - req.file after:', req.file);
      console.log('uploadSingleImage - req.body after:', req.body);
      next();
    });
  };
};

// Middleware for multiple image uploads
export const uploadMultipleImages = (fieldName = 'images', maxCount = 10) => {
  return upload.array(fieldName, maxCount);
};

// Middleware for processing uploaded images
export const processUploadedImage = (options = {}) => {
  return async (req, res, next) => {
    try {
      console.log('processUploadedImage - req.file:', req.file);
      console.log('processUploadedImage - options:', options);
      
      if (!req.file) {
        console.log('processUploadedImage - No file found, skipping');
        return next();
      }

      console.log('processUploadedImage - Processing file:', req.file.originalname);
      const result = await imageService.processAndSaveImage(req.file, options);
      console.log('processUploadedImage - Result:', result);
      req.processedImage = result;
      next();
    } catch (error) {
      console.error('processUploadedImage - Error:', error);
      next(error);
    }
  };
};

// Middleware for processing multiple uploaded images
export const processMultipleImages = (options = {}) => {
  return async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return next();
      }

      const processedImages = [];
      
      for (const file of req.files) {
        const result = await imageService.processAndSaveImage(file, options);
        processedImages.push(result);
      }

      req.processedImages = processedImages;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware for handling image URLs in responses
export const addImageUrls = (imageField = 'image') => {
  return (req, res, next) => {
    const originalJson = res.json;
    
    res.json = function(data) {
      if (data && typeof data === 'object') {
        // Handle single object
        if (data[imageField]) {
          data[imageField] = imageService.convertToAbsoluteUrl(data[imageField], req);
        }
        
        // Handle arrays
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (item && item[imageField]) {
              item[imageField] = imageService.convertToAbsoluteUrl(item[imageField], req);
            }
          });
        }
        
        // Handle nested objects (e.g., { banks: [...] })
        Object.keys(data).forEach(key => {
          if (Array.isArray(data[key])) {
            data[key].forEach(item => {
              if (item && item[imageField]) {
                item[imageField] = imageService.convertToAbsoluteUrl(item[imageField], req);
              }
            });
          }
        });
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: `File too large. Maximum size is ${imageService.maxFileSize / (1024 * 1024)}MB`
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files uploaded'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: 'Unexpected file field'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      message: error.message
    });
  }
  
  if (error.message.includes('File size must be less than')) {
    return res.status(400).json({
      message: error.message
    });
  }
  
  next(error);
};

export default {
  uploadSingleImage,
  uploadMultipleImages,
  processUploadedImage,
  processMultipleImages,
  addImageUrls,
  handleUploadError
};
