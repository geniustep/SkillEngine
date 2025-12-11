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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notifications_service_1 = require("./notifications.service");
const create_notification_dto_1 = require("./dto/create-notification.dto");
const notification_query_dto_1 = require("./dto/notification-query.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const tenant_decorator_1 = require("../../common/decorators/tenant.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const id_param_dto_1 = require("../../common/dto/id-param.dto");
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async findAll(query, tenantId, currentUser) {
        return this.notificationsService.findAll(currentUser.id, tenantId, query);
    }
    async create(createNotificationDto, tenantId, currentUser) {
        return this.notificationsService.create(createNotificationDto, tenantId, currentUser.id);
    }
    async markAsRead(params, tenantId, currentUser) {
        return this.notificationsService.markAsRead(params.id, currentUser.id, tenantId);
    }
    async markAllAsRead(tenantId, currentUser) {
        await this.notificationsService.markAllAsRead(currentUser.id, tenantId);
        return { message: 'تم تحديد جميع الإشعارات كمقروءة' };
    }
    async remove(params, tenantId, currentUser) {
        await this.notificationsService.remove(params.id, currentUser.id, tenantId);
        return { message: 'تم حذف الإشعار بنجاح' };
    }
    async getUnreadCount(tenantId, currentUser) {
        const count = await this.notificationsService.getUnreadCount(currentUser.id, tenantId);
        return { count };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.NOTIFICATIONS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على إشعارات المستخدم' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_query_dto_1.NotificationQueryDto, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.NOTIFICATIONS_CREATE),
    (0, swagger_1.ApiOperation)({ summary: 'إنشاء إشعار جديد (للمسؤولين)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'تم إنشاء الإشعار بنجاح' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.NOTIFICATIONS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'تحديد إشعار كمقروء' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الإشعار' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('mark-all-read'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.NOTIFICATIONS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'تحديد جميع الإشعارات كمقروءة' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.NOTIFICATIONS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'حذف إشعار' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الإشعار' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.NOTIFICATIONS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على عدد الإشعارات غير المقروءة' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUnreadCount", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiSecurity)('tenant-id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map