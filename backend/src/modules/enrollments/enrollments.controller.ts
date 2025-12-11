import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { EnrollmentQueryDto } from './dto/enrollment-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions, Permission } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';
import { IdParamDto } from '../../common/dto/id-param.dto';

@ApiTags('Enrollments')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  @RequirePermissions(Permission.ENROLLMENTS_VIEW)
  @ApiOperation({ summary: 'الحصول على قائمة التسجيلات' })
  async findAll(@Query() query: EnrollmentQueryDto, @TenantId() tenantId: string) {
    return this.enrollmentsService.findAll(tenantId, query);
  }

  @Get(':id')
  @RequirePermissions(Permission.ENROLLMENTS_VIEW)
  @ApiOperation({ summary: 'الحصول على تسجيل محدد' })
  @ApiParam({ name: 'id', description: 'معرف التسجيل' })
  async findOne(@Param() params: IdParamDto, @TenantId() tenantId: string) {
    return this.enrollmentsService.findOne(params.id, tenantId);
  }

  @Post()
  @RequirePermissions(Permission.ENROLLMENTS_CREATE)
  @ApiOperation({ summary: 'إنشاء تسجيل جديد' })
  @ApiResponse({ status: 201, description: 'تم التسجيل بنجاح' })
  async create(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.enrollmentsService.create(createEnrollmentDto, tenantId, currentUser.id);
  }

  @Patch(':id/progress')
  @RequirePermissions(Permission.ENROLLMENTS_EDIT)
  @ApiOperation({ summary: 'تحديث تقدم الطالب' })
  @ApiParam({ name: 'id', description: 'معرف التسجيل' })
  async updateProgress(
    @Param() params: IdParamDto,
    @Body() updateProgressDto: UpdateProgressDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.enrollmentsService.updateProgress(
      params.id,
      updateProgressDto,
      tenantId,
      currentUser.id,
    );
  }

  @Patch(':id/complete')
  @RequirePermissions(Permission.ENROLLMENTS_EDIT)
  @ApiOperation({ summary: 'تحديد التسجيل كمكتمل' })
  @ApiParam({ name: 'id', description: 'معرف التسجيل' })
  async markComplete(
    @Param() params: IdParamDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.enrollmentsService.markComplete(params.id, tenantId, currentUser.id);
  }

  @Delete(':id')
  @RequirePermissions(Permission.ENROLLMENTS_DELETE)
  @ApiOperation({ summary: 'إلغاء تسجيل' })
  @ApiParam({ name: 'id', description: 'معرف التسجيل' })
  async remove(
    @Param() params: IdParamDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    await this.enrollmentsService.remove(params.id, tenantId, currentUser.id);
    return { message: 'تم إلغاء التسجيل بنجاح' };
  }

  @Get(':id/certificate')
  @RequirePermissions(Permission.ENROLLMENTS_VIEW)
  @ApiOperation({ summary: 'الحصول على شهادة الإتمام' })
  @ApiParam({ name: 'id', description: 'معرف التسجيل' })
  async getCertificate(@Param() params: IdParamDto, @TenantId() tenantId: string) {
    return this.enrollmentsService.getCertificate(params.id, tenantId);
  }
}

