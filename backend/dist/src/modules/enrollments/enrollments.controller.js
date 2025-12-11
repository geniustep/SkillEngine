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
exports.EnrollmentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const enrollments_service_1 = require("./enrollments.service");
const create_enrollment_dto_1 = require("./dto/create-enrollment.dto");
const update_progress_dto_1 = require("./dto/update-progress.dto");
const enrollment_query_dto_1 = require("./dto/enrollment-query.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const tenant_decorator_1 = require("../../common/decorators/tenant.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const id_param_dto_1 = require("../../common/dto/id-param.dto");
let EnrollmentsController = class EnrollmentsController {
    constructor(enrollmentsService) {
        this.enrollmentsService = enrollmentsService;
    }
    async findAll(query, tenantId) {
        return this.enrollmentsService.findAll(tenantId, query);
    }
    async findOne(params, tenantId) {
        return this.enrollmentsService.findOne(params.id, tenantId);
    }
    async create(createEnrollmentDto, tenantId, currentUser) {
        return this.enrollmentsService.create(createEnrollmentDto, tenantId, currentUser.id);
    }
    async updateProgress(params, updateProgressDto, tenantId, currentUser) {
        return this.enrollmentsService.updateProgress(params.id, updateProgressDto, tenantId, currentUser.id);
    }
    async markComplete(params, tenantId, currentUser) {
        return this.enrollmentsService.markComplete(params.id, tenantId, currentUser.id);
    }
    async remove(params, tenantId, currentUser) {
        await this.enrollmentsService.remove(params.id, tenantId, currentUser.id);
        return { message: 'تم إلغاء التسجيل بنجاح' };
    }
    async getCertificate(params, tenantId) {
        return this.enrollmentsService.getCertificate(params.id, tenantId);
    }
};
exports.EnrollmentsController = EnrollmentsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.ENROLLMENTS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على قائمة التسجيلات' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [enrollment_query_dto_1.EnrollmentQueryDto, String]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.ENROLLMENTS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على تسجيل محدد' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف التسجيل' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.ENROLLMENTS_CREATE),
    (0, swagger_1.ApiOperation)({ summary: 'إنشاء تسجيل جديد' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'تم التسجيل بنجاح' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_enrollment_dto_1.CreateEnrollmentDto, String, Object]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/progress'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.ENROLLMENTS_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'تحديث تقدم الطالب' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف التسجيل' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_decorator_1.TenantId)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto,
        update_progress_dto_1.UpdateProgressDto, String, Object]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "updateProgress", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.ENROLLMENTS_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'تحديد التسجيل كمكتمل' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف التسجيل' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String, Object]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "markComplete", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.ENROLLMENTS_DELETE),
    (0, swagger_1.ApiOperation)({ summary: 'إلغاء تسجيل' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف التسجيل' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String, Object]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/certificate'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.ENROLLMENTS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على شهادة الإتمام' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف التسجيل' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "getCertificate", null);
exports.EnrollmentsController = EnrollmentsController = __decorate([
    (0, swagger_1.ApiTags)('Enrollments'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiSecurity)('tenant-id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('enrollments'),
    __metadata("design:paramtypes", [enrollments_service_1.EnrollmentsService])
], EnrollmentsController);
//# sourceMappingURL=enrollments.controller.js.map