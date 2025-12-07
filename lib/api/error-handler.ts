import { AxiosError } from 'axios';
import { ApiError } from '@/lib/types/common.types';

export class ApiClientError extends Error {
  public statusCode?: number;
  public errors?: ApiError[];

  constructor(message: string, statusCode?: number, errors?: ApiError[]) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export function handleApiError(error: unknown): ApiClientError {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;
    const data = error.response?.data;

    if (data?.error) {
      return new ApiClientError(
        data.error.message || 'An error occurred',
        statusCode,
        data.errors
      );
    }

    if (data?.message) {
      return new ApiClientError(data.message, statusCode);
    }

    return new ApiClientError(
      error.message || 'An unexpected error occurred',
      statusCode
    );
  }

  if (error instanceof Error) {
    return new ApiClientError(error.message);
  }

  return new ApiClientError('An unexpected error occurred');
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.message ||
      'An error occurred'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}
