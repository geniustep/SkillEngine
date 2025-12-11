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
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionQueryDto } from './dto/session-query.dto';
import { SessionResponseDto } from './dto/session-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions, Permission } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { IdParamDto } from '../../common/dto/id-param.dto';

@ApiTags('Sessions')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @RequirePermissions(Permission.SESSIONS_VIEW)
  @ApiOperation({ summary: 'الحصول على قائمة الجلسات' })
  @ApiPaginatedResponse(SessionResponseDto)
  async findAll(@Query() query: SessionQueryDto, @TenantId() tenantId: string) {
    return this.sessionsService.findAll(tenantId, query);
  }

  @Get(':id')
  @RequirePermissions(Permission.SESSIONS_VIEW)
  @ApiOperation({ summary: 'الحصول على جلسة محددة' })
  @ApiParam({ name: 'id', description: 'معرف الجلسة' })
  @ApiResponse({ status: 200, type: SessionResponseDto })
  @ApiResponse({ status: 404, description: 'الجلسة غير موجودة' })
  async findOne(@Param() params: IdParamDto, @TenantId() tenantId: string) {
    return this.sessionsService.findOne(params.id, tenantId);
  }

  @Post()
  @RequirePermissions(Permission.SESSIONS_CREATE)
  @ApiOperation({ summary: 'إنشاء جلسة جديدة' })
  @ApiResponse({ status: 201, type: SessionResponseDto })
  @ApiResponse({ status: 400, description: 'بيانات غير صالحة' })
  async create(
    @Body() createSessionDto: CreateSessionDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.sessionsService.create(createSessionDto, tenantId, currentUser.id);
  }

  @Put(':id')
  @RequirePermissions(Permission.SESSIONS_MANAGE)
  @ApiOperation({ summary: 'تحديث جلسة' })
  @ApiParam({ name: 'id', description: 'معرف الجلسة' })
  @ApiResponse({ status: 200, type: SessionResponseDto })
  @ApiResponse({ status: 404, description: 'الجلسة غير موجودة' })
  async update(
    @Param() params: IdParamDto,
    @Body() updateSessionDto: UpdateSessionDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.sessionsService.update(params.id, updateSessionDto, tenantId, currentUser.id);
  }

  @Patch(':id/start')
  @RequirePermissions(Permission.SESSIONS_MANAGE)
  @ApiOperation({ summary: 'بدء الجلسة المباشرة' })
  @ApiParam({ name: 'id', description: 'معرف الجلسة' })
  @ApiResponse({ status: 200, type: SessionResponseDto })
  async startSession(
    @Param() params: IdParamDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.sessionsService.startSession(params.id, tenantId, currentUser.id);
  }

  @Patch(':id/end')
  @RequirePermissions(Permission.SESSIONS_MANAGE)
  @ApiOperation({ summary: 'إنهاء الجلسة المباشرة' })
  @ApiParam({ name: 'id', description: 'معرف الجلسة' })
  @ApiResponse({ status: 200, type: SessionResponseDto })
  async endSession(
    @Param() params: IdParamDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.sessionsService.endSession(params.id, tenantId, currentUser.id);
  }

  @Delete(':id')
  @RequirePermissions(Permission.SESSIONS_MANAGE)
  @ApiOperation({ summary: 'إلغاء جلسة' })
  @ApiParam({ name: 'id', description: 'معرف الجلسة' })
  @ApiResponse({ status: 200, description: 'تم إلغاء الجلسة بنجاح' })
  @ApiResponse({ status: 404, description: 'الجلسة غير موجودة' })
  async remove(
    @Param() params: IdParamDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    await this.sessionsService.cancelSession(params.id, tenantId, currentUser.id);
    return { message: 'تم إلغاء الجلسة بنجاح' };
  }

  @Get(':id/participants')
  @RequirePermissions(Permission.SESSIONS_VIEW)
  @ApiOperation({ summary: 'الحصول على المشاركين في الجلسة' })
  @ApiParam({ name: 'id', description: 'معرف الجلسة' })
  async getParticipants(@Param() params: IdParamDto, @TenantId() tenantId: string) {
    return this.sessionsService.getParticipants(params.id, tenantId);
  }

  @Post(':id/join')
  @RequirePermissions(Permission.SESSIONS_VIEW)
  @ApiOperation({ summary: 'الانضمام للجلسة (الحصول على رابط الاجتماع)' })
  @ApiParam({ name: 'id', description: 'معرف الجلسة' })
  async joinSession(
    @Param() params: IdParamDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.sessionsService.joinSession(params.id, tenantId, currentUser.id);
  }

  @Get(':id/attendance')
  @RequirePermissions(Permission.SESSIONS_ATTENDANCE)
  @ApiOperation({ summary: 'الحصول على سجل الحضور' })
  @ApiParam({ name: 'id', description: 'معرف الجلسة' })
  async getAttendance(@Param() params: IdParamDto, @TenantId() tenantId: string) {
    return this.sessionsService.getAttendance(params.id, tenantId);
  }

  @Patch(':id/attendance/:userId')
  @RequirePermissions(Permission.SESSIONS_ATTENDANCE)
  @ApiOperation({ summary: 'تحديث حالة حضور مشارك' })
  @ApiParam({ name: 'id', description: 'معرف الجلسة' })
  @ApiParam({ name: 'userId', description: 'معرف المستخدم' })
  async updateAttendance(
    @Param('id') sessionId: string,
    @Param('userId') userId: string,
    @Body('status') status: string,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.sessionsService.updateAttendance(
      sessionId,
      userId,
      status,
      tenantId,
      currentUser.id,
    );
  }
}

