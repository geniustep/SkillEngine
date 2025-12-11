import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

/**
 * Standard API response wrapper
 */
export interface ApiResponseWrapper<T> {
  success: boolean;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Decorator for list endpoints with pagination
 */
export function ApiPaginatedResponse(model: Type<any>, description?: string) {
  return applyDecorators(
    ApiOperation({ summary: description || `Get list of ${model.name}` }),
    ApiBearerAuth('JWT-auth'),
    ApiSecurity('tenant-id'),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' }),
    ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort field' }),
    ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' }),
    ApiResponse({
      status: 200,
      description: 'Success',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            items: { $ref: `#/components/schemas/${model.name}` },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number', example: 100 },
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 20 },
              totalPages: { type: 'number', example: 5 },
            },
          },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
  );
}

/**
 * Decorator for single item endpoints
 */
export function ApiItemResponse(model: Type<any>, description?: string) {
  return applyDecorators(
    ApiOperation({ summary: description || `Get ${model.name} by ID` }),
    ApiBearerAuth('JWT-auth'),
    ApiSecurity('tenant-id'),
    ApiParam({ name: 'id', type: 'string', description: 'Resource ID' }),
    ApiResponse({
      status: 200,
      description: 'Success',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { $ref: `#/components/schemas/${model.name}` },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Not Found' }),
  );
}

/**
 * Decorator for create endpoints
 */
export function ApiCreateResponse(model: Type<any>, description?: string) {
  return applyDecorators(
    ApiOperation({ summary: description || `Create new ${model.name}` }),
    ApiBearerAuth('JWT-auth'),
    ApiSecurity('tenant-id'),
    ApiResponse({
      status: 201,
      description: 'Created successfully',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { $ref: `#/components/schemas/${model.name}` },
        },
      },
    }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 409, description: 'Conflict - Resource already exists' }),
  );
}

/**
 * Decorator for update endpoints
 */
export function ApiUpdateResponse(model: Type<any>, description?: string) {
  return applyDecorators(
    ApiOperation({ summary: description || `Update ${model.name}` }),
    ApiBearerAuth('JWT-auth'),
    ApiSecurity('tenant-id'),
    ApiParam({ name: 'id', type: 'string', description: 'Resource ID' }),
    ApiResponse({
      status: 200,
      description: 'Updated successfully',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { $ref: `#/components/schemas/${model.name}` },
        },
      },
    }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Not Found' }),
  );
}

/**
 * Decorator for delete endpoints
 */
export function ApiDeleteResponse(description?: string) {
  return applyDecorators(
    ApiOperation({ summary: description || 'Delete resource' }),
    ApiBearerAuth('JWT-auth'),
    ApiSecurity('tenant-id'),
    ApiParam({ name: 'id', type: 'string', description: 'Resource ID' }),
    ApiResponse({
      status: 200,
      description: 'Deleted successfully',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Resource deleted successfully' },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Not Found' }),
  );
}

/**
 * Decorator for status update endpoints
 */
export function ApiStatusUpdateResponse(model: Type<any>) {
  return applyDecorators(
    ApiOperation({ summary: `Update ${model.name} status` }),
    ApiBearerAuth('JWT-auth'),
    ApiSecurity('tenant-id'),
    ApiParam({ name: 'id', type: 'string', description: 'Resource ID' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'active' },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Status updated successfully',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { $ref: `#/components/schemas/${model.name}` },
        },
      },
    }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Not Found' }),
  );
}
