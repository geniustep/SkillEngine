import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseQueryDto } from './dto/course-query.dto';
import { createPaginatedResponse } from '../../common/dto/pagination.dto';
import { CourseStatus, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, query: CourseQueryDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      status,
      level,
      category,
      instructorId,
      featured,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {
      tenantId,
      deletedAt: null,
      ...(status && { status }),
      ...(level && { level }),
      ...(category && { category }),
      ...(instructorId && { instructorId }),
      ...(featured !== undefined && { featured }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { shortDescription: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              enrollments: true,
              sessions: true,
              curriculum: true,
            },
          },
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    const formattedCourses = courses.map((course) => ({
      ...course,
      enrollmentsCount: course._count.enrollments,
      sessionsCount: course._count.sessions,
      lessonsCount: course._count.curriculum,
      _count: undefined,
    }));

    return createPaginatedResponse(formattedCourses, total, page, limit);
  }

  async findOne(id: string, tenantId: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null,
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
          },
        },
        curriculum: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            parentId: true,
            order: true,
            duration: true,
            isFree: true,
            isPublished: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            sessions: true,
            reviews: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('الدورة غير موجودة');
    }

    return {
      ...course,
      enrollmentsCount: course._count.enrollments,
      sessionsCount: course._count.sessions,
      reviewsCount: course._count.reviews,
      _count: undefined,
    };
  }

  async create(createCourseDto: CreateCourseDto, tenantId: string, createdBy: string) {
    // Generate unique slug
    let slug = slugify(createCourseDto.title, { lower: true, strict: true });
    const existingSlug = await this.prisma.course.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Verify instructor exists
    const instructor = await this.prisma.user.findFirst({
      where: {
        id: createCourseDto.instructorId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!instructor) {
      throw new BadRequestException('المدرب غير موجود');
    }

    const course = await this.prisma.course.create({
      data: {
        id: uuidv4(),
        ...createCourseDto,
        slug,
        tenantId,
        metadata: (createCourseDto.metadata || {}) as any,
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Log audit
    await this.logAudit(tenantId, createdBy, 'create', 'courses', course.id, null, course);

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, tenantId: string, updatedBy: string) {
    const existingCourse = await this.findOne(id, tenantId);

    // Update slug if title changed
    let slug = existingCourse.slug;
    if (updateCourseDto.title && updateCourseDto.title !== existingCourse.title) {
      slug = slugify(updateCourseDto.title, { lower: true, strict: true });
      const existingSlug = await this.prisma.course.findFirst({
        where: { slug, id: { not: id } },
      });
      if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const { metadata, ...restDto } = updateCourseDto;
    const course = await this.prisma.course.update({
      where: { id },
      data: {
        ...restDto,
        slug,
        ...(metadata && {
          metadata: { ...(existingCourse.metadata as object), ...metadata } as any,
        }),
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Log audit
    await this.logAudit(tenantId, updatedBy, 'update', 'courses', id, existingCourse, course);

    return course;
  }

  async updateStatus(id: string, status: CourseStatus, tenantId: string, updatedBy: string) {
    const existingCourse = await this.findOne(id, tenantId);

    const updateData: Prisma.CourseUpdateInput = { status };

    // Set publishedAt when publishing
    if (status === 'published' && !existingCourse.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const course = await this.prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Log audit
    await this.logAudit(
      tenantId,
      updatedBy,
      'update_status',
      'courses',
      id,
      { status: existingCourse.status },
      { status: course.status },
    );

    return course;
  }

  async remove(id: string, tenantId: string, deletedBy: string) {
    const course = await this.findOne(id, tenantId);

    // Check if course has active enrollments
    const activeEnrollments = await this.prisma.enrollment.count({
      where: {
        courseId: id,
        status: 'active',
        deletedAt: null,
      },
    });

    if (activeEnrollments > 0) {
      throw new BadRequestException('لا يمكن حذف دورة بها تسجيلات نشطة');
    }

    // Soft delete
    await this.prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Log audit
    await this.logAudit(tenantId, deletedBy, 'delete', 'courses', id, course, null);
  }

  async enrollStudent(courseId: string, studentId: string, tenantId: string, enrolledBy: string) {
    const course = await this.findOne(courseId, tenantId);

    if (course.status !== 'published') {
      throw new BadRequestException('لا يمكن التسجيل في دورة غير منشورة');
    }

    // Check if student exists
    const student = await this.prisma.user.findFirst({
      where: { id: studentId, tenantId, deletedAt: null },
    });

    if (!student) {
      throw new BadRequestException('الطالب غير موجود');
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

    const enrollment = await this.prisma.enrollment.create({
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

    // Update course enrollment count
    await this.prisma.course.update({
      where: { id: courseId },
      data: { enrollmentCount: { increment: 1 } },
    });

    // Log audit
    await this.logAudit(tenantId, enrolledBy, 'enroll', 'enrollments', enrollment.id, null, enrollment);

    return enrollment;
  }

  async getCourseStudents(courseId: string, tenantId: string) {
    await this.findOne(courseId, tenantId);

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        courseId,
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
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return enrollments.map((e) => ({
      ...e.student,
      enrollmentId: e.id,
      progress: e.progress,
      status: e.status,
      enrolledAt: e.enrolledAt,
      completedAt: e.completedAt,
    }));
  }

  async getCourseAnalytics(courseId: string, tenantId: string) {
    await this.findOne(courseId, tenantId);

    const [enrollments, completions, avgProgress] = await Promise.all([
      this.prisma.enrollment.count({
        where: { courseId, deletedAt: null },
      }),
      this.prisma.enrollment.count({
        where: { courseId, status: 'completed', deletedAt: null },
      }),
      this.prisma.enrollment.aggregate({
        where: { courseId, deletedAt: null },
        _avg: { progress: true },
      }),
    ]);

    const completionRate = enrollments > 0 ? (completions / enrollments) * 100 : 0;

    return {
      totalEnrollments: enrollments,
      completedEnrollments: completions,
      completionRate: Math.round(completionRate * 100) / 100,
      averageProgress: Math.round((avgProgress._avg.progress || 0) * 100) / 100,
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

