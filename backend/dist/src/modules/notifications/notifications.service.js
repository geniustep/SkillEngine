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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const pusher_service_1 = require("./services/pusher.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(prisma, pusherService) {
        this.prisma = prisma;
        this.pusherService = pusherService;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async findAll(userId, tenantId, query) {
        const { page = 1, limit = 20, isRead, type, } = query;
        const skip = (page - 1) * limit;
        const where = {
            userId,
            tenantId,
            ...(isRead !== undefined && { isRead }),
            ...(type && { type }),
        };
        const [notifications, total] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.notification.count({ where }),
        ]);
        return (0, pagination_dto_1.createPaginatedResponse)(notifications, total, page, limit);
    }
    async create(createDto, tenantId, createdBy) {
        const notification = await this.prisma.notification.create({
            data: {
                id: (0, uuid_1.v4)(),
                ...createDto,
                tenantId,
            },
        });
        try {
            await this.pusherService.sendToUser(createDto.userId, 'notification', {
                id: notification.id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                priority: notification.priority,
                createdAt: notification.createdAt,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send real-time notification: ${error}`);
        }
        return notification;
    }
    async markAsRead(id, userId, tenantId) {
        const notification = await this.prisma.notification.findFirst({
            where: { id, tenantId },
        });
        if (!notification) {
            throw new common_1.NotFoundException('الإشعار غير موجود');
        }
        if (notification.userId !== userId) {
            throw new common_1.ForbiddenException('لا يمكنك تعديل هذا الإشعار');
        }
        return this.prisma.notification.update({
            where: { id },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async markAllAsRead(userId, tenantId) {
        await this.prisma.notification.updateMany({
            where: {
                userId,
                tenantId,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async remove(id, userId, tenantId) {
        const notification = await this.prisma.notification.findFirst({
            where: { id, tenantId },
        });
        if (!notification) {
            throw new common_1.NotFoundException('الإشعار غير موجود');
        }
        if (notification.userId !== userId) {
            throw new common_1.ForbiddenException('لا يمكنك حذف هذا الإشعار');
        }
        await this.prisma.notification.delete({
            where: { id },
        });
    }
    async getUnreadCount(userId, tenantId) {
        return this.prisma.notification.count({
            where: {
                userId,
                tenantId,
                isRead: false,
            },
        });
    }
    async notifyEnrollment(userId, tenantId, courseTitle, courseId) {
        return this.create({
            userId,
            type: client_1.NotificationType.enrollment,
            title: 'تم التسجيل بنجاح',
            message: `تم تسجيلك في دورة "${courseTitle}"`,
            priority: client_1.NotificationPriority.medium,
            data: { courseId },
        }, tenantId, 'system');
    }
    async notifySessionReminder(userId, tenantId, sessionTitle, sessionId, startTime) {
        return this.create({
            userId,
            type: client_1.NotificationType.session,
            title: 'تذكير بجلسة قادمة',
            message: `الجلسة "${sessionTitle}" ستبدأ قريباً`,
            priority: client_1.NotificationPriority.high,
            data: { sessionId, startTime: startTime.toISOString() },
        }, tenantId, 'system');
    }
    async notifyAnnouncement(userIds, tenantId, title, message) {
        const notifications = userIds.map((userId) => ({
            id: (0, uuid_1.v4)(),
            userId,
            tenantId,
            type: client_1.NotificationType.announcement,
            title,
            message,
            priority: client_1.NotificationPriority.medium,
            isRead: false,
            data: {},
        }));
        await this.prisma.notification.createMany({
            data: notifications,
        });
        for (const userId of userIds) {
            try {
                await this.pusherService.sendToUser(userId, 'announcement', {
                    title,
                    message,
                });
            }
            catch (error) {
                this.logger.error(`Failed to send announcement to user ${userId}: ${error}`);
            }
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pusher_service_1.PusherService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map