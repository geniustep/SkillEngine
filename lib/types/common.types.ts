export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
}

export type Status = 'active' | 'inactive' | 'suspended' | 'archived';

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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

export interface ApiError {
  message: string;
  code: string;
  field?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  errors?: ApiError[];
}
