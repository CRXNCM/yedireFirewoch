export interface School {
  id?: number | string;
  name?: string;
  children_served?: number;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: string;
  [key: string]: any;
}
