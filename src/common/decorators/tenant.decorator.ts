import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const tenantId = request.headers['x-tenant-id'] as string;

    if (!tenantId) {
      // Try to get from user
      const user = request.user as { tenantId?: string };
      if (user?.tenantId) {
        return user.tenantId;
      }
      throw new BadRequestException('X-Tenant-ID header is required');
    }

    return tenantId;
  },
);

