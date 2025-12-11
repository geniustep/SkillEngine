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
exports.TenantsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tenants_service_1 = require("./tenants.service");
const create_tenant_dto_1 = require("./dto/create-tenant.dto");
const update_tenant_dto_1 = require("./dto/update-tenant.dto");
const tenant_query_dto_1 = require("./dto/tenant-query.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const id_param_dto_1 = require("../../common/dto/id-param.dto");
let TenantsController = class TenantsController {
    constructor(tenantsService) {
        this.tenantsService = tenantsService;
    }
    async findAll(query) {
        return this.tenantsService.findAll(query);
    }
    async findOne(params) {
        return this.tenantsService.findOne(params.id);
    }
    async create(createTenantDto, currentUser) {
        return this.tenantsService.create(createTenantDto, currentUser.id);
    }
    async update(params, updateTenantDto, currentUser) {
        return this.tenantsService.update(params.id, updateTenantDto, currentUser.id);
    }
    async updateStatus(params, status, currentUser) {
        return this.tenantsService.updateStatus(params.id, status, currentUser.id);
    }
    async getStats(params) {
        return this.tenantsService.getTenantStats(params.id);
    }
};
exports.TenantsController = TenantsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.TENANTS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على قائمة المؤسسات (Super Admin فقط)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_query_dto_1.TenantQueryDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.TENANTS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على مؤسسة محددة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المؤسسة' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.TENANTS_CREATE),
    (0, swagger_1.ApiOperation)({ summary: 'إنشاء مؤسسة جديدة' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'تم إنشاء المؤسسة بنجاح' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tenant_dto_1.CreateTenantDto, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.TENANTS_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'تحديث مؤسسة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المؤسسة' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto,
        update_tenant_dto_1.UpdateTenantDto, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.TENANTS_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'تحديث حالة مؤسسة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المؤسسة' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.TENANTS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على إحصائيات المؤسسة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المؤسسة' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getStats", null);
exports.TenantsController = TenantsController = __decorate([
    (0, swagger_1.ApiTags)('Tenants'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('tenants'),
    __metadata("design:paramtypes", [tenants_service_1.TenantsService])
], TenantsController);
//# sourceMappingURL=tenants.controller.js.map