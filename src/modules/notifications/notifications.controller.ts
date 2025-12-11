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
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions, Permission } from '../../common/decorators/permissions.decorator';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';
import { IdParamDto } from '../../common/dto/id-param.dto';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('tenant-id')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @RequirePermissions(Permission.NOTIFICATIONS_VIEW)
  @ApiOperation({ summary: 'الحصول على إشعارات المستخدم' })
  async findAll(
    @Query() query: NotificationQueryDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.notificationsService.findAll(currentUser.id, tenantId, query);
  }

  @Post()
  @RequirePermissions(Permission.NOTIFICATIONS_CREATE)
  @ApiOperation({ summary: 'إنشاء إشعار جديد (للمسؤولين)' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الإشعار بنجاح' })
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.notificationsService.create(createNotificationDto, tenantId, currentUser.id);
  }

  @Patch(':id/read')
  @RequirePermissions(Permission.NOTIFICATIONS_VIEW)
  @ApiOperation({ summary: 'تحديد إشعار كمقروء' })
  @ApiParam({ name: 'id', description: 'معرف الإشعار' })
  async markAsRead(
    @Param() params: IdParamDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return this.notificationsService.markAsRead(params.id, currentUser.id, tenantId);
  }

  @Patch('mark-all-read')
  @RequirePermissions(Permission.NOTIFICATIONS_VIEW)
  @ApiOperation({ summary: 'تحديد جميع الإشعارات كمقروءة' })
  async markAllAsRead(
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    await this.notificationsService.markAllAsRead(currentUser.id, tenantId);
    return { message: 'تم تحديد جميع الإشعارات كمقروءة' };
  }

  @Delete(':id')
  @RequirePermissions(Permission.NOTIFICATIONS_VIEW)
  @ApiOperation({ summary: 'حذف إشعار' })
  @ApiParam({ name: 'id', description: 'معرف الإشعار' })
  async remove(
    @Param() params: IdParamDto,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    await this.notificationsService.remove(params.id, currentUser.id, tenantId);
    return { message: 'تم حذف الإشعار بنجاح' };
  }

  @Get('unread-count')
  @RequirePermissions(Permission.NOTIFICATIONS_VIEW)
  @ApiOperation({ summary: 'الحصول على عدد الإشعارات غير المقروءة' })
  async getUnreadCount(
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    const count = await this.notificationsService.getUnreadCount(currentUser.id, tenantId);
    return { count };
  }
}

