import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { InstructorQueryDto } from './dto/instructor-query.dto';
import { createPaginatedResponse } from '../../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InstructorsService {
  private readonly logger = new Logger(InstructorsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, query: InstructorQueryDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      isVerified,
      specialization,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.InstructorWhereInput = {
      deletedAt: null,
      user: {
        tenantId,
        deletedAt: null,
      },
      ...(isVerified !== undefined && { isVerified }),
      ...(specialization && { specialization: { has: specialization } }),
      ...(search && {
        OR: [
          { user: { firstName: { contains: search, mode: 'insensitive' } } },
          { user: { lastName: { contains: search, mode: 'insensitive' } } },
          { biography: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [instructors, total] = await Promise.all([
      this.prisma.instructor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
              phone: true,
            },
          },
        },
      }),
      this.prisma.instructor.count({ where }),
    ]);

    const formattedInstructors = instructors.map((instructor) => ({
      instructorId: instructor.id,
      userId: instructor.userId,
      ...instructor.user,
      title: instructor.title,
      specialization: instructor.specialization,
      expertise: instructor.expertise,
      biography: instructor.biography,
      rating: instructor.rating,
      reviewCount: instructor.reviewCount,
      totalStudents: instructor.totalStudents,
      totalCourses: instructor.totalCourses,
      isVerified: instructor.isVerified,
      hourlyRate: instructor.hourlyRate,
      createdAt: instructor.createdAt,
    }));

    return createPaginatedResponse(formattedInstructors, total, page, limit);
  }

  async findOne(id: string, tenantId: string) {
    const instructor = await this.prisma.instructor.findFirst({
      where: {
        id,
        deletedAt: null,
        user: {
          tenantId,
          deletedAt: null,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            phone: true,
            bio: true,
            _count: {
              select: {
                coursesAsInstructor: true,
                sessionsAsInstructor: true,
              },
            },
          },
        },
      },
    });

    if (!instructor) {
      throw new NotFoundException('المدرب غير موجود');
    }

    return {
      instructorId: instructor.id,
      userId: instructor.userId,
      ...instructor.user,
      title: instructor.title,
      specialization: instructor.specialization,
      expertise: instructor.expertise,
      biography: instructor.biography,
      certifications: instructor.certifications,
      socialLinks: instructor.socialLinks,
      hourlyRate: instructor.hourlyRate,
      availability: instructor.availability,
      rating: instructor.rating,
      reviewCount: instructor.reviewCount,
      totalStudents: instructor.totalStudents,
      totalCourses: instructor.user._count.coursesAsInstructor,
      totalSessions: instructor.user._count.sessionsAsInstructor,
      isVerified: instructor.isVerified,
      createdAt: instructor.createdAt,
      updatedAt: instructor.updatedAt,
    };
  }

  async create(createInstructorDto: CreateInstructorDto, tenantId: string, createdBy: string) {
    // Verify user exists and belongs to tenant
    const user = await this.prisma.user.findFirst({
      where: {
        id: createInstructorDto.userId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new BadRequestException('المستخدم غير موجود');
    }

    // Check if instructor profile already exists
    const existingInstructor = await this.prisma.instructor.findUnique({
      where: { userId: createInstructorDto.userId },
    });

    if (existingInstructor) {
      throw new ConflictException('المستخدم لديه ملف مدرب بالفعل');
    }

    const instructor = await this.prisma.instructor.create({
      data: {
        id: uuidv4(),
        ...createInstructorDto,
        certifications: (createInstructorDto.certifications || []) as any,
        socialLinks: (createInstructorDto.socialLinks || {}) as any,
        availability: (createInstructorDto.availability || {}) as any,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    // Update user role to instructor if needed
    if (user.role === 'student') {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { role: 'instructor' },
      });
    }

    // Log audit
    await this.logAudit(tenantId, createdBy, 'create', 'instructors', instructor.id, null, instructor);

    return instructor;
  }

  async update(id: string, updateInstructorDto: UpdateInstructorDto, tenantId: string, updatedBy: string) {
    const existingInstructor = await this.findOne(id, tenantId);

    const { certifications, socialLinks, availability, ...restDto } = updateInstructorDto;
    const instructor = await this.prisma.instructor.update({
      where: { id },
      data: {
        ...restDto,
        ...(certifications && { certifications: certifications as any }),
        ...(socialLinks && {
          socialLinks: { ...(existingInstructor.socialLinks as object), ...socialLinks } as any,
        }),
        ...(availability && {
          availability: { ...(existingInstructor.availability as object), ...availability } as any,
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    // Log audit
    await this.logAudit(tenantId, updatedBy, 'update', 'instructors', id, existingInstructor, instructor);

    return instructor;
  }

  async verify(id: string, isVerified: boolean, tenantId: string, verifiedBy: string) {
    await this.findOne(id, tenantId);

    const instructor = await this.prisma.instructor.update({
      where: { id },
      data: { isVerified },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Log audit
    await this.logAudit(tenantId, verifiedBy, 'verify', 'instructors', id, null, { isVerified });

    return instructor;
  }

  async remove(id: string, tenantId: string, deletedBy: string) {
    const instructor = await this.findOne(id, tenantId);

    // Check if instructor has active courses
    const activeCourses = await this.prisma.course.count({
      where: {
        instructorId: instructor.userId,
        status: 'published',
        deletedAt: null,
      },
    });

    if (activeCourses > 0) {
      throw new BadRequestException('لا يمكن حذف مدرب لديه دورات نشطة');
    }

    // Soft delete
    await this.prisma.instructor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Log audit
    await this.logAudit(tenantId, deletedBy, 'delete', 'instructors', id, instructor, null);
  }

  async getInstructorCourses(instructorId: string, tenantId: string) {
    const instructor = await this.findOne(instructorId, tenantId);

    return this.prisma.course.findMany({
      where: {
        instructorId: instructor.userId,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        status: true,
        level: true,
        enrollmentCount: true,
        rating: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInstructorSessions(instructorId: string, tenantId: string) {
    const instructor = await this.findOne(instructorId, tenantId);

    return this.prisma.session.findMany({
      where: {
        instructorId: instructor.userId,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        scheduledStart: true,
        scheduledEnd: true,
        status: true,
        currentParticipants: true,
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { scheduledStart: 'asc' },
      take: 20,
    });
  }

  async getAvailability(instructorId: string, tenantId: string) {
    const instructor = await this.findOne(instructorId, tenantId);
    return instructor.availability;
  }

  async updateAvailability(
    instructorId: string,
    availability: Record<string, unknown>,
    tenantId: string,
    updatedBy: string,
  ) {
    await this.findOne(instructorId, tenantId);

    const instructor = await this.prisma.instructor.update({
      where: { id: instructorId },
      data: { availability: availability as any },
    });

    // Log audit
    await this.logAudit(tenantId, updatedBy, 'update_availability', 'instructors', instructorId, null, {
      availability,
    });

    return instructor.availability;
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

