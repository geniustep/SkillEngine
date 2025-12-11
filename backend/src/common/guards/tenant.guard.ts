import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  private readonly logger = new Logger(TenantGuard.name);

  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const tenantId = request.headers['x-tenant-id'] as string;

    // If no tenant ID in header, try to get from user
    if (!tenantId) {
      const user = request.user as { tenantId?: string };
      if (user?.tenantId) {
        request.headers['x-tenant-id'] = user.tenantId;
        return true;
      }
      throw new BadRequestException('X-Tenant-ID header is required');
    }

    // Validate tenant exists and is active
    try {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { id: true, status: true },
      });

      if (!tenant) {
        throw new BadRequestException('المؤسسة غير موجودة');
      }

      if (tenant.status !== 'active') {
        throw new BadRequestException('المؤسسة غير نشطة');
      }

      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Tenant validation error: ${error}`);
      throw new BadRequestException('فشل التحقق من المؤسسة');
    }
  }
}

