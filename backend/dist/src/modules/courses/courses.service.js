"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CoursesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const uuid_1 = require("uuid");
const slugify_1 = __importDefault(require("slugify"));
let CoursesService = CoursesService_1 = class CoursesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CoursesService_1.name);
    }
    async findAll(tenantId, query) {
        const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', search, status, level, category, instructorId, featured, } = query;
        const skip = (page - 1) * limit;
        const where = {
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
        return (0, pagination_dto_1.createPaginatedResponse)(formattedCourses, total, page, limit);
    }
    async findOne(id, tenantId) {
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
            throw new common_1.NotFoundException('الدورة غير موجودة');
        }
        return {
            ...course,
            enrollmentsCount: course._count.enrollments,
            sessionsCount: course._count.sessions,
            reviewsCount: course._count.reviews,
            _count: undefined,
        };
    }
    async create(createCourseDto, tenantId, createdBy) {
        let slug = (0, slugify_1.default)(createCourseDto.title, { lower: true, strict: true });
        const existingSlug = await this.prisma.course.findUnique({ where: { slug } });
        if (existingSlug) {
            slug = `${slug}-${Date.now()}`;
        }
        const instructor = await this.prisma.user.findFirst({
            where: {
                id: createCourseDto.instructorId,
                tenantId,
                deletedAt: null,
            },
        });
        if (!instructor) {
            throw new common_1.BadRequestException('المدرب غير موجود');
        }
        const course = await this.prisma.course.create({
            data: {
                id: (0, uuid_1.v4)(),
                ...createCourseDto,
                slug,
                tenantId,
                metadata: createCourseDto.metadata || {},
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
        await this.logAudit(tenantId, createdBy, 'create', 'courses', course.id, null, course);
        return course;
    }
    async update(id, updateCourseDto, tenantId, updatedBy) {
        const existingCourse = await this.findOne(id, tenantId);
        let slug = existingCourse.slug;
        if (updateCourseDto.title && updateCourseDto.title !== existingCourse.title) {
            slug = (0, slugify_1.default)(updateCourseDto.title, { lower: true, strict: true });
            const existingSlug = await this.prisma.course.findFirst({
                where: { slug, id: { not: id } },
            });
            if (existingSlug) {
                slug = `${slug}-${Date.now()}`;
            }
        }
        const course = await this.prisma.course.update({
            where: { id },
            data: {
                ...updateCourseDto,
                slug,
                metadata: updateCourseDto.metadata
                    ? { ...existingCourse.metadata, ...updateCourseDto.metadata }
                    : undefined,
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
        await this.logAudit(tenantId, updatedBy, 'update', 'courses', id, existingCourse, course);
        return course;
    }
    async updateStatus(id, status, tenantId, updatedBy) {
        const existingCourse = await this.findOne(id, tenantId);
        const updateData = { status };
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
        await this.logAudit(tenantId, updatedBy, 'update_status', 'courses', id, { status: existingCourse.status }, { status: course.status });
        return course;
    }
    async remove(id, tenantId, deletedBy) {
        const course = await this.findOne(id, tenantId);
        const activeEnrollments = await this.prisma.enrollment.count({
            where: {
                courseId: id,
                status: 'active',
                deletedAt: null,
            },
        });
        if (activeEnrollments > 0) {
            throw new common_1.BadRequestException('لا يمكن حذف دورة بها تسجيلات نشطة');
        }
        await this.prisma.course.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        await this.logAudit(tenantId, deletedBy, 'delete', 'courses', id, course, null);
    }
    async enrollStudent(courseId, studentId, tenantId, enrolledBy) {
        const course = await this.findOne(courseId, tenantId);
        if (course.status !== 'published') {
            throw new common_1.BadRequestException('لا يمكن التسجيل في دورة غير منشورة');
        }
        const student = await this.prisma.user.findFirst({
            where: { id: studentId, tenantId, deletedAt: null },
        });
        if (!student) {
            throw new common_1.BadRequestException('الطالب غير موجود');
        }
        const existingEnrollment = await this.prisma.enrollment.findUnique({
            where: {
                studentId_courseId: { studentId, courseId },
            },
        });
        if (existingEnrollment && !existingEnrollment.deletedAt) {
            throw new common_1.ConflictException('الطالب مسجل بالفعل في هذه الدورة');
        }
        const enrollment = await this.prisma.enrollment.create({
            data: {
                id: (0, uuid_1.v4)(),
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
        await this.prisma.course.update({
            where: { id: courseId },
            data: { enrollmentCount: { increment: 1 } },
        });
        await this.logAudit(tenantId, enrolledBy, 'enroll', 'enrollments', enrollment.id, null, enrollment);
        return enrollment;
    }
    async getCourseStudents(courseId, tenantId) {
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
    async getCourseAnalytics(courseId, tenantId) {
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
    async logAudit(tenantId, userId, action, resource, resourceId, oldData, newData) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    tenantId,
                    userId,
                    action,
                    resource,
                    resourceId,
                    oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : null,
                    newData: newData ? JSON.parse(JSON.stringify(newData)) : null,
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to log audit: ${error}`);
        }
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = CoursesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map