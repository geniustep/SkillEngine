import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantQueryDto } from './dto/tenant-query.dto';
import { createPaginatedResponse } from '../../common/dto/pagination.dto';
import { TenantStatus, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: TenantQueryDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      status,
      subscriptionPlan,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.TenantWhereInput = {
      deletedAt: null,
      ...(status && { status }),
      ...(subscriptionPlan && { subscriptionPlan }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          { domain: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [tenants, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          _count: {
            select: {
              users: true,
              courses: true,
            },
          },
        },
      }),
      this.prisma.tenant.count({ where }),
    ]);

    const formattedTenants = tenants.map((tenant) => ({
      ...tenant,
      usersCount: tenant._count.users,
      coursesCount: tenant._count.courses,
      _count: undefined,
    }));

    return createPaginatedResponse(formattedTenants, total, page, limit);
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findFirst({
      where: { id, deletedAt: null },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            users: true,
            courses: true,
            sessions: true,
            enrollments: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('المؤسسة غير موجودة');
    }

    return {
      ...tenant,
      usersCount: tenant._count.users,
      coursesCount: tenant._count.courses,
      sessionsCount: tenant._count.sessions,
      enrollmentsCount: tenant._count.enrollments,
      _count: undefined,
    };
  }

  async create(createTenantDto: CreateTenantDto, createdBy: string) {
    // Generate unique slug
    let slug = slugify(createTenantDto.name, { lower: true, strict: true });
    const existingSlug = await this.prisma.tenant.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Check domain uniqueness if provided
    if (createTenantDto.domain) {
      const existingDomain = await this.prisma.tenant.findUnique({
        where: { domain: createTenantDto.domain },
      });
      if (existingDomain) {
        throw new ConflictException('النطاق مستخدم بالفعل');
      }
    }

    const tenant = await this.prisma.tenant.create({
      data: {
        id: uuidv4(),
        ...createTenantDto,
        slug,
        settings: (createTenantDto.settings || this.getDefaultSettings()) as any,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Log audit
    await this.logAudit(tenant.id, createdBy, 'create', 'tenants', tenant.id, null, tenant);

    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto, updatedBy: string) {
    const existingTenant = await this.findOne(id);

    // Check domain uniqueness if changing
    if (updateTenantDto.domain && updateTenantDto.domain !== existingTenant.domain) {
      const existingDomain = await this.prisma.tenant.findUnique({
        where: { domain: updateTenantDto.domain },
      });
      if (existingDomain) {
        throw new ConflictException('النطاق مستخدم بالفعل');
      }
    }

    const { settings, ...restDto } = updateTenantDto;
    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: {
        ...restDto,
        ...(settings && {
          settings: { ...(existingTenant.settings as object), ...settings } as any,
        }),
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Log audit
    await this.logAudit(id, updatedBy, 'update', 'tenants', id, existingTenant, tenant);

    return tenant;
  }

  async updateStatus(id: string, status: string, updatedBy: string) {
    const existingTenant = await this.findOne(id);

    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: { status: status as TenantStatus },
    });

    // Log audit
    await this.logAudit(id, updatedBy, 'update_status', 'tenants', id, 
      { status: existingTenant.status }, 
      { status: tenant.status }
    );

    return tenant;
  }

  async getTenantStats(id: string) {
    await this.findOne(id);

    const [
      usersCount,
      coursesCount,
      sessionsCount,
      enrollmentsCount,
      activeEnrollments,
      completedEnrollments,
    ] = await Promise.all([
      this.prisma.user.count({ where: { tenantId: id, deletedAt: null } }),
      this.prisma.course.count({ where: { tenantId: id, deletedAt: null } }),
      this.prisma.session.count({ where: { tenantId: id, deletedAt: null } }),
      this.prisma.enrollment.count({ where: { tenantId: id, deletedAt: null } }),
      this.prisma.enrollment.count({ where: { tenantId: id, status: 'active', deletedAt: null } }),
      this.prisma.enrollment.count({ where: { tenantId: id, status: 'completed', deletedAt: null } }),
    ]);

    return {
      users: usersCount,
      courses: coursesCount,
      sessions: sessionsCount,
      enrollments: {
        total: enrollmentsCount,
        active: activeEnrollments,
        completed: completedEnrollments,
      },
      completionRate: enrollmentsCount > 0 
        ? Math.round((completedEnrollments / enrollmentsCount) * 100) 
        : 0,
    };
  }

  private getDefaultSettings() {
    return {
      language: 'ar',
      currency: 'SAR',
      timezone: 'Asia/Riyadh',
      features: {
        realTime: true,
        analytics: true,
        advancedAnalytics: false,
        multiInstructor: true,
        whiteLabel: false,
        customDomain: false,
        sso: false,
      },
    };
  }

  private async logAudit(
    tenantId: string,
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    oldData?: unknown,
    newData?: unknown,
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          id: uuidv4(),
          tenantId,
          userId,
          action,
          resource,
          resourceId,
          oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : null,
          newData: newData ? JSON.parse(JSON.stringify(newData)) : null,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to log audit: ${error}`);
    }
  }
}

