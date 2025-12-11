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
var EnrollmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const uuid_1 = require("uuid");
let EnrollmentsService = EnrollmentsService_1 = class EnrollmentsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(EnrollmentsService_1.name);
    }
    async findAll(tenantId, query) {
        const { page = 1, limit = 20, sortBy = 'enrolledAt', sortOrder = 'desc', studentId, courseId, status, } = query;
        const skip = (page - 1) * limit;
        const where = {
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
        return (0, pagination_dto_1.createPaginatedResponse)(enrollments, total, page, limit);
    }
    async findOne(id, tenantId) {
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
            throw new common_1.NotFoundException('التسجيل غير موجود');
        }
        return enrollment;
    }
    async create(createEnrollmentDto, tenantId, createdBy) {
        const { studentId, courseId } = createEnrollmentDto;
        const student = await this.prisma.user.findFirst({
            where: { id: studentId, tenantId, deletedAt: null },
        });
        if (!student) {
            throw new common_1.BadRequestException('الطالب غير موجود');
        }
        const course = await this.prisma.course.findFirst({
            where: { id: courseId, tenantId, deletedAt: null },
        });
        if (!course) {
            throw new common_1.BadRequestException('الدورة غير موجودة');
        }
        if (course.status !== 'published') {
            throw new common_1.BadRequestException('لا يمكن التسجيل في دورة غير منشورة');
        }
        const existingEnrollment = await this.prisma.enrollment.findUnique({
            where: {
                studentId_courseId: { studentId, courseId },
            },
        });
        if (existingEnrollment && !existingEnrollment.deletedAt) {
            throw new common_1.ConflictException('الطالب مسجل بالفعل في هذه الدورة');
        }
        let enrollment;
        if (existingEnrollment) {
            enrollment = await this.prisma.enrollment.update({
                where: { id: existingEnrollment.id },
                data: {
                    status: 'active',
                    progress: 0,
                    completedLessons: [],
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
        }
        else {
            enrollment = await this.prisma.enrollment.create({
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
        }
        await this.prisma.course.update({
            where: { id: courseId },
            data: { enrollmentCount: { increment: 1 } },
        });
        await this.logAudit(tenantId, createdBy, 'create', 'enrollments', enrollment.id, null, enrollment);
        return enrollment;
    }
    async updateProgress(id, updateProgressDto, tenantId, updatedBy) {
        const existingEnrollment = await this.findOne(id, tenantId);
        if (existingEnrollment.status !== 'active') {
            throw new common_1.BadRequestException('لا يمكن تحديث تقدم تسجيل غير نشط');
        }
        const enrollment = await this.prisma.enrollment.update({
            where: { id },
            data: {
                progress: updateProgressDto.progress,
                completedLessons: updateProgressDto.completedLessons || existingEnrollment.completedLessons,
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
        await this.logAudit(tenantId, updatedBy, 'update_progress', 'enrollments', id, null, {
            progress: enrollment.progress,
        });
        return enrollment;
    }
    async markComplete(id, tenantId, completedBy) {
        const enrollment = await this.findOne(id, tenantId);
        if (enrollment.status === 'completed') {
            throw new common_1.BadRequestException('التسجيل مكتمل بالفعل');
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
        await this.logAudit(tenantId, completedBy, 'complete', 'enrollments', id, null, {
            status: 'completed',
        });
        return updatedEnrollment;
    }
    async remove(id, tenantId, deletedBy) {
        const enrollment = await this.findOne(id, tenantId);
        await this.prisma.enrollment.update({
            where: { id },
            data: {
                status: 'dropped',
                deletedAt: new Date(),
            },
        });
        await this.prisma.course.update({
            where: { id: enrollment.courseId },
            data: { enrollmentCount: { decrement: 1 } },
        });
        await this.logAudit(tenantId, deletedBy, 'delete', 'enrollments', id, enrollment, null);
    }
    async getCertificate(id, tenantId) {
        const enrollment = await this.findOne(id, tenantId);
        if (enrollment.status !== 'completed') {
            throw new common_1.BadRequestException('لا يمكن الحصول على شهادة لتسجيل غير مكتمل');
        }
        if (!enrollment.certificateUrl) {
            throw new common_1.BadRequestException('الشهادة غير متوفرة بعد');
        }
        return {
            certificateUrl: enrollment.certificateUrl,
            studentName: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
            courseName: enrollment.course.title,
            completedAt: enrollment.completedAt,
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
exports.EnrollmentsService = EnrollmentsService;
exports.EnrollmentsService = EnrollmentsService = EnrollmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnrollmentsService);
//# sourceMappingURL=enrollments.service.js.map