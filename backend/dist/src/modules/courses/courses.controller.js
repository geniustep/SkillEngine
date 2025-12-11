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
exports.CoursesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const courses_service_1 = require("./courses.service");
const create_course_dto_1 = require("./dto/create-course.dto");
const update_course_dto_1 = require("./dto/update-course.dto");
const course_query_dto_1 = require("./dto/course-query.dto");
const course_response_dto_1 = require("./dto/course-response.dto");
const publish_course_dto_1 = require("./dto/publish-course.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const tenant_decorator_1 = require("../../common/decorators/tenant.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const api_paginated_response_decorator_1 = require("../../common/decorators/api-paginated-response.decorator");
const id_param_dto_1 = require("../../common/dto/id-param.dto");
let CoursesController = class CoursesController {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async findAll(query, tenantId) {
        return this.coursesService.findAll(tenantId, query);
    }
    async findOne(params, tenantId) {
        return this.coursesService.findOne(params.id, tenantId);
    }
    async create(createCourseDto, tenantId, currentUser) {
        return this.coursesService.create(createCourseDto, tenantId, currentUser.id);
    }
    async update(params, updateCourseDto, tenantId, currentUser) {
        return this.coursesService.update(params.id, updateCourseDto, tenantId, currentUser.id);
    }
    async publish(params, publishDto, tenantId, currentUser) {
        return this.coursesService.updateStatus(params.id, publishDto.status, tenantId, currentUser.id);
    }
    async remove(params, tenantId, currentUser) {
        await this.coursesService.remove(params.id, tenantId, currentUser.id);
        return { message: 'تم حذف الدورة بنجاح' };
    }
    async enrollStudent(params, studentId, tenantId, currentUser) {
        return this.coursesService.enrollStudent(params.id, studentId, tenantId, currentUser.id);
    }
    async getCourseStudents(params, tenantId) {
        return this.coursesService.getCourseStudents(params.id, tenantId);
    }
    async getCourseAnalytics(params, tenantId) {
        return this.coursesService.getCourseAnalytics(params.id, tenantId);
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.COURSES_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على قائمة الدورات' }),
    (0, api_paginated_response_decorator_1.ApiPaginatedResponse)(course_response_dto_1.CourseResponseDto),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_query_dto_1.CourseQueryDto, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.COURSES_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على دورة محددة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الدورة' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: course_response_dto_1.CourseResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'الدورة غير موجودة' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.COURSES_CREATE),
    (0, swagger_1.ApiOperation)({ summary: 'إنشاء دورة جديدة' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: course_response_dto_1.CourseResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'بيانات غير صالحة' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto, String, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.COURSES_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'تحديث دورة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الدورة' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: course_response_dto_1.CourseResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'الدورة غير موجودة' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_decorator_1.TenantId)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto,
        update_course_dto_1.UpdateCourseDto, String, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.COURSES_PUBLISH),
    (0, swagger_1.ApiOperation)({ summary: 'نشر أو إلغاء نشر دورة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الدورة' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: course_response_dto_1.CourseResponseDto }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, tenant_decorator_1.TenantId)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto,
        publish_course_dto_1.PublishCourseDto, String, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "publish", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.COURSES_DELETE),
    (0, swagger_1.ApiOperation)({ summary: 'حذف دورة (حذف ناعم)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الدورة' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'تم حذف الدورة بنجاح' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'الدورة غير موجودة' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/enroll'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.ENROLLMENTS_CREATE),
    (0, swagger_1.ApiOperation)({ summary: 'تسجيل طالب في الدورة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الدورة' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)('studentId')),
    __param(2, (0, tenant_decorator_1.TenantId)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String, String, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "enrollStudent", null);
__decorate([
    (0, common_1.Get)(':id/students'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.COURSES_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على طلاب الدورة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الدورة' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourseStudents", null);
__decorate([
    (0, common_1.Get)(':id/analytics'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.ANALYTICS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على تحليلات الدورة' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'معرف الدورة' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_param_dto_1.IdParamDto, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourseAnalytics", null);
exports.CoursesController = CoursesController = __decorate([
    (0, swagger_1.ApiTags)('Courses'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiSecurity)('tenant-id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('courses'),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map