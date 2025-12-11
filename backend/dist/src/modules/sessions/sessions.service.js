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
var SessionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const daily_service_1 = require("./services/daily.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const uuid_1 = require("uuid");
let SessionsService = SessionsService_1 = class SessionsService {
    constructor(prisma, dailyService) {
        this.prisma = prisma;
        this.dailyService = dailyService;
        this.logger = new common_1.Logger(SessionsService_1.name);
    }
    async findAll(tenantId, query) {
        const { page = 1, limit = 20, sortBy = 'scheduledStart', sortOrder = 'asc', search, status, instructorId, courseId, startDate, endDate, } = query;
        const skip = (page - 1) * limit;
        const where = {
            tenantId,
            deletedAt: null,
            ...(status && { status }),
            ...(instructorId && { instructorId }),
            ...(courseId && { courseId }),
            ...(startDate && { scheduledStart: { gte: new Date(startDate) } }),
            ...(endDate && { scheduledEnd: { lte: new Date(endDate) } }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [sessions, total] = await Promise.all([
            this.prisma.session.findMany({
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
                    course: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                    _count: {
                        select: {
                            attendances: true,
                        },
                    },
                },
            }),
            this.prisma.session.count({ where }),
        ]);
        const formattedSessions = sessions.map((session) => ({
            ...session,
            participantsCount: session._count.attendances,
            _count: undefined,
        }));
        return (0, pagination_dto_1.createPaginatedResponse)(formattedSessions, total, page, limit);
    }
    async findOne(id, tenantId) {
        const session = await this.prisma.session.findFirst({
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
                course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail: true,
                    },
                },
                _count: {
                    select: {
                        attendances: true,
                    },
                },
            },
        });
        if (!session) {
            throw new common_1.NotFoundException('الجلسة غير موجودة');
        }
        return {
            ...session,
            participantsCount: session._count.attendances,
            _count: undefined,
        };
    }
    async create(createSessionDto, tenantId, createdBy) {
        const instructor = await this.prisma.user.findFirst({
            where: {
                id: createSessionDto.instructorId,
                tenantId,
                deletedAt: null,
            },
        });
        if (!instructor) {
            throw new common_1.BadRequestException('المدرب غير موجود');
        }
        if (createSessionDto.courseId) {
            const course = await this.prisma.course.findFirst({
                where: {
                    id: createSessionDto.courseId,
                    tenantId,
                    deletedAt: null,
                },
            });
            if (!course) {
                throw new common_1.BadRequestException('الدورة غير موجودة');
            }
        }
        let meetingUrl;
        let meetingId;
        if (createSessionDto.platform === 'daily') {
            try {
                const room = await this.dailyService.createRoom({
                    name: `session-${(0, uuid_1.v4)().slice(0, 8)}`,
                    expiresAt: createSessionDto.scheduledEnd,
                    maxParticipants: createSessionDto.maxParticipants,
                });
                meetingUrl = room.url;
                meetingId = room.name;
            }
            catch (error) {
                this.logger.error(`Failed to create Daily room: ${error}`);
            }
        }
        const session = await this.prisma.session.create({
            data: {
                id: (0, uuid_1.v4)(),
                ...createSessionDto,
                meetingUrl,
                meetingId,
                tenantId,
                metadata: createSessionDto.metadata || {},
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
                course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
            },
        });
        await this.logAudit(tenantId, createdBy, 'create', 'sessions', session.id, null, session);
        return session;
    }
    async update(id, updateSessionDto, tenantId, updatedBy) {
        const existingSession = await this.findOne(id, tenantId);
        if (existingSession.status === 'completed' || existingSession.status === 'cancelled') {
            throw new common_1.BadRequestException('لا يمكن تعديل جلسة منتهية أو ملغاة');
        }
        const session = await this.prisma.session.update({
            where: { id },
            data: updateSessionDto,
            include: {
                instructor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
            },
        });
        await this.logAudit(tenantId, updatedBy, 'update', 'sessions', id, existingSession, session);
        return session;
    }
    async startSession(id, tenantId, startedBy) {
        const session = await this.findOne(id, tenantId);
        if (session.status !== 'scheduled') {
            throw new common_1.BadRequestException('لا يمكن بدء هذه الجلسة');
        }
        if (!session.meetingUrl && session.platform === 'daily') {
            try {
                const room = await this.dailyService.createRoom({
                    name: `session-${id.slice(0, 8)}`,
                    expiresAt: session.scheduledEnd,
                    maxParticipants: session.maxParticipants || undefined,
                });
                session.meetingUrl = room.url;
                session.meetingId = room.name;
            }
            catch (error) {
                this.logger.error(`Failed to create Daily room: ${error}`);
                throw new common_1.BadRequestException('فشل في إنشاء غرفة الاجتماع');
            }
        }
        const updatedSession = await this.prisma.session.update({
            where: { id },
            data: {
                status: 'live',
                actualStart: new Date(),
                meetingUrl: session.meetingUrl,
                meetingId: session.meetingId,
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
        await this.logAudit(tenantId, startedBy, 'start', 'sessions', id, { status: 'scheduled' }, { status: 'live' });
        return updatedSession;
    }
    async endSession(id, tenantId, endedBy) {
        const session = await this.findOne(id, tenantId);
        if (session.status !== 'live') {
            throw new common_1.BadRequestException('الجلسة ليست قيد البث');
        }
        const updatedSession = await this.prisma.session.update({
            where: { id },
            data: {
                status: 'completed',
                actualEnd: new Date(),
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
        if (session.meetingId && session.platform === 'daily') {
            try {
                await this.dailyService.deleteRoom(session.meetingId);
            }
            catch (error) {
                this.logger.error(`Failed to delete Daily room: ${error}`);
            }
        }
        await this.logAudit(tenantId, endedBy, 'end', 'sessions', id, { status: 'live' }, { status: 'completed' });
        return updatedSession;
    }
    async cancelSession(id, tenantId, cancelledBy) {
        const session = await this.findOne(id, tenantId);
        if (session.status === 'completed' || session.status === 'cancelled') {
            throw new common_1.BadRequestException('لا يمكن إلغاء هذه الجلسة');
        }
        await this.prisma.session.update({
            where: { id },
            data: {
                status: 'cancelled',
                deletedAt: new Date(),
            },
        });
        if (session.meetingId && session.platform === 'daily') {
            try {
                await this.dailyService.deleteRoom(session.meetingId);
            }
            catch (error) {
                this.logger.error(`Failed to delete Daily room: ${error}`);
            }
        }
        await this.logAudit(tenantId, cancelledBy, 'cancel', 'sessions', id, session, null);
    }
    async getParticipants(sessionId, tenantId) {
        await this.findOne(sessionId, tenantId);
        const attendances = await this.prisma.sessionAttendance.findMany({
            where: { sessionId },
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
            orderBy: { joinedAt: 'asc' },
        });
        return attendances.map((a) => ({
            ...a.user,
            attendanceId: a.id,
            status: a.status,
            joinedAt: a.joinedAt,
            leftAt: a.leftAt,
            duration: a.duration,
        }));
    }
    async joinSession(sessionId, tenantId, userId) {
        const session = await this.findOne(sessionId, tenantId);
        if (session.status !== 'live' && session.status !== 'scheduled') {
            throw new common_1.BadRequestException('الجلسة غير متاحة للانضمام');
        }
        if (session.maxParticipants) {
            const currentCount = await this.prisma.sessionAttendance.count({
                where: { sessionId, status: 'present' },
            });
            if (currentCount >= session.maxParticipants) {
                throw new common_1.BadRequestException('الجلسة ممتلئة');
            }
        }
        await this.prisma.sessionAttendance.upsert({
            where: {
                sessionId_userId: { sessionId, userId },
            },
            create: {
                id: (0, uuid_1.v4)(),
                sessionId,
                userId,
                status: 'present',
                joinedAt: new Date(),
            },
            update: {
                status: 'present',
                joinedAt: new Date(),
            },
        });
        await this.prisma.session.update({
            where: { id: sessionId },
            data: { currentParticipants: { increment: 1 } },
        });
        return {
            meetingUrl: session.meetingUrl,
            meetingId: session.meetingId,
            sessionTitle: session.title,
            instructor: session.instructor,
        };
    }
    async getAttendance(sessionId, tenantId) {
        await this.findOne(sessionId, tenantId);
        return this.prisma.sessionAttendance.findMany({
            where: { sessionId },
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
            orderBy: { createdAt: 'asc' },
        });
    }
    async updateAttendance(sessionId, userId, status, tenantId, updatedBy) {
        await this.findOne(sessionId, tenantId);
        const attendance = await this.prisma.sessionAttendance.upsert({
            where: {
                sessionId_userId: { sessionId, userId },
            },
            create: {
                id: (0, uuid_1.v4)(),
                sessionId,
                userId,
                status: status,
            },
            update: {
                status: status,
            },
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
        await this.logAudit(tenantId, updatedBy, 'update_attendance', 'sessions', sessionId, null, {
            userId,
            status,
        });
        return attendance;
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
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = SessionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        daily_service_1.DailyService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map