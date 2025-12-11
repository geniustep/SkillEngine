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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions, Permission } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { IdParamDto } from '../../common/dto/id-param.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions(Permission.USERS_VIEW)
  @ApiOperation({ summary: 'الحصول على قائمة المستخدمين' })
  @ApiPaginatedResponse(UserResponseDto)
  async findAll(@Query() query: UserQueryDto, @TenantId() tenantId: string) {
    return this.usersService.findAll(tenantId, query);
  }

  @Get(':id')
  @RequirePermissions(Permission.USERS_VIEW)
  @ApiOperation({ summary: 'الحصول على مستخدم محدد' })
  @ApiParam({ name: 'id', description: 'معرف المستخدم' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'المستخدم غير موجود' })
  async findOne(@Param() params: IdParamDto, @TenantId() tenantId: string) {
    return this.usersService.findOne(params.id, tenantId);
  }

  @Post()
  @RequirePermissions(Permission.USERS_CREATE)
  @ApiOperation({ summary: 'إنشاء مستخدم جديد' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'بيانات غير صالحة' })
  @ApiResponse({ status: 409, description: 'البريد الإلكتروني مستخدم بالفعل' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.usersService.create(createUserDto, tenantId, currentUser.id);
  }

  @Put(':id')
  @RequirePermissions(Permission.USERS_EDIT)
  @ApiOperation({ summary: 'تحديث بيانات مستخدم' })
  @ApiParam({ name: 'id', description: 'معرف المستخدم' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'المستخدم غير موجود' })
  async update(
    @Param() params: IdParamDto,
    @Body() updateUserDto: UpdateUserDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.usersService.update(params.id, updateUserDto, tenantId, currentUser.id);
  }

  @Patch(':id/status')
  @RequirePermissions(Permission.USERS_EDIT)
  @ApiOperation({ summary: 'تحديث حالة مستخدم' })
  @ApiParam({ name: 'id', description: 'معرف المستخدم' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async updateStatus(
    @Param() params: IdParamDto,
    @Body() statusDto: UpdateUserStatusDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.usersService.updateStatus(params.id, statusDto.status, tenantId, currentUser.id);
  }

  @Delete(':id')
  @RequirePermissions(Permission.USERS_DELETE)
  @ApiOperation({ summary: 'حذف مستخدم (حذف ناعم)' })
  @ApiParam({ name: 'id', description: 'معرف المستخدم' })
  @ApiResponse({ status: 200, description: 'تم حذف المستخدم بنجاح' })
  @ApiResponse({ status: 404, description: 'المستخدم غير موجود' })
  async remove(
    @Param() params: IdParamDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    await this.usersService.remove(params.id, tenantId, currentUser.id);
    return { message: 'تم حذف المستخدم بنجاح' };
  }

  @Get(':id/enrollments')
  @RequirePermissions(Permission.USERS_VIEW)
  @ApiOperation({ summary: 'الحصول على تسجيلات المستخدم' })
  @ApiParam({ name: 'id', description: 'معرف المستخدم' })
  async getUserEnrollments(@Param() params: IdParamDto, @TenantId() tenantId: string) {
    return this.usersService.getUserEnrollments(params.id, tenantId);
  }

  @Get(':id/activity')
  @RequirePermissions(Permission.USERS_VIEW)
  @ApiOperation({ summary: 'الحصول على سجل نشاط المستخدم' })
  @ApiParam({ name: 'id', description: 'معرف المستخدم' })
  async getUserActivity(@Param() params: IdParamDto, @TenantId() tenantId: string) {
    return this.usersService.getUserActivity(params.id, tenantId);
  }
}

