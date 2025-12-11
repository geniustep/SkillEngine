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
exports.AnalyticsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const analytics_service_1 = require("./analytics.service");
const analytics_query_dto_1 = require("./dto/analytics-query.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const tenant_decorator_1 = require("../../common/decorators/tenant.decorator");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getDashboard(tenantId) {
        return this.analyticsService.getDashboardKPIs(tenantId);
    }
    async getEnrollments(query, tenantId) {
        return this.analyticsService.getEnrollmentTrends(tenantId, query);
    }
    async getRevenue(query, tenantId) {
        return this.analyticsService.getRevenueTrends(tenantId, query);
    }
    async getCourses(tenantId) {
        return this.analyticsService.getCoursePerformance(tenantId);
    }
    async getInstructors(tenantId) {
        return this.analyticsService.getInstructorPerformance(tenantId);
    }
    async getStudents(tenantId) {
        return this.analyticsService.getStudentEngagement(tenantId);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.ANALYTICS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على مؤشرات لوحة التحكم' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('enrollments'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.ANALYTICS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على إحصائيات التسجيلات' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_query_dto_1.AnalyticsQueryDto, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getEnrollments", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.ANALYTICS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على إحصائيات الإيرادات' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_query_dto_1.AnalyticsQueryDto, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRevenue", null);
__decorate([
    (0, common_1.Get)('courses'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.ANALYTICS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على أداء الدورات' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCourses", null);
__decorate([
    (0, common_1.Get)('instructors'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.ANALYTICS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على أداء المدربين' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getInstructors", null);
__decorate([
    (0, common_1.Get)('students'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_decorator_1.Permission.ANALYTICS_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'الحصول على تفاعل الطلاب' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getStudents", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiSecurity)('tenant-id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map