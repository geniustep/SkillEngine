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
exports.UsersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const update_user_status_dto_1 = require("./dto/update-user-status.dto");
const user_query_dto_1 = require("./dto/user-query.dto");
const user_response_dto_1 = require("./dto/user-response.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const tenant_decorator_1 = require("../../common/decorators/tenant.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../common/decorators/api-paginated-response.decorator");
const id_param_dto_1 = require("../../common/dto/id-param.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(query, tenantId) {
        return this.usersService.findAll(tenantId, query);
    }
    async findOne(params, tenantId) {
        return this.usersService.findOne(params.id, tenantId);
    }
    async create(createUserDto, tenantId, currentUser) {
        return this.usersService.create(createUserDto, tenantId, currentUser.id);
    }
    async update(params, updateUserDto, tenantId, currentUser) {
        return this.usersService.update(params.id, updateUserDto, tenantId, currentUser.id);
    }
    async updateStatus(params, statusDto, tenantId, currentUser) {
        return this.usersService.updateStatus(params.id, statusDto.status, tenantId, currentUser.id);
    }
    async remove(params, tenantId, currentUser) {
        await this.usersService.remove(params.id, tenantId, currentUser.id);
        return { message: 'تم حذف المستخدم بنجاح' };
    }
    async getUserEnrollments(params, tenantId) {
        return this.usersService.getUserEnrollments(params.id, tenantId);
    }
    async getUserActivity(params, tenantId) {
        return this.usersService.getUserActivity(params.id, tenantId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.USERS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على قائمة المستخدمين' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(user_response_dto_1.UserResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_query_dto_1.UserQueryDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.USERS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على مستخدم محدد' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المستخدم' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_response_dto_1.UserResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'المستخدم غير موجود' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.USERS_CREATE),
    (0, swagger_1.ApiOperation)({ summary: 'إنشاء مستخدم جديد' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: user_response_dto_1.UserResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'بيانات غير صالحة' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'البريد الإلكتروني مستخدم بالفعل' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.USERS_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'تحديث بيانات مستخدم' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المستخدم' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_response_dto_1.UserResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'المستخدم غير موجود' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_decorator_1.TenantId)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto,
        update_user_dto_1.UpdateUserDto, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.USERS_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'تحديث حالة مستخدم' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المستخدم' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_response_dto_1.UserResponseDto }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_decorator_1.TenantId)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto,
        update_user_status_dto_1.UpdateUserStatusDto, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.USERS_DELETE),
    (0, swagger_1.ApiOperation)({ summary: 'حذف مستخدم (حذف ناعم)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المستخدم' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'تم حذف المستخدم بنجاح' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'المستخدم غير موجود' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/enrollments'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.USERS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على تسجيلات المستخدم' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المستخدم' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserEnrollments", null);
__decorate([
    (0, common_1.Get)(':id/activity'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.USERS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على سجل نشاط المستخدم' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المستخدم' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserActivity", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiSecurity)('tenant-id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map