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
exports.SessionsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sessions_service_1 = require("./sessions.service");
const create_session_dto_1 = require("./dto/create-session.dto");
const update_session_dto_1 = require("./dto/update-session.dto");
const session_query_dto_1 = require("./dto/session-query.dto");
const session_response_dto_1 = require("./dto/session-response.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const tenant_decorator_1 = require("../../common/decorators/tenant.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../common/decorators/api-paginated-response.decorator");
const id_param_dto_1 = require("../../common/dto/id-param.dto");
let SessionsController = class SessionsController {
    constructor(sessionsService) {
        this.sessionsService = sessionsService;
    }
    async findAll(query, tenantId) {
        return this.sessionsService.findAll(tenantId, query);
    }
    async findOne(params, tenantId) {
        return this.sessionsService.findOne(params.id, tenantId);
    }
    async create(createSessionDto, tenantId, currentUser) {
        return this.sessionsService.create(createSessionDto, tenantId, currentUser.id);
    }
    async update(params, updateSessionDto, tenantId, currentUser) {
        return this.sessionsService.update(params.id, updateSessionDto, tenantId, currentUser.id);
    }
    async startSession(params, tenantId, currentUser) {
        return this.sessionsService.startSession(params.id, tenantId, currentUser.id);
    }
    async endSession(params, tenantId, currentUser) {
        return this.sessionsService.endSession(params.id, tenantId, currentUser.id);
    }
    async remove(params, tenantId, currentUser) {
        await this.sessionsService.cancelSession(params.id, tenantId, currentUser.id);
        return { message: 'تم إلغاء الجلسة بنجاح' };
    }
    async getParticipants(params, tenantId) {
        return this.sessionsService.getParticipants(params.id, tenantId);
    }
    async joinSession(params, tenantId, currentUser) {
        return this.sessionsService.joinSession(params.id, tenantId, currentUser.id);
    }
    async getAttendance(params, tenantId) {
        return this.sessionsService.getAttendance(params.id, tenantId);
    }
    async updateAttendance(sessionId, userId, status, tenantId, currentUser) {
        return this.sessionsService.updateAttendance(sessionId, userId, status, tenantId, currentUser.id);
    }
};
exports.SessionsController = SessionsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.SESSIONS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على قائمة الجلسات' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(session_response_dto_1.SessionResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_query_dto_1.SessionQueryDto, String]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.SESSIONS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على جلسة محددة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الجلسة' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: session_response_dto_1.SessionResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'الجلسة غير موجودة' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.SESSIONS_CREATE),
    (0, swagger_1.ApiOperation)({ summary: 'إنشاء جلسة جديدة' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: session_response_dto_1.SessionResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'بيانات غير صالحة' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_session_dto_1.CreateSessionDto, String, Object]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.SESSIONS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'تحديث جلسة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الجلسة' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: session_response_dto_1.SessionResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'الجلسة غير موجودة' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_decorator_1.TenantId)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto,
        update_session_dto_1.UpdateSessionDto, String, Object]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/start'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.SESSIONS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'بدء الجلسة المباشرة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الجلسة' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: session_response_dto_1.SessionResponseDto }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String, Object]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "startSession", null);
__decorate([
    (0, common_1.Patch)(':id/end'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.SESSIONS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'إنهاء الجلسة المباشرة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الجلسة' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: session_response_dto_1.SessionResponseDto }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String, Object]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "endSession", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.SESSIONS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'إلغاء جلسة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الجلسة' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'تم إلغاء الجلسة بنجاح' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'الجلسة غير موجودة' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String, Object]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/participants'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.SESSIONS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على المشاركين في الجلسة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الجلسة' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "getParticipants", null);
__decorate([
    (0, common_1.Post)(':id/join'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.SESSIONS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الانضمام للجلسة (الحصول على رابط الاجتماع)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الجلسة' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String, Object]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "joinSession", null);
__decorate([
    (0, common_1.Get)(':id/attendance'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.SESSIONS_ATTENDANCE),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على سجل الحضور' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الجلسة' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "getAttendance", null);
__decorate([
    (0, common_1.Patch)(':id/attendance/:userId'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.SESSIONS_ATTENDANCE),
    (0, swagger_1.ApiOperation)({ summary: 'تحديث حالة حضور مشارك' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الجلسة' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'معرف المستخدم' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)('status')),
    __param(3, (0, tenant_decorator_1.TenantId)()),
    __param(4, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "updateAttendance", null);
exports.SessionsController = SessionsController = __decorate([
    (0, swagger_1.ApiTags)('Sessions'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiSecurity)('tenant-id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('sessions'),
    __metadata("design:paramtypes", [sessions_service_1.SessionsService])
], SessionsController);
//# sourceMappingURL=sessions.controller.js.map