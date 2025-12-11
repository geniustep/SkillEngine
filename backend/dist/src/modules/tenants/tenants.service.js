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
var TenantsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const uuid_1 = require("uuid");
const slugify_1 = __importDefault(require("slugify"));
let TenantsService = TenantsService_1 = class TenantsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(TenantsService_1.name);
    }
    async findAll(query) {
        const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', search, status, subscriptionPlan, } = query;
        const skip = (page - 1) * limit;
        const where = {
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
        return (0, pagination_dto_1.createPaginatedResponse)(formattedTenants, total, page, limit);
    }
    async findOne(id) {
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
            throw new common_1.NotFoundException('المؤسسة غير موجودة');
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
    async create(createTenantDto, createdBy) {
        let slug = (0, slugify_1.default)(createTenantDto.name, { lower: true, strict: true });
        const existingSlug = await this.prisma.tenant.findUnique({ where: { slug } });
        if (existingSlug) {
            slug = `${slug}-${Date.now()}`;
        }
        if (createTenantDto.domain) {
            const existingDomain = await this.prisma.tenant.findUnique({
                where: { domain: createTenantDto.domain },
            });
            if (existingDomain) {
                throw new common_1.ConflictException('النطاق مستخدم بالفعل');
            }
        }
        const tenant = await this.prisma.tenant.create({
            data: {
                id: (0, uuid_1.v4)(),
                ...createTenantDto,
                slug,
                settings: createTenantDto.settings || this.getDefaultSettings(),
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
        await this.logAudit(tenant.id, createdBy, 'create', 'tenants', tenant.id, null, tenant);
        return tenant;
    }
    async update(id, updateTenantDto, updatedBy) {
        const existingTenant = await this.findOne(id);
        if (updateTenantDto.domain && updateTenantDto.domain !== existingTenant.domain) {
            const existingDomain = await this.prisma.tenant.findUnique({
                where: { domain: updateTenantDto.domain },
            });
            if (existingDomain) {
                throw new common_1.ConflictException('النطاق مستخدم بالفعل');
            }
        }
        const tenant = await this.prisma.tenant.update({
            where: { id },
            data: {
                ...updateTenantDto,
                settings: updateTenantDto.settings
                    ? { ...existingTenant.settings, ...updateTenantDto.settings }
                    : undefined,
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
        await this.logAudit(id, updatedBy, 'update', 'tenants', id, existingTenant, tenant);
        return tenant;
    }
    async updateStatus(id, status, updatedBy) {
        const existingTenant = await this.findOne(id);
        const tenant = await this.prisma.tenant.update({
            where: { id },
            data: { status: status },
        });
        await this.logAudit(id, updatedBy, 'update_status', 'tenants', id, { status: existingTenant.status }, { status: tenant.status });
        return tenant;
    }
    async getTenantStats(id) {
        await this.findOne(id);
        const [usersCount, coursesCount, sessionsCount, enrollmentsCount, activeEnrollments, completedEnrollments,] = await Promise.all([
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
    getDefaultSettings() {
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
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = TenantsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map