import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { EnrollmentQueryDto } from './dto/enrollment-query.dto';
import { createPaginatedResponse } from '../../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EnrollmentsService {
  private readonly logger = new Logger(EnrollmentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, query: EnrollmentQueryDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'enrolledAt',
      sortOrder = 'desc',
      studentId,
      courseId,
      status,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.EnrollmentWhereInput = {
      tenantId,
      deletedAt: null,
      ...(studentId && { studentId }),
      ...(courseId && { courseId }),
      ...(status && { status }),
    };

    const [enrollments, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
              level: true,
              instructor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.enrollment.count({ where }),
    ]);

    return createPaginatedResponse(enrollments, total, page, limit);
  }

  async findOne(id: string, tenantId: string) {
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
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
            curriculum: {
              where: { deletedAt: null },
              select: {
                id: true,
                title: true,
                type: true,
                duration: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('التسجيل غير موجود');
    }

    return enrollment;
  }

  async create(createEnrollmentDto: CreateEnrollmentDto, tenantId: string, createdBy: string) {
    const { studentId, courseId } = createEnrollmentDto;

    // Verify student exists
    const student = await this.prisma.user.findFirst({
      where: { id: studentId, tenantId, deletedAt: null },
    });

    if (!student) {
      throw new BadRequestException('الطالب غير موجود');
    }

    // Verify course exists and is published
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, tenantId, deletedAt: null },
    });

    if (!course) {
      throw new BadRequestException('الدورة غير موجودة');
    }

    if (course.status !== 'published') {
      throw new BadRequestException('لا يمكن التسجيل في دورة غير منشورة');
    }

    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId },
      },
    });

    if (existingEnrollment && !existingEnrollment.deletedAt) {
      throw new ConflictException('الطالب مسجل بالفعل في هذه الدورة');
    }

    // Create or reactivate enrollment
    let enrollment;
    if (existingEnrollment) {
      enrollment = await this.prisma.enrollment.update({
        where: { id: existingEnrollment.id },
        data: {
          status: 'active',
          progress: 0,
          completedLessons: [] as any,
          enrolledAt: new Date(),
          deletedAt: null,
        },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
    } else {
      enrollment = await this.prisma.enrollment.create({
        data: {
          id: uuidv4(),
          studentId,
          courseId,
          tenantId,
        },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
    }

    // Update course enrollment count
    await this.prisma.course.update({
      where: { id: courseId },
      data: { enrollmentCount: { increment: 1 } },
    });

    // Log audit
    await this.logAudit(tenantId, createdBy, 'create', 'enrollments', enrollment.id, null, enrollment);

    return enrollment;
  }

  async updateProgress(
    id: string,
    updateProgressDto: UpdateProgressDto,
    tenantId: string,
    updatedBy: string,
  ) {
    const existingEnrollment = await this.findOne(id, tenantId);

    if (existingEnrollment.status !== 'active') {
      throw new BadRequestException('لا يمكن تحديث تقدم تسجيل غير نشط');
    }

    const enrollment = await this.prisma.enrollment.update({
      where: { id },
      data: {
        progress: updateProgressDto.progress,
        completedLessons: (updateProgressDto.completedLessons || existingEnrollment.completedLessons) as any,
        lastAccessedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Log audit
    await this.logAudit(tenantId, updatedBy, 'update_progress', 'enrollments', id, null, {
      progress: enrollment.progress,
    });

    return enrollment;
  }

  async markComplete(id: string, tenantId: string, completedBy: string) {
    const enrollment = await this.findOne(id, tenantId);

    if (enrollment.status === 'completed') {
      throw new BadRequestException('التسجيل مكتمل بالفعل');
    }

    const updatedEnrollment = await this.prisma.enrollment.update({
      where: { id },
      data: {
        status: 'completed',
        progress: 100,
        completedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // TODO: Generate certificate

    // Log audit
    await this.logAudit(tenantId, completedBy, 'complete', 'enrollments', id, null, {
      status: 'completed',
    });

    return updatedEnrollment;
  }

  async remove(id: string, tenantId: string, deletedBy: string) {
    const enrollment = await this.findOne(id, tenantId);

    // Soft delete
    await this.prisma.enrollment.update({
      where: { id },
      data: {
        status: 'dropped',
        deletedAt: new Date(),
      },
    });

    // Update course enrollment count
    await this.prisma.course.update({
      where: { id: enrollment.courseId },
      data: { enrollmentCount: { decrement: 1 } },
    });

    // Log audit
    await this.logAudit(tenantId, deletedBy, 'delete', 'enrollments', id, enrollment, null);
  }

  async getCertificate(id: string, tenantId: string) {
    const enrollment = await this.findOne(id, tenantId);

    if (enrollment.status !== 'completed') {
      throw new BadRequestException('لا يمكن الحصول على شهادة لتسجيل غير مكتمل');
    }

    if (!enrollment.certificateUrl) {
      // TODO: Generate certificate if not exists
      throw new BadRequestException('الشهادة غير متوفرة بعد');
    }

    return {
      certificateUrl: enrollment.certificateUrl,
      studentName: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
      courseName: enrollment.course.title,
      completedAt: enrollment.completedAt,
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

