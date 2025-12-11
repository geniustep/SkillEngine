import {
  Controller,
  Get,
  Post,
  Put,
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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseQueryDto } from './dto/course-query.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { PublishCourseDto } from './dto/publish-course.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions, Permission } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { IdParamDto } from '../../common/dto/id-param.dto';

@ApiTags('Courses')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @RequirePermissions(Permission.COURSES_VIEW)
  @ApiOperation({ summary: 'الحصول على قائمة الدورات' })
  @ApiPaginatedResponse(CourseResponseDto)
  async findAll(@Query() query: CourseQueryDto, @TenantId() tenantId: string) {
    return this.coursesService.findAll(tenantId, query);
  }

  @Get(':id')
  @RequirePermissions(Permission.COURSES_VIEW)
  @ApiOperation({ summary: 'الحصول على دورة محددة' })
  @ApiParam({ name: 'id', description: 'معرف الدورة' })
  @ApiResponse({ status: 200, type: CourseResponseDto })
  @ApiResponse({ status: 404, description: 'الدورة غير موجودة' })
  async findOne(@Param() params: IdParamDto, @TenantId() tenantId: string) {
    return this.coursesService.findOne(params.id, tenantId);
  }

  @Post()
  @RequirePermissions(Permission.COURSES_CREATE)
  @ApiOperation({ summary: 'إنشاء دورة جديدة' })
  @ApiResponse({ status: 201, type: CourseResponseDto })
  @ApiResponse({ status: 400, description: 'بيانات غير صالحة' })
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.coursesService.create(createCourseDto, tenantId, currentUser.id);
  }

  @Put(':id')
  @RequirePermissions(Permission.COURSES_EDIT)
  @ApiOperation({ summary: 'تحديث دورة' })
  @ApiParam({ name: 'id', description: 'معرف الدورة' })
  @ApiResponse({ status: 200, type: CourseResponseDto })
  @ApiResponse({ status: 404, description: 'الدورة غير موجودة' })
  async update(
    @Param() params: IdParamDto,
    @Body() updateCourseDto: UpdateCourseDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.coursesService.update(params.id, updateCourseDto, tenantId, currentUser.id);
  }

  @Patch(':id/publish')
  @RequirePermissions(Permission.COURSES_PUBLISH)
  @ApiOperation({ summary: 'نشر أو إلغاء نشر دورة' })
  @ApiParam({ name: 'id', description: 'معرف الدورة' })
  @ApiResponse({ status: 200, type: CourseResponseDto })
  async publish(
    @Param() params: IdParamDto,
    @Body() publishDto: PublishCourseDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.coursesService.updateStatus(params.id, publishDto.status, tenantId, currentUser.id);
  }

  @Delete(':id')
  @RequirePermissions(Permission.COURSES_DELETE)
  @ApiOperation({ summary: 'حذف دورة (حذف ناعم)' })
  @ApiParam({ name: 'id', description: 'معرف الدورة' })
  @ApiResponse({ status: 200, description: 'تم حذف الدورة بنجاح' })
  @ApiResponse({ status: 404, description: 'الدورة غير موجودة' })
  async remove(
    @Param() params: IdParamDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    await this.coursesService.remove(params.id, tenantId, currentUser.id);
    return { message: 'تم حذف الدورة بنجاح' };
  }

  @Post(':id/enroll')
  @RequirePermissions(Permission.ENROLLMENTS_CREATE)
  @ApiOperation({ summary: 'تسجيل طالب في الدورة' })
  @ApiParam({ name: 'id', description: 'معرف الدورة' })
  async enrollStudent(
    @Param() params: IdParamDto,
    @Body('studentId') studentId: string,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.coursesService.enrollStudent(params.id, studentId, tenantId, currentUser.id);
  }

  @Get(':id/students')
  @RequirePermissions(Permission.COURSES_VIEW)
  @ApiOperation({ summary: 'الحصول على طلاب الدورة' })
  @ApiParam({ name: 'id', description: 'معرف الدورة' })
  async getCourseStudents(@Param() params: IdParamDto, @TenantId() tenantId: string) {
    return this.coursesService.getCourseStudents(params.id, tenantId);
  }

  @Get(':id/analytics')
  @RequirePermissions(Permission.ANALYTICS_VIEW)
  @ApiOperation({ summary: 'الحصول على تحليلات الدورة' })
  @ApiParam({ name: 'id', description: 'معرف الدورة' })
  async getCourseAnalytics(@Param() params: IdParamDto, @TenantId() tenantId: string) {
    return this.coursesService.getCourseAnalytics(params.id, tenantId);
  }
}

