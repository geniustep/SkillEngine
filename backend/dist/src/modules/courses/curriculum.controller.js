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
exports.CurriculumController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const curriculum_service_1 = require("./curriculum.service");
const create_curriculum_dto_1 = require("./dto/create-curriculum.dto");
const update_curriculum_dto_1 = require("./dto/update-curriculum.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const tenant_decorator_1 = require("../../common/decorators/tenant.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CurriculumController = class CurriculumController {
    constructor(curriculumService) {
        this.curriculumService = curriculumService;
    }
    async getCurriculum(courseId, tenantId) {
        return this.curriculumService.getCurriculum(courseId, tenantId);
    }
    async addItem(courseId, createDto, tenantId, currentUser) {
        return this.curriculumService.addItem(courseId, createDto, tenantId, currentUser.id);
    }
    async updateItem(courseId, itemId, updateDto, tenantId, currentUser) {
        return this.curriculumService.updateItem(courseId, itemId, updateDto, tenantId, currentUser.id);
    }
    async deleteItem(courseId, itemId, tenantId, currentUser) {
        await this.curriculumService.deleteItem(courseId, itemId, tenantId, currentUser.id);
        return { message: 'تم حذف العنصر بنجاح' };
    }
    async reorderItems(courseId, items, tenantId, currentUser) {
        return this.curriculumService.reorderItems(courseId, items, tenantId, currentUser.id);
    }
};
exports.CurriculumController = CurriculumController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.COURSES_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على منهج الدورة' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'معرف الدورة' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CurriculumController.prototype, "getCurriculum", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.COURSES_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'إضافة عنصر للمنهج' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'معرف الدورة' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'تم إضافة العنصر بنجاح' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_decorator_1.TenantId)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_curriculum_dto_1.CreateCurriculumDto, String, Object]),
    __metadata("design:returntype", Promise)
], CurriculumController.prototype, "addItem", null);
__decorate([
    (0, common_1.Put)(':itemId'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.COURSES_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'تحديث عنصر في المنهج' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'معرف الدورة' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', description: 'معرف العنصر' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, tenant_decorator_1.TenantId)()),
    __param(4, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_curriculum_dto_1.UpdateCurriculumDto, String, Object]),
    __metadata("design:returntype", Promise)
], CurriculumController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)(':itemId'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.COURSES_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'حذف عنصر من المنهج' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'معرف الدورة' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', description: 'معرف العنصر' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, tenant_decorator_1.TenantId)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], CurriculumController.prototype, "deleteItem", null);
__decorate([
    (0, common_1.Post)('reorder'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.COURSES_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'إعادة ترتيب عناصر المنهج' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'معرف الدورة' }),
    openapi.ApiResponse({ status: 201, type: [Object] }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_decorator_1.TenantId)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, String, Object]),
    __metadata("design:returntype", Promise)
], CurriculumController.prototype, "reorderItems", null);
exports.CurriculumController = CurriculumController = __decorate([
    (0, swagger_1.ApiTags)('Courses'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiSecurity)('tenant-id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('courses/:courseId/curriculum'),
    __metadata("design:paramtypes", [curriculum_service_1.CurriculumService])
], CurriculumController);
//# sourceMappingURL=curriculum.controller.js.map