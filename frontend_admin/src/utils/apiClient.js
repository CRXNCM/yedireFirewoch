import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Log error for debugging
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ API Timeout Error:', error.message);
    } else if (error.response) {
      console.error('❌ API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('🌐 API Network Error:', error.message);
    } else {
      console.error('❓ API Unknown Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API Service Methods
export const apiService = {
  // Authentication
  auth: {
    login: async (credentials) => {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },
    
    getCurrentUser: async () => {
      const response = await apiClient.get('/auth/me');
      return response.data;
    },
    
    verifyToken: async () => {
      const response = await apiClient.get('/auth/verify-token');
      return response.data;
    },
    
    logout: async () => {
      await apiClient.post('/auth/logout');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
    
    changePassword: async (passwords) => {
      const response = await apiClient.put('/auth/change-password', passwords);
      return response.data;
    }
  },

  // Alerts
  alerts: {
    getAll: async (params = {}) => {
      const response = await apiClient.get('/alerts', { params });
      return response.data;
    },
    
    getById: async (id) => {
      const response = await apiClient.get(`/alerts/${id}`);
      return response.data;
    },
    
    create: async (data) => {
      const response = await apiClient.post('/alerts', data);
      return response.data;
    },
    
    update: async (id, data) => {
      const response = await apiClient.put(`/alerts/${id}`, data);
      return response.data;
    },
    
    updateStatus: async (id, status) => {
      const response = await apiClient.patch(`/alerts/${id}/status`, { status });
      return response.data;
    },
    
    delete: async (id) => {
      const response = await apiClient.delete(`/alerts/${id}`);
      return response.data;
    },
    
    getActive: async () => {
      const response = await apiClient.get('/alerts/active/current');
      return response.data;
    }
  },

  // Banks (bank_info table)
  banks: {
    getAll: async (params = {}) => {
      const response = await apiClient.get('/banks', { params });
      return response.data;
    },
    
    getById: async (id) => {
      const response = await apiClient.get(`/banks/${id}`);
      return response.data;
    },
    
    getPrimary: async () => {
      const response = await apiClient.get('/banks/primary');
      return response.data;
    },
    
    create: async (data) => {
      // Handle both FormData and regular JSON data
      const isFormData = data instanceof FormData;
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      } : {};
      
      const response = await apiClient.post('/banks', data, config);
      return response.data;
    },
    
    update: async (id, data) => {
      // Handle both FormData and regular JSON data
      const isFormData = data instanceof FormData;
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      } : {};
      
      const response = await apiClient.put(`/banks/${id}`, data, config);
      return response.data;
    },
    
    updateStatus: async (id, isActive) => {
      const response = await apiClient.patch(`/banks/${id}/status`, { isActive });
      return response.data;
    },
    
    setPrimary: async (id) => {
      const response = await apiClient.patch(`/banks/${id}/primary`);
      return response.data;
    },
    
    delete: async (id) => {
      const response = await apiClient.delete(`/banks/${id}`);
      return response.data;
    }
  },

  // Schools
  schools: {
    getAll: async (params = {}) => {
      const response = await apiClient.get('/schools', { params });
      return response.data;
    },
    
    getActiveProjects: async () => {
      const response = await apiClient.get('/schools/active-projects');
      return response.data;
    },
    
    getById: async (id) => {
      const response = await apiClient.get(`/schools/${id}`);
      return response.data;
    },
    
    create: async (data) => {
      const response = await apiClient.post('/schools', data);
      return response.data;
    },
    
    update: async (id, data) => {
      const response = await apiClient.put(`/schools/${id}`, data);
      return response.data;
    },
    
    delete: async (id) => {
      const response = await apiClient.delete(`/schools/${id}`);
      return response.data;
    }
  },

  // Testimonials
  testimonials: {
    getAll: async (params = {}) => {
      const response = await apiClient.get('/testimonials', { params });
      return response.data;
    },
    
    getFeatured: async () => {
      const response = await apiClient.get('/testimonials/featured');
      return response.data;
    },
    
    getById: async (id) => {
      const response = await apiClient.get(`/testimonials/${id}`);
      return response.data;
    },
    
    create: async (data) => {
      const response = await apiClient.post('/testimonials', data);
      return response.data;
    },
    
    update: async (id, data) => {
      const response = await apiClient.put(`/testimonials/${id}`, data);
      return response.data;
    },
    
    delete: async (id) => {
      const response = await apiClient.delete(`/testimonials/${id}`);
      return response.data;
    }
  },

  // Sponsors
  sponsors: {
    getAll: async (params = {}) => {
      const response = await apiClient.get('/sponsors', { params });
      return response.data;
    },
    
    getById: async (id) => {
      const response = await apiClient.get(`/sponsors/${id}`);
      return response.data;
    },
    
    create: async (data) => {
      const response = await apiClient.post('/sponsors', data);
      return response.data;
    },
    
    update: async (id, data) => {
      const response = await apiClient.put(`/sponsors/${id}`, data);
      return response.data;
    },
    
    delete: async (id) => {
      const response = await apiClient.delete(`/sponsors/${id}`);
      return response.data;
    }
  },

  // Communities
  communities: {
    getAll: async (params = {}) => {
      const response = await apiClient.get('/communities', { params });
      return response.data;
    },
    
    getById: async (id) => {
      const response = await apiClient.get(`/communities/${id}`);
      return response.data;
    },
    
    create: async (data) => {
      const response = await apiClient.post('/communities', data);
      return response.data;
    },
    
    update: async (id, data) => {
      const response = await apiClient.put(`/communities/${id}`, data);
      return response.data;
    },
    
    delete: async (id) => {
      const response = await apiClient.delete(`/communities/${id}`);
      return response.data;
    }
  },

  // Urgent Messages
  urgentMessages: {
    getAll: async (params = {}) => {
      const response = await apiClient.get('/urgent-messages', { params });
      return response.data;
    },
    
    getById: async (id) => {
      const response = await apiClient.get(`/urgent-messages/${id}`);
      return response.data;
    },
    
    create: async (data) => {
      const response = await apiClient.post('/urgent-messages', data);
      return response.data;
    },
    
    update: async (id, data) => {
      const response = await apiClient.put(`/urgent-messages/${id}`, data);
      return response.data;
    },
    
    updateStatus: async (id, status) => {
      const response = await apiClient.patch(`/urgent-messages/${id}/status`, { status });
      return response.data;
    },
    
    delete: async (id) => {
      const response = await apiClient.delete(`/urgent-messages/${id}`);
      return response.data;
    }
  },

  // Volunteers
  volunteers: {
    getAll: async (params = {}) => {
      const response = await apiClient.get('/volunteers', { params });
      return response.data;
    },
    
    getById: async (id) => {
      const response = await apiClient.get(`/volunteers/${id}`);
      return response.data;
    },
    
    create: async (data) => {
      const response = await apiClient.post('/volunteers', data);
      return response.data;
    },
    
    update: async (id, data) => {
      const response = await apiClient.put(`/volunteers/${id}`, data);
      return response.data;
    },
    
    delete: async (id) => {
      const response = await apiClient.delete(`/volunteers/${id}`);
      return response.data;
    }
  },

  // Social Links
  socialLinks: {
    getAll: async (params = {}) => {
      const response = await apiClient.get('/social-links', { params });
      return response.data;
    },
    
    getById: async (id) => {
      const response = await apiClient.get(`/social-links/${id}`);
      return response.data;
    },
    
    create: async (data) => {
      const response = await apiClient.post('/social-links', data);
      return response.data;
    },
    
    update: async (id, data) => {
      const response = await apiClient.put(`/social-links/${id}`, data);
      return response.data;
    },
    
    delete: async (id) => {
      const response = await apiClient.delete(`/social-links/${id}`);
      return response.data;
    }
  },

  // File Upload
  upload: {
    image: async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await apiClient.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    
    images: async (files) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await apiClient.post('/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
  },

  // School Images (gallery)
  schoolImages: {
    getAll: async (params = {}) => {
      const response = await apiClient.get('/school-images', { params });
      return response.data;
    },
    create: async (payload) => {
      const formData = new FormData();
      if (payload.images && Array.isArray(payload.images)) {
        payload.images.forEach(file => formData.append('images', file));
      }
      if (payload.school_id) formData.append('school_id', payload.school_id);
      if (payload.title) formData.append('title', payload.title);
      if (payload.description) formData.append('description', payload.description);
      if (typeof payload.is_featured === 'boolean') formData.append('is_featured', String(payload.is_featured));

      const response = await apiClient.post('/school-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    update: async (id, data) => {
      const response = await apiClient.put(`/school-images/${id}`, data);
      return response.data;
    },
    delete: async (id) => {
      const response = await apiClient.delete(`/school-images/${id}`);
      return response.data;
    }
  },

  // Health Check
  health: {
    check: async () => {
      const response = await apiClient.get('/health');
      return response.data;
    },
    
    corsTest: async () => {
      const response = await apiClient.get('/cors-test');
      return response.data;
    }
  }
};

export default apiClient;
