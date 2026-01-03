export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  date?: string;
  status?: string;
  priority?: number;
  type?: string;
  completed?: boolean;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}