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
import { InstructorsService } from './instructors.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { InstructorQueryDto } from './dto/instructor-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions, Permission } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';
import { IdParamDto } from '../../common/dto/id-param.dto';

@ApiTags('Instructors')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Get()
  @RequirePermissions(Permission.INSTRUCTORS_VIEW)
  @ApiOperation({ summary: 'الحصول على قائمة المدربين' })
  async findAll(@Query() query: InstructorQueryDto, @TenantId() tenantId: string) {
    return this.instructorsService.findAll(tenantId, query);
  }

  @Get(':id')
  @RequirePermissions(Permission.INSTRUCTORS_VIEW)
  @ApiOperation({ summary: 'الحصول على مدرب محدد' })
  @ApiParam({ name: 'id', description: 'معرف المدرب' })
  async findOne(@Param() params: IdParamDto, @TenantId() tenantId: string) {
    return this.instructorsService.findOne(params.id, tenantId);
  }

  @Post()
  @RequirePermissions(Permission.INSTRUCTORS_CREATE)
  @ApiOperation({ summary: 'إنشاء ملف مدرب' })
  @ApiResponse({ status: 201, description: 'تم إنشاء ملف المدرب بنجاح' })
  async create(
    @Body() createInstructorDto: CreateInstructorDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.instructorsService.create(createInstructorDto, tenantId, currentUser.id);
  }

  @Put(':id')
  @RequirePermissions(Permission.INSTRUCTORS_EDIT)
  @ApiOperation({ summary: 'تحديث ملف مدرب' })
  @ApiParam({ name: 'id', description: 'معرف المدرب' })
  async update(
    @Param() params: IdParamDto,
    @Body() updateInstructorDto: UpdateInstructorDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.instructorsService.update(params.id, updateInstructorDto, tenantId, currentUser.id);
  }

  @Patch(':id/verify')
  @RequirePermissions(Permission.INSTRUCTORS_EDIT)
  @ApiOperation({ summary: 'التحقق من المدرب' })
  @ApiParam({ name: 'id', description: 'معرف المدرب' })
  async verify(
    @Param() params: IdParamDto,
    @Body('isVerified') isVerified: boolean,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.instructorsService.verify(params.id, isVerified, tenantId, currentUser.id);
  }

  @Delete(':id')
  @RequirePermissions(Permission.INSTRUCTORS_DELETE)
  @ApiOperation({ summary: 'حذف ملف مدرب' })
  @ApiParam({ name: 'id', description: 'معرف المدرب' })
  async remove(
    @Param() params: IdParamDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    await this.instructorsService.remove(params.id, tenantId, currentUser.id);
    return { message: 'تم حذف ملف المدرب بنجاح' };
  }

  @Get(':id/courses')
  @RequirePermissions(Permission.INSTRUCTORS_VIEW)
  @ApiOperation({ summary: 'الحصول على دورات المدرب' })
  @ApiParam({ name: 'id', description: 'معرف المدرب' })
  async getInstructorCourses(@Param() params: IdParamDto, @TenantId() tenantId: string) {
    return this.instructorsService.getInstructorCourses(params.id, tenantId);
  }

  @Get(':id/sessions')
  @RequirePermissions(Permission.INSTRUCTORS_VIEW)
  @ApiOperation({ summary: 'الحصول على جلسات المدرب' })
  @ApiParam({ name: 'id', description: 'معرف المدرب' })
  async getInstructorSessions(@Param() params: IdParamDto, @TenantId() tenantId: string) {
    return this.instructorsService.getInstructorSessions(params.id, tenantId);
  }

  @Get(':id/availability')
  @RequirePermissions(Permission.INSTRUCTORS_VIEW)
  @ApiOperation({ summary: 'الحصول على أوقات توفر المدرب' })
  @ApiParam({ name: 'id', description: 'معرف المدرب' })
  async getAvailability(@Param() params: IdParamDto, @TenantId() tenantId: string) {
    return this.instructorsService.getAvailability(params.id, tenantId);
  }

  @Put(':id/availability')
  @RequirePermissions(Permission.INSTRUCTORS_EDIT)
  @ApiOperation({ summary: 'تحديث أوقات توفر المدرب' })
  @ApiParam({ name: 'id', description: 'معرف المدرب' })
  async updateAvailability(
    @Param() params: IdParamDto,
    @Body('availability') availability: Record<string, unknown>,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.instructorsService.updateAvailability(
      params.id,
      availability,
      tenantId,
      currentUser.id,
    );
  }
}

