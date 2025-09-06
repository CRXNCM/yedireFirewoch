// Database Types for YeDire Firewoch MySQL Schema

export interface Admin {
  id: number;
  username: string;
  password: string;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Omit<Admin, 'password'>;
}

export interface BankInfo {
  id: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  routing_number?: string;
  swift_code?: string;
  bank_address?: string;
  bank_image?: string;
  is_active: boolean;
  last_updated: string;
  payment_link?: string;
}

export interface Community {
  id: number;
  name: string;
  region?: string;
  description?: string;
  created_at: string;
}

export interface School {
  school_id: string;
  name: string;
  description?: string;
  region?: string;
  children_served: number;
  created_at: string;
}

export interface SchoolImage {
  id: number;
  school_id: string;
  image_name: string;
  title?: string;
  description?: string;
  is_featured: boolean;
  upload_date: string;
}

export interface Sponsor {
  id: number;
  name: string;
  description?: string;
  logo_path: string;
  website_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role?: string;
  message: string;
  image_path?: string;
  rating: number;
  is_active: boolean;
  created_at: string;
}

export interface UrgentMessage {
  id: number;
  title: string;
  message: string;
  image_path?: string;
  urgency_level: 'Urgent' | 'Important' | 'Normal';
  status: 'active' | 'inactive';
  action_link?: string;
  action_text?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon_class: string;
  display_order: number;
  is_active: boolean;
  date_added: string;
  last_updated: string;
}

export interface Donation {
  id: number;
  donation_id: string;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  donor_address?: string;
  amount: number;
  donation_date: string;
  payment_method: string;
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  donor_message?: string;
  admin_notes?: string;
  last_updated?: string;
}

export interface Volunteer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  join_date: string;
}

export interface FooterLink {
  id: number;
  title: string;
  url: string;
  display_order: number;
  is_active: boolean;
  date_added: string;
  last_updated: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Data Types
export interface CreateSchoolData {
  school_id: string;
  name: string;
  description?: string;
  region?: string;
  children_served: number;
}

export interface CreateSponsorData {
  name: string;
  description?: string;
  logo_path: string;
  website_url?: string;
}

export interface CreateTestimonialData {
  name: string;
  role?: string;
  message: string;
  image_path?: string;
  rating: number;
}

export interface CreateUrgentMessageData {
  title: string;
  message: string;
  image_path?: string;
  urgency_level: 'Urgent' | 'Important' | 'Normal';
  action_link?: string;
  action_text?: string;
}

// API Service Parameters
export interface GetAllParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
