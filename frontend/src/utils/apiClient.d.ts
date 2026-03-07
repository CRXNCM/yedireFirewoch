import { AxiosInstance } from 'axios';

export const apiService: {
  auth: {
    login: (credentials: any) => Promise<any>;
    getCurrentUser: () => Promise<any>;
    verifyToken: () => Promise<any>;
    logout: () => Promise<void>;
    changePassword: (passwords: any) => Promise<any>;
  };
  alerts: {
    getAll: (params?: any) => Promise<any>;
    getById: (id: any) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: any, data: any) => Promise<any>;
    updateStatus: (id: any, status: any) => Promise<any>;
    delete: (id: any) => Promise<any>;
    getActive: () => Promise<any>;
  };
  banks: {
    getAll: (params?: any) => Promise<any>;
    getById: (id: any) => Promise<any>;
    getPrimary: () => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: any, data: any) => Promise<any>;
    updateStatus: (id: any, isActive: any) => Promise<any>;
    setPrimary: (id: any) => Promise<any>;
    delete: (id: any) => Promise<any>;
  };
  schools: {
    getAll: (params?: any) => Promise<any>;
    getActiveProjects: () => Promise<any>;
    getById: (id: any) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: any, data: any) => Promise<any>;
    delete: (id: any) => Promise<any>;
  };
  testimonials: {
    getAll: (params?: any) => Promise<any>;
    getFeatured: () => Promise<any>;
    getById: (id: any) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: any, data: any) => Promise<any>;
    delete: (id: any) => Promise<any>;
  };
  sponsors: {
    getAll: (params?: any) => Promise<any>;
    getById: (id: any) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: any, data: any) => Promise<any>;
    delete: (id: any) => Promise<any>;
  };
  communities: {
    getAll: (params?: any) => Promise<any>;
    getById: (id: any) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: any, data: any) => Promise<any>;
    delete: (id: any) => Promise<any>;
  };
  urgentMessages: {
    getAll: (params?: any) => Promise<any>;
    getById: (id: any) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: any, data: any) => Promise<any>;
    updateStatus: (id: any, status: any) => Promise<any>;
    delete: (id: any) => Promise<any>;
  };
  volunteers: {
    getAll: (params?: any) => Promise<any>;
    getById: (id: any) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: any, data: any) => Promise<any>;
    delete: (id: any) => Promise<any>;
  };
  socialLinks: {
    getAll: (params?: any) => Promise<any>;
    getById: (id: any) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: any, data: any) => Promise<any>;
    delete: (id: any) => Promise<any>;
  };
  upload: {
    image: (file: any) => Promise<any>;
    images: (files: any[]) => Promise<any>;
  };
  schoolImages: {
    getAll: (params?: any) => Promise<any>;
    create: (payload: any) => Promise<any>;
    update: (id: any, data: any) => Promise<any>;
    delete: (id: any) => Promise<any>;
  };
  health: {
    check: () => Promise<any>;
    corsTest: () => Promise<any>;
  };
};

declare const apiClient: AxiosInstance;
export default apiClient;
