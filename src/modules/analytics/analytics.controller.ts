import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions, Permission } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';

@ApiTags('Analytics')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @RequirePermissions(Permission.ANALYTICS_VIEW)
  @ApiOperation({ summary: 'الحصول على مؤشرات لوحة التحكم' })
  async getDashboard(@TenantId() tenantId: string) {
    return this.analyticsService.getDashboardKPIs(tenantId);
  }

  @Get('enrollments')
  @RequirePermissions(Permission.ANALYTICS_VIEW)
  @ApiOperation({ summary: 'الحصول على إحصائيات التسجيلات' })
  async getEnrollments(@Query() query: AnalyticsQueryDto, @TenantId() tenantId: string) {
    return this.analyticsService.getEnrollmentTrends(tenantId, query);
  }

  @Get('revenue')
  @RequirePermissions(Permission.ANALYTICS_VIEW)
  @ApiOperation({ summary: 'الحصول على إحصائيات الإيرادات' })
  async getRevenue(@Query() query: AnalyticsQueryDto, @TenantId() tenantId: string) {
    return this.analyticsService.getRevenueTrends(tenantId, query);
  }

  @Get('courses')
  @RequirePermissions(Permission.ANALYTICS_VIEW)
  @ApiOperation({ summary: 'الحصول على أداء الدورات' })
  async getCourses(@TenantId() tenantId: string) {
    return this.analyticsService.getCoursePerformance(tenantId);
  }

  @Get('instructors')
  @RequirePermissions(Permission.ANALYTICS_VIEW)
  @ApiOperation({ summary: 'الحصول على أداء المدربين' })
  async getInstructors(@TenantId() tenantId: string) {
    return this.analyticsService.getInstructorPerformance(tenantId);
  }

  @Get('students')
  @RequirePermissions(Permission.ANALYTICS_VIEW)
  @ApiOperation({ summary: 'الحصول على تفاعل الطلاب' })
  async getStudents(@TenantId() tenantId: string) {
    return this.analyticsService.getStudentEngagement(tenantId);
  }
}

