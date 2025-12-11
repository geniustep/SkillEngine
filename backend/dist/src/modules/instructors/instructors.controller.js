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
exports.InstructorsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const instructors_service_1 = require("./instructors.service");
const create_instructor_dto_1 = require("./dto/create-instructor.dto");
const update_instructor_dto_1 = require("./dto/update-instructor.dto");
const instructor_query_dto_1 = require("./dto/instructor-query.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const tenant_decorator_1 = require("../../common/decorators/tenant.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const id_param_dto_1 = require("../../common/dto/id-param.dto");
let InstructorsController = class InstructorsController {
    constructor(instructorsService) {
        this.instructorsService = instructorsService;
    }
    async findAll(query, tenantId) {
        return this.instructorsService.findAll(tenantId, query);
    }
    async findOne(params, tenantId) {
        return this.instructorsService.findOne(params.id, tenantId);
    }
    async create(createInstructorDto, tenantId, currentUser) {
        return this.instructorsService.create(createInstructorDto, tenantId, currentUser.id);
    }
    async update(params, updateInstructorDto, tenantId, currentUser) {
        return this.instructorsService.update(params.id, updateInstructorDto, tenantId, currentUser.id);
    }
    async verify(params, isVerified, tenantId, currentUser) {
        return this.instructorsService.verify(params.id, isVerified, tenantId, currentUser.id);
    }
    async remove(params, tenantId, currentUser) {
        await this.instructorsService.remove(params.id, tenantId, currentUser.id);
        return { message: 'تم حذف ملف المدرب بنجاح' };
    }
    async getInstructorCourses(params, tenantId) {
        return this.instructorsService.getInstructorCourses(params.id, tenantId);
    }
    async getInstructorSessions(params, tenantId) {
        return this.instructorsService.getInstructorSessions(params.id, tenantId);
    }
    async getAvailability(params, tenantId) {
        return this.instructorsService.getAvailability(params.id, tenantId);
    }
    async updateAvailability(params, availability, tenantId, currentUser) {
        return this.instructorsService.updateAvailability(params.id, availability, tenantId, currentUser.id);
    }
};
exports.InstructorsController = InstructorsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.INSTRUCTORS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على قائمة المدربين' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [instructor_query_dto_1.InstructorQueryDto, String]),
    __metadata("design:returntype", Promise)
], InstructorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.INSTRUCTORS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على مدرب محدد' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المدرب' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String]),
    __metadata("design:returntype", Promise)
], InstructorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.INSTRUCTORS_CREATE),
    (0, swagger_1.ApiOperation)({ summary: 'إنشاء ملف مدرب' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'تم إنشاء ملف المدرب بنجاح' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_instructor_dto_1.CreateInstructorDto, String, Object]),
    __metadata("design:returntype", Promise)
], InstructorsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.INSTRUCTORS_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'تحديث ملف مدرب' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المدرب' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_decorator_1.TenantId)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto,
        update_instructor_dto_1.UpdateInstructorDto, String, Object]),
    __metadata("design:returntype", Promise)
], InstructorsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/verify'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.INSTRUCTORS_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'التحقق من المدرب' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المدرب' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)('isVerified')),
    __param(2, (0, tenant_decorator_1.TenantId)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, Boolean, String, Object]),
    __metadata("design:returntype", Promise)
], InstructorsController.prototype, "verify", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.INSTRUCTORS_DELETE),
    (0, swagger_1.ApiOperation)({ summary: 'حذف ملف مدرب' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المدرب' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String, Object]),
    __metadata("design:returntype", Promise)
], InstructorsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/courses'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.INSTRUCTORS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على دورات المدرب' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المدرب' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String]),
    __metadata("design:returntype", Promise)
], InstructorsController.prototype, "getInstructorCourses", null);
__decorate([
    (0, common_1.Get)(':id/sessions'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.INSTRUCTORS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على جلسات المدرب' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المدرب' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String]),
    __metadata("design:returntype", Promise)
], InstructorsController.prototype, "getInstructorSessions", null);
__decorate([
    (0, common_1.Get)(':id/availability'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.INSTRUCTORS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على أوقات توفر المدرب' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المدرب' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String]),
    __metadata("design:returntype", Promise)
], InstructorsController.prototype, "getAvailability", null);
__decorate([
    (0, common_1.Put)(':id/availability'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.INSTRUCTORS_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'تحديث أوقات توفر المدرب' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف المدرب' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)('availability')),
    __param(2, (0, tenant_decorator_1.TenantId)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, Object, String, Object]),
    __metadata("design:returntype", Promise)
], InstructorsController.prototype, "updateAvailability", null);
exports.InstructorsController = InstructorsController = __decorate([
    (0, swagger_1.ApiTags)('Instructors'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiSecurity)('tenant-id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('instructors'),
    __metadata("design:paramtypes", [instructors_service_1.InstructorsService])
], InstructorsController);
//# sourceMappingURL=instructors.controller.js.map