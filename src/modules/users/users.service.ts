import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { createPaginatedResponse } from '../../common/dto/pagination.dto';
import { UserStatus, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, query: UserQueryDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      role,
      status,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      tenantId,
      deletedAt: null,
      ...(role && { role }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          status: true,
          bio: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const formattedUsers = users.map((user) => ({
      ...user,
      enrollmentsCount: user._count.enrollments,
      _count: undefined,
    }));

    return createPaginatedResponse(formattedUsers, total, page, limit);
  }

  async findOne(id: string, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      include: {
        instructor: {
          select: {
            id: true,
            isVerified: true,
            rating: true,
            totalStudents: true,
            totalCourses: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            sessionsAsInstructor: true,
            coursesAsInstructor: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    return {
      ...user,
      enrollmentsCount: user._count.enrollments,
      sessionsCount: user._count.sessionsAsInstructor,
      coursesCount: user._count.coursesAsInstructor,
      _count: undefined,
    };
  }

  async create(createUserDto: CreateUserDto, tenantId: string, createdBy: string) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
    }

    // Generate a temporary keycloakId (in production, this would be created via Keycloak)
    const keycloakId = `kc_${uuidv4()}`;

    const user = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        ...createUserDto,
        keycloakId,
        tenantId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Log audit
    await this.logAudit(tenantId, createdBy, 'create', 'users', user.id, null, user);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, tenantId: string, updatedBy: string) {
    const existingUser = await this.findOne(id, tenantId);

    // Check email uniqueness if changing email
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (emailExists) {
        throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Log audit
    await this.logAudit(tenantId, updatedBy, 'update', 'users', id, existingUser, user);

    return user;
  }

  async updateStatus(id: string, status: UserStatus, tenantId: string, updatedBy: string) {
    const existingUser = await this.findOne(id, tenantId);

    // Prevent self-suspension for admins
    if (id === updatedBy && status === 'suspended') {
      throw new BadRequestException('لا يمكنك تعليق حسابك الخاص');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    // Log audit
    await this.logAudit(
      tenantId,
      updatedBy,
      'update_status',
      'users',
      id,
      { status: existingUser.status },
      { status: user.status },
    );

    return user;
  }

  async remove(id: string, tenantId: string, deletedBy: string) {
    const user = await this.findOne(id, tenantId);

    // Prevent self-deletion
    if (id === deletedBy) {
      throw new BadRequestException('لا يمكنك حذف حسابك الخاص');
    }

    // Soft delete
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Log audit
    await this.logAudit(tenantId, deletedBy, 'delete', 'users', id, user, null);
  }

  async getUserEnrollments(userId: string, tenantId: string) {
    await this.findOne(userId, tenantId);

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId: userId,
        deletedAt: null,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            level: true,
            duration: true,
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return enrollments;
  }

  async getUserActivity(userId: string, tenantId: string) {
    await this.findOne(userId, tenantId);

    const activities = await this.prisma.auditLog.findMany({
      where: {
        userId,
        tenantId,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        action: true,
        resource: true,
        resourceId: true,
        createdAt: true,
      },
    });

    return activities;
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

