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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const uuid_1 = require("uuid");
let UsersService = UsersService_1 = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async findAll(tenantId, query) {
        const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', search, role, status, } = query;
        const skip = (page - 1) * limit;
        const where = {
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
        return (0, pagination_dto_1.createPaginatedResponse)(formattedUsers, total, page, limit);
    }
    async findOne(id, tenantId) {
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
            throw new common_1.NotFoundException('المستخدم غير موجود');
        }
        return {
            ...user,
            enrollmentsCount: user._count.enrollments,
            sessionsCount: user._count.sessionsAsInstructor,
            coursesCount: user._count.coursesAsInstructor,
            _count: undefined,
        };
    }
    async create(createUserDto, tenantId, createdBy) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('البريد الإلكتروني مستخدم بالفعل');
        }
        const keycloakId = `kc_${(0, uuid_1.v4)()}`;
        const user = await this.prisma.user.create({
            data: {
                id: (0, uuid_1.v4)(),
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
        await this.logAudit(tenantId, createdBy, 'create', 'users', user.id, null, user);
        return user;
    }
    async update(id, updateUserDto, tenantId, updatedBy) {
        const existingUser = await this.findOne(id, tenantId);
        if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
            const emailExists = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            });
            if (emailExists) {
                throw new common_1.ConflictException('البريد الإلكتروني مستخدم بالفعل');
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
        await this.logAudit(tenantId, updatedBy, 'update', 'users', id, existingUser, user);
        return user;
    }
    async updateStatus(id, status, tenantId, updatedBy) {
        const existingUser = await this.findOne(id, tenantId);
        if (id === updatedBy && status === 'suspended') {
            throw new common_1.BadRequestException('لا يمكنك تعليق حسابك الخاص');
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
        await this.logAudit(tenantId, updatedBy, 'update_status', 'users', id, { status: existingUser.status }, { status: user.status });
        return user;
    }
    async remove(id, tenantId, deletedBy) {
        const user = await this.findOne(id, tenantId);
        if (id === deletedBy) {
            throw new common_1.BadRequestException('لا يمكنك حذف حسابك الخاص');
        }
        await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        await this.logAudit(tenantId, deletedBy, 'delete', 'users', id, user, null);
    }
    async getUserEnrollments(userId, tenantId) {
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
    async getUserActivity(userId, tenantId) {
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
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map