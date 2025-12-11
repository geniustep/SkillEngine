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
var InstructorsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const uuid_1 = require("uuid");
let InstructorsService = InstructorsService_1 = class InstructorsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(InstructorsService_1.name);
    }
    async findAll(tenantId, query) {
        const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', search, isVerified, specialization, } = query;
        const skip = (page - 1) * limit;
        const where = {
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
            id: instructor.id,
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
        return (0, pagination_dto_1.createPaginatedResponse)(formattedInstructors, total, page, limit);
    }
    async findOne(id, tenantId) {
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
            throw new common_1.NotFoundException('المدرب غير موجود');
        }
        return {
            id: instructor.id,
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
    async create(createInstructorDto, tenantId, createdBy) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: createInstructorDto.userId,
                tenantId,
                deletedAt: null,
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('المستخدم غير موجود');
        }
        const existingInstructor = await this.prisma.instructor.findUnique({
            where: { userId: createInstructorDto.userId },
        });
        if (existingInstructor) {
            throw new common_1.ConflictException('المستخدم لديه ملف مدرب بالفعل');
        }
        const instructor = await this.prisma.instructor.create({
            data: {
                id: (0, uuid_1.v4)(),
                ...createInstructorDto,
                certifications: createInstructorDto.certifications || [],
                socialLinks: createInstructorDto.socialLinks || {},
                availability: createInstructorDto.availability || {},
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
        if (user.role === 'student') {
            await this.prisma.user.update({
                where: { id: user.id },
                data: { role: 'instructor' },
            });
        }
        await this.logAudit(tenantId, createdBy, 'create', 'instructors', instructor.id, null, instructor);
        return instructor;
    }
    async update(id, updateInstructorDto, tenantId, updatedBy) {
        const existingInstructor = await this.findOne(id, tenantId);
        const instructor = await this.prisma.instructor.update({
            where: { id },
            data: {
                ...updateInstructorDto,
                certifications: updateInstructorDto.certifications
                    ? updateInstructorDto.certifications
                    : undefined,
                socialLinks: updateInstructorDto.socialLinks
                    ? { ...existingInstructor.socialLinks, ...updateInstructorDto.socialLinks }
                    : undefined,
                availability: updateInstructorDto.availability
                    ? { ...existingInstructor.availability, ...updateInstructorDto.availability }
                    : undefined,
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
        await this.logAudit(tenantId, updatedBy, 'update', 'instructors', id, existingInstructor, instructor);
        return instructor;
    }
    async verify(id, isVerified, tenantId, verifiedBy) {
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
        await this.logAudit(tenantId, verifiedBy, 'verify', 'instructors', id, null, { isVerified });
        return instructor;
    }
    async remove(id, tenantId, deletedBy) {
        const instructor = await this.findOne(id, tenantId);
        const activeCourses = await this.prisma.course.count({
            where: {
                instructorId: instructor.userId,
                status: 'published',
                deletedAt: null,
            },
        });
        if (activeCourses > 0) {
            throw new common_1.BadRequestException('لا يمكن حذف مدرب لديه دورات نشطة');
        }
        await this.prisma.instructor.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        await this.logAudit(tenantId, deletedBy, 'delete', 'instructors', id, instructor, null);
    }
    async getInstructorCourses(instructorId, tenantId) {
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
    async getInstructorSessions(instructorId, tenantId) {
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
    async getAvailability(instructorId, tenantId) {
        const instructor = await this.findOne(instructorId, tenantId);
        return instructor.availability;
    }
    async updateAvailability(instructorId, availability, tenantId, updatedBy) {
        await this.findOne(instructorId, tenantId);
        const instructor = await this.prisma.instructor.update({
            where: { id: instructorId },
            data: { availability },
        });
        await this.logAudit(tenantId, updatedBy, 'update_availability', 'instructors', instructorId, null, {
            availability,
        });
        return instructor.availability;
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
exports.InstructorsService = InstructorsService;
exports.InstructorsService = InstructorsService = InstructorsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InstructorsService);
//# sourceMappingURL=instructors.service.js.map