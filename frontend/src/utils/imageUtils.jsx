import React, { useState, useEffect } from 'react';

/**
 * Image utility functions for consistent image handling across the frontend
 */

// Default fallback images for different types
const FALLBACK_IMAGES = {
  bank: 'https://ui-avatars.com/api/?name=Bank&background=random&color=fff&size=200',
  sponsor: 'https://ui-avatars.com/api/?name=Sponsor&background=random&color=fff&size=200',
  gallery: '/vite.svg',
  profile: 'https://ui-avatars.com/api/?name=User&background=random&color=fff&size=200',
  school: 'https://ui-avatars.com/api/?name=School&background=random&color=fff&size=200'
};

/**
 * Get fallback image URL based on type
 */
export const getFallbackImage = (type = 'gallery', name = '') => {
  if (name && type === 'bank') {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200`;
  }
  if (name && type === 'sponsor') {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200`;
  }
  return FALLBACK_IMAGES[type] || FALLBACK_IMAGES.gallery;
};

/**
 * Validate image URL
 */
export const isValidImageUrl = (url) => {
  if (!url) return false;
  
  // Check if it's a data URL
  if (url.startsWith('data:image/')) return true;
  
  // Check if it's a valid HTTP/HTTPS URL
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Convert relative URL to absolute URL
 */
export const convertToAbsoluteUrl = (url, baseUrl = '') => {
  if (!url) return null;
  
  // If it's already an absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a data URL, return as is
  if (url.startsWith('data:image/')) {
    return url;
  }
  
  // Convert relative URL to absolute
  const base = baseUrl || window.location.origin;
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
};

/**
 * Image component with error handling and fallback
 */
export const ImageWithFallback = ({ 
  src, 
  alt, 
  fallbackType = 'gallery', 
  fallbackName = '',
  className = '',
  style = {},
  onLoad = null,
  onError = null,
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = (e) => {
    if (!hasError) {
      setHasError(true);
      const fallbackUrl = getFallbackImage(fallbackType, fallbackName);
      setImgSrc(fallbackUrl);
      
      if (onError) {
        onError(e);
      }
    }
  };

  const handleLoad = (e) => {
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

/**
 * Preload image
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Compress image before upload (client-side)
 */
export const compressImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.8,
      format = 'webp'
    } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: `image/${format}`,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validate file before upload
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  } = options;

  const errors = [];

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get image dimensions from file
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Create thumbnail from image
 */
export const createThumbnail = (file, width = 150, height = 150) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = width;
    canvas.height = height;

    img.onload = () => {
      // Calculate aspect ratio
      const ratio = Math.min(width / img.width, height / img.height);
      const centerX = (width - img.width * ratio) / 2;
      const centerY = (height - img.height * ratio) / 2;

      ctx.drawImage(
        img,
        centerX,
        centerY,
        img.width * ratio,
        img.height * ratio
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const thumbnail = new File([blob], `thumb_${file.name}`, {
              type: 'image/webp',
              lastModified: Date.now()
            });
            resolve(thumbnail);
          } else {
            reject(new Error('Failed to create thumbnail'));
          }
        },
        'image/webp',
        0.8
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export default {
  getFallbackImage,
  isValidImageUrl,
  convertToAbsoluteUrl,
  ImageWithFallback,
  preloadImage,
  compressImage,
  validateImageFile,
  formatFileSize,
  getImageDimensions,
  createThumbnail
};
